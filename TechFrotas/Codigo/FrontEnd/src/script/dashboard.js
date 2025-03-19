document.addEventListener("DOMContentLoaded", () => {
    // Função para buscar dados e inicializar gráficos
    async function carregarGraficos() {
      try {
        // Buscando dados de viagens
        const viagensResponse = await fetch('http://localhost:8080/viagens');
        const viagens = await viagensResponse.json();
  
        // Total de ganhos por dia
        const ganhosPorDia = {};
        viagens.forEach(viagem => {
          const dataSaida = new Date(viagem.dataSaida);
          const dia = dataSaida.getDate();
          ganhosPorDia[dia] = (ganhosPorDia[dia] || 0) + viagem.valor;
        });
  
        // Preparar dados para exibir ganhos por dia
        const diasDoMes = Array.from({ length: 31 }, (_, i) => i + 1); // Dias do mês (1 a 31)
        const valoresGanhosPorDia = diasDoMes.map(dia => ganhosPorDia[dia] || 0);
  
        // Buscando dados de gastos
        const gastosResponse = await fetch('http://localhost:8080/gastos-veiculos');
        const gastos = await gastosResponse.json();
  
        // Filtrar gastos por tipo
        const tiposDeGastos = ['Manutenção', 'Seguro', 'Financiamento'];
        const somaGastos = tiposDeGastos.map(tipo =>
          gastos
            .filter(gasto => gasto.tipo === tipo)
            .reduce((acc, gasto) => acc + gasto.valor, 0)
        );
  
        // Buscando dados de abastecimentos
        const abastecimentosResponse = await fetch('http://localhost:8080/abastecimentos');
        const abastecimentos = await abastecimentosResponse.json();
  
        const somaAbastecimentos = abastecimentos.reduce((acc, abastecimento) => acc + abastecimento.valor, 0);
  
        // Gráfico de Total de Viagens Feitas
        const ctxTrips = document.getElementById('tripsChart').getContext('2d');
        new Chart(ctxTrips, {
          type: 'line',
          data: {
            labels: diasDoMes,
            datasets: [
              {
                label: 'Viagens por Dia',
                data: diasDoMes.map(dia => (ganhosPorDia[dia] || 0)),
                borderColor: '#007bff',
                backgroundColor: 'rgba(0, 123, 255, 0.3)',
                fill: true,
              },
            ],
          },
          options: {
            responsive: true,
            scales: {
              x: {
                title: { display: true, text: 'Dias do Mês' },
              },
              y: {
                title: { display: true, text: 'Número de Viagens' },
                beginAtZero: true,
              },
            },
          },
        });
  
        // Gráfico de Gastos
        const ctxExpenses = document.getElementById('expensesChart').getContext('2d');
        new Chart(ctxExpenses, {
          type: 'pie',
          data: {
            labels: [...tiposDeGastos, 'Abastecimentos'],
            datasets: [
              {
                data: [...somaGastos, somaAbastecimentos],
                backgroundColor: ['#ffc107', '#dc3545', '#28a745', '#6c757d', '#17a2b8'],
              },
            ],
          },
        });
  
        // Gráfico de Ganhos Totais por Dia
        const ctxIncome = document.getElementById('incomeChart').getContext('2d');
        new Chart(ctxIncome, {
          type: 'line',
          data: {
            labels: diasDoMes,
            datasets: [
              {
                label: 'Ganhos Totais por Dia',
                data: valoresGanhosPorDia,
                borderColor: '#28a745',
                backgroundColor: 'rgba(40, 167, 69, 0.3)',
                fill: true,
              },
            ],
          },
          options: {
            responsive: true,
            scales: {
              x: {
                title: { display: true, text: 'Dias do Mês' },
              },
              y: {
                title: { display: true, text: 'Ganhos Totais (R$)' },
                beginAtZero: true,
              },
            },
          },
        });
      } catch (error) {
        console.error('Erro ao carregar gráficos:', error);
      }
    }
  
    carregarGraficos();
  });