package com.moedaestudantil.api.config;

import com.moedaestudantil.api.entities.Instituicao;
import com.moedaestudantil.api.entities.Professor;
import com.moedaestudantil.api.enums.TipoUsuario;
import com.moedaestudantil.api.repositories.InstituicaoRepository;
import com.moedaestudantil.api.repositories.ProfessorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Base64;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {
    
    private final InstituicaoRepository instituicaoRepository;
    private final ProfessorRepository professorRepository;
    
    // Método auxiliar para codificar senha
    private String codificarSenha(String senha) {
        return Base64.getEncoder().encodeToString(senha.getBytes());
    }
    
    @Override
    public void run(String... args) throws Exception {
        // Inicializar instituições PUC se não existirem
        if (instituicaoRepository.count() == 0) {
            
            // =============================================
            // INSTITUIÇÕES PUC MINAS
            // =============================================
            Instituicao pucCoracao = instituicaoRepository.save(new Instituicao(null, 
                "PUC Minas - Campus Coração Eucarístico", 
                "Av. Dom José Gaspar, 500 - Coração Eucarístico, Belo Horizonte - MG, 30535-901", 
                "(31) 3319-4444"));
            
            Instituicao pucBarreiro = instituicaoRepository.save(new Instituicao(null, 
                "PUC Minas - Campus Barreiro", 
                "Av. Afonso Vaz de Melo, 1200 - Barreiro, Belo Horizonte - MG, 30640-070", 
                "(31) 3328-9500"));
            
            Instituicao pucLourdes = instituicaoRepository.save(new Instituicao(null, 
                "PUC Minas - Campus Lourdes", 
                "Rua Gonçalves Dias, 276 - Lourdes, Belo Horizonte - MG, 30140-090", 
                "(31) 3319-4000"));
            
            System.out.println("✅ Instituições PUC Minas carregadas com sucesso!");
            
            // =============================================
            // PROFESSORES COM SENHAS INDIVIDUAIS
            // =============================================
            
            // Professor 1: João Paulo Aramuni - Coração Eucarístico
            // Senha: @ramuni2024
            Professor profAramuni = new Professor();
            profAramuni.setNome("Prof. João Paulo Carneiro Aramuni");
            profAramuni.setEmail("joao.aramuni@pucminas.br");
            profAramuni.setSenha(codificarSenha("@ramuni2024"));
            profAramuni.setTipo(TipoUsuario.PROFESSOR);
            profAramuni.setInstituicao(pucCoracao);
            profAramuni.setCpf("12345678901");
            profAramuni.setDepartamento("Engenharia de Software");
            profAramuni.setSaldoMoedas(1000.0);
            professorRepository.save(profAramuni);
            
            // Professor 2: Jose Laerte - Coração Eucarístico
            // Senha: Laerte@2024
            Professor profJose = new Professor();
            profJose.setNome("Prof. Jose Laerte");
            profJose.setEmail("jose.laerte@pucminas.br");
            profJose.setSenha(codificarSenha("Laerte@2024"));
            profJose.setTipo(TipoUsuario.PROFESSOR);
            profJose.setInstituicao(pucCoracao);
            profJose.setCpf("23456789012");
            profJose.setDepartamento("Engenharia de Computação");
            profJose.setSaldoMoedas(1000.0);
            professorRepository.save(profJose);
            
            // Professor 3: Glender da Silva - Barreiro
            // Senha: Glender@2024
            Professor profGlender = new Professor();
            profGlender.setNome("Prof. Glender da Silva");
            profGlender.setEmail("glender.silva@pucminas.br");
            profGlender.setSenha(codificarSenha("Glender@2024"));
            profGlender.setTipo(TipoUsuario.PROFESSOR);
            profGlender.setInstituicao(pucBarreiro);
            profGlender.setCpf("34567890123");
            profGlender.setDepartamento("Sistemas de Informação");
            profGlender.setSaldoMoedas(1000.0);
            professorRepository.save(profGlender);
            
            // Professor 4: Joana Gabriela de Souza - Lourdes
            // Senha: Joana@2024
            Professor profJoana = new Professor();
            profJoana.setNome("Prof. Joana Gabriela de Souza");
            profJoana.setEmail("joana.souza@pucminas.br");
            profJoana.setSenha(codificarSenha("Joana@2024"));
            profJoana.setTipo(TipoUsuario.PROFESSOR);
            profJoana.setInstituicao(pucLourdes);
            profJoana.setCpf("45678901234");
            profJoana.setDepartamento("Ciência de Dados");
            profJoana.setSaldoMoedas(1000.0);
            professorRepository.save(profJoana);
            
            System.out.println("✅ Professores pré-cadastrados com sucesso!");
            System.out.println("   📍 Campus Coração Eucarístico:");
            System.out.println("      - Prof. João Paulo Aramuni (Eng. Software) - Senha: @ramuni2024");
            System.out.println("      - Prof. Jose Laerte (Eng. Computação) - Senha: Laerte@2024");
            System.out.println("   📍 Campus Barreiro:");
            System.out.println("      - Prof. Glender da Silva (Sistemas de Informação) - Senha: Glender@2024");
            System.out.println("   📍 Campus Lourdes:");
            System.out.println("      - Prof. Joana Gabriela de Souza (Ciência de Dados) - Senha: Joana@2024");
        }
    }
}
