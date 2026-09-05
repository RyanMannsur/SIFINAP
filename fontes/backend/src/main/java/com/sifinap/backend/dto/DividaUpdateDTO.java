package com.sifinap.backend.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class DividaUpdateDTO {
    @NotBlank(message = "Nome é obrigatório")
    private String nome;

    private BigDecimal valor;

    @NotNull(message = "Dia de vencimento é obrigatório")
    @Min(value = 1, message = "Dia deve ser no mínimo 1")
    @Max(value = 31, message = "Dia deve ser no máximo 31")
    private Integer diaVencimento;

    private String observacao;
}
