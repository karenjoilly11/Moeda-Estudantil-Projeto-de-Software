package com.moedaestudantil.api.controller;

import com.moedaestudantil.api.dto.EmpresaCadastroDTO;
import com.moedaestudantil.api.dto.LoginRequestDTO;
import com.moedaestudantil.api.dto.EmpresaPerfilDTO;
import com.moedaestudantil.api.services.EmpresaService;
import com.moedaestudantil.api.services.TransacaoService;
import com.moedaestudantil.api.services.VantagemService;
import com.moedaestudantil.api.util.TokenUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/empresa")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class EmpresaController {

    private final EmpresaService empresaService;
    private final VantagemService vantagemService;
    private final TransacaoService transacaoService;

    @PostMapping("/cadastro")
    public ResponseEntity<?> cadastrar(@RequestBody EmpresaCadastroDTO dto) {
        try {
            return ResponseEntity.ok(empresaService.cadastrar(dto));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO dto) {
        try {
            return ResponseEntity.ok(empresaService.login(dto));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<?> listar() {
        return ResponseEntity.ok(empresaService.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscar(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(empresaService.buscarPorId(id));
        } catch (Exception e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    @GetMapping("/{id}/vantagens")
    public ResponseEntity<?> vantagens(@PathVariable Long id,
                                       @RequestHeader(value = "Authorization", required = false) String authorization) {
        try {
            // P0-5: só a própria empresa lista suas vantagens
            ResponseEntity<?> forbidden = checkOwnership(id, authorization);
            if (forbidden != null) return forbidden;
            return ResponseEntity.ok(vantagemService.listarPorEmpresa(id));
        } catch (RuntimeException e) {
            String msg = e.getMessage();
            if (msg != null && (msg.contains("Token") || msg.contains("token"))) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(msg);
            }
            return ResponseEntity.badRequest().body(msg);
        }
    }

    @GetMapping("/{id}/cupons")
    public ResponseEntity<?> cupons(@PathVariable Long id,
                                    @RequestHeader(value = "Authorization", required = false) String authorization) {
        try {
            // P0-5: só a própria empresa lista seus cupons
            ResponseEntity<?> forbidden = checkOwnership(id, authorization);
            if (forbidden != null) return forbidden;
            return ResponseEntity.ok(transacaoService.cuponsDaEmpresa(id));
        } catch (RuntimeException e) {
            String msg = e.getMessage();
            if (msg != null && (msg.contains("Token") || msg.contains("token"))) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(msg);
            }
            return ResponseEntity.badRequest().body(msg);
        }
    }

    @PutMapping("/perfil/{id}")
    public ResponseEntity<?> atualizarPerfil(@PathVariable Long id, @RequestBody EmpresaPerfilDTO dto,
                                             @RequestHeader(value = "Authorization", required = false) String authorization) {
        try {
            ResponseEntity<?> forbidden = checkOwnership(id, authorization);
            if (forbidden != null) return forbidden;
            return ResponseEntity.ok(empresaService.atualizarPerfil(id, dto));
        } catch (RuntimeException e) {
            String msg = e.getMessage();
            if (msg != null && (msg.contains("Token") || msg.contains("token"))) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(msg);
            }
            return ResponseEntity.badRequest().body(msg);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> excluirConta(@PathVariable Long id,
                                          @RequestHeader(value = "Authorization", required = false) String authorization) {
        try {
            ResponseEntity<?> forbidden = checkOwnership(id, authorization);
            if (forbidden != null) return forbidden;
            empresaService.excluirConta(id);
            return ResponseEntity.ok().body("Conta excluída com sucesso");
        } catch (RuntimeException e) {
            String msg = e.getMessage();
            if (msg != null && (msg.contains("Token") || msg.contains("token"))) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(msg);
            }
            return ResponseEntity.badRequest().body(msg);
        }
    }

    /** Retorna ResponseEntity 403 se id ≠ empresa autenticada, ou null se OK. */
    private ResponseEntity<?> checkOwnership(Long pathId, String authorization) {
        String email = TokenUtil.extractEmail(authorization);
        Long empresaIdAutenticada = empresaService.findByEmail(email).getId();
        if (!pathId.equals(empresaIdAutenticada)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Você não tem permissão para acessar dados de outra empresa");
        }
        return null;
    }
}
