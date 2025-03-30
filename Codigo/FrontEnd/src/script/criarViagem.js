document.addEventListener("DOMContentLoaded", function () {
    // Função para abrir o modal
    function abrirModal(modalId) {
        document.getElementById(modalId).style.display = 'block';
    }

    // Função para fechar o modal
    function fecharModal(modalId) {
        document.getElementById(modalId).style.display = 'none';
    }

    // Evento para abrir o modal de adicionar viagem
    const btnAbrirModalViagem = document.getElementById('btnAbrirModalViagem');
    if (btnAbrirModalViagem) {
        btnAbrirModalViagem.addEventListener('click', () => {
            abrirModal('modalAddViagem');
        });
    }

    // Evento para fechar o modal de adicionar viagem
    const closeModalViagem = document.getElementById('closeModalViagem');
    if (closeModalViagem) {
        closeModalViagem.addEventListener('click', () => {
            fecharModal('modalAddViagem');
        });
    }

    // Fechar o modal ao clicar fora do conteúdo
    window.onclick = function (event) {
        const modal = document.getElementById('modalAddViagem');
        if (event.target === modal) {
            fecharModal('modalAddViagem');
        }
    };
});

// Função para carregar caminhões e preencher select
function carregarCaminhoes(selectId) {
    fetch('http://localhost:8080/caminhoes')
        .then(response => response.json())
        .then(caminhoes => {
            const selectCaminhao = document.getElementById(selectId);
            selectCaminhao.innerHTML = ''; // Limpa o select para evitar duplicados
            caminhoes.forEach(caminhao => {
                const option = new Option(caminhao.placa, caminhao.placa);
                selectCaminhao.append(option);
            });
        })
        .catch(error => console.error('Erro ao carregar caminhões:', error));
}

// Chama o carregamento dos caminhões para o select de cadastro e edição
carregarCaminhoes('placaCaminhao');

// Função para listar viagens
function listarViagens() {
    fetch('http://localhost:8080/viagens')
        .then(response => response.json())
        .then(viagens => {
            const tbody = document.querySelector('#tabelaViagens tbody');
            tbody.innerHTML = '';
            viagens.forEach(viagem => {
                const row = `
                    <tr>
                        <td>${viagem.origem}</td>
                        <td>${viagem.destino}</td>
                        <td>${viagem.dataSaida}</td>
                        <td>${viagem.dataChegada}</td>
                        <td>${viagem.valor}</td>
                        <td>
                            <button onclick="abrirModalEditarViagem(${viagem.id})"><i class="fas fa-edit"></i></button>
                            <button onclick="excluirViagem(${viagem.id})"><i class="fas fa-trash-alt"></i></button>
                        </td>
                    </tr>
                `;
                tbody.innerHTML += row;
            });
        })
        .catch(error => console.error('Erro ao listar viagens:', error));
}

// Função para cadastrar uma nova viagem
function cadastrarViagem() {
    const novaViagem = {
        origem: document.getElementById('origemViagem').value,
        destino: document.getElementById('destinoViagem').value,
        dataSaida: document.getElementById('dataSaidaViagem').value,
        dataChegada: document.getElementById('dataChegadaViagem').value,
        valor: parseFloat(document.getElementById('valorViagem').value),
        pesoTransportado: parseFloat(document.getElementById('pesoViagem').value),
        placaCaminhao: document.getElementById('placaCaminhao').value
    };

    fetch('http://localhost:8080/viagens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novaViagem)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao cadastrar viagem.');
        }
        return response.json();
    })
    .then(() => {
        alert("Viagem cadastrada com sucesso!");
        fecharModal('modalAddViagem');
        document.getElementById('formAddViagem').reset();
        listarViagens(); // Atualiza a lista de viagens
    })
    .catch(error => {
        console.error('Erro ao cadastrar viagem:', error);
    });
}

// Função para abrir o modal de edição
function abrirModalEditarViagem(viagemId) {
    // Abrir o modal de edição
    document.getElementById('modalEditViagem').style.display = 'block';
    
    // Carregar a lista de caminhões no select do modal de edição
    carregarCaminhoes('placaCaminhaoEdit');

    // Fazer uma requisição para buscar os dados da viagem com o ID especificado
    fetch(`http://localhost:8080/viagens/${viagemId}`)
        .then(response => response.json())
        .then(viagem => {
            // Preencher os campos do modal de edição com os dados da viagem
            document.getElementById('idViagem').value = viagem.id;
            document.getElementById('origemViagemEdit').value = viagem.origem;
            document.getElementById('destinoViagemEdit').value = viagem.destino;
            document.getElementById('dataSaidaViagemEdit').value = viagem.dataSaida;
            document.getElementById('dataChegadaViagemEdit').value = viagem.dataChegada;
            document.getElementById('valorViagemEdit').value = viagem.valor;
            document.getElementById('pesoViagemEdit').value = viagem.pesoTransportado;
            document.getElementById('placaCaminhaoEdit').value = viagem.placaCaminhao;
        })
        .catch(error => console.error('Erro ao buscar viagem:', error));
}

// Função para fechar o modal
function fecharModalEditarViagem() {
    document.getElementById('modalEditViagem').style.display = 'none';
}

// Evento para fechar o modal de edição ao clicar no "X"
document.getElementById('closeModalEditViagem').addEventListener('click', fecharModalEditarViagem);

// Função para salvar alterações na viagem
function salvarAlteracoesViagem() {
    const viagemId = document.getElementById('idViagem').value;
    const viagemAtualizada = {
        origem: document.getElementById('origemViagemEdit').value,
        destino: document.getElementById('destinoViagemEdit').value,
        dataSaida: document.getElementById('dataSaidaViagemEdit').value,
        dataChegada: document.getElementById('dataChegadaViagemEdit').value,
        valor: parseFloat(document.getElementById('valorViagemEdit').value),
        pesoTransportado: parseFloat(document.getElementById('pesoViagemEdit').value),
        placaCaminhao: document.getElementById('placaCaminhaoEdit').value
    };

    fetch(`http://localhost:8080/viagens/${viagemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(viagemAtualizada)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao atualizar viagem.');
        }
        return response.json();
    })
    .then(() => {
        alert('Viagem atualizada com sucesso!');
        fecharModal('modalEditViagem');
        listarViagens(); // Atualiza a lista de viagens
    })
    .catch(error => {
        console.error('Erro ao atualizar viagem:', error);
    });
}

// Função para excluir viagem
function excluirViagem(viagemId) {
    if (confirm("Tem certeza que deseja excluir esta viagem?")) {
        fetch(`http://localhost:8080/viagens/${viagemId}`, { method: 'DELETE' })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao excluir viagem.');
            }
            alert('Viagem excluída com sucesso!');
            listarViagens(); // Atualiza a lista de viagens
        })
        .catch(error => {
            console.error('Erro ao excluir viagem:', error);
           
        });
    }
}

// Inicializar as funções
document.addEventListener('DOMContentLoaded', function() {
    listarViagens();
    carregarCaminhoes('placaCaminhao');
});

// Adiciona o evento de envio no formulário de adicionar viagem
document.getElementById('formAddViagem').addEventListener('submit', (event) => {
    event.preventDefault();
    cadastrarViagem();
});

// Adiciona o evento de envio no formulário de edição de viagem
document.getElementById('formEditViagem').addEventListener('submit', (event) => {
    event.preventDefault();
    salvarAlteracoesViagem();
});
