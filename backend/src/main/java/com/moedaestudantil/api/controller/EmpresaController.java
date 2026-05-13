package com.moedaestudantil.api.controller;

import com.moedaestudantil.api.dto.EmpresaCadastroDTO;
import com.moedaestudantil.api.dto.LoginRequestDTO;
import com.moedaestudantil.api.dto.EmpresaPerfilDTO;
import com.moedaestudantil.api.services.EmpresaService;
import com.moedaestudantil.api.services.TransacaoService;
import com.moedaestudantil.api.services.VantagemService;
import lombok.RequiredArgsConstructor;
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
    public ResponseEntity<?> vantagens(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(vantagemService.listarPorEmpresa(id));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{id}/cupons")
    public ResponseEntity<?> cupons(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(transacaoService.cuponsDaEmpresa(id));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @PutMapping("/perfil/{id}")
public ResponseEntity<?> atualizarPerfil(@PathVariable Long id, @RequestBody EmpresaPerfilDTO dto) {
    try {
        return ResponseEntity.ok(empresaService.atualizarPerfil(id, dto));
    } catch (Exception e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }
}

@DeleteMapping("/{id}")
public ResponseEntity<?> excluirConta(@PathVariable Long id) {
    try {
        empresaService.excluirConta(id);
        return ResponseEntity.ok().body("Conta excluída com sucesso");
    } catch (Exception e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }
}
}
