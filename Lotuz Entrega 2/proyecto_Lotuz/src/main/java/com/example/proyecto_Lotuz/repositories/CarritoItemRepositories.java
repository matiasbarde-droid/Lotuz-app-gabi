package com.example.proyecto_Lotuz.repositories;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

import com.example.proyecto_Lotuz.entities.CarritoItem;

public interface CarritoItemRepositories extends CrudRepository<CarritoItem, Long> {
    List<CarritoItem> findBySku(String sku);
}
