package com.sifinap.backend.entity;

import com.sifinap.backend.enums.TipoDivida;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Representa uma dívida dentro de um mês financeiro.
 */
@Entity
@Table(name = "divida")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Divida {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mes_financeiro_id", nullable = false)
    private MesFinanceiro mesFinanceiro;

    @Column(nullable = false, length = 100)
    private String nome;

    /**
     * Valor da dívida. Pode ser null para cartões que ainda não tiveram a fatura inserida.
     */
    @Column(precision = 12, scale = 2)
    private BigDecimal valor;

    /**
     * Dia do mês de vencimento (1-31).
     */
    @Column(name = "dia_vencimento", nullable = false)
    private Integer diaVencimento;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private TipoDivida tipo;

    /**
     * Para PARCELADA e EMPRESTIMO: número da parcela atual (ex: 3).
     */
    @Column(name = "parcela_atual")
    private Integer parcelaAtual;

    /**
     * Para PARCELADA e EMPRESTIMO: total de parcelas (ex: 12).
     */
    @Column(name = "total_parcelas")
    private Integer totalParcelas;

    /**
     * Para REPASSE: nome de quem vai pagar (ex: "Walkiria").
     */
    @Column(name = "responsavel", length = 100)
    private String responsavel;

    /**
     * Referência ao template de cartão, se a dívida originou de um.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "divida_template_id")
    private DividaTemplate dividaTemplate;

    /**
     * Indica se a dívida já foi paga.
     */
    @Column(nullable = false)
    @Builder.Default
    private Boolean pago = false;

    /**
     * Data em que o pagamento foi realizado.
     */
    @Column(name = "data_pagamento")
    private LocalDate dataPagamento;

    /**
     * Observações opcionais.
     */
    @Column(length = 255)
    private String observacao;
}
