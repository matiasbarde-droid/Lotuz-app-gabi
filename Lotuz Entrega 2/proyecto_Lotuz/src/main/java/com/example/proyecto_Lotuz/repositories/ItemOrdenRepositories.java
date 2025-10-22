package com.example.proyecto_Lotuz.repositories;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import com.example.proyecto_Lotuz.entities.ItemOrden;

@Repository
public interface ItemOrdenRepositories extends CrudRepository<ItemOrden, Long> {

}