package com.example.proyecto_Lotuz.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.proyecto_Lotuz.entities.Usuario;
import com.example.proyecto_Lotuz.services.UsuarioService;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/admin/usuarios")
public class AdminUsuariosRestControllers {

    @Autowired
    private UsuarioService usuarioService;

    // CREAR USUARIO (POST) 
    @PostMapping
    public ResponseEntity<Usuario> crearUsuario(@RequestBody Usuario usuario) {
        Usuario nuevoUsuario = usuarioService.registrar(usuario); 
        nuevoUsuario.setPassword(null); // Limpiar seguridad
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoUsuario);
    }

    //LISTAR TODOS (GET) 
    @GetMapping
    public ResponseEntity<List<Usuario>> listarUsuarios() {
        List<Usuario> usuarios = usuarioService.listarTodos();
        // Limpiar passwords de todos los usuarios
        usuarios.forEach(u -> u.setPassword(null));
        return ResponseEntity.ok(usuarios);
    }

    // OBTENER POR ID (READ) 
    @GetMapping("/{id}")
    public ResponseEntity<Usuario> obtenerUsuarioPorId(@PathVariable Long id) {
        Usuario usuario = usuarioService.obtenerPorId(id); // Lanza RuntimeException si no existe
        usuario.setPassword(null); 
        return ResponseEntity.ok(usuario);
    }

    // ACTUALIZAR (PUT) 
    @PutMapping("/{id}")
    public ResponseEntity<Usuario> actualizarUsuario(@PathVariable Long id, @RequestBody Usuario datosActualizados) {
        Usuario usuarioActualizado = usuarioService.actualizarPerfil(id, datosActualizados);
        usuarioActualizado.setPassword(null);
        return ResponseEntity.ok(usuarioActualizado);
    }

    //ELIMINAR (DELETE)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarUsuario(@PathVariable Long id) {
        usuarioService.eliminar(id); 
        return ResponseEntity.noContent().build(); 
    }
}
