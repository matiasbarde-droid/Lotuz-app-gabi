package com.example.proyecto_Lotuz.repositories;

import java.util.List;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import com.example.proyecto_Lotuz.entities.Orden;

@Repository
public interface OrdenRepositories extends CrudRepository<Orden, Long> {
    Orden findByNumeroOrden(String numeroOrden);
    List<Orden> findByUsuarioId(Long usuarioId);
    List<Orden> findByEstado(com.example.proyecto_Lotuz.entities.EstadoOrden estado);
}