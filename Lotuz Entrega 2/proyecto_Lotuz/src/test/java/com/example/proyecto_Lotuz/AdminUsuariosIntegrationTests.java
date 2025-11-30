package com.example.proyecto_Lotuz;

import com.example.proyecto_Lotuz.entities.Usuario;
import com.example.proyecto_Lotuz.services.UsuarioService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class AdminUsuariosIntegrationTests {

    @Autowired
    private UsuarioService usuarioService;

    @Test
    void crear_y_desactivar_usuario_funciona() {
        Usuario u = new Usuario("Test User", "test@example.com", "secret123");
        Usuario creado = usuarioService.registrar(u);
        assertNotNull(creado.getId());
        assertTrue(creado.isActivo());

        usuarioService.desactivar(creado.getId());
        Usuario obtenido = usuarioService.obtenerPorId(creado.getId());
        assertFalse(obtenido.isActivo());
    }

    @Test
    void listar_con_paginacion_devuelve_pagina() {
        Page<Usuario> page = usuarioService.listar(null, null, null, null, null, PageRequest.of(0, 10));
        assertNotNull(page);
    }
}
