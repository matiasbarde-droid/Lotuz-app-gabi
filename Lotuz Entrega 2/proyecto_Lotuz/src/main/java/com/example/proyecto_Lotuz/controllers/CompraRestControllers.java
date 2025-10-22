package com.example.proyecto_Lotuz.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.proyecto_Lotuz.entities.Orden;
import com.example.proyecto_Lotuz.entities.Usuario;
import com.example.proyecto_Lotuz.entities.CarritoItem;
import com.example.proyecto_Lotuz.services.OrdenService;
import com.example.proyecto_Lotuz.services.UsuarioService;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/checkout")
public class CompraRestControllers {

    @Autowired
    private OrdenService ordenService;
    
    @Autowired
    private UsuarioService usuarioService;

    public static class CheckoutRequest {
        private Long usuarioId; 
        private String emailInvitado;
        private List<CarritoItem> items;

        public Long getUsuarioId() { return usuarioId; }
        public String getEmailInvitado() { return emailInvitado; }
        public List<CarritoItem> getItems() { return items; }
        public void setUsuarioId(Long usuarioId) { this.usuarioId = usuarioId; }
        public void setEmailInvitado(String emailInvitado) { this.emailInvitado = emailInvitado; }
        public void setItems(List<CarritoItem> items) { this.items = items; }
    }

    @PostMapping
    public ResponseEntity<Orden> crearOrden(@RequestBody CheckoutRequest request) {
        
        Usuario comprador;
        boolean esInvitado = request.getUsuarioId() == null;

        if (esInvitado) {
            comprador = new Usuario(null, request.getEmailInvitado(), "N/A"); 
        } else {
            comprador = usuarioService.obtenerPorId(request.getUsuarioId()); 
        }

        Orden nuevaOrden = ordenService.crearOrden(request.getItems(), comprador, esInvitado);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevaOrden);
    }
}
