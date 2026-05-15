package com.moedaestudantil.api.controller;

import com.moedaestudantil.api.dto.ProfessorLoginDTO;
import com.moedaestudantil.api.services.ProfessorService;
import com.moedaestudantil.api.util.TokenUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.moedaestudantil.api.dto.EnviarMoedasDTO;
import com.moedaestudantil.api.dto.EnvioMoedasResponseDTO;

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
            @RequestHeader(value = "Authorization", required = false) String authorization) {
        try {
            Long professorId = extractProfessorIdFromToken(authorization);
            EnvioMoedasResponseDTO response = professorService.enviarMoedas(professorId, dto);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return mapearErro(e);
        }
    }

    @GetMapping("/extrato")
    public ResponseEntity<?> extrato(@RequestHeader(value = "Authorization", required = false) String authorization) {
        try {
            Long professorId = extractProfessorIdFromToken(authorization);
            return ResponseEntity.ok(professorService.extrato(professorId));
        } catch (RuntimeException e) {
            return mapearErro(e);
        }
    }

    @GetMapping("/saldo")
    public ResponseEntity<?> saldo(@RequestHeader(value = "Authorization", required = false) String authorization) {
        try {
            Long professorId = extractProfessorIdFromToken(authorization);
            return ResponseEntity.ok(professorService.saldo(professorId));
        } catch (RuntimeException e) {
            return mapearErro(e);
        }
    }

    @GetMapping("/alunos")
    public ResponseEntity<?> listarAlunos(@RequestHeader(value = "Authorization", required = false) String authorization) {
        try {
            Long professorId = extractProfessorIdFromToken(authorization);
            return ResponseEntity.ok(professorService.listarAlunosPorInstituicao(professorId));
        } catch (RuntimeException e) {
            return mapearErro(e);
        }
    }

    @GetMapping("/alunos/busca")
    public ResponseEntity<?> buscarAlunos(@RequestHeader(value = "Authorization", required = false) String authorization,
                                          @RequestParam String nome) {
        try {
            Long professorId = extractProfessorIdFromToken(authorization);
            return ResponseEntity.ok(professorService.buscarAlunosPorNome(professorId, nome));
        } catch (RuntimeException e) {
            return mapearErro(e);
        }
    }

    private Long extractProfessorIdFromToken(String authorization) {
        String email = TokenUtil.extractEmail(authorization);
        return professorService.findByEmail(email).getId();
    }

    // P2-N04: mapeia erros de token pra 401, demais pra 400
    private ResponseEntity<?> mapearErro(RuntimeException e) {
        String msg = e.getMessage();
        if (msg != null && (msg.contains("Token") || msg.contains("token"))) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(msg);
        }
        return ResponseEntity.badRequest().body(msg);
    }
}
