package com.moedaestudantil.api.services;

import com.moedaestudantil.api.entities.Aluno;
import com.moedaestudantil.api.entities.Vantagem;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class NotificacaoService {

    public void notificarRecebimentoMoeda(Aluno aluno, Double valor, String mensagem) {
        log.info("[EMAIL→{}] Você recebeu {} moedas. Motivo: {}",
                aluno.getEmail(), valor, mensagem);
    }

    public void notificarResgateAluno(Aluno aluno, Vantagem vantagem, String codigoCupom) {
        log.info("[EMAIL→{}] Cupom '{}' gerado para a vantagem '{}'. Apresente este código no estabelecimento.",
                aluno.getEmail(), codigoCupom, vantagem.getNome());
    }

    public void notificarResgateEmpresa(Vantagem vantagem, Aluno aluno, String codigoCupom) {
        String empresaRef = vantagem.getInstituicao() != null
                ? vantagem.getInstituicao().getNome()
                : "empresa-desconhecida";
        log.info("[EMAIL→empresa@{}] Aluno '{}' resgatou '{}'. Código do cupom: {}",
                empresaRef, aluno.getNome(), vantagem.getNome(), codigoCupom);
    }
}
