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
    public ResponseEntity<?> cadastrarLegacy(@Valid @RequestBody VantagemCadastroDTO dto) {
        return cadastrar(dto);
    }

    @PostMapping
    public ResponseEntity<?> cadastrar(@Valid @RequestBody VantagemCadastroDTO dto) {
        try {
            return ResponseEntity.ok(vantagemService.cadastrar(dto));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable Long id, @Valid @RequestBody VantagemCadastroDTO dto) {
        try {
            return ResponseEntity.ok(vantagemService.atualizar(id, dto));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> remover(@PathVariable Long id) {
        try {
            vantagemService.remover(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<?> listar() {
        return ResponseEntity.ok(vantagemService.listar());
    }
}
