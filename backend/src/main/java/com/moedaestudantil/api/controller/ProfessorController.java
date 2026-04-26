package com.moedaestudantil.api.controller;

import com.moedaestudantil.api.dto.ProfessorLoginDTO;
import com.moedaestudantil.api.services.ProfessorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/professor")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ProfessorController {
    
    private final ProfessorService professorService;
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody ProfessorLoginDTO dto) {
        try {
            return ResponseEntity.ok(professorService.login(dto));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
