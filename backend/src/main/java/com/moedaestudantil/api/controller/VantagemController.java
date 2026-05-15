package com.moedaestudantil.api.controller;

import com.moedaestudantil.api.dto.VantagemCadastroDTO;
import com.moedaestudantil.api.dto.VantagemResponseDTO;
import com.moedaestudantil.api.services.EmpresaService;
import com.moedaestudantil.api.services.VantagemService;
import com.moedaestudantil.api.util.TokenUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/vantagem")
@RequiredArgsConstructor
public class VantagemController {

    private final VantagemService vantagemService;
    private final EmpresaService empresaService;

    @PostMapping("/cadastro")
    public ResponseEntity<?> cadastrarLegacy(@Valid @RequestBody VantagemCadastroDTO dto,
                                             @RequestHeader(value = "Authorization", required = false) String authorization) {
        return cadastrar(dto, authorization);
    }

    @PostMapping
    public ResponseEntity<?> cadastrar(@Valid @RequestBody VantagemCadastroDTO dto,
                                       @RequestHeader(value = "Authorization", required = false) String authorization) {
        try {
            // P0-4: exigir token e forçar empresaId = empresa autenticada
            Long empresaIdAutenticada = extractEmpresaIdFromToken(authorization);
            dto.setEmpresaId(empresaIdAutenticada);
            return ResponseEntity.ok(vantagemService.cadastrar(dto));
        } catch (RuntimeException e) {
            String msg = e.getMessage();
            if (msg != null && (msg.contains("Token") || msg.contains("token"))) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(msg);
            }
            return ResponseEntity.badRequest().body(msg);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable Long id, @Valid @RequestBody VantagemCadastroDTO dto,
                                       @RequestHeader(value = "Authorization", required = false) String authorization) {
        try {
            Long empresaIdAutenticada = extractEmpresaIdFromToken(authorization);
            // Garante que só pode editar suas próprias vantagens
            VantagemResponseDTO existente = vantagemService.buscarPorId(id);
            if (existente.getEmpresaId() != null && !existente.getEmpresaId().equals(empresaIdAutenticada)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Vantagem não pertence à sua empresa");
            }
            dto.setEmpresaId(empresaIdAutenticada);
            return ResponseEntity.ok(vantagemService.atualizar(id, dto));
        } catch (RuntimeException e) {
            String msg = e.getMessage();
            if (msg != null && (msg.contains("Token") || msg.contains("token"))) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(msg);
            }
            return ResponseEntity.badRequest().body(msg);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> remover(@PathVariable Long id,
                                     @RequestHeader(value = "Authorization", required = false) String authorization) {
        try {
            Long empresaIdAutenticada = extractEmpresaIdFromToken(authorization);
            VantagemResponseDTO existente = vantagemService.buscarPorId(id);
            if (existente.getEmpresaId() != null && !existente.getEmpresaId().equals(empresaIdAutenticada)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Vantagem não pertence à sua empresa");
            }
            vantagemService.remover(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            String msg = e.getMessage();
            if (msg != null && (msg.contains("Token") || msg.contains("token"))) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(msg);
            }
            return ResponseEntity.badRequest().body(msg);
        }
    }

    @GetMapping
    public ResponseEntity<?> listar() {
        return ResponseEntity.ok(vantagemService.listar());
    }

    private Long extractEmpresaIdFromToken(String authorization) {
        String email = TokenUtil.extractEmail(authorization);
        return empresaService.findByEmail(email).getId();
    }
}
