package com.example.proyecto_Lotuz.controllers; 

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.proyecto_Lotuz.entities.Orden;
import com.example.proyecto_Lotuz.entities.EstadoOrden;
import com.example.proyecto_Lotuz.services.OrdenService;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/admin/ordenes")
public class AdminOrdenesRestControllers   {

    @Autowired
    private OrdenService ordenService;

    @GetMapping
    public ResponseEntity<List<Orden>> listarOrdenes(
            @RequestParam(required = false) String terminoBusqueda, 
            @RequestParam(required = false) EstadoOrden estadoFiltro) {
        
        List<Orden> ordenes = ordenService.listarTodos(terminoBusqueda, estadoFiltro);
        return ResponseEntity.ok(ordenes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Orden> obtenerOrdenPorId(@PathVariable Long id) {
        Orden orden = ordenService.obtenerPorId(id);
        return ResponseEntity.ok(orden);
    }

    @PutMapping("/{numeroOrden}/estado")
    public ResponseEntity<Orden> actualizarEstadoOrden(
            @PathVariable String numeroOrden,
            @RequestParam EstadoOrden nuevoEstado) {
        
        Orden ordenActualizada = ordenService.actualizarEstado(numeroOrden, nuevoEstado);
        return ResponseEntity.ok(ordenActualizada);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarOrden(@PathVariable Long id) {
        ordenService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}


