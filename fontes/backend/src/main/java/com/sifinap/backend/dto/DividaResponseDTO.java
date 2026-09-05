package com.sifinap.backend.dto;

import com.sifinap.backend.enums.TipoDivida;

import java.math.BigDecimal;
import java.time.LocalDate;

public record DividaResponseDTO(
    Long id,
    String nome,
    BigDecimal valor,
    Integer diaVencimento,
    TipoDivida tipo,
    Integer parcelaAtual,
    Integer totalParcelas,
    String responsavel,
    Boolean pago,
    LocalDate dataPagamento,
    String observacao,
    Long dividaTemplateId,
    // Data de vencimento calculada com base no mês/ano do mês financeiro
    LocalDate dataVencimento
) {}
