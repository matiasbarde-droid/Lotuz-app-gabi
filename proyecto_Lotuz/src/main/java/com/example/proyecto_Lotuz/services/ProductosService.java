package com.example.proyecto_Lotuz.services;

import java.util.List;

import com.example.proyecto_Lotuz.entities.Categoria;
import com.example.proyecto_Lotuz.entities.Productos;

public interface ProductosService {    
    List<Productos> listarParaCatalogo(String terminoBusqueda, Categoria categoria, String orden);
    Productos obtenerPorSku(String sku); // El sku es el codico alfanumerico del producto
    Productos crear(Productos producto);
    Productos actualizar(String sku, Productos datosActualizados);
    void eliminar(String sku);

}
