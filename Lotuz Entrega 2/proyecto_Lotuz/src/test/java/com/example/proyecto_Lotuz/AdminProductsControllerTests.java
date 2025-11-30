package com.example.proyecto_Lotuz;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class AdminProductsControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void crear_producto_admin_ok() throws Exception {
        Map<String, Object> body = Map.of(
                "sku", "TEST-SKU-1",
                "nombre", "Producto Test",
                "precio", 1000,
                "categoria", "MOUSE",
                "fotoUrl", "https://example.com/img.png",
                "descripcion", "desc",
                "stock", 3,
                "estado", "ACTIVO"
        );
        mockMvc.perform(post("/api/admin/products")
                        .header("X-ADMIN", "true")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.sku").value("TEST-SKU-1"));
    }

    @Test
    void actualizar_producto_admin_ok() throws Exception {
        // Crear primero
        Map<String, Object> body = Map.of(
                "sku", "TEST-SKU-2",
                "nombre", "Producto 2",
                "precio", 2000,
                "categoria", "MOUSE",
                "fotoUrl", "https://example.com/img2.png",
                "stock", 1
        );
        String created = mockMvc.perform(post("/api/admin/products")
                        .header("X-ADMIN", "true")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andReturn().getResponse().getContentAsString();
        long id = objectMapper.readTree(created).get("id").asLong();

        Map<String, Object> update = Map.of(
                "nombre", "Producto 2 Editado",
                "stock", 5
        );
        mockMvc.perform(put("/api/admin/products/" + id)
                        .header("X-ADMIN", "true")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(update)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nombre").value("Producto 2 Editado"))
                .andExpect(jsonPath("$.stock").value(5));
    }

    @Test
    void bloquear_sin_autorizacion() throws Exception {
        Map<String, Object> body = Map.of(
                "sku", "TEST-SKU-3",
                "nombre", "Producto 3",
                "precio", 3000,
                "categoria", "MOUSE",
                "fotoUrl", "https://example.com/img3.png",
                "stock", 2
        );
        mockMvc.perform(post("/api/admin/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isForbidden());
    }
}
