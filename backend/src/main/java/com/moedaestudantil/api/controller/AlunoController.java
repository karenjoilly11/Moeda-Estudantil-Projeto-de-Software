package com.moedaestudantil.api.controller;

import com.moedaestudantil.api.dto.AlterarSenhaDTO;
import com.moedaestudantil.api.dto.AlunoCadastroDTO;
import com.moedaestudantil.api.dto.AlunoPerfilDTO;
import com.moedaestudantil.api.dto.AlunoResponseDTO;
import com.moedaestudantil.api.dto.LoginRequestDTO;
import com.moedaestudantil.api.services.AlunoService;
import com.moedaestudantil.api.util.TokenUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/aluno")
@RequiredArgsConstructor
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
            @PathVariable Long id,
            @RequestHeader(value = "Authorization", required = false) String authorization) {
        try {
            Long alunoIdAutenticado = extractAlunoIdFromToken(authorization);
            if (!id.equals(alunoIdAutenticado)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("Você não tem permissão para editar este perfil");
            }
            AlunoResponseDTO resultado = alunoService.atualizarPerfil(id, dto);
            return ResponseEntity.ok(resultado);
        } catch (RuntimeException e) {
            String msg = e.getMessage();
            if (msg != null && (msg.contains("Token") || msg.contains("token"))) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(msg);
            }
            return ResponseEntity.badRequest().body(msg);
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

    @DeleteMapping("/{id}")
    public ResponseEntity<?> excluirConta(
            @PathVariable Long id,
            @RequestHeader(value = "Authorization", required = false) String authorization) {
        try {
            Long alunoIdAutenticado = extractAlunoIdFromToken(authorization);
            if (!id.equals(alunoIdAutenticado)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("Você não tem permissão para excluir esta conta");
            }
            alunoService.excluirConta(id);
            return ResponseEntity.ok().body("Conta excluída com sucesso");
        } catch (RuntimeException e) {
            String msg = e.getMessage();
            if (msg != null && (msg.contains("Token") || msg.contains("token"))) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(msg);
            }
            return ResponseEntity.badRequest().body(msg);
        }
    }

    @PutMapping("/senha")
    public ResponseEntity<?> alterarSenha(@RequestBody AlterarSenhaDTO dto,
                                          @RequestHeader(value = "Authorization", required = false) String authorization) {
        try {
            Long alunoId = extractAlunoIdFromToken(authorization);
            alunoService.alterarSenha(alunoId, dto.getSenhaAtual(), dto.getNovaSenha());
            return ResponseEntity.ok().body("Senha alterada com sucesso");
        } catch (RuntimeException e) {
            String msg = e.getMessage();
            if (msg != null && (msg.contains("Token") || msg.contains("token"))) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(msg);
            }
            return ResponseEntity.badRequest().body(msg);
        }
    }

    private Long extractAlunoIdFromToken(String authorization) {
        String email = TokenUtil.extractEmail(authorization);
        return alunoService.findByEmail(email).getId();
    }
}
