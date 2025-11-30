package com.example.proyecto_Lotuz.services;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.example.proyecto_Lotuz.entities.Usuario;
import com.example.proyecto_Lotuz.entities.Roles;

public interface UsuarioService {  
    Usuario registrar(Usuario usuario); 
    Usuario obtenerPorId(Long id); 
    Usuario obtenerPorCorreo(String correo); 
    List<Usuario> listarTodos(); 
    Page<Usuario> listar(String q, Roles rol, Boolean activo, LocalDateTime from, LocalDateTime to, Pageable pageable);
    Usuario actualizarPerfil(Long id, Usuario datosActualizados);
    void eliminar(Long id);
    void desactivar(Long id);
    Usuario autenticar(String correo, String password);
}
