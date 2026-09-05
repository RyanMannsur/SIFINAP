package com.sifinap.backend.controller;

import com.sifinap.backend.dto.MesFinanceiroResponseDTO;
import com.sifinap.backend.dto.MesFinanceiroSummaryDTO;
import com.sifinap.backend.service.MesFinanceiroService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/meses")
@RequiredArgsConstructor
public class MesFinanceiroController {

    private final MesFinanceiroService mesFinanceiroService;

    /**
     * Lista todos os meses existentes (resumo).
     */
    @GetMapping
    public ResponseEntity<List<MesFinanceiroSummaryDTO>> listarTodos() {
        return ResponseEntity.ok(mesFinanceiroService.listarTodos());
    }

    /**
     * Busca detalhes de um mês específico. Se não existir, inicializa automaticamente.
     */
    @GetMapping("/{ano}/{mes}")
    public ResponseEntity<MesFinanceiroResponseDTO> buscar(
        @PathVariable Integer ano,
        @PathVariable Integer mes
    ) {
        return ResponseEntity.ok(mesFinanceiroService.buscarOuInicializar(ano, mes));
    }

    /**
     * Retorna o mês atual.
     */
    @GetMapping("/atual")
    public ResponseEntity<MesFinanceiroResponseDTO> mesAtual() {
        LocalDate hoje = LocalDate.now();
        return ResponseEntity.ok(mesFinanceiroService.buscarOuInicializar(hoje.getYear(), hoje.getMonthValue()));
    }
}
