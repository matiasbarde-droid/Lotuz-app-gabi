package com.example.proyecto_Lotuz.entities;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Data 
@NoArgsConstructor 
@AllArgsConstructor
@Entity
@Table(name = "ordenes")
public class Orden { 
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String numeroOrden; // Numero de orden

    @Column(nullable = false)
    private String emailCliente; 

    private Long usuarioId; 
    
    private String modo;     // Indica si fue una compra de 'user' o 'guest'

    private LocalDateTime fechaCreacion = LocalDateTime.now(); // Fecha de la compra

    // Total final de la orden
    @Column(nullable = false)
    private Long total; 

    // Estado actual de la orden (Pagado, Anulado, etc.)
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoOrden estado = EstadoOrden.PAGADO; 

    // ID de la transacción de pago simulada (MockApi) o real
    private String pagoId; 

    // Código de autorización de la transacción
    private String codigoAutorizacion; 

    /**
     * Relación con los items de la orden.
     * La anotación 'mappedBy' indica que la relación es gestionada por el campo 'orden' 
     * en la clase ItemOrden.
     * CascadeType.ALL asegura que si se elimina la Orden, sus ItemOrden también se eliminen.
     */
    @OneToMany(mappedBy = "orden", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<ItemOrden> items;

}
