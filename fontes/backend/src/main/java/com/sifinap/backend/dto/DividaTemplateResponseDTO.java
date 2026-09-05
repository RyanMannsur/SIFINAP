package com.sifinap.backend.dto;

import java.math.BigDecimal;

public record DividaTemplateResponseDTO(
    Long id,
    String nome,
    Integer diaVencimento,
    Boolean ativa
) {}
