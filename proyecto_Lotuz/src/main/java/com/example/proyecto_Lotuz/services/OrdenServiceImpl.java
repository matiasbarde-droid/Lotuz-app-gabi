package com.example.proyecto_Lotuz.services;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.proyecto_Lotuz.entities.CarritoItem;
import com.example.proyecto_Lotuz.entities.EstadoOrden;
import com.example.proyecto_Lotuz.entities.ItemOrden;
import com.example.proyecto_Lotuz.entities.Orden;
import com.example.proyecto_Lotuz.entities.Productos;
import com.example.proyecto_Lotuz.entities.Usuario;
import com.example.proyecto_Lotuz.repositories.ItemOrdenRepositories;
import com.example.proyecto_Lotuz.repositories.OrdenRepositories;
import com.example.proyecto_Lotuz.repositories.ProductosRepositories;

import jakarta.transaction.Transactional;

@Service
public class OrdenServiceImpl implements OrdenService{

    // Nombres de las interfaces finales actualizados a plural
    private final OrdenRepositories ordenRepositories;
    private final ItemOrdenRepositories itemOrdenRepositories ;
    private final ProductosRepositories productosRepositories;

    // El constructor refleja las interfaces en plural
    @Autowired
    public OrdenServiceImpl(OrdenRepositories ordenRepositories, 
                            ItemOrdenRepositories itemOrdenRepositories, 
                            ProductosRepositories productosRepositories) {
        this.ordenRepositories = ordenRepositories;
        this.itemOrdenRepositories = itemOrdenRepositories;
        this.productosRepositories = productosRepositories;
    }

    private String generarNumeroOrden() {
        return "ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    @Override
    @Transactional
    public Orden crearOrden(List<CarritoItem> itemsDelCarrito, Usuario comprador, boolean esInvitado) {
        if (itemsDelCarrito == null || itemsDelCarrito.isEmpty()) {
            throw new IllegalArgumentException("No puedes crear una orden con el carrito vacío.");
        }

        Orden nuevaOrden = new Orden();
        nuevaOrden.setNumeroOrden(generarNumeroOrden());
        nuevaOrden.setEmailCliente(comprador.getCorreo());
        nuevaOrden.setUsuarioId(esInvitado ? null : comprador.getId());
        nuevaOrden.setModo(esInvitado ? "guest" : "user");
        nuevaOrden.setEstado(EstadoOrden.PAGADO); 
        nuevaOrden.setFechaCreacion(LocalDateTime.now());
        nuevaOrden.setItems(new ArrayList<>()); 

        Long totalCompra = 0L;

        for (CarritoItem itemDelCarrito : itemsDelCarrito) {
            
            Productos productoCatalogo = productosRepositories.findBySku(itemDelCarrito.getSku());
            if (productoCatalogo == null) {
                throw new RuntimeException("Producto con SKU '" + itemDelCarrito.getSku() + "' no existe.");
            }

            Long cantidad = itemDelCarrito.getCantidad();
            Long precioDeVenta = productoCatalogo.getPrecio();
            
            ItemOrden itemDetalle = new ItemOrden(
                nuevaOrden, 
                productoCatalogo.getSku(), 
                productoCatalogo.getNombre(), 
                precioDeVenta, 
                cantidad, 
                productoCatalogo
            );
            
            nuevaOrden.getItems().add(itemDetalle);
            totalCompra += precioDeVenta * cantidad;
        }

        nuevaOrden.setTotal(totalCompra);

        return ordenRepositories.save(nuevaOrden);
    }
    
    @Override
    @Transactional
    public Orden actualizarEstado(String numeroOrden, EstadoOrden nuevoEstado) {
        // Uso de ordenRepositories (plural)
        Orden ordenAActualizar = ordenRepositories.findByNumeroOrden(numeroOrden);
        if (ordenAActualizar == null) {
            throw new RuntimeException("Orden no encontrada con número: " + numeroOrden);
        }

        ordenAActualizar.setEstado(nuevoEstado);
        return ordenRepositories.save(ordenAActualizar);
    }

    @Override
    public Orden obtenerPorId(Long id) {
        return ordenRepositories.findById(id)
                .orElseThrow(() -> new RuntimeException("Orden no encontrada con ID: " + id));
    }
    
    @Override
    public List<Orden> listarPorUsuario(Long usuarioId) {
        return ordenRepositories.findByUsuarioId(usuarioId);
    }

    @Override
    public List<Orden> listarTodos(String terminoBusqueda, EstadoOrden estadoFiltro) {
        List<Orden> todas = new ArrayList<>();
        
        if (estadoFiltro != null) {
            todas = ordenRepositories.findByEstado(estadoFiltro);
        } else {
            todas = (List<Orden>) ordenRepositories.findAll();
        }
        
        if (terminoBusqueda != null && !terminoBusqueda.trim().isEmpty()) {
            List<Orden> filtradas = new ArrayList<>();
            String termino = terminoBusqueda.toLowerCase();
            for (Orden o : todas) {
                if ((o.getNumeroOrden() != null && o.getNumeroOrden().toLowerCase().contains(termino)) ||
                    (o.getEmailCliente() != null && o.getEmailCliente().toLowerCase().contains(termino))) {
                    filtradas.add(o);
                }
            }
            return filtradas;
        }
        
        return todas;
    }

    @Override
    @Transactional
    public void eliminar(Long id) {
        if (!ordenRepositories.existsById(id)) {
            throw new RuntimeException("Orden no encontrada");
        }
        ordenRepositories.deleteById(id);
    }
}
