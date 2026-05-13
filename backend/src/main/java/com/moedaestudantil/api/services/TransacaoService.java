package com.moedaestudantil.api.services;

import com.moedaestudantil.api.dto.CupomValidacaoDTO;
import com.moedaestudantil.api.dto.ResgateRequestDTO;
import com.moedaestudantil.api.dto.ResgateResponseDTO;
import com.moedaestudantil.api.dto.TransacaoResponseDTO;
import com.moedaestudantil.api.entities.Aluno;
import com.moedaestudantil.api.entities.Transacao;
import com.moedaestudantil.api.entities.Vantagem;
import com.moedaestudantil.api.enums.TipoTransacao;
import com.moedaestudantil.api.repositories.AlunoRepository;
import com.moedaestudantil.api.repositories.TransacaoRepository;
import com.moedaestudantil.api.repositories.VantagemRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TransacaoService {

    private static final String STATUS_PENDENTE = "PENDENTE";
    private static final String STATUS_UTILIZADO = "UTILIZADO";

    private final TransacaoRepository transacaoRepository;
    private final AlunoRepository alunoRepository;
    private final VantagemRepository vantagemRepository;
    private final NotificacaoService notificacaoService;

    @Transactional
    public ResgateResponseDTO resgatar(ResgateRequestDTO dto) {
        Aluno aluno = alunoRepository.findById(dto.getAlunoId())
                .orElseThrow(() -> new EntityNotFoundException("Aluno não encontrado!"));

        Vantagem vantagem = vantagemRepository.findById(dto.getVantagemId())
                .orElseThrow(() -> new EntityNotFoundException("Vantagem não encontrada!"));

        if (aluno.getSaldoMoedas() < vantagem.getCustoMoedas()) {
            throw new IllegalStateException(
                    "Saldo insuficiente. Saldo atual: " + aluno.getSaldoMoedas()
                            + " | Custo: " + vantagem.getCustoMoedas());
        }

        if (vantagem.getEstoque() != null && vantagem.getEstoque() <= 0) {
            throw new IllegalStateException("Vantagem sem estoque");
        }

        aluno.setSaldoMoedas(aluno.getSaldoMoedas() - vantagem.getCustoMoedas());
        alunoRepository.save(aluno);

        if (vantagem.getEstoque() != null) {
            vantagem.setEstoque(vantagem.getEstoque() - 1);
            vantagemRepository.save(vantagem);
        }

        String codigoCupom = gerarCodigoCupom();

        Transacao transacao = new Transacao();
        transacao.setTipo(TipoTransacao.RESGATE);
        transacao.setValor(vantagem.getCustoMoedas());
        transacao.setMensagem("Resgate da vantagem '" + vantagem.getNome() + "'");
        transacao.setAluno(aluno);
        transacao.setProfessor(null);
        transacao.setVantagem(vantagem);
        transacao.setCodigoCupom(codigoCupom);
        transacao.setStatus(STATUS_PENDENTE);
        Transacao salva = transacaoRepository.save(transacao);

        notificacaoService.notificarResgateAluno(aluno, vantagem, codigoCupom, aluno.getSaldoMoedas());
        notificacaoService.notificarResgateEmpresa(vantagem, aluno, codigoCupom);

        ResgateResponseDTO response = new ResgateResponseDTO();
        response.setCodigoCupom(codigoCupom);
        response.setVantagemNome(vantagem.getNome());
        response.setCustoMoedas(vantagem.getCustoMoedas());
        response.setSaldoRestante(aluno.getSaldoMoedas());
        response.setDataResgate(salva.getData());
        return response;
    }

    public List<TransacaoResponseDTO> extratoAluno(Long alunoId) {
        if (!alunoRepository.existsById(alunoId)) {
            throw new EntityNotFoundException("Aluno não encontrado!");
        }
        return transacaoRepository.findByAlunoIdOrderByDataDesc(alunoId).stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    public CupomValidacaoDTO validarCupom(String codigo) {
        Transacao t = transacaoRepository.findByCodigoCupom(codigo)
                .orElseThrow(() -> new EntityNotFoundException("Cupom não encontrado!"));
        return toCupomDTO(t);
    }

    @Transactional
    public CupomValidacaoDTO utilizarCupom(String codigo) {
        Transacao t = transacaoRepository.findByCodigoCupom(codigo)
                .orElseThrow(() -> new EntityNotFoundException("Cupom não encontrado!"));

        if (!STATUS_PENDENTE.equals(t.getStatus())) {
            throw new IllegalStateException(
                    "Cupom não está pendente (status atual: " + t.getStatus() + ")");
        }

        t.setStatus(STATUS_UTILIZADO);
        Transacao salva = transacaoRepository.save(t);
        return toCupomDTO(salva);
    }

    public List<CupomValidacaoDTO> cuponsDaEmpresa(Long empresaId) {
        return transacaoRepository.findCuponsByEmpresaId(empresaId).stream()
                .map(this::toCupomDTO)
                .collect(Collectors.toList());
    }

    private String gerarCodigoCupom() {
        String codigo;
        do {
            codigo = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        } while (transacaoRepository.findByCodigoCupom(codigo).isPresent());
        return codigo;
    }

    private TransacaoResponseDTO toResponseDTO(Transacao t) {
        TransacaoResponseDTO dto = new TransacaoResponseDTO();
        dto.setId(t.getId());
        dto.setData(t.getData());
        dto.setTipo(t.getTipo());
        dto.setValor(t.getValor());
        dto.setMensagem(t.getMensagem());
        dto.setAlunoNome(t.getAluno() != null ? t.getAluno().getNome() : null);
        dto.setProfessorNome(t.getProfessor() != null ? t.getProfessor().getNome() : null);
        dto.setCodigoCupom(t.getCodigoCupom());
        dto.setStatus(t.getStatus());
        return dto;
    }

    private CupomValidacaoDTO toCupomDTO(Transacao t) {
        CupomValidacaoDTO dto = new CupomValidacaoDTO();
        dto.setCodigoCupom(t.getCodigoCupom());
        dto.setAlunoNome(t.getAluno() != null ? t.getAluno().getNome() : null);
        if (t.getVantagem() != null) {
            dto.setVantagemNome(t.getVantagem().getNome());
        } else {
            dto.setVantagemNome(extrairNomeVantagem(t.getMensagem()));
        }
        dto.setCustoMoedas(t.getValor());
        dto.setStatus(t.getStatus());
        dto.setDataResgate(t.getData());
        return dto;
    }

    private String extrairNomeVantagem(String mensagem) {
        if (mensagem == null) return null;
        int ini = mensagem.indexOf('\'');
        int fim = mensagem.lastIndexOf('\'');
        if (ini >= 0 && fim > ini) return mensagem.substring(ini + 1, fim);
        return mensagem;
    }
}
