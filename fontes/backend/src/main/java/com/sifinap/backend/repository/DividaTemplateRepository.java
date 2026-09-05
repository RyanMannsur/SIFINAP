package com.sifinap.backend.repository;

import com.sifinap.backend.entity.DividaTemplate;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DividaTemplateRepository extends JpaRepository<DividaTemplate, Long> {
    List<DividaTemplate> findByAtivaTrue();
}
