package com.sifinap.backend.repository;

import com.sifinap.backend.entity.MesFinanceiro;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MesFinanceiroRepository extends JpaRepository<MesFinanceiro, Long> {
    Optional<MesFinanceiro> findByAnoAndMes(Integer ano, Integer mes);
    List<MesFinanceiro> findAllByOrderByAnoDescMesDesc();
}
