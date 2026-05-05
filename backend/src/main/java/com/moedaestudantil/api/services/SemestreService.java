package com.moedaestudantil.api.services;

import com.moedaestudantil.api.entities.Professor;
import com.moedaestudantil.api.repositories.ProfessorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class SemestreService {
    
    private final ProfessorRepository professorRepository;
    
    // Rodar todo dia 1 de março e 1 de setembro às 00:00
    @Scheduled(cron = "0 0 0 1 3,9 *")
    public void creditarMoedasSemestre() {
        for (Professor professor : professorRepository.findAll()) {
            professor.setSaldoMoedas(professor.getSaldoMoedas() + 1000);
            professor.setUltimoSemestreCreditado(LocalDateTime.now());
            professorRepository.save(professor);
        }
        System.out.println("Crédito semestral de 1000 moedas distribuído para todos os professores!");
    }
}