package com.example.proyecto_Lotuz.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.proyecto_Lotuz.entities.Productos;
import com.example.proyecto_Lotuz.services.ProductosService;


@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/admin/productos") // Ruta protegida: /api/admin/productos
public class ProductosAdminRestControllers{

    @Autowired
    private ProductosService productosService;

    @PostMapping
    public ResponseEntity<Productos> crearProducto(@RequestBody Productos producto) {
        Productos nuevoProducto = productosService.crear(producto);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoProducto);
    }

    @PutMapping("/{sku}")
    public ResponseEntity<Productos> actualizarProducto(@PathVariable String sku, @RequestBody Productos productoActualizado) {
        Productos producto = productosService.actualizar(sku, productoActualizado);
        return ResponseEntity.ok(producto);
    }
    
    @DeleteMapping("/{sku}")
    public ResponseEntity<Void> eliminarProducto(@PathVariable String sku) {
        productosService.eliminar(sku);
        return ResponseEntity.noContent().build();
    }
}
