package com.sifinap.backend.controller;

import com.sifinap.backend.dto.DividaCreateDTO;
import com.sifinap.backend.dto.DividaResponseDTO;
import com.sifinap.backend.dto.DividaUpdateDTO;
import com.sifinap.backend.service.DividaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/dividas")
@RequiredArgsConstructor
public class DividaController {

    private final DividaService dividaService;

    @PostMapping
    public ResponseEntity<DividaResponseDTO> criar(@Valid @RequestBody DividaCreateDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(dividaService.criar(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DividaResponseDTO> atualizar(@PathVariable Long id, @Valid @RequestBody DividaUpdateDTO dto) {
        return ResponseEntity.ok(dividaService.atualizar(id, dto));
    }

    /**
     * Atualiza o valor de uma dívida (usado principalmente para inserir fatura do cartão).
     */
    @PatchMapping("/{id}/valor")
    public ResponseEntity<DividaResponseDTO> atualizarValor(
        @PathVariable Long id,
        @RequestBody Map<String, BigDecimal> body
    ) {
        BigDecimal novoValor = body.get("valor");
        return ResponseEntity.ok(dividaService.atualizarValor(id, novoValor));
    }

    /**
     * Marca dívida como paga.
     */
    @PatchMapping("/{id}/pagar")
    public ResponseEntity<DividaResponseDTO> marcarPago(@PathVariable Long id) {
        return ResponseEntity.ok(dividaService.marcarPago(id));
    }

    /**
     * Remove o pagamento de uma dívida.
     */
    @PatchMapping("/{id}/estornar")
    public ResponseEntity<DividaResponseDTO> desmarcarPago(@PathVariable Long id) {
        return ResponseEntity.ok(dividaService.desmarcarPago(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        dividaService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
