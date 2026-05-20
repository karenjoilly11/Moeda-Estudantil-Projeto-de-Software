package com.moedaestudantil.api.controller;

import com.moedaestudantil.api.dto.ResgateRequestDTO;
import com.moedaestudantil.api.services.AlunoService;
import com.moedaestudantil.api.services.EmpresaService;
import com.moedaestudantil.api.services.TransacaoService;
import com.moedaestudantil.api.util.TokenUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/transacao")
@RequiredArgsConstructor
public class TransacaoController {

    private final TransacaoService transacaoService;
    private final EmpresaService empresaService;
    private final AlunoService alunoService;

    @PostMapping("/resgatar")
    public ResponseEntity<?> resgatar(@Valid @RequestBody ResgateRequestDTO dto,
                                      @RequestHeader(value = "Authorization", required = false) String authorization) {
        Long alunoIdAutenticado = requireAluno(authorization);
        return ResponseEntity.ok(transacaoService.resgatar(dto, alunoIdAutenticado));
    }

    @GetMapping("/extrato/{alunoId}")
    public ResponseEntity<?> extrato(@PathVariable Long alunoId,
                                     @RequestHeader(value = "Authorization", required = false) String authorization) {
        Long alunoIdAutenticado = requireAluno(authorization);
        if (!alunoIdAutenticado.equals(alunoId)) {
            throw new SecurityException("Não é permitido ver extrato de outro aluno");
        }
        return ResponseEntity.ok(transacaoService.extratoAluno(alunoId));
    }

    @GetMapping("/validar/{codigo}")
    public ResponseEntity<?> validarCupom(@PathVariable String codigo,
                                          @RequestHeader(value = "Authorization", required = false) String authorization) {
        Long empresaId = requireEmpresa(authorization);
        return ResponseEntity.ok(transacaoService.validarCupom(codigo, empresaId));
    }

    @PostMapping("/utilizar/{codigo}")
    public ResponseEntity<?> utilizarCupom(@PathVariable String codigo,
                                           @RequestHeader(value = "Authorization", required = false) String authorization) {
        Long empresaId = requireEmpresa(authorization);
        return ResponseEntity.ok(transacaoService.utilizarCupom(codigo, empresaId));
    }

    private Long requireEmpresa(String authorization) {
        String email = TokenUtil.extractEmail(authorization);
        return empresaService.findByEmail(email).getId();
    }

    private Long requireAluno(String authorization) {
        String email = TokenUtil.extractEmail(authorization);
        return alunoService.findByEmail(email).getId();
    }
}
