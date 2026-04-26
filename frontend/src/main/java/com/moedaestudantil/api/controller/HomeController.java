package com.moedaestudantil.api.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {
    
    @GetMapping("/")
    public String home() {
        return "🚀 Moeda Estudantil API - Rodando com sucesso!";
    }
    
    @GetMapping("/health")
    public String health() {
        return "OK - Servidor funcionando!";
    }
}
