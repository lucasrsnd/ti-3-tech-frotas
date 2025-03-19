// Função para abrir um modal (reutilizável)
function abrirModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

// Função para fechar um modal (reutilizável)
function fecharModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Função para fechar o modal de edição
function fecharModalEditar() {
    fecharModal('modalEditVeiculo');
}

// Adicione um ouvinte de evento ao botão "Adicionar Veículo"
document.getElementById('btnAbrirModalVeiculo').addEventListener('click', () => {
    abrirModal('modalAddVeiculo');
});

// Adicione um ouvinte de evento ao botão de fechar do modal de veículo
document.getElementById('closeModalVeiculo').addEventListener('click', () => {
    fecharModal('modalAddVeiculo');
});

// Adicione um ouvinte de evento ao botão de fechar do modal de edição
document.getElementById('closeModalEditVeiculo').addEventListener('click', () => {
    fecharModalEditar();
});
// Função para listar caminhões
function listarCaminhoes() {
    fetch('http://localhost:8080/caminhoes', {
        method: 'GET'
    })
        .then(response => response.json())
        .then(data => {
            const tabelaCaminhoes = document.querySelector('#tabelaCaminhoes tbody');
            tabelaCaminhoes.innerHTML = ''; // Limpa a tabela antes de adicionar os dados

            data.forEach(caminhao => {
                const linha = `
                    <tr data-id="${caminhao.id}">
                        <td>${caminhao.modelo}</td>
                        <td>${caminhao.ano}</td>
                        <td>${caminhao.placa}</td>
                        <td>${caminhao.km}</td>
                        <td>${caminhao.kmTrocaOleo}</td>
                        <td>
                            <button onclick="abrirModalEditar(${caminhao.id})"><i class="fas fa-edit"></i></button>
                            <button onclick="excluirCaminhao(${caminhao.id})"><i class="fas fa-trash-alt"></i></button>
                        </td>
                    </tr>`;
                tabelaCaminhoes.insertAdjacentHTML('beforeend', linha);
            });
        })
        .catch(error => console.error('Erro ao listar caminhões:', error));
}

// Função para criar um novo caminhão via API
function criarCaminhao() {
    const modelo = document.getElementById('modeloVeiculo').value;
    const ano = parseInt(document.getElementById('anoVeiculo').value);
    const placa = document.getElementById('placaVeiculo').value;
    const km = parseInt(document.getElementById('kmVeiculo').value);
    const kmTrocaOleo = parseInt(document.getElementById('kmTrocaOleoVeiculo').value);

    const novoCaminhao = { modelo, ano, placa, km, kmTrocaOleo };

    fetch('http://localhost:8080/caminhoes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoCaminhao)
    })
        .then(response => {
            if (!response.ok) throw new Error('Erro ao criar caminhão!');
            return response.json();
        })
        .then(() => {
            alert('Caminhão adicionado com sucesso!');
            fecharModal('modalAddVeiculo');
            document.getElementById('formAddVeiculo').reset();
            listarCaminhoes(); // Atualiza a lista de caminhões
        })
        .catch(error => {
            console.error('Erro ao criar caminhão:', error);
            alert('Ocorreu um erro ao adicionar o caminhão. Por favor, tente novamente.');
        });
}

// Adicionar evento de submit ao formulário do modal
document.getElementById('formAddVeiculo').addEventListener('submit', (event) => {
    event.preventDefault();
    criarCaminhao();
});

// Função para abrir modal de edição e carregar dados do caminhão
function abrirModalEditar(id) {
    fetch(`http://localhost:8080/caminhoes/${id}`, {
        method: 'GET'
    })
        .then(response => response.json())
        .then(caminhao => {
            document.getElementById('idVeiculo').value = caminhao.id;
            document.getElementById('modeloVeiculoEdit').value = caminhao.modelo;
            document.getElementById('anoVeiculoEdit').value = caminhao.ano;
            document.getElementById('placaVeiculoEdit').value = caminhao.placa;
            document.getElementById('kmVeiculoEdit').value = caminhao.km;
            document.getElementById('kmTrocaOleoVeiculoEdit').value = caminhao.kmTrocaOleo;
            abrirModal('modalEditVeiculo');
        })
        .catch(error => console.error('Erro ao carregar caminhão para edição:', error));
}

// Função para salvar alterações de um caminhão
document.getElementById('formEditVeiculo').addEventListener('submit', function (event) {
    event.preventDefault();

    const caminhaoAtualizado = {
        modelo: document.getElementById('modeloVeiculoEdit').value,
        ano: parseInt(document.getElementById('anoVeiculoEdit').value),
        placa: document.getElementById('placaVeiculoEdit').value,
        km: parseInt(document.getElementById('kmVeiculoEdit').value),
        kmTrocaOleo: parseInt(document.getElementById('kmTrocaOleoVeiculoEdit').value)
    };

    const id = document.getElementById('idVeiculo').value;

    fetch(`http://localhost:8080/caminhoes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(caminhaoAtualizado)
    })
        .then(response => {
            if (!response.ok) throw new Error('Erro ao atualizar caminhão!');
            listarCaminhoes();
            fecharModal('modalEditVeiculo');
        })
        .catch(error => {
            console.error('Erro ao atualizar caminhão:', error);
            alert('Ocorreu um erro ao atualizar o caminhão.');
        });
});

// Função para excluir um caminhão
function excluirCaminhao(id) {
    console.log('Tentando excluir caminhão com ID:', id); // Log para depuração
    if (confirm('Tem certeza que deseja excluir este caminhão?')) {
        fetch(`http://localhost:8080/caminhoes/${id}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (!response.ok) throw new Error('Erro ao excluir caminhão!');
                listarCaminhoes();
                fecharModal('modalEditVeiculo');
            })
            .catch(error => {
                console.error('Erro ao excluir caminhão:', error);
                alert('Não é possível excluir esse registro. Verifique se está vinculado a algum dado do sistema. :(');
            });
    }
}


// Carregar a lista de caminhões ao carregar a página
document.addEventListener('DOMContentLoaded', listarCaminhoes);
