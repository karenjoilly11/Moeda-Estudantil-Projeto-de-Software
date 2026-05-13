package com.moedaestudantil.api.controller;

import com.moedaestudantil.api.dto.AlunoCadastroDTO;
import com.moedaestudantil.api.dto.AlunoPerfilDTO;
import com.moedaestudantil.api.dto.AlunoResponseDTO;
import com.moedaestudantil.api.dto.LoginRequestDTO;
import com.moedaestudantil.api.services.AlunoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/aluno")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AlunoController {
    
    private final AlunoService alunoService;
    
    @PostMapping("/cadastro")
    public ResponseEntity<?> cadastrar(@RequestBody AlunoCadastroDTO dto) {
        try {
            return ResponseEntity.ok(alunoService.cadastrar(dto));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO dto) {
        try {
            return ResponseEntity.ok(alunoService.login(dto));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

   @PutMapping("/perfil/{id}")
public ResponseEntity<?> atualizarPerfilComId(
        @RequestBody AlunoPerfilDTO dto,
        @PathVariable Long id) {
    try {
        System.out.println("✅ Endpoint /perfil/{id} chamado com ID: " + id);
        AlunoResponseDTO resultado = alunoService.atualizarPerfil(id, dto);
        return ResponseEntity.ok(resultado);
    } catch (Exception e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }
}

    
    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPorId(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(alunoService.buscarPorId(id));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
