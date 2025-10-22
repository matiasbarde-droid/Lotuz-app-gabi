package com.example.proyecto_Lotuz.services;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.proyecto_Lotuz.entities.Categoria;
import com.example.proyecto_Lotuz.entities.Productos;
import com.example.proyecto_Lotuz.repositories.ProductosRepositories;

@Service
public class ProductosServiceImpl implements ProductosService{

	@Autowired
	private ProductosRepositories productosRepositories;

	@Override
	public List<Productos> listarParaCatalogo(String terminoBusqueda, Categoria categoria, String orden) {
		List<Productos> resultados = new ArrayList<>();

		if (terminoBusqueda != null && !terminoBusqueda.isBlank()) {
			resultados = productosRepositories.findByNombreContainingIgnoreCase(terminoBusqueda);
		} else if (categoria != null) {
			resultados = productosRepositories.findByCategoria(categoria);
		} else {
			resultados = (List<Productos>) productosRepositories.findAll();
		}

		return resultados;
	}

	@Override
	public Productos obtenerPorSku(String sku) {
		Productos p = productosRepositories.findBySku(sku);
		if (p == null) {
			throw new RuntimeException("Producto no encontrado");
		}
		return p;
	}

	@Override
	public Productos crear(Productos producto) {
		// podrías validar sku único
		if (producto.getSku() == null || producto.getSku().isBlank()) {
			throw new RuntimeException("SKU inválido");
		}
		if (productosRepositories.existsBySku(producto.getSku())) {
			throw new RuntimeException("Ya existe un producto con ese SKU");
		}
		return productosRepositories.save(producto);
	}

	@Override
	public Productos actualizar(String sku, Productos datosActualizados) {
		Productos existente = obtenerPorSku(sku);

		if (datosActualizados.getNombre() != null) {
			existente.setNombre(datosActualizados.getNombre());
		}
		if (datosActualizados.getPrecio() != null) {
			existente.setPrecio(datosActualizados.getPrecio());
		}
		if (datosActualizados.getCategoria() != null) {
			existente.setCategoria(datosActualizados.getCategoria());
		}
		if (datosActualizados.getFotoUrl() != null) {
			existente.setFotoUrl(datosActualizados.getFotoUrl());
		}
		if (datosActualizados.getDescripcion() != null) {
			existente.setDescripcion(datosActualizados.getDescripcion());
		}

		return productosRepositories.save(existente);
	}

	@Override
	public void eliminar(String sku) {
		if (!productosRepositories.existsBySku(sku)) {
			throw new RuntimeException("Producto no encontrado");
		}
		productosRepositories.deleteBySku(sku);
	}

}
