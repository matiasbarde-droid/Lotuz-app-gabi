package com.example.proyecto_Lotuz.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data // Proporciona Getters, Setters, toString, etc.
@NoArgsConstructor // Constructor sin argumentos
@AllArgsConstructor // Constructor con todos los argumentos
@Entity
@Table(name = "productos")
public class Productos {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Es el identificador único que el JS usa para buscar el producto.
    @Column(unique = true, nullable = false)
    private String sku; 

    @Column(nullable = false)
    private String nombre; //

    @Column(nullable = false)
    private Long precio; //

    // Categoría (Usamos el Enum, guardado como String en la DB)
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Categoria categoria; 

    private String fotoUrl; // URL o path de la imagen 

    // Descripción corta
    @Lob
    private String descripcion; //
}
