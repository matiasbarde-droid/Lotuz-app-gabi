package com.example.proyecto_Lotuz.controllers;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/admin/audit")
public class AdminAuditController {

    public static class AuditEvent {
        public String action;
        public String user;
        public LocalDateTime time;
        public String details;
    }

    private final List<AuditEvent> events = new ArrayList<>();

    @PostMapping
    public ResponseEntity<Void> log(@RequestBody AuditEvent event) {
        event.time = event.time != null ? event.time : LocalDateTime.now();
        events.add(event);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping
    public ResponseEntity<List<AuditEvent>> list() {
        return ResponseEntity.ok(events);
    }
}
