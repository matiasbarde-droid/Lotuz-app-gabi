package com.example.proyecto_Lotuz.repositories;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import com.example.proyecto_Lotuz.entities.Usuario;

@Repository
public interface UsuariosRepositories extends CrudRepository<Usuario, Long> {
    Usuario findByCorreo(String correo);
}