package com.moedaestudantil.api.controller;

import com.moedaestudantil.api.dto.EmpresaCadastroDTO;
import com.moedaestudantil.api.dto.LoginRequestDTO;
import com.moedaestudantil.api.dto.EmpresaPerfilDTO;
import com.moedaestudantil.api.services.EmpresaService;
import com.moedaestudantil.api.services.TransacaoService;
import com.moedaestudantil.api.services.VantagemService;
import com.moedaestudantil.api.util.TokenUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/empresa")
@RequiredArgsConstructor
public class EmpresaController {

    private final EmpresaService empresaService;
    private final VantagemService vantagemService;
    private final TransacaoService transacaoService;

    @PostMapping("/cadastro")
    public ResponseEntity<?> cadastrar(@RequestBody EmpresaCadastroDTO dto) {
        return ResponseEntity.ok(empresaService.cadastrar(dto));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO dto) {
        return ResponseEntity.ok(empresaService.login(dto));
    }

    @GetMapping
    public ResponseEntity<?> listar() {
        return ResponseEntity.ok(empresaService.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscar(@PathVariable Long id) {
        return ResponseEntity.ok(empresaService.buscarPorId(id));
    }

    @GetMapping("/{id}/vantagens")
    public ResponseEntity<?> vantagens(@PathVariable Long id,
                                       @RequestHeader(value = "Authorization", required = false) String authorization) {
        checkOwnership(id, authorization);
        return ResponseEntity.ok(vantagemService.listarPorEmpresa(id));
    }

    @GetMapping("/{id}/cupons")
    public ResponseEntity<?> cupons(@PathVariable Long id,
                                    @RequestHeader(value = "Authorization", required = false) String authorization) {
        checkOwnership(id, authorization);
        return ResponseEntity.ok(transacaoService.cuponsDaEmpresa(id));
    }

    @PutMapping("/perfil/{id}")
    public ResponseEntity<?> atualizarPerfil(@PathVariable Long id, @RequestBody EmpresaPerfilDTO dto,
                                             @RequestHeader(value = "Authorization", required = false) String authorization) {
        checkOwnership(id, authorization);
        return ResponseEntity.ok(empresaService.atualizarPerfil(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> excluirConta(@PathVariable Long id,
                                          @RequestHeader(value = "Authorization", required = false) String authorization) {
        checkOwnership(id, authorization);
        empresaService.excluirConta(id);
        return ResponseEntity.ok().body("Conta excluída com sucesso");
    }

    private void checkOwnership(Long pathId, String authorization) {
        String email = TokenUtil.extractEmail(authorization);
        Long empresaIdAutenticada = empresaService.findByEmail(email).getId();
        if (!pathId.equals(empresaIdAutenticada)) {
            throw new SecurityException("Você não tem permissão para acessar dados de outra empresa");
        }
    }
}
