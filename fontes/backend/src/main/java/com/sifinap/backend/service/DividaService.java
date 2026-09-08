package com.sifinap.backend.service;

import com.sifinap.backend.dto.DividaCreateDTO;
import com.sifinap.backend.dto.DividaResponseDTO;
import com.sifinap.backend.dto.DividaUpdateDTO;
import com.sifinap.backend.entity.Divida;
import com.sifinap.backend.entity.DividaTemplate;
import com.sifinap.backend.entity.MesFinanceiro;
import com.sifinap.backend.enums.TipoDivida;
import com.sifinap.backend.repository.DividaRepository;
import com.sifinap.backend.repository.DividaTemplateRepository;
import com.sifinap.backend.repository.MesFinanceiroRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DividaService {

    private final DividaRepository dividaRepository;
    private final MesFinanceiroRepository mesFinanceiroRepository;
    private final DividaTemplateRepository dividaTemplateRepository;
    private final MesFinanceiroService mesFinanceiroService;

    @Transactional
    public DividaResponseDTO criar(DividaCreateDTO dto) {
        LocalDate hoje = LocalDate.now();
        int ano = dto.ano() != null ? dto.ano() : hoje.getYear();
        int mes = dto.mes() != null ? dto.mes() : hoje.getMonthValue();

        // Busca ou inicializa o mês
        MesFinanceiro mesFinanceiro = mesFinanceiroRepository
            .findByAnoAndMes(ano, mes)
            .orElseGet(() -> mesFinanceiroService.inicializarMes(ano, mes));

        DividaTemplate template = null;
        if (dto.dividaTemplateId() != null) {
            template = dividaTemplateRepository.findById(dto.dividaTemplateId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Template não encontrado"));
        }

        Divida divida = Divida.builder()
            .mesFinanceiro(mesFinanceiro)
            .nome(dto.nome())
            .valor(dto.valor())
            .diaVencimento(dto.diaVencimento())
            .tipo(dto.tipo())
            .parcelaAtual(dto.parcelaAtual())
            .totalParcelas(dto.totalParcelas())
            .responsavel(dto.responsavel())
            .dividaTemplate(template)
            .observacao(dto.observacao())
            .pago(false)
            .build();

        divida = dividaRepository.save(divida);

        // Para PARCELADA e EMPRESTIMO: propagar as parcelas futuras
        if ((dto.tipo() == TipoDivida.PARCELADA || dto.tipo() == TipoDivida.EMPRESTIMO)
            && dto.totalParcelas() != null && dto.parcelaAtual() != null) {
            propagarParcelas(divida, ano, mes, dto);
        }

        // Para REPASSE: propagar para meses futuros já existentes
        if (dto.tipo() == TipoDivida.REPASSE) {
            propagarRepasse(divida, ano, mes, dto);
        }

        return toDividaResponseDTO(divida, ano, mes);
    }

    @Transactional
    public DividaResponseDTO atualizar(Long id, DividaUpdateDTO dto) {
        Divida divida = buscarPorId(id);
        String nomeAntigo = divida.getNome();

        divida.setNome(dto.getNome());
        divida.setValor(dto.getValor());
        divida.setDiaVencimento(dto.getDiaVencimento());
        divida.setObservacao(dto.getObservacao());

        // Se for um cartão baseado em template, atualiza o template globalmente
        if (divida.getDividaTemplate() != null) {
            DividaTemplate template = divida.getDividaTemplate();
            if (dto.getNome() != null) template.setNome(dto.getNome());
            if (dto.getDiaVencimento() != null) template.setDiaVencimento(dto.getDiaVencimento());
            dividaTemplateRepository.save(template);

            // Atualiza o nome/vencimento de todos os registros em aberto deste cartão
            List<Divida> cartoesAbertos = dividaRepository.findAll().stream()
                .filter(d -> d.getDividaTemplate() != null && d.getDividaTemplate().getId().equals(template.getId()) && !Boolean.TRUE.equals(d.getPago()))
                .toList();
            for (Divida d : cartoesAbertos) {
                d.setNome(dto.getNome());
                if (dto.getDiaVencimento() != null) d.setDiaVencimento(dto.getDiaVencimento());
                dividaRepository.save(d);
            }
        }

        // Se for Repasse, atualiza o nome em repasses futuros em aberto
        if (divida.getTipo() == TipoDivida.REPASSE && dto.getNome() != null && !dto.getNome().equals(nomeAntigo)) {
            List<Divida> repassesFuturos = dividaRepository.findAll().stream()
                .filter(d -> d.getTipo() == TipoDivida.REPASSE && d.getNome().equalsIgnoreCase(nomeAntigo) && !Boolean.TRUE.equals(d.getPago()))
                .toList();
            for (Divida r : repassesFuturos) {
                r.setNome(dto.getNome());
                if (dto.getDiaVencimento() != null) r.setDiaVencimento(dto.getDiaVencimento());
                dividaRepository.save(r);
            }
        }

        divida = dividaRepository.save(divida);
        MesFinanceiro mes = divida.getMesFinanceiro();
        return toDividaResponseDTO(divida, mes.getAno(), mes.getMes());
    }

    @Transactional
    public DividaResponseDTO atualizarValor(Long id, BigDecimal novoValor) {
        Divida divida = buscarPorId(id);
        divida.setValor(novoValor);
        divida = dividaRepository.save(divida);
        MesFinanceiro mes = divida.getMesFinanceiro();
        return toDividaResponseDTO(divida, mes.getAno(), mes.getMes());
    }

    @Transactional
    public DividaResponseDTO marcarPago(Long id) {
        Divida divida = buscarPorId(id);
        divida.setPago(true);
        divida.setDataPagamento(LocalDate.now());
        divida = dividaRepository.save(divida);
        MesFinanceiro mes = divida.getMesFinanceiro();
        return toDividaResponseDTO(divida, mes.getAno(), mes.getMes());
    }

    @Transactional
    public DividaResponseDTO desmarcarPago(Long id) {
        Divida divida = buscarPorId(id);
        divida.setPago(false);
        divida.setDataPagamento(null);
        divida = dividaRepository.save(divida);
        MesFinanceiro mes = divida.getMesFinanceiro();
        return toDividaResponseDTO(divida, mes.getAno(), mes.getMes());
    }

    @Transactional
    public void deletar(Long id) {
        Divida divida = buscarPorId(id);
        dividaRepository.delete(divida);
    }

    private void propagarParcelas(Divida origem, int anoInicial, int mesInicial, DividaCreateDTO dto) {
        int parcelaInicial = dto.parcelaAtual() != null ? dto.parcelaAtual() : 1;
        int totalParcelas = dto.totalParcelas();

        for (int i = parcelaInicial + 1; i <= totalParcelas; i++) {
            YearMonth ym = YearMonth.of(anoInicial, mesInicial).plusMonths(i - parcelaInicial);

            MesFinanceiro mesFuturo = mesFinanceiroRepository
                .findByAnoAndMes(ym.getYear(), ym.getMonthValue())
                .orElseGet(() -> mesFinanceiroService.inicializarMes(ym.getYear(), ym.getMonthValue()));

            Divida parcelaFutura = Divida.builder()
                .mesFinanceiro(mesFuturo)
                .nome(dto.nome())
                .valor(dto.valor())
                .diaVencimento(dto.diaVencimento())
                .tipo(dto.tipo())
                .parcelaAtual(i)
                .totalParcelas(totalParcelas)
                .responsavel(dto.responsavel())
                .observacao(dto.observacao())
                .pago(false)
                .build();

            dividaRepository.save(parcelaFutura);
        }
    }

    private void propagarRepasse(Divida origem, int anoInicial, int mesInicial, DividaCreateDTO dto) {
        List<MesFinanceiro> mesesFuturos = mesFinanceiroRepository.findAllByOrderByAnoDescMesDesc().stream()
            .filter(m -> m.getAno() > anoInicial || (m.getAno() == anoInicial && m.getMes() > mesInicial))
            .toList();

        for (MesFinanceiro mesFuturo : mesesFuturos) {
            boolean jaExiste = mesFuturo.getDividas().stream()
                .anyMatch(d -> d.getTipo() == TipoDivida.REPASSE && d.getNome().equalsIgnoreCase(dto.nome()));

            if (!jaExiste) {
                Divida repasseFuturo = Divida.builder()
                    .mesFinanceiro(mesFuturo)
                    .nome(dto.nome())
                    .valor(dto.valor())
                    .diaVencimento(dto.diaVencimento())
                    .tipo(TipoDivida.REPASSE)
                    .responsavel(dto.responsavel())
                    .observacao(dto.observacao())
                    .pago(false)
                    .build();

                dividaRepository.save(repasseFuturo);
            }
        }
    }

    private Divida buscarPorId(Long id) {
        return dividaRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Dívida não encontrada"));
    }

    private DividaResponseDTO toDividaResponseDTO(Divida d, int ano, int mes) {
        LocalDate dataVencimento = calcularDataVencimento(ano, mes, d.getDiaVencimento());
        return new DividaResponseDTO(
            d.getId(), d.getNome(), d.getValor(), d.getDiaVencimento(),
            d.getTipo(), d.getParcelaAtual(), d.getTotalParcelas(),
            d.getResponsavel(), d.getPago(), d.getDataPagamento(),
            d.getObservacao(),
            d.getDividaTemplate() != null ? d.getDividaTemplate().getId() : null,
            dataVencimento
        );
    }

    private LocalDate calcularDataVencimento(int ano, int mes, Integer dia) {
        if (dia == null) return null;
        try {
            YearMonth ym = YearMonth.of(ano, mes);
            int diaAjustado = Math.min(dia, ym.lengthOfMonth());
            return LocalDate.of(ano, mes, diaAjustado);
        } catch (Exception e) {
            return null;
        }
    }
}
