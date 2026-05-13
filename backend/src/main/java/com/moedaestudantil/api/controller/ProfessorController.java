package com.moedaestudantil.api.controller;

import com.moedaestudantil.api.dto.ProfessorLoginDTO;
import com.moedaestudantil.api.services.ProfessorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.moedaestudantil.api.dto.EnviarMoedasDTO;
import com.moedaestudantil.api.dto.EnvioMoedasResponseDTO;
import java.util.Base64;

@RestController
@RequestMapping("/api/professor")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ProfessorController {
    
    private final ProfessorService professorService;
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody ProfessorLoginDTO dto) {
        try {
            return ResponseEntity.ok(professorService.login(dto));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/enviar-moedas")
    public ResponseEntity<?> enviarMoedas(@RequestBody EnviarMoedasDTO dto,
            @RequestHeader("Authorization") String token) {
        try {
            Long professorId = extractProfessorIdFromToken(token);
            EnvioMoedasResponseDTO response = professorService.enviarMoedas(professorId, dto);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/extrato")
    public ResponseEntity<?> extrato(@RequestHeader("Authorization") String token) {
        try {
            Long professorId = extractProfessorIdFromToken(token);
            return ResponseEntity.ok(professorService.extrato(professorId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/saldo")
    public ResponseEntity<?> saldo(@RequestHeader("Authorization") String token) {
        try {
            Long professorId = extractProfessorIdFromToken(token);
            return ResponseEntity.ok(professorService.saldo(professorId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/alunos")
    public ResponseEntity<?> listarAlunos(@RequestHeader("Authorization") String token) {
        try {
            Long professorId = extractProfessorIdFromToken(token);
            return ResponseEntity.ok(professorService.listarAlunosPorInstituicao(professorId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

   // Método auxiliar para extrair professorId do token JWT
    private Long extractProfessorIdFromToken(String token) {
        // Remove "Bearer " prefix se existir
        String jwt = token;
        if (token.startsWith("Bearer ")) {
            jwt = token.substring(7);
        }
        
        // Decodifica Base64
        String decoded = new String(Base64.getDecoder().decode(jwt));
        
        // Formato esperado: "email:timestamp"
        String email = decoded.split(":")[0];
        
        // Busca professor por email
        return professorService.findByEmail(email).getId();
    }

    @GetMapping("/alunos/busca")
    public ResponseEntity<?> buscarAlunos(@RequestHeader("Authorization") String token, 
                                        @RequestParam String nome) {
        try {
            Long professorId = extractProfessorIdFromToken(token);
            return ResponseEntity.ok(professorService.buscarAlunosPorNome(professorId, nome));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}

