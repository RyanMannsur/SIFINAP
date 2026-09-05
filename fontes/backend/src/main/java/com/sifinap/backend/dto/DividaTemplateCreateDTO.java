package com.sifinap.backend.dto;

import jakarta.validation.constraints.*;

public record DividaTemplateCreateDTO(
    @NotBlank String nome,
    @NotNull @Min(1) @Max(31) Integer diaVencimento
) {}
