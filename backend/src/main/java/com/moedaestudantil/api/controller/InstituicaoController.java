package com.moedaestudantil.api.controller;

import com.moedaestudantil.api.entities.Instituicao;
import com.moedaestudantil.api.repositories.InstituicaoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/instituicoes")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class InstituicaoController {
    
    private final InstituicaoRepository instituicaoRepository;
    
    @GetMapping
    public List<Instituicao> listar() {
        return instituicaoRepository.findAll();
    }
}
