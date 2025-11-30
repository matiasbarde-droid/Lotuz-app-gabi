package com.example.proyecto_Lotuz.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.proyecto_Lotuz.entities.Usuario;

@Repository
public interface UsuariosRepositories extends JpaRepository<Usuario, Long> {
    Usuario findByCorreo(String correo);
}
