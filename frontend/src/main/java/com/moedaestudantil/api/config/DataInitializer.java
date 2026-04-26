package com.moedaestudantil.api.config;

import com.moedaestudantil.api.entities.Instituicao;
import com.moedaestudantil.api.repositories.InstituicaoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {
    
    private final InstituicaoRepository instituicaoRepository;
    
    @Override
    public void run(String... args) throws Exception {
        if (instituicaoRepository.count() == 0) {
            instituicaoRepository.save(new Instituicao(null, "Universidade de São Paulo (USP)", "São Paulo, SP", "(11) 3091-1000"));
            instituicaoRepository.save(new Instituicao(null, "Universidade Estadual de Campinas (UNICAMP)", "Campinas, SP", "(19) 3521-7000"));
            instituicaoRepository.save(new Instituicao(null, "Universidade Federal do Rio de Janeiro (UFRJ)", "Rio de Janeiro, RJ", "(21) 3938-1000"));
            instituicaoRepository.save(new Instituicao(null, "Pontifícia Universidade Católica (PUC-SP)", "São Paulo, SP", "(11) 3670-8000"));
            instituicaoRepository.save(new Instituicao(null, "Universidade Federal de Minas Gerais (UFMG)", "Belo Horizonte, MG", "(31) 3409-4000"));
            System.out.println("Instituições carregadas com sucesso!");
        }
    }
}
