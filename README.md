# Sistema de Moeda Estudantil

> Plataforma para reconhecimento de mérito estudantil através de moeda virtual, com integração entre alunos, professores e empresas parceiras.

---

## 👥 Autores


| 👤 Nome | 🖼️ Foto | :octocat: GitHub | 💼 LinkedIn | 📤 Gmail |
|---------|----------|-----------------|-------------|-----------|
| Josué Carlos Goulart dos Reis  | <div align="center"><img src="https://joaopauloaramuni.github.io/image/aramunilogo.png" width="70px" height="70px"></div> | <div align="center"><a href="https://github.com/user2"><img src="https://joaopauloaramuni.github.io/image/github6.png" width="50px" height="50px"></a></div> | <div align="center"><a href="https://www.linkedin.com/in/user2"><img src="https://joaopauloaramuni.github.io/image/linkedin2.png" width="50px" height="50px"></a></div> | <div align="center"><a href="mailto:user2@gmail.com"><img src="https://joaopauloaramuni.github.io/image/gmail3.png" width="50px" height="50px"></a></div> |
| Karen Joilly | <img src="https://github.com/karenjoilly11/Resenha-de-Artigos-Projeto-de-Software/./assets/fotokaren.jpg" width="80px" style="border-radius: 50%;"> | <a href="https://github.com/vcaraujo"><img src="https://joaopauloaramuni.github.io/image/github6.png" width="40px"></a> | <a href="https://www.linkedin.com/in/karen-joilly-araujo-gregorio-de-almeida/"><img src="https://joaopauloaramuni.github.io/image/linkedin2.png" width="40px"></a> | <a href="mailto:karenjoilly@gmail.com"><img src="https://joaopauloaramuni.github.io/image/gmail3.png" width="40px"></a> |
| Luiz Fernando Batista Moreira  | <div align="center"><img src="https://joaopauloaramuni.github.io/image/aramunilogo.png" width="70px" height="70px"></div> | <div align="center"><a href="https://github.com/user2"><img src="https://joaopauloaramuni.github.io/image/github6.png" width="50px" height="50px"></a></div> | <div align="center"><a href="https://www.linkedin.com/in/user2"><img src="https://joaopauloaramuni.github.io/image/linkedin2.png" width="50px" height="50px"></a></div> | <div align="center"><a href="mailto:user2@gmail.com"><img src="https://joaopauloaramuni.github.io/image/gmail3.png" width="50px" height="50px"></a></div> |

---

## 📋 Histórias de Usuário

### 👨‍🎓 Aluno

| ID | História | Prioridade |
|----|----------|------------|
| **H01** | Eu, como **aluno**, quero me cadastrar no sistema informando nome, email, CPF, RG, endereço, instituição e curso, **para que** eu possa participar do programa de moeda estudantil. | Alta |
| **H02** | Eu, como **aluno**, quero consultar meu extrato completo (saldo + histórico), **para que** eu possa controlar minhas moedas. | Alta |
| **H03** | Eu, como **aluno**, quero selecionar uma vantagem e resgatar usando minhas moedas, **para que** eu possa obter descontos ou produtos. | Alta |
| **H04** | Eu, como **aluno**, quero receber um email com código de cupom após resgatar uma vantagem, **para que** eu possa apresentá-lo na empresa parceira. | Média |

### 👨‍🏫 Professor

| ID | História | Prioridade |
|----|----------|------------|
| **H05** | Eu, como **professor**, quero consultar meu extrato (saldo + histórico de envios), **para que** eu possa gerenciar minha distribuição. | Alta |
| **H06** | Eu, como **professor**, quero enviar moedas para um aluno com motivo de reconhecimento, **para que** eu possa estimular o mérito estudantil. | Alta |
| **H07** | Eu, como **professor**, quero que o sistema verifique meu saldo antes de cada envio, **para que** eu não possa enviar mais do que possuo. | Alta |
| **H08** | Eu, como **professor**, quero que o saldo não utilizado seja somado às 1.000 novas moedas do próximo semestre, **para que** eu não perca moedas. | Média |

### 🏢 Empresa Parceira

| ID | História | Prioridade |
|----|----------|------------|
| **H09** | Eu, como **empresa parceira**, quero cadastrar vantagens com nome, descrição, foto e custo em moedas, **para que** os alunos possam resgatar. | Alta |
| **H10** | Eu, como **empresa parceira**, quero receber um email com o código do cupom no resgate, **para que** eu possa conferir a troca. | Média |
| **H11** | Eu, como **empresa parceira**, quero editar ou remover minhas vantagens, **para que** eu mantenha as ofertas atualizadas. | Baixa |

### 🔐 Geral

| ID | História | Prioridade |
|----|----------|------------|
| **H12** | Eu, como **usuário**, quero fazer login com email e senha antes de acessar o sistema, **para que** apenas pessoas autorizadas utilizem a plataforma. | Alta |

---

## 📊 Matriz de Rastreabilidade

| Requisito | Histórias Relacionadas |
|-----------|------------------------|
| Cadastro de aluno | H01 |
| Cadastro de vantagem | H09 |
| Distribuição de moedas | H05, H06, H07, H08 |
| Troca de moedas | H02, H03, H04 |
| Notificações por email | H04, H10 |
| Autenticação | H12 |

---

## 📎 Documentos Complementares

- [Diagrama de Casos de Uso](./Modelagem/Caso%20de%20Uso/Caso%20de%20Uso%20-%20Sprint%203%20-%20Projeto%20de%20Software.png)
- [Diagrama de Classe](./Modelagem/Classe/Moeda%20Estudantil%20-%20Diagrama%20de%20Classe%20-%20Sprint%203.png)
- [Histórias de Usuário em PDF](./docs/historias-de-usuario/historias-de-usuario.pdf)

---

