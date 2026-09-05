package com.sifinap.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

/**
 * Representa um mês financeiro (ex: setembro de 2026).
 * Cada mês contém sua lista de dívidas.
 */
@Entity
@Table(
    name = "mes_financeiro",
    uniqueConstraints = @UniqueConstraint(columnNames = {"ano", "mes"})
)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MesFinanceiro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Integer ano;

    /**
     * Mês de 1 (janeiro) a 12 (dezembro).
     */
    @Column(nullable = false)
    private Integer mes;

    @OneToMany(mappedBy = "mesFinanceiro", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Divida> dividas = new ArrayList<>();
}
