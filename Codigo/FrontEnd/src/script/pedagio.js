// Função para abrir um modal específico
function abrirModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

// Função para fechar um modal específico
function fecharModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Evento para abrir o modal de adicionar pedágio ao clicar no botão
document.getElementById('btnAbrirModalPedagio').addEventListener('click', () => {
    abrirModal('modalAddPedagio');
});

// Evento para fechar o modal de adicionar pedágio
document.getElementById('closeModalPedagio').addEventListener('click', () => {
    fecharModal('modalAddPedagio');
});

// Evento para fechar o modal de editar pedágio
document.getElementById('closeModalEditPedagio').addEventListener('click', () => {
    fecharModal('modalEditPedagio');
});

// Fecha o modal quando clicar fora do conteúdo
window.addEventListener('click', (event) => {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
});

// Função para carregar os pedágios na tabela
function listarPedagios() {
    fetch("http://localhost:8080/pedagios")
        .then(response => response.json())
        .then(pedagios => {
            const tabelaBody = document.querySelector('#tabelaPedagios tbody');
            tabelaBody.innerHTML = ''; // Limpa a tabela

            pedagios.forEach(pedagio => {
                const row = document.createElement('tr');
                row.innerHTML = `
            <td>${pedagio.caminhao.placa}</td>
            <td>${pedagio.local}</td>
            <td>${pedagio.valor.toFixed(2)}</td>
            <td>${new Date(pedagio.data).toLocaleDateString()}</td>
            <td>
              <button onclick="abrirModalEditarPedagio(${pedagio.id})"><i class="fas fa-edit"></i></button>
              <button onclick="deletarPedagio(${pedagio.id})"><i class="fas fa-trash-alt"></i></button>
            </td>
          `;
                tabelaBody.appendChild(row);
            });
        })
        .catch(error => console.error('Erro ao listar pedágios:', error));
}

// Função para criar um novo pedágio via API
function criarPedagio() {
    const valor = parseFloat(document.getElementById('valorPedagio').value);
    const data = document.getElementById('dataPedagio').value;
    const placaCaminhao = document.getElementById('placaPedagio').value;
    const local = document.getElementById('localPedagio').value;

    // Estrutura do objeto conforme PedagioRecordDto
    const novoPedagio = {
        valor: valor,
        local: local,
        data: data,
        placaCaminhao: placaCaminhao
    };

    fetch("http://localhost:8080/pedagios", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoPedagio)
    })
        .then(response => {
            if (!response.ok) throw new Error('Erro ao criar pedágio');
            return response.json();
        })
        .then(pedagio => {
            alert('Pedágio adicionado com sucesso!');
            fecharModal('modalAddPedagio');
            document.getElementById('formAddPedagio').reset();
            listarPedagios();
        })
        .catch(error => {
            console.error('Erro ao criar pedágio:', error);
            alert('Erro ao adicionar pedágio. Tente novamente.');
        });
}

// Função para abrir o modal de edição e preencher os dados
function abrirModalEditarPedagio(id) {
    fetch(`http://localhost:8080/pedagios/${id}`)
        .then(response => response.json())
        .then(pedagio => {
            document.getElementById('editarIdPedagio').value = pedagio.id;
            document.getElementById('editarPlacaPedagio').value = pedagio.caminhao.placa;
            document.getElementById('editarLocalPedagio').value = pedagio.local;
            document.getElementById('editarValorPedagio').value = pedagio.valor;
            document.getElementById('editarDataPedagio').value = pedagio.data;

            abrirModal('modalEditPedagio');
        })
        .catch(error => console.error('Erro ao buscar pedágio para edição:', error));
}

// Função para salvar alterações do pedágio
function editarPedagio() {
    const id = document.getElementById('editarIdPedagio').value;
    const valor = parseFloat(document.getElementById('editarValorPedagio').value);
    const local = document.getElementById('editarLocalPedagio').value;
    const data = document.getElementById('editarDataPedagio').value;
    const placaCaminhao = document.getElementById('editarPlacaPedagio').value;

    const pedagioAtualizado = {
        valor: valor,
        local: local,
        data: data,
        placaCaminhao: placaCaminhao
    };

    fetch(`http://localhost:8080/pedagios/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pedagioAtualizado)
    })
        .then(response => {
            if (!response.ok) throw new Error('Erro ao atualizar pedágio');
            return response.json();
        })
        .then(() => {
            alert('Pedágio atualizado com sucesso!');
            fecharModal('modalEditPedagio');
            listarPedagios();
        })
        .catch(error => {
            console.error('Erro ao atualizar pedágio:', error);
            alert('Erro ao atualizar pedágio. Tente novamente.');
        });
}


// Função para excluir um pedágio
function deletarPedagio(id) {
    if (confirm('Tem certeza que deseja excluir este pedágio?')) {
        fetch(`http://localhost:8080/pedagios/${id}`, { method: 'DELETE' })
            .then(response => {
                if (!response.ok) throw new Error('Erro ao excluir pedágio');
                listarPedagios();
            })
            .catch(error => console.error('Erro ao excluir pedágio:', error));
    }
}

// Eventos de submissão dos formulários
document.getElementById('formAddPedagio').addEventListener('submit', event => {
    event.preventDefault();
    criarPedagio();
});

document.getElementById('formEditPedagio').addEventListener('submit', event => {
    event.preventDefault();
    editarPedagio();
});

// Inicialização ao carregar a página
document.addEventListener('DOMContentLoaded', listarPedagios);

// Função para gerar o relatório de pedágios em formato PDF
function gerarRelatorioPedagios() {
    // Importa o jsPDF
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Título do PDF
    doc.setFontSize(18);
    doc.text("Relatório de Pedágios", 10, 10);

    // Define os cabeçalhos das colunas da tabela
    const colunas = ["Placa", "Local", "Valor", "Data"];

    // Obtém os pedágios do backend
    fetch('http://localhost:8080/pedagios')
        .then(response => {
            if (!response.ok) throw new Error("Erro ao buscar pedágios.");
            return response.json();
        })
        .then(pedagios => {
            // Mapeia os dados dos pedágios para um formato de array bidimensional
            const linhas = pedagios.map(pedagio => [
                pedagio.caminhao ? pedagio.caminhao.placa : 'Sem Caminhão',
                pedagio.local,
                `R$ ${pedagio.valor.toFixed(2)}`, // Formata o valor
                new Date(pedagio.data).toLocaleDateString() // Formata a data
            ]);

            // Gera a tabela usando o autoTable
            doc.autoTable({
                head: [colunas],
                body: linhas,
                startY: 20, // Define o espaço entre o título e a tabela
            });

            // Salva o PDF com o nome "relatorio_pedagios.pdf"
            doc.save("relatorio_pedagios.pdf");
        })
        .catch(error => alert("Erro ao gerar relatório: " + error.message));
}

// Adiciona evento ao botão "Gerar Relatório"
document.getElementById('btnGerarRelatorioPedagio').addEventListener('click', gerarRelatorioPedagios);