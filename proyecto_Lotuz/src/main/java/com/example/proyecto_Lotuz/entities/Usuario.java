package com.example.proyecto_Lotuz.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data // Proporciona Getters, Setters, toString, etc.
@NoArgsConstructor // Genera un constructor sin argumentos
@AllArgsConstructor // Genera un constructor con todos los argumentos
@Entity // Define esta clase como una Entidad JPA
@Table(name = "usuarios") // Nombre de la tabla en la base de datos
public class Usuario{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; 

    @Enumerated(EnumType.STRING) 
    @Column(nullable = false)
    private Roles rol = Roles.CLIENTE; 

    private LocalDateTime createdAt = LocalDateTime.now(); 

    @Column(unique = true, nullable = false)
    private String correo; 

    @Column(nullable = false)
    private String password; 

    private String nombre;
    private String rut; 
    private String telefono; 
    private String direccion; 
    private String pais; 
    private String region; 
    private String comuna; 

    public Usuario(String nombre, String correo, String password) {
        this.nombre = nombre;
        this.correo = correo;
        this.password= password;
        this.rol = Roles.CLIENTE;
        this.createdAt = LocalDateTime.now();
    }
}



