const helpButton = document.getElementById('helpButton');
    const closeButton = document.getElementById('closeButton');
    const helpModal = document.getElementById('helpModal');
    const responseDiv = document.getElementById('response');

    // Abrir modal
    helpButton.addEventListener('click', () => {
      helpModal.classList.add('open');
    });

    // Fechar modal
    closeButton.addEventListener('click', () => {
      helpModal.classList.remove('open');
      responseDiv.textContent = ''; // Limpar resposta ao fechar
    });

    // Exibir respostas
    function showResponse(question) {
      let responseText = '';
      switch (question) {
        case 'caminhao':
          responseText = 'Provavelmente esse caminhão está ligado a um funcionário. Exclua o funcionário primeiro.';
          break;
        case 'abastecimento':
          responseText = 'Coloque o valor a mais que o caminhão rodou durante a viagem.';
          break;
        case 'notificacao':
          responseText = 'No menu lateral, na parte de baixo, clique no sino.';
          break;
        case 'km':
          responseText = 'O editar do caminhão não pode ser alterado, somente quando fizer um novo abastecimento.';
          break;
        case 'relatorio':
          responseText = 'Clique no botão "Gerar Relatório" ao lado do botão "Criar" da aba desejada.';
          break;
        default:
          responseText = 'Dúvida não encontrada.';
      }
      responseDiv.textContent = responseText;
    }

    // Abrir vídeo no YouTube
    function openVideo() {
      window.open('https://youtube.com', '_blank');
    }