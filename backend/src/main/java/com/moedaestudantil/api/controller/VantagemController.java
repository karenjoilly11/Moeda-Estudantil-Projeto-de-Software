package com.moedaestudantil.api.controller;

import com.moedaestudantil.api.dto.VantagemCadastroDTO;
import com.moedaestudantil.api.services.VantagemService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/vantagem")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class VantagemController {

    private final VantagemService vantagemService;

    @PostMapping("/cadastro")
    public ResponseEntity<?> cadastrar(@Valid @RequestBody VantagemCadastroDTO dto) {
        try {
            return ResponseEntity.ok(vantagemService.cadastrar(dto));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<?> listar() {
        return ResponseEntity.ok(vantagemService.listar());
    }
}