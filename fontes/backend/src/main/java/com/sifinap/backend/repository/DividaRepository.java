package com.sifinap.backend.repository;

import com.sifinap.backend.entity.Divida;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DividaRepository extends JpaRepository<Divida, Long> {
    List<Divida> findByMesFinanceiroId(Long mesFinanceiroId);
}
