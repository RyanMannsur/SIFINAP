package com.sifinap.backend.dto;

import java.math.BigDecimal;
import java.util.List;

public record MesFinanceiroResponseDTO(
    Long id,
    Integer ano,
    Integer mes,
    List<DividaResponseDTO> dividas,
    // Campos calculados
    BigDecimal totalMes,
    BigDecimal totalPago,
    BigDecimal totalAPagar,
    BigDecimal totalAVencer,
    Long quantidadePagas,
    Long quantidadeAVencer,
    Long quantidadeVencidas
) {}
