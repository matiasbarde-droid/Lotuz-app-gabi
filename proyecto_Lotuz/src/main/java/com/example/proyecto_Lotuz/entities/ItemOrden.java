package com.example.proyecto_Lotuz.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "items_orden")
public class ItemOrden {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Relación hacia la Orden (CLAVE FORÁNEA hacia la cabecera)
    @ManyToOne
    @JoinColumn(name = "orden_id", nullable = false)
    @JsonBackReference
    private Orden orden;

    // --- SNAPSHOTS (Datos Immutables al momento de la compra) ---
    
    // ID de negocio (SKU) del producto
    private String productoSku; 
    
    // Nombre del producto al momento de la compra
    private String nombreProducto; 

    // Precio unitario al momento de la orden (copiado desde Producto.precio)
    private Long precioUnitario; //
    
    // Cantidad pedida
    private Long cantidad; //


    // --- RELACIÓN CON EL PRODUCTO DEL CATÁLOGO (Opcional, pero útil para gestión de stock) ---

    // Referencia al producto original (NOTA: corregido de Productos a Producto)
    @ManyToOne(fetch = FetchType.LAZY) // Usamos LAZY para no cargar el producto si no es necesario
    @JoinColumn(name = "producto_fk_id")
    @JsonIgnore
    private Productos productos; 


    // --- Constructor para la creación (Checkout) ---
    // Usamos el constructor sin el ID autogenerado por la base de datos
    public ItemOrden(Orden orden, String productoSku, String nombreProducto, Long precioUnitario, Long cantidad, Productos producto) {
        this.orden = orden;
        this.productoSku = productoSku;
        this.nombreProducto = nombreProducto;
        this.precioUnitario = precioUnitario;
        this.cantidad = cantidad;
        this.productos = producto;
    }
}
