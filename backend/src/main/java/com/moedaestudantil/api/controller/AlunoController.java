package com.moedaestudantil.api.controller;

import com.moedaestudantil.api.dto.AlterarSenhaDTO;
import com.moedaestudantil.api.dto.AlunoCadastroDTO;
import com.moedaestudantil.api.dto.AlunoPerfilDTO;
import com.moedaestudantil.api.dto.AlunoResponseDTO;
import com.moedaestudantil.api.dto.LoginRequestDTO;
import com.moedaestudantil.api.services.AlunoService;
import com.moedaestudantil.api.util.TokenUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/aluno")
@RequiredArgsConstructor
public class AlunoController {

    private final AlunoService alunoService;

    @PostMapping("/cadastro")
    public ResponseEntity<?> cadastrar(@RequestBody AlunoCadastroDTO dto) {
        return ResponseEntity.ok(alunoService.cadastrar(dto));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO dto) {
        return ResponseEntity.ok(alunoService.login(dto));
    }

    @PutMapping("/perfil/{id}")
    public ResponseEntity<?> atualizarPerfilComId(
            @RequestBody AlunoPerfilDTO dto,
            @PathVariable Long id,
            @RequestHeader(value = "Authorization", required = false) String authorization) {
        Long alunoIdAutenticado = extractAlunoIdFromToken(authorization);
        if (!id.equals(alunoIdAutenticado)) {
            throw new SecurityException("Você não tem permissão para editar este perfil");
        }
        AlunoResponseDTO resultado = alunoService.atualizarPerfil(id, dto);
        return ResponseEntity.ok(resultado);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(alunoService.buscarPorId(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> excluirConta(
            @PathVariable Long id,
            @RequestHeader(value = "Authorization", required = false) String authorization) {
        Long alunoIdAutenticado = extractAlunoIdFromToken(authorization);
        if (!id.equals(alunoIdAutenticado)) {
            throw new SecurityException("Você não tem permissão para excluir esta conta");
        }
        alunoService.excluirConta(id);
        return ResponseEntity.ok().body("Conta excluída com sucesso");
    }

    @PutMapping("/senha")
    public ResponseEntity<?> alterarSenha(@RequestBody AlterarSenhaDTO dto,
                                          @RequestHeader(value = "Authorization", required = false) String authorization) {
        Long alunoId = extractAlunoIdFromToken(authorization);
        alunoService.alterarSenha(alunoId, dto.getSenhaAtual(), dto.getNovaSenha());
        return ResponseEntity.ok().body("Senha alterada com sucesso");
    }

    private Long extractAlunoIdFromToken(String authorization) {
        String email = TokenUtil.extractEmail(authorization);
        return alunoService.findByEmail(email).getId();
    }
}
