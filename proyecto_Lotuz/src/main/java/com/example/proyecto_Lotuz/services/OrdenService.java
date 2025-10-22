package com.example.proyecto_Lotuz.services;

import java.util.List;

import com.example.proyecto_Lotuz.entities.CarritoItem;
import com.example.proyecto_Lotuz.entities.EstadoOrden;
import com.example.proyecto_Lotuz.entities.Orden;
import com.example.proyecto_Lotuz.entities.Usuario;

public interface OrdenService {  
    Orden crearOrden(List<CarritoItem> carritoItems, Usuario cliente, boolean esInvitado);
    List<Orden> listarPorUsuario(Long usuarioId);
    Orden obtenerPorId(Long id); 
    List<Orden> listarTodos(String terminoBusqueda, EstadoOrden estadoFiltro);
    Orden actualizarEstado(String numeroOrden, EstadoOrden nuevoEstado);
    void eliminar(Long id);

}
