package com.example.proyecto_Lotuz.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.proyecto_Lotuz.entities.Orden;
import com.example.proyecto_Lotuz.entities.Usuario;
import com.example.proyecto_Lotuz.services.OrdenService;
import com.example.proyecto_Lotuz.services.UsuarioService;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/perfil")
public class PerfilRestControllers {

    @Autowired
    private UsuarioService usuarioService;
    
    @Autowired
    private OrdenService ordenService;

    @GetMapping("/{id}")
    public ResponseEntity<Usuario> obtenerPerfil(@PathVariable Long id) {
        Usuario usuario = usuarioService.obtenerPorId(id);
        usuario.setPassword(null); // Seguridad
        return ResponseEntity.ok(usuario);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Usuario> actualizarPerfil(@PathVariable Long id, @RequestBody Usuario datosActualizados) {
        Usuario usuarioActualizado = usuarioService.actualizarPerfil(id, datosActualizados);
        usuarioActualizado.setPassword(null);
        return ResponseEntity.ok(usuarioActualizado);
    }
    
    @GetMapping("/{id}/ordenes")
    public ResponseEntity<List<Orden>> listarHistorialCompras(@PathVariable Long id) {
        List<Orden> historial = ordenService.listarPorUsuario(id);
        return ResponseEntity.ok(historial);
    }
}