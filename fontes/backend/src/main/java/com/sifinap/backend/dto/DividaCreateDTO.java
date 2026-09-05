package com.sifinap.backend.dto;

import com.sifinap.backend.enums.TipoDivida;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;

public record DividaCreateDTO(

    @NotBlank(message = "Nome é obrigatório")
    @Size(max = 100)
    String nome,

    BigDecimal valor,

    @NotNull(message = "Dia de vencimento é obrigatório")
    @Min(1) @Max(31)
    Integer diaVencimento,

    @NotNull(message = "Tipo é obrigatório")
    TipoDivida tipo,

    // Para PARCELADA e EMPRESTIMO
    Integer parcelaAtual,
    Integer totalParcelas,

    // Para REPASSE
    String responsavel,

    // Para criar a dívida em um mês específico (padrão: mês atual)
    Integer ano,
    Integer mes,

    // Referência ao template de cartão (para CARTAO)
    Long dividaTemplateId,

    String observacao
) {}
