# Tribal Wars Assistant Script

**Script para assistente de saque** – Automatização de farming. Este script ajuda jogadores a gerenciar saques disponíveis de forma eficiente, permitindo ataques automáticos com base em critérios configuráveis.

---

## Features

### ✅ Implemented
- **Clique automático nos saques disponíveis**: Identifica e envia ataques automaticamente para aldeias disponíveis.
### 🚧 To Implement
- **Configurações personalizáveis**:
  - Temporizador de refresh da página
  - Seleção de tipos de saques (A, B ou ambos)
  - Escolha de atacar relatórios amarelos
  - Escolha de atacar relatórios azuis
  - Limite de distância (em tempo ou blocos)
  - Limite máximo de muralha (se disponível / necessário)
  - Intervalo aleatório de envio (mínimo e máximo)
  - Interface limpa e similar ao jogo para facilitar uso

- **Auto-refresh da página**: Atualiza a página automaticamente após um intervalo configurável.

- **Envio seletivo de ataques**:
  - Somente opção **A**
  - Somente opção **B**
  - Ambas as opções de saque
- **Filtragem por cor de relatório**:
  - Farm apenas relatórios verdes (seguro)
  - Farm amarelos e azuis opcional (configurável)


- **Checks e restrições**:
  - Limite máximo de muralha
  - Limite máximo de distância
  - Unidades disponiveis em cada ronda

- **Captcha notification or solver
nopecha for example



// todos
add a way to farm a and then b when it becomes unclicable
ui will not update when no more troops are available so i think we can just fetch the initial quantities, the quantities needed for each model and then on each attack deduct and check before clicking if theres any troops to send the attack. 