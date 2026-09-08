package com.sifinap.backend.controller;

import com.sifinap.backend.dto.DividaTemplateCreateDTO;
import com.sifinap.backend.dto.DividaTemplateResponseDTO;
import com.sifinap.backend.entity.DividaTemplate;
import com.sifinap.backend.repository.DividaTemplateRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/cartoes")
@RequiredArgsConstructor
public class DividaTemplateController {

    private final DividaTemplateRepository dividaTemplateRepository;
    private final com.sifinap.backend.repository.MesFinanceiroRepository mesFinanceiroRepository;
    private final com.sifinap.backend.repository.DividaRepository dividaRepository;

    @GetMapping
    public ResponseEntity<List<DividaTemplateResponseDTO>> listar() {
        List<DividaTemplateResponseDTO> cartoes = dividaTemplateRepository.findAll()
            .stream()
            .map(t -> new DividaTemplateResponseDTO(t.getId(), t.getNome(), t.getDiaVencimento(), t.getAtiva()))
            .toList();
        return ResponseEntity.ok(cartoes);
    }

    @PostMapping
    public ResponseEntity<DividaTemplateResponseDTO> criar(@Valid @RequestBody DividaTemplateCreateDTO dto) {
        DividaTemplate template = DividaTemplate.builder()
            .nome(dto.nome())
            .diaVencimento(dto.diaVencimento())
            .ativa(true)
            .build();
        final DividaTemplate savedTemplate = dividaTemplateRepository.save(template);

        // Associa ao mês atual se o mês atual já existir no banco
        java.time.LocalDate hoje = java.time.LocalDate.now();
        mesFinanceiroRepository.findByAnoAndMes(hoje.getYear(), hoje.getMonthValue()).ifPresent(mesAtual -> {
            com.sifinap.backend.entity.Divida divida = com.sifinap.backend.entity.Divida.builder()
                .mesFinanceiro(mesAtual)
                .nome(dto.nome())
                .diaVencimento(dto.diaVencimento())
                .tipo(com.sifinap.backend.enums.TipoDivida.CARTAO)
                .dividaTemplate(savedTemplate)
                .pago(false)
                .build();
            dividaRepository.save(divida);
        });

        return ResponseEntity.status(HttpStatus.CREATED)
            .body(new DividaTemplateResponseDTO(savedTemplate.getId(), savedTemplate.getNome(), savedTemplate.getDiaVencimento(), savedTemplate.getAtiva()));
    }

    @PatchMapping("/{id}/desativar")
    public ResponseEntity<DividaTemplateResponseDTO> desativar(@PathVariable Long id) {
        DividaTemplate template = dividaTemplateRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        template.setAtiva(false);
        template = dividaTemplateRepository.save(template);
        return ResponseEntity.ok(new DividaTemplateResponseDTO(template.getId(), template.getNome(), template.getDiaVencimento(), template.getAtiva()));
    }

    @PatchMapping("/{id}/ativar")
    public ResponseEntity<DividaTemplateResponseDTO> ativar(@PathVariable Long id) {
        DividaTemplate template = dividaTemplateRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        template.setAtiva(true);
        template = dividaTemplateRepository.save(template);
        return ResponseEntity.ok(new DividaTemplateResponseDTO(template.getId(), template.getNome(), template.getDiaVencimento(), template.getAtiva()));
    }

    @DeleteMapping("/{id}")
    @org.springframework.transaction.annotation.Transactional
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        DividaTemplate template = dividaTemplateRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cartão não encontrado"));

        // Remove pendências não pagas e desvincula histórico
        List<com.sifinap.backend.entity.Divida> dividas = dividaRepository.findAll().stream()
            .filter(d -> d.getDividaTemplate() != null && d.getDividaTemplate().getId().equals(id))
            .toList();

        for (com.sifinap.backend.entity.Divida d : dividas) {
            if (!Boolean.TRUE.equals(d.getPago()) && d.getValor() == null) {
                dividaRepository.delete(d);
            } else {
                d.setDividaTemplate(null);
                dividaRepository.save(d);
            }
        }

        dividaTemplateRepository.delete(template);
        return ResponseEntity.noContent().build();
    }
}
