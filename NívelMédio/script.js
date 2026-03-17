let intervalotempo = null; // Variável que guardará o intervalo do temporizador
let totalsegundos = null; // Variável que guardará o total de segundos do temporizador
let pausado = false; // Variável que indica se o temporizador está pausado

const tela = document.getElementById('tela-tempo');
const entradahora = document.getElementById('horas');
const entradaminuto = document.getElementById('minutos');
const entradasegundo = document.getElementById('segundos');

const inicioBtn = document.getElementById('btn-inicio');
const pauseBtn = document.getElementById('btn-pausar');
const resetarBtn = document.getElementById('btn-resetar');

// Função responsável por formatar o tempo
function formatarTempo(seconds) {
    const h = Math.floor(seconds / 3600); // Calcula quantas horas existem dentro do total de segundos
    const m = Math.floor((seconds % 3600) / 60); // Calcula os minutos restantes após remover as horas
    const s = seconds % 60; // Calcula os segundos restantes
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`; // Retorna o tempo formatado com dois dígitos
}

// Função que atualiza o tempo mostrado na tela
function updateTela() {
    tela.textContent = formatarTempo(totalsegundos); // Atualiza o texto da tela com o tempo formatado
}

// Função que inicia o temporizador
function comecarTempo() {
    if (intervalotempo) return; // Se já existir um intervalo rodando, não cria outro

    // Cria um intervalo que executa a cada 1 segundo
    intervalotempo = setInterval(() => { 
        totalsegundos--; // Diminui um segundo do total
        updateTela(); // Atualiza a tela com o novo tempo

        // Verifica se o tempo chegou a zero
        if (totalsegundos <= 0) { 
            clearInterval(intervalotempo); // Para o intervalo
            intervalotempo = null; // Remove o intervalo da variável
            totalsegundos = null; // Zera o total de segundos
            pauseBtn.textContent = "Pausar"; // Volta o texto do botão de pausa para "Pausar"
            alert("Tempo esgotado!"); // Mostra um alerta avisando que o tempo acabou
        } 
    }, 1000); // Executa a cada 1000ms (1 segundo)
}

// Evento executado quando o botão iniciar é clicado
inicioBtn.addEventListener('click', () => {
    if (intervalotempo || pausado) return; // Se já estiver rodando ou pausado, não inicia novamente

    const h = parseInt(entradahora.value) || 0; // Converte o valor das horas para número
    const m = parseInt(entradaminuto.value) || 0;
    const s = parseInt(entradasegundo.value) || 0;
    totalsegundos = (h * 3600) + (m * 60) + s; // Converte tudo para segundos
 
    if (totalsegundos <= 0) return; // Se o tempo for zero ou menor, não inicia

    comecarTempo(); // Inicia o temporizador
});

// Evento executado quando o botão pausar é clicado
pauseBtn.addEventListener('click', () => {
    // Funciona se ainda houver tempo
    if (totalsegundos > 0) {
        // Se não estiver pausado
        if (!pausado) {
            clearInterval(intervalotempo); // Para o intervalo
            intervalotempo = null; // Remove o intervalo
            pausado = true; // Marca como pausado
            pauseBtn.textContent = "Retomar";
        } else { // Se estiver pausado, retoma o temporizador
            comecarTempo();
            pausado = false; // Marca como não pausado
            pauseBtn.textContent = "Pausar"; // Volta o texto do botão para "Pausar"
        }
    }
});

// Evento executado quando o botão reiniciar é clicado
resetarBtn.addEventListener('click', () => {
    clearInterval(intervalotempo); // Para o temporizador
    intervalotempo = null; // Remove o intervalo
    totalsegundos = null; // Zera o tempo total
    pausado = false; // Remove o estado de pausa
    pauseBtn.textContent = "Pausar"; // Volta o texto do botão para "Pausar"
    // Limpa os campos de entrada
    entradahora.value = '';
    entradaminuto.value = '';
    entradasegundo.value = '';
    tela.textContent = "00:00:00"; // Reseta a tela para 00:00:00
});