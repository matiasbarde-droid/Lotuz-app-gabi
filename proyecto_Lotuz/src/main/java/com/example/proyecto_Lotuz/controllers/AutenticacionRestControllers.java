package com.example.proyecto_Lotuz.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.proyecto_Lotuz.entities.Usuario;
import com.example.proyecto_Lotuz.services.UsuarioService;
 
@CrossOrigin(origins = "http://localhost:5173") // Permite la comunicación con tu frontend de Vite
@RestController
@RequestMapping("/api/auth") // Ruta base: /api/auth
public class AutenticacionRestControllers {

    @Autowired
    private UsuarioService usuarioService;

    public static class LoginRequest {
        private String correo;
        private String password;
        
        public String getCorreo() { return correo; }
        public String getPassword() { return password; }
        public void setCorreo(String correo) { this.correo = correo; }
        public void setPassword(String password) { this.password = password; }
    }



    // ENDPOINT 1: REGISTRO DE CLIENTE (POST /api/auth/register)

    @PostMapping("/register")
    public ResponseEntity<Usuario> registrarCliente(@RequestBody Usuario usuario) {
        try {
            Usuario nuevoUsuario = usuarioService.registrar(usuario);
            nuevoUsuario.setPassword(null);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevoUsuario); 
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

   
    // ENDPOINT 2: INICIO DE SESIÓN (POST /api/auth/login)
    @PostMapping("/login")
    public ResponseEntity<Usuario> iniciarSesion(@RequestBody LoginRequest credenciales) {
        try {
            Usuario usuario = usuarioService.autenticar(credenciales.getCorreo(), credenciales.getPassword());
            usuario.setPassword(null);
            return ResponseEntity.ok(usuario);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); // 401: No autorizado
        }
    }

}
