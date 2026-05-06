package com.moedaestudantil.api.controller;

import com.moedaestudantil.api.dto.ResgateRequestDTO;
import com.moedaestudantil.api.services.TransacaoService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/transacao")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class TransacaoController {

    private final TransacaoService transacaoService;

    @PostMapping("/resgatar")
    public ResponseEntity<?> resgatar(@Valid @RequestBody ResgateRequestDTO dto) {
        try {
            return ResponseEntity.ok(transacaoService.resgatar(dto));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/extrato/{alunoId}")
    public ResponseEntity<?> extrato(@PathVariable Long alunoId) {
        try {
            return ResponseEntity.ok(transacaoService.extratoAluno(alunoId));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    @GetMapping("/validar/{codigo}")
    public ResponseEntity<?> validarCupom(@PathVariable String codigo) {
        try {
            return ResponseEntity.ok(transacaoService.validarCupom(codigo));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    @PostMapping("/utilizar/{codigo}")
    public ResponseEntity<?> utilizarCupom(@PathVariable String codigo) {
        try {
            return ResponseEntity.ok(transacaoService.utilizarCupom(codigo));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
