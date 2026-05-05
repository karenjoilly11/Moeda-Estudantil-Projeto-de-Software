package com.moedaestudantil.api.entities;

import com.moedaestudantil.api.enums.TipoTransacao;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "transacoes")
@Data
public class Transacao {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "aluno_id")
    private Aluno aluno;
    
    @ManyToOne
    @JoinColumn(name = "professor_id")
    private Professor professor;
    
    @Column(nullable = false)
    private Double valor;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoTransacao tipo;
    
    @Column(length = 500)
    private String mensagem;
    
    @Column(nullable = false)
    private LocalDateTime data = LocalDateTime.now();
    
    @Column(unique = true, length = 8)
    private String codigoCupom;  // Para resgates
    
    @Column(length = 50)
    private String status;  // PENDENTE, CONCLUIDO, CANCELADO
}