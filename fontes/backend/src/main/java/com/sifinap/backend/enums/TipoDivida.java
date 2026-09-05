package com.sifinap.backend.enums;

public enum TipoDivida {
    UNICA,       // Dívida avulsa, aparece só naquele mês
    PARCELADA,   // Parcelada em X meses (ex: compra no crédito)
    CARTAO,      // Cartão de crédito — sempre presente, valor inserido todo mês
    REPASSE,     // Dívida a ser repassada para outra pessoa (valor variável)
    EMPRESTIMO   // Empréstimo — igual à parcelada, mas categorizado separado
}
