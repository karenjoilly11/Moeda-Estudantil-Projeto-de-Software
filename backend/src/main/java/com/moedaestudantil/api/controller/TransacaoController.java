package com.moedaestudantil.api.controller;

import com.moedaestudantil.api.dto.ResgateRequestDTO;
import com.moedaestudantil.api.services.AlunoService;
import com.moedaestudantil.api.services.EmpresaService;
import com.moedaestudantil.api.services.TransacaoService;
import com.moedaestudantil.api.util.TokenUtil;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
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
        try {
            // P1-N01: exige token de aluno e força que o alunoId bata com o do token
            Long alunoIdAutenticado = requireAluno(authorization);
            return ResponseEntity.ok(transacaoService.resgatar(dto, alunoIdAutenticado));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (RuntimeException e) {
            String msg = e.getMessage();
            if (msg != null && (msg.contains("Token") || msg.contains("token"))) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(msg);
            }
            return ResponseEntity.badRequest().body(msg);
        }
    }

    @GetMapping("/extrato/{alunoId}")
    public ResponseEntity<?> extrato(@PathVariable Long alunoId,
                                     @RequestHeader(value = "Authorization", required = false) String authorization) {
        try {
            // P2-N03: exige token de aluno e que seja o próprio
            Long alunoIdAutenticado = requireAluno(authorization);
            if (!alunoIdAutenticado.equals(alunoId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Não é permitido ver extrato de outro aluno");
            }
            return ResponseEntity.ok(transacaoService.extratoAluno(alunoId));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (RuntimeException e) {
            String msg = e.getMessage();
            if (msg != null && (msg.contains("Token") || msg.contains("token"))) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(msg);
            }
            return ResponseEntity.badRequest().body(msg);
        }
    }

    @GetMapping("/validar/{codigo}")
    public ResponseEntity<?> validarCupom(@PathVariable String codigo,
                                          @RequestHeader(value = "Authorization", required = false) String authorization) {
        try {
            // P1-2 + P1-N02: empresa autenticada só valida cupons das suas vantagens
            Long empresaId = requireEmpresa(authorization);
            return ResponseEntity.ok(transacaoService.validarCupom(codigo, empresaId));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (RuntimeException e) {
            String msg = e.getMessage();
            if (msg != null && (msg.contains("Token") || msg.contains("token"))) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(msg);
            }
            return ResponseEntity.badRequest().body(msg);
        }
    }

    @PostMapping("/utilizar/{codigo}")
    public ResponseEntity<?> utilizarCupom(@PathVariable String codigo,
                                           @RequestHeader(value = "Authorization", required = false) String authorization) {
        try {
            // P1-2 + P1-N02: empresa autenticada só utiliza cupons das suas vantagens
            Long empresaId = requireEmpresa(authorization);
            return ResponseEntity.ok(transacaoService.utilizarCupom(codigo, empresaId));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (RuntimeException e) {
            String msg = e.getMessage();
            if (msg != null && (msg.contains("Token") || msg.contains("token"))) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(msg);
            }
            return ResponseEntity.badRequest().body(msg);
        }
    }

    /** Garante token de empresa e retorna o id. */
    private Long requireEmpresa(String authorization) {
        String email = TokenUtil.extractEmail(authorization);
        return empresaService.findByEmail(email).getId();
    }

    /** Garante token de aluno e retorna o id. */
    private Long requireAluno(String authorization) {
        String email = TokenUtil.extractEmail(authorization);
        return alunoService.findByEmail(email).getId();
    }
}
