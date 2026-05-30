/*
  CLASSE: Sensor
  Estrutura de POO para modelar e gerenciar a regra de negócio de cada ativo
 */
class Sensor {
    constructor(nome, tipo, valor) {
        this.nome = nome;
        this.tipo = tipo; // 'TEMPERATURA', 'PRESSÃO' ou 'UMIDADE'
        this.valor = parseFloat(valor);
    }

    /*
      Avalia as regras operacionais com base nos limites do edital técnico
      @returns {string} Retorna 'NORMAL' ou 'CRÍTICO'
     */
    obterStatus() {
        switch (this.tipo) {
            case 'TEMPERATURA':
                return this.valueControl(this.valor > 50);
            case 'PRESSÃO':
                return this.valueControl(this.valor < 10 || this.valor > 100);
            case 'UMIDADE':
                return this.valueControl(this.valor < 30 || this.valor > 80);
            default:
                return 'NORMAL';
        }
    }

    
    // Função auxiliar interna para modularizar o retorno do status  
    valueControl(condicao) {
        return condicao ? 'CRÍTICO' : 'NORMAL';
    }
}


// Gerenciamento de Estado da Aplicação
let listaSensores = [];
let chartInstance = null; // Armazena a referência interna do Chart.js

// Mapeamento dos Elementos Ativos do DOM
const sensorForm = document.getElementById('sensor-form');
const sensorGrid = document.getElementById('sensor-grid');


// Evento acionado ao carregar o DOM (Montagem da aplicação e busca de persistência)
document.addEventListener('DOMContentLoaded', () => {
    const dadosLocais = localStorage.getItem('iot_sensors');
    if (dadosLocais) {
        const dadosConvertidos = JSON.parse(dadosLocais);
        // Transforma objetos puros do JSON de volta em instâncias com métodos da Classe Sensor
        listaSensores = dadosConvertidos.map(s => new Sensor(s.nome, s.tipo, s.valor));
    }
    
    inicializarGrafico();
    renderizarInterface();
});


// FLUXO CENTRAL: Cadastro de Novos Ativos
 
sensorForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Captura dos elementos do formulário
    const rawNome = document.getElementById('sensor-name').value;
    const tipo = document.getElementById('sensor-type').value;
    const rawValor = document.getElementById('sensor-value').value;

    // Higienização de strings obrigatória antes do processamento (.trim() e .toUpperCase())
    const nomeHigienizado = rawNome.trim();
    const tipoHigienizado = tipo.toUpperCase().trim();

    // Criação de nova instância da classe
    const novoSensor = new Sensor(nomeHigienizado, tipoHigienizado, rawValor);
    
    // Adição ao Array Global
    listaSensores.push(novoSensor);

    // Persistência imediata e atualização da visão
    salvarNoLocalStorage();
    renderizarInterface();
    atualizarEstatisticasGrafico();

    // Reseta inputs e reposiciona o foco de digitação
    sensorForm.reset();
    document.getElementById('sensor-name').focus();
});

/*
  FLUXO CENTRAL: Remoção/Exclusão de Ativos por Índice
  @param {number} index - Posição do sensor alvo dentro da lista global
 */
function deletarSensor(index) {
    // Remove o elemento cirurgicamente do array usando splice
    listaSensores.splice(index, 1);
    
    // Atualiza a persistência local com o novo array reduzido
    salvarNoLocalStorage();
    
    // Re-renderiza a interface de cards e reconstrói as estatísticas do gráfico
    renderizarInterface();
    atualizarEstatisticasGrafico();
}


// Sincroniza o array global de objetos convertendo-o em string JSON para o LocalStorage
function salvarNoLocalStorage() {
    localStorage.setItem('iot_sensors', JSON.stringify(listaSensores));
}

/*
  ROTINA DE ANALYTICS: Processamento usando Métodos Avançados de Array (.filter e .reduce)
  @param {string} tipoAlvo - Tipo de sensor a ser contabilizado
  @returns {number} Média calculada formatada em 1 casa decimal
 */
function calcularMediaPorTipo(tipoAlvo) {
    // Filtragem avançada das categorias
    const sensoresFiltrados = listaSensores.filter(sensor => sensor.tipo === tipoAlvo);
    
    if (sensoresFiltrados.length === 0) return 0;

    // Consolidação de valores via acumulador do método reduce
    const somaValores = sensoresFiltrados.reduce((acumulador, sensor) => acumulador + sensor.valor, 0);
    
    return (somaValores / sensoresFiltrados.length).toFixed(1);
}


// Renderização Dinâmica e Reativa de Cards
function renderizarInterface() {
    // Limpeza prévia do container para evitar duplicações de iteração
    sensorGrid.innerHTML = '';

    // Varre o array injetando a estrutura HTML mapeando o índice corrente para remoção
    listaSensores.forEach((sensor, index) => {
        const status = sensor.obterStatus();
        const cardElement = document.createElement('div');
        
        // Aplicação da classe condicional pulsante caso seja crítico
        cardElement.className = `sensor-card ${status === 'CRÍTICO' ? 'critico-alert' : ''}`;

        // Mapeamento dos modificadores de unidade de engenharia
        let unidade = '';
        if (sensor.tipo === 'TEMPERATURA') unidade = '°C';
        else if (sensor.tipo === 'PRESSÃO') unidade = ' Bar';
        else if (sensor.tipo === 'UMIDADE') unidade = ' %';

        cardElement.innerHTML = `
            <div class="card-header-info">
                <div class="card-header-text">
                    <h4>${sensor.nome}</h4>
                    <span class="badge-type">${sensor.tipo}</span>
                </div>
                <button class="btn-delete" onclick="deletarSensor(${index})" title="Remover Ativo">&times;</button>
            </div>
            <div class="card-value-display">
                ${sensor.valor}${unidade}
            </div>
            <div class="card-status ${status === 'CRÍTICO' ? 'status-critico' : 'status-normal'}">
                <span class="status-dot">●</span> Status: ${status}
            </div>
        `;

        sensorGrid.appendChild(cardElement);
    });
}

// Inicialização Estrutural dos parâmetros visuais do Chart.js via CDN
function inicializarGrafico() {
    const ctx = document.getElementById('metricsChart').getContext('2d');
    
    chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Temperatura (°C)', 'Pressão (Bar)', 'Umidade (%)'],
            datasets: [{
                label: 'Média de Leitura Atual',
                data: [0, 0, 0],
                backgroundColor: [
                    'rgba(56, 189, 248, 0.6)',
                    'rgba(74, 222, 128, 0.6)',
                    'rgba(251, 146, 60, 0.6)'
                ],
                borderColor: [
                    '#38bdf8',
                    '#4ade80',
                    '#fb923c'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: '#334155' },
                    ticks: { color: '#94a3b8' }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#94a3b8' }
                }
            },
            plugins: {
                legend: { display: false }
            }
        }
    });

    atualizarEstatisticasGrafico();
}

// Re-plota dinamicamente os valores e atualiza o gráfico sem recarregar o elemento canvas
function atualizarEstatisticasGrafico() {
    if (!chartInstance) return;

    const mediaTemp = calcularMediaPorTipo('TEMPERATURA');
    const mediaPressao = calcularMediaPorTipo('PRESSÃO');
    const mediaUmidade = calcularMediaPorTipo('UMIDADE');

    // Injeta os dados matemáticos atualizados direto no array do dataset da biblioteca
    chartInstance.data.datasets[0].data = [mediaTemp, mediaPressao, mediaUmidade];
    
    // Atualiza a visualização gráfica
    chartInstance.update();
}
