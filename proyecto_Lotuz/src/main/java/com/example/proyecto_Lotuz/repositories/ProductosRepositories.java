package com.example.proyecto_Lotuz.repositories;

import java.util.List;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import com.example.proyecto_Lotuz.entities.Productos;
import com.example.proyecto_Lotuz.entities.Categoria;

@Repository
public interface ProductosRepositories extends CrudRepository<Productos, Long> {
    Productos findBySku(String sku);
    boolean existsBySku(String sku);
    void deleteBySku(String sku);
    List<Productos> findByCategoria(Categoria categoria);
    List<Productos> findByNombreContainingIgnoreCase(String termino);
}