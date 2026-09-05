package com.sifinap.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Template de cartão de crédito — cadastrado uma vez, aparece em todos os meses.
 * Outros tipos de dívida recorrente (como empréstimos longos) também podem ser
 * representados aqui no futuro.
 */
@Entity
@Table(name = "divida_template")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DividaTemplate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nome;

    /**
     * Dia do mês de vencimento padrão (1-31).
     */
    @Column(name = "dia_vencimento", nullable = false)
    private Integer diaVencimento;

    /**
     * Se false, o cartão não será mais incluído nos meses futuros.
     */
    @Column(nullable = false)
    @Builder.Default
    private Boolean ativa = true;
}
