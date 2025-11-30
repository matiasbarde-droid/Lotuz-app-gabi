package com.example.proyecto_Lotuz.services;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.example.proyecto_Lotuz.entities.Usuario;
import com.example.proyecto_Lotuz.entities.Roles;
import com.example.proyecto_Lotuz.repositories.UsuariosRepositories;

@Service
public class UsuarioServiceImpl implements UsuarioService {

    @Autowired
    private UsuariosRepositories usuarioRepositories;

    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
    public Usuario registrar(Usuario usuario) {
        // Validar correo único
        Usuario existente = usuarioRepositories.findByCorreo(usuario.getCorreo());
        if (existente != null) {
            throw new RuntimeException("Correo ya registrado");
        }
        // Hashear contraseña
        if (usuario.getPassword() == null || usuario.getPassword().isBlank()) {
            throw new RuntimeException("La contraseña es obligatoria");
        }
        usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
        return usuarioRepositories.save(usuario);
    }

    @Override
    public Usuario obtenerPorId(Long id) {
        return usuarioRepositories.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    @Override
    public Usuario obtenerPorCorreo(String correo) {
        Usuario usuario = usuarioRepositories.findByCorreo(correo);
        if (usuario == null) {
            throw new RuntimeException("Usuario no encontrado");
        }
        return usuario;
    }

    @Override
    public List<Usuario> listarTodos() {
        return (List<Usuario>) usuarioRepositories.findAll();
    }

    @Override
    public Page<Usuario> listar(String q, Roles rol, Boolean activo, LocalDateTime from, LocalDateTime to, Pageable pageable) {
        Page<Usuario> page = usuarioRepositories.findAll(pageable);
        List<Usuario> filtered = page.getContent().stream()
            .filter(u -> q == null || q.isBlank() ||
                (u.getNombre() != null && u.getNombre().toLowerCase().contains(q.toLowerCase())) ||
                (u.getCorreo() != null && u.getCorreo().toLowerCase().contains(q.toLowerCase())) ||
                (u.getRut() != null && u.getRut().toLowerCase().contains(q.toLowerCase()))
            )
            .filter(u -> rol == null || u.getRol() == rol)
            .filter(u -> activo == null || u.isActivo() == activo)
            .filter(u -> from == null || (u.getCreatedAt() != null && !u.getCreatedAt().isBefore(from)))
            .filter(u -> to == null || (u.getCreatedAt() != null && !u.getCreatedAt().isAfter(to)))
            .collect(Collectors.toList());
        return new PageImpl<>(filtered, pageable, page.getTotalElements());
    }

    @Override
    public Usuario actualizarPerfil(Long id, Usuario datosActualizados) {
        Usuario existente = obtenerPorId(id);
        
        // Actualizar solo los campos no nulos
        if (datosActualizados.getNombre() != null) {
            existente.setNombre(datosActualizados.getNombre());
        }
        if (datosActualizados.getCorreo() != null) {
            existente.setCorreo(datosActualizados.getCorreo());
        }
        if (datosActualizados.getPassword() != null && !datosActualizados.getPassword().isBlank()) {
            existente.setPassword(passwordEncoder.encode(datosActualizados.getPassword()));
        }
        if (datosActualizados.getRut() != null) {
            existente.setRut(datosActualizados.getRut());
        }
        if (datosActualizados.getTelefono() != null) {
            existente.setTelefono(datosActualizados.getTelefono());
        }
        if (datosActualizados.getDireccion() != null) {
            existente.setDireccion(datosActualizados.getDireccion());
        }
        if (datosActualizados.getPais() != null) {
            existente.setPais(datosActualizados.getPais());
        }
        if (datosActualizados.getRegion() != null) {
            existente.setRegion(datosActualizados.getRegion());
        }
        if (datosActualizados.getComuna() != null) {
            existente.setComuna(datosActualizados.getComuna());
        }
        
        return usuarioRepositories.save(existente);
    }

    @Override
    public void eliminar(Long id) {
        desactivar(id);
    }

    @Override
    public void desactivar(Long id) {
        Usuario usuario = obtenerPorId(id);
        usuario.setActivo(false);
        usuarioRepositories.save(usuario);
    }

    @Override
    public Usuario autenticar(String correo, String password) {
        Usuario usuario = usuarioRepositories.findByCorreo(correo);
        if (usuario == null) {
            throw new RuntimeException("Usuario no encontrado");
        }
        if (!passwordEncoder.matches(password, usuario.getPassword())) {
            throw new RuntimeException("Credenciales inválidas");
        }
        return usuario;
    }
}
