package com.moedaestudantil.api.config;

import com.moedaestudantil.api.entities.Aluno;
import com.moedaestudantil.api.entities.Empresa;
import com.moedaestudantil.api.entities.Instituicao;
import com.moedaestudantil.api.entities.Professor;
import com.moedaestudantil.api.entities.Vantagem;
import com.moedaestudantil.api.enums.TipoUsuario;
import com.moedaestudantil.api.repositories.AlunoRepository;
import com.moedaestudantil.api.repositories.EmpresaRepository;
import com.moedaestudantil.api.repositories.InstituicaoRepository;
import com.moedaestudantil.api.repositories.ProfessorRepository;
import com.moedaestudantil.api.repositories.VantagemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Base64;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final InstituicaoRepository instituicaoRepository;
    private final ProfessorRepository professorRepository;
    private final AlunoRepository alunoRepository;
    private final VantagemRepository vantagemRepository;
    private final EmpresaRepository empresaRepository;
    
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

            // Professor DEMO (usado pela UI: LoginScreen seedEmail)
            // Senha: professor@2024
            Professor profDemo = new Professor();
            profDemo.setNome("Prof. Demonstração");
            profDemo.setEmail("professor.demo@pucminas.br");
            profDemo.setSenha(codificarSenha("professor@2024"));
            profDemo.setTipo(TipoUsuario.PROFESSOR);
            profDemo.setInstituicao(pucCoracao);
            profDemo.setCpf("55566677788");
            profDemo.setDepartamento("Engenharia de Software");
            profDemo.setSaldoMoedas(1000.0);
            professorRepository.save(profDemo);
            
            System.out.println("✅ Professores pré-cadastrados com sucesso!");
            System.out.println("   📍 Campus Coração Eucarístico:");
            System.out.println("      - Prof. João Paulo Aramuni (Eng. Software) - Senha: @ramuni2024");
            System.out.println("      - Prof. Jose Laerte (Eng. Computação) - Senha: Laerte@2024");
            System.out.println("   📍 Campus Barreiro:");
            System.out.println("      - Prof. Glender da Silva (Sistemas de Informação) - Senha: Glender@2024");
            System.out.println("   📍 Campus Lourdes:");
            System.out.println("      - Prof. Joana Gabriela de Souza (Ciência de Dados) - Senha: Joana@2024");

            // =============================================
            // EMPRESA DEMO
            // Senha: empresa@2024
            // =============================================
            Empresa empresaDemo = new Empresa();
            empresaDemo.setNome("Livraria Cultura");
            empresaDemo.setEmail("empresa.demo@livraria.com");
            empresaDemo.setSenha(codificarSenha("empresa@2024"));
            empresaDemo.setTipo(TipoUsuario.EMPRESA);
            empresaDemo.setCnpj("12.345.678/0001-99");
            empresaDemo.setDescricao("Livraria parceira com vouchers e descontos em livros");
            empresaDemo.setInstituicao(pucCoracao);
            Empresa empresaSalva = empresaRepository.save(empresaDemo);

            System.out.println("✅ Empresa demo cadastrada:");
            System.out.println("      - empresa.demo@livraria.com (CNPJ: 12.345.678/0001-99) - Senha: empresa@2024");

            // Empresa DEMO 2 (usada pela UI: LoginScreen seedEmail "empresa.demo@parceiro.com")
            Empresa empresaParceiro = new Empresa();
            empresaParceiro.setNome("Parceiro Demo");
            empresaParceiro.setEmail("empresa.demo@parceiro.com");
            empresaParceiro.setSenha(codificarSenha("empresa@2024"));
            empresaParceiro.setTipo(TipoUsuario.EMPRESA);
            empresaParceiro.setCnpj("98.765.432/0001-10");
            empresaParceiro.setDescricao("Empresa parceira de demonstração");
            empresaParceiro.setInstituicao(pucCoracao);
            empresaRepository.save(empresaParceiro);
            System.out.println("      - empresa.demo@parceiro.com (CNPJ: 98.765.432/0001-10) - Senha: empresa@2024");

            // =============================================
            // VANTAGENS DE EXEMPLO
            // (2 vinculadas à empresa demo, 2 só de instituição)
            // =============================================
            Vantagem v1 = new Vantagem();
            v1.setNome("Caderno Universitário PUC");
            v1.setDescricao("Caderno oficial PUC Minas — 200 folhas, capa dura");
            v1.setFoto("https://placehold.co/400x300?text=Caderno+PUC");
            v1.setCustoMoedas(50.0);
            v1.setEstoque(10);
            v1.setCategoria("livros");
            v1.setInstituicao(pucCoracao);
            v1.setEmpresa(empresaSalva);
            vantagemRepository.save(v1);

            Vantagem v2 = new Vantagem();
            v2.setNome("Voucher Cantina (R$ 20)");
            v2.setDescricao("Crédito de R$ 20 na cantina do campus Barreiro");
            v2.setFoto("https://placehold.co/400x300?text=Voucher+Cantina");
            v2.setCustoMoedas(100.0);
            v2.setEstoque(20);
            v2.setCategoria("comida");
            v2.setInstituicao(pucBarreiro);
            vantagemRepository.save(v2);

            Vantagem v3 = new Vantagem();
            v3.setNome("Camiseta PUC Minas");
            v3.setDescricao("Camiseta oficial em algodão — modelos M, G, GG");
            v3.setFoto("https://placehold.co/400x300?text=Camiseta+PUC");
            v3.setCustoMoedas(250.0);
            v3.setEstoque(15);
            v3.setCategoria("outros");
            v3.setInstituicao(pucLourdes);
            vantagemRepository.save(v3);

            Vantagem v4 = new Vantagem();
            v4.setNome("Curso de Extensão (1 vaga)");
            v4.setDescricao("Vaga gratuita em curso de extensão de até 40h");
            v4.setFoto("https://placehold.co/400x300?text=Curso+Extensao");
            v4.setCustoMoedas(400.0);
            v4.setEstoque(5);
            v4.setCategoria("cursos");
            v4.setInstituicao(pucCoracao);
            v4.setEmpresa(empresaSalva);
            vantagemRepository.save(v4);

            System.out.println("✅ Vantagens de exemplo carregadas (4 itens, 2 vinculadas à empresa demo).");

            // =============================================
            // ALUNO DEMO (com saldo inicial pra testar resgate)
            // Senha: aluno@2024
            // =============================================
            Aluno alunoDemo = new Aluno();
            alunoDemo.setNome("Aluno Demonstração");
            alunoDemo.setEmail("aluno.demo@pucminas.br");
            alunoDemo.setSenha(codificarSenha("aluno@2024"));
            alunoDemo.setTipo(TipoUsuario.ALUNO);
            alunoDemo.setInstituicao(pucCoracao);
            alunoDemo.setCpf("99988877766");
            alunoDemo.setRg("MG12345678");
            alunoDemo.setEndereco("Rua Exemplo, 100 - BH/MG");
            alunoDemo.setCurso("Engenharia de Software");
            alunoDemo.setSaldoMoedas(500.0);
            alunoRepository.save(alunoDemo);

            System.out.println("✅ Aluno demo cadastrado:");
            System.out.println("      - aluno.demo@pucminas.br (saldo: 500) - Senha: aluno@2024");
        }
    }
}
