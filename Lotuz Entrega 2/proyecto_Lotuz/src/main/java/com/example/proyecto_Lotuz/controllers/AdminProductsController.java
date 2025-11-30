package com.example.proyecto_Lotuz.controllers;

import com.example.proyecto_Lotuz.entities.Productos;
import com.example.proyecto_Lotuz.entities.Categoria;
import com.example.proyecto_Lotuz.entities.EstadoProducto;
import com.example.proyecto_Lotuz.repositories.ProductosRepositories;
import com.example.proyecto_Lotuz.services.ProductosService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/admin/products")
@Tag(name = "Admin Products", description = "Administración de productos")
public class AdminProductsController {

    private static final Logger log = LoggerFactory.getLogger(AdminProductsController.class);

    @Autowired
    private ProductosService productosService;

    @Autowired
    private ProductosRepositories productosRepositories;

    private boolean isAuthorized(String adminHeader) {
        return "true".equalsIgnoreCase(String.valueOf(adminHeader));
    }

    public static class CreateProductRequest {
        @NotBlank public String sku;
        @NotBlank public String nombre;
        @NotNull @Min(0) public Long precio;
        @NotNull public Categoria categoria;
        @NotBlank public String fotoUrl;
        public String descripcion;
        @NotNull @Min(0) public Integer stock;
        public EstadoProducto estado;
    }

    @Operation(summary = "Crear producto",
            responses = {
                    @ApiResponse(responseCode = "201", description = "Producto creado",
                            content = @Content(schema = @Schema(implementation = Productos.class))),
                    @ApiResponse(responseCode = "400", description = "Datos inválidos"),
                    @ApiResponse(responseCode = "403", description = "No autorizado"),
                    @ApiResponse(responseCode = "409", description = "SKU existente")
            })
    @PostMapping
    public ResponseEntity<?> create(@RequestHeader(value = "X-ADMIN", required = false) String admin,
                                    @Valid @RequestBody CreateProductRequest body) {
        if (!isAuthorized(admin)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Acceso restringido para administración");
        }
        if (productosRepositories.existsBySku(body.sku)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("SKU ya existe");
        }
        Productos p = new Productos();
        p.setSku(body.sku);
        p.setNombre(body.nombre);
        p.setPrecio(body.precio);
        p.setCategoria(body.categoria);
        p.setFotoUrl(body.fotoUrl);
        p.setDescripcion(body.descripcion);
        p.setStock(body.stock);
        p.setEstado(body.estado == null ? EstadoProducto.ACTIVO : body.estado);
        Productos created = productosService.crear(p);
        log.info("[AUDIT] create_product sku={} id={}", created.getSku(), created.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    public static class UpdateProductRequest {
        public String sku;
        public String nombre;
        @Min(0) public Long precio;
        public Categoria categoria;
        public String fotoUrl;
        public String descripcion;
        @Min(0) public Integer stock;
        public EstadoProducto estado;
    }

    @Operation(summary = "Actualizar producto por ID",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Producto actualizado",
                            content = @Content(schema = @Schema(implementation = Productos.class))),
                    @ApiResponse(responseCode = "400", description = "Datos inválidos"),
                    @ApiResponse(responseCode = "403", description = "No autorizado"),
                    @ApiResponse(responseCode = "404", description = "No encontrado")
            })
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@RequestHeader(value = "X-ADMIN", required = false) String admin,
                                    @PathVariable Long id,
                                    @Valid @RequestBody UpdateProductRequest body) {
        if (!isAuthorized(admin)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Acceso restringido para administración");
        }
        Optional<Productos> opt = productosRepositories.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Producto no encontrado");
        }
        Productos existente = opt.get();
        if (body.sku != null && !body.sku.equals(existente.getSku())) {
            if (productosRepositories.existsBySku(body.sku)) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("SKU ya existe");
            }
            existente.setSku(body.sku);
        }
        if (body.nombre != null) existente.setNombre(body.nombre);
        if (body.precio != null && body.precio >= 0) existente.setPrecio(body.precio);
        if (body.categoria != null) existente.setCategoria(body.categoria);
        if (body.fotoUrl != null) existente.setFotoUrl(body.fotoUrl);
        if (body.descripcion != null) existente.setDescripcion(body.descripcion);
        if (body.stock != null && body.stock >= 0) existente.setStock(body.stock);
        if (body.estado != null) existente.setEstado(body.estado);
        Productos actualizado = productosRepositories.save(existente);
        log.info("[AUDIT] update_product id={} sku={}", actualizado.getId(), actualizado.getSku());
        return ResponseEntity.ok(actualizado);
    }
}
