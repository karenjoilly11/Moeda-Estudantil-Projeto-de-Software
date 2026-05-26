package com.moedaestudantil.api.controller;

import com.moedaestudantil.api.dto.ProfessorLoginDTO;
import com.moedaestudantil.api.services.ProfessorService;
import com.moedaestudantil.api.util.TokenUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.moedaestudantil.api.dto.EnviarMoedasDTO;
import com.moedaestudantil.api.dto.EnvioMoedasResponseDTO;

@RestController
@RequestMapping("/api/professor")
@RequiredArgsConstructor
public class ProfessorController {

    private final ProfessorService professorService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody ProfessorLoginDTO dto) {
        return ResponseEntity.ok(professorService.login(dto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPorId(@PathVariable Long id,
            @RequestHeader(value = "Authorization", required = false) String authorization) {
        extractProfessorIdFromToken(authorization);
        return ResponseEntity.ok(professorService.buscarPorId(id));
    }

    @PostMapping("/enviar-moedas")
    public ResponseEntity<?> enviarMoedas(@Valid @RequestBody EnviarMoedasDTO dto,
            @RequestHeader(value = "Authorization", required = false) String authorization) {
        Long professorId = extractProfessorIdFromToken(authorization);
        EnvioMoedasResponseDTO response = professorService.enviarMoedas(professorId, dto);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/extrato")
    public ResponseEntity<?> extrato(@RequestHeader(value = "Authorization", required = false) String authorization) {
        Long professorId = extractProfessorIdFromToken(authorization);
        return ResponseEntity.ok(professorService.extrato(professorId));
    }

    @GetMapping("/saldo")
    public ResponseEntity<?> saldo(@RequestHeader(value = "Authorization", required = false) String authorization) {
        Long professorId = extractProfessorIdFromToken(authorization);
        return ResponseEntity.ok(professorService.saldo(professorId));
    }

    @GetMapping("/alunos")
    public ResponseEntity<?> listarAlunos(@RequestHeader(value = "Authorization", required = false) String authorization) {
        Long professorId = extractProfessorIdFromToken(authorization);
        return ResponseEntity.ok(professorService.listarAlunosPorInstituicao(professorId));
    }

    @GetMapping("/alunos/busca")
    public ResponseEntity<?> buscarAlunos(@RequestHeader(value = "Authorization", required = false) String authorization,
                                          @RequestParam String nome) {
        Long professorId = extractProfessorIdFromToken(authorization);
        return ResponseEntity.ok(professorService.buscarAlunosPorNome(professorId, nome));
    }

    private Long extractProfessorIdFromToken(String authorization) {
        String email = TokenUtil.extractEmail(authorization);
        return professorService.findByEmail(email).getId();
    }
}
