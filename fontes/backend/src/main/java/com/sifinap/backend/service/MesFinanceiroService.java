package com.sifinap.backend.service;

import com.sifinap.backend.dto.*;
import com.sifinap.backend.entity.Divida;
import com.sifinap.backend.entity.DividaTemplate;
import com.sifinap.backend.entity.MesFinanceiro;
import com.sifinap.backend.enums.TipoDivida;
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
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MesFinanceiroService {

    private final MesFinanceiroRepository mesFinanceiroRepository;
    private final DividaTemplateRepository dividaTemplateRepository;

    public List<MesFinanceiroSummaryDTO> listarTodos() {
        return mesFinanceiroRepository.findAllByOrderByAnoDescMesDesc()
            .stream()
            .map(m -> new MesFinanceiroSummaryDTO(m.getId(), m.getAno(), m.getMes()))
            .toList();
    }

    @Transactional
    public MesFinanceiroResponseDTO buscarOuInicializar(Integer ano, Integer mes) {
        MesFinanceiro mesFinanceiro = mesFinanceiroRepository
            .findByAnoAndMes(ano, mes)
            .orElseGet(() -> inicializarMes(ano, mes));

        return toResponseDTO(mesFinanceiro);
    }

    @Transactional
    public MesFinanceiro inicializarMes(Integer ano, Integer mes) {
        // Verifica se já existe
        if (mesFinanceiroRepository.findByAnoAndMes(ano, mes).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Mês já existe");
        }

        MesFinanceiro novoMes = MesFinanceiro.builder()
            .ano(ano)
            .mes(mes)
            .build();

        // Adiciona cartões automaticamente (copiando valor do mês anterior se existir)
        YearMonth ymAnterior = YearMonth.of(ano, mes).minusMonths(1);
        MesFinanceiro mesAnteriorOpt = mesFinanceiroRepository.findByAnoAndMes(ymAnterior.getYear(), ymAnterior.getMonthValue()).orElse(null);

        List<DividaTemplate> cartoes = dividaTemplateRepository.findByAtivaTrue();
        for (DividaTemplate cartao : cartoes) {
            BigDecimal valorAnterior = null;
            if (mesAnteriorOpt != null) {
                valorAnterior = mesAnteriorOpt.getDividas().stream()
                    .filter(d -> d.getDividaTemplate() != null && d.getDividaTemplate().getId().equals(cartao.getId()))
                    .map(Divida::getValor)
                    .findFirst()
                    .orElse(null);
            }

            Divida divida = Divida.builder()
                .mesFinanceiro(novoMes)
                .nome(cartao.getNome())
                .diaVencimento(cartao.getDiaVencimento())
                .valor(valorAnterior)
                .tipo(TipoDivida.CARTAO)
                .dividaTemplate(cartao)
                .pago(false)
                .build();
            novoMes.getDividas().add(divida);
        }

        return mesFinanceiroRepository.save(novoMes);
    }

    public MesFinanceiroResponseDTO toResponseDTO(MesFinanceiro mes) {
        LocalDate hoje = LocalDate.now();

        List<DividaResponseDTO> dividas = mes.getDividas().stream()
            .map(d -> toDividaResponseDTO(d, mes.getAno(), mes.getMes()))
            .sorted(Comparator.comparing(DividaResponseDTO::diaVencimento))
            .toList();

        // Totais — ignora cartões sem valor inserido
        BigDecimal totalMes = dividas.stream()
            .filter(d -> d.valor() != null)
            .map(DividaResponseDTO::valor)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalPago = dividas.stream()
            .filter(d -> d.pago() && d.valor() != null)
            .map(DividaResponseDTO::valor)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalAPagar = totalMes.subtract(totalPago);

        long quantidadePagas = dividas.stream().filter(DividaResponseDTO::pago).count();

        long quantidadeVencidas = dividas.stream()
            .filter(d -> !d.pago() && d.dataVencimento() != null && d.dataVencimento().isBefore(hoje))
            .count();

        long quantidadeAVencer = dividas.stream()
            .filter(d -> !d.pago() && d.dataVencimento() != null && !d.dataVencimento().isBefore(hoje))
            .count();

        return new MesFinanceiroResponseDTO(
            mes.getId(), mes.getAno(), mes.getMes(), dividas,
            totalMes, totalPago, totalAPagar,
            quantidadePagas, quantidadeAVencer, quantidadeVencidas
        );
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

    private LocalDate calcularDataVencimento(int ano, int mes, int dia) {
        try {
            YearMonth ym = YearMonth.of(ano, mes);
            int diaAjustado = Math.min(dia, ym.lengthOfMonth());
            return LocalDate.of(ano, mes, diaAjustado);
        } catch (Exception e) {
            return null;
        }
    }
}
