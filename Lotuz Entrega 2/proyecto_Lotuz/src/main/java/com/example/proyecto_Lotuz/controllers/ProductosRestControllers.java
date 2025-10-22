package com.example.proyecto_Lotuz.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.proyecto_Lotuz.entities.Productos;
import com.example.proyecto_Lotuz.entities.Categoria;
import com.example.proyecto_Lotuz.services.ProductosService;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/productos") // Ruta pública: /api/productos
public class ProductosRestControllers {

    @Autowired
    private ProductosService productosService;

    @GetMapping
    public ResponseEntity<List<Productos>> listarProductos(
            @RequestParam(required = false) String terminoBusqueda, 
            @RequestParam(required = false) Categoria categoria,     
            @RequestParam(required = false) String orden             
    ) {
        List<Productos> productos = productosService.listarParaCatalogo(terminoBusqueda, categoria, orden);
        return ResponseEntity.ok(productos);
    }
     //Obtiene un producto por su identificador único (SKU).
     //El service lanza una excepción si no lo encuentra.
    @GetMapping("/{sku}")
    public ResponseEntity<Productos> obtenerProductoPorSku(@PathVariable String sku) {
        Productos producto = productosService.obtenerPorSku(sku); 
        return ResponseEntity.ok(producto);
    } 
}
