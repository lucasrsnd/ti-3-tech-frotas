// Função para abrir um modal
function abrirModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

// Função para fechar um modal
function fecharModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Função para buscar e exibir notificações
function buscarNotificacoes() {
    fetch('http://localhost:8080/notificacoes')
      .then(response => response.json())
      .then(notificacoes => {
        exibirNotificacoes(notificacoes);
      })
      .catch(error => {
        console.error('Erro ao buscar notificações:', error);
        // Lidar com o erro, por exemplo, exibindo uma mensagem ao usuário
      });
}

// Função para exibir as notificações no modal
function exibirNotificacoes(notificacoes) {
    const notificacoesContainer = document.getElementById('notificacoes-container');
    notificacoesContainer.innerHTML = ''; // Limpa o container

    if (notificacoes.length === 0) {
      notificacoesContainer.innerHTML = '<p>Nenhuma notificação.</p>';
      return;
    }

    notificacoes.forEach(notificacao => {
      const notificacaoElement = document.createElement('div');
      notificacaoElement.classList.add('notificacao-item');

      // Cria o botão de excluir
      const botaoExcluir = document.createElement('button');
      botaoExcluir.classList.add('btn-excluir');
      botaoExcluir.innerHTML = '<i class="fa fa-trash"></i>'; // Ícone de lixeira
      botaoExcluir.addEventListener('click', () => {
        excluirNotificacao(notificacao.id); // Chama a função para excluir a notificação
      });

      // Adiciona o conteúdo da notificação (texto e ícone) ao elemento
      notificacaoElement.innerHTML = `
        <i class="fa fa-info-circle"></i>
        <span>${notificacao.assunto} - ${notificacao.texto}</span>
      `;

      // Adiciona o botão de excluir ao lado do texto
      const textoContainer = notificacaoElement.querySelector('span');
      textoContainer.style.flexGrow = '1'; // Garante que o texto ocupe o espaço disponível
      textoContainer.appendChild(botaoExcluir);

      // Adiciona a notificação ao container
      notificacoesContainer.appendChild(notificacaoElement);
    });
}

// Função para excluir uma notificação
function excluirNotificacao(notificacaoId) {
    fetch(`http://localhost:8080/notificacoes/${notificacaoId}`, {
      method: 'DELETE'
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Erro ao excluir notificação!');
      }
      // Atualiza a lista de notificações após a exclusão
      buscarNotificacoes(); 
    })
    .catch(error => {
      console.error('Erro ao excluir notificação:', error);
      alert('Ocorreu um erro ao excluir a notificação.');
    });
}

// Adiciona ouvintes de evento para abrir e fechar o modal de notificações
document.getElementById('btnAbrirModalNotificacoes').addEventListener('click', () => {
  abrirModal('modalNotificacoes');
  buscarNotificacoes(); // Busca as notificações ao abrir o modal
});

document.getElementById('closeModalNotificacoes').addEventListener('click', () => {
  fecharModal('modalNotificacoes');
});
