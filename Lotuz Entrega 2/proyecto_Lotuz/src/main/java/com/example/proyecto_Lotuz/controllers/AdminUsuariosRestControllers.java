package com.example.proyecto_Lotuz.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import com.example.proyecto_Lotuz.entities.Usuario;
import com.example.proyecto_Lotuz.entities.Roles;
import com.example.proyecto_Lotuz.services.UsuarioService;

import java.time.LocalDateTime;
import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/admin/usuarios")
public class AdminUsuariosRestControllers {

    @Autowired
    private UsuarioService usuarioService;

    @PostMapping
    public ResponseEntity<Usuario> crearUsuario(@RequestBody Usuario usuario) {
        Usuario nuevoUsuario = usuarioService.registrar(usuario); 
        nuevoUsuario.setPassword(null);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoUsuario);
    }

    @GetMapping
    public ResponseEntity<?> listarUsuarios(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) Roles rol,
            @RequestParam(required = false) Boolean activo,
            @RequestParam(required = false) LocalDateTime from,
            @RequestParam(required = false) LocalDateTime to,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false, defaultValue = "createdAt,desc") String sort
    ) {
        String[] sortParts = sort.split(",");
        Sort.Direction dir = (sortParts.length > 1 && "asc".equalsIgnoreCase(sortParts[1])) ? Sort.Direction.ASC : Sort.Direction.DESC;
        Sort sortObj = Sort.by(dir, sortParts[0]);
        Pageable pageable = PageRequest.of(page, size, sortObj);
        Page<Usuario> usuariosPage = usuarioService.listar(q, rol, activo, from, to, pageable);
        usuariosPage.forEach(u -> u.setPassword(null));
        return ResponseEntity.ok(usuariosPage);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Usuario> obtenerUsuarioPorId(@PathVariable Long id) {
        Usuario usuario = usuarioService.obtenerPorId(id);
        usuario.setPassword(null); 
        return ResponseEntity.ok(usuario);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Usuario> actualizarUsuario(@PathVariable Long id, @RequestBody Usuario datosActualizados) {
        Usuario usuarioActualizado = usuarioService.actualizarPerfil(id, datosActualizados);
        usuarioActualizado.setPassword(null);
        return ResponseEntity.ok(usuarioActualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarUsuario(@PathVariable Long id) {
        usuarioService.desactivar(id);
        return ResponseEntity.noContent().build(); 
    }
}
