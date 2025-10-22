package com.example.proyecto_Lotuz.services;

import java.util.List;
import com.example.proyecto_Lotuz.entities.Usuario;

public interface UsuarioService {  
    Usuario registrar(Usuario usuario); 
    Usuario obtenerPorId(Long id); 
    Usuario obtenerPorCorreo(String correo); 
    List<Usuario> listarTodos(); 
    Usuario actualizarPerfil(Long id, Usuario datosActualizados);
    void eliminar(Long id);
    Usuario autenticar(String correo, String password);
}
