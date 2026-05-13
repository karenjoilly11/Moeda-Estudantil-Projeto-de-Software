# Diagramas de Sequência

Arquivos `.puml` (PlantUML) gerados para os requisitos:

| Arquivo | Sprint | Caso de Uso |
|---|---|---|
| `lab04s02-cadastrar-vantagem.puml` | Lab04S02 | Empresa cadastra vantagem |
| `lab04s02-listar-vantagens.puml` | Lab04S02 | Aluno lista vantagens (marketplace) |
| `lab04s03-trocar-vantagem.puml` | Lab04S03 | Aluno resgata vantagem + email + validação empresa |

## Como gerar PNG

### Opção 1 — Online (mais fácil)
1. Abra https://www.plantuml.com/plantuml/uml/
2. Cole o conteúdo do `.puml`
3. Clique em "Submit"
4. Baixe a imagem PNG (botão direito → salvar imagem como)
5. Salve com o mesmo nome do `.puml` mas extensão `.png`

### Opção 2 — VS Code Extension
Instale a extensão **PlantUML** (jebbs.plantuml). Abra o `.puml`, **Alt+D** abre preview, depois exporte como PNG.

### Opção 3 — CLI local
```bash
# Precisa Java + plantuml.jar
java -jar plantuml.jar lab04s03-trocar-vantagem.puml
```
