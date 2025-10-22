package com.example.proyecto_Lotuz.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.example.proyecto_Lotuz.entities.Roles;
import com.example.proyecto_Lotuz.entities.Usuario;
import com.example.proyecto_Lotuz.repositories.UsuariosRepositories;

/**
 * Carga datos iniciales en H2 al iniciar la aplicación (solo desarrollo).
 * Crea el usuario administrador si no existe: admin@lotuz.cl / admin123
 */
@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UsuariosRepositories usuarioRepositories;

    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
    public void run(String... args) throws Exception {
        final String adminCorreo = "admin@lotuz.cl";
        final String adminPass = "admin123";

        Usuario existente = usuarioRepositories.findByCorreo(adminCorreo);
        if (existente == null) {
            Usuario admin = new Usuario();
            admin.setCorreo(adminCorreo);
            admin.setNombre("Administrador");
            admin.setPassword(passwordEncoder.encode(adminPass));
            admin.setRol(Roles.ADMIN);
            usuarioRepositories.save(admin);
            System.out.println("[DataInitializer] Usuario admin creado: " + adminCorreo);
        } else {
            // Asegurar que el rol sea ADMIN si ya existe (por si fue creado como CLIENTE)
            if (existente.getRol() != Roles.ADMIN) {
                existente.setRol(Roles.ADMIN);
                usuarioRepositories.save(existente);
                System.out.println("[DataInitializer] Usuario existente promovido a ADMIN: " + adminCorreo);
            }
        }
    }
}