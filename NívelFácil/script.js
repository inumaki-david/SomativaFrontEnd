let sequencia = []; //essa lista é para armazenar a sequência gerada pelo jogo, que o jogador deve seguir
let sequenciaJogador = []; //essa lista é para armazenar a sequência que o jogador está tentando seguir, para comparar com a sequência do jogo
let nivel = 0; // Controla o nível atual do jogo
let jogoAtivo = false; // Indica se o jogador pode clicar ou se o jogo está mostrando a sequência 
const cores = ["azul", "vermelho", "amarelo", "verde"]; // Lista com as cores possíveis do jogo

//essa lista de sons é para cada cor, e um som de erro para quando o jogador errar a sequência 
const sons = {
    azul: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound1.mp3'),
    vermelho: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound2.mp3'),
    amarelo: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound3.mp3'),
    verde: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound4.mp3'),
    erro: new Audio('music/music_lose.mp3') 
};

const btnStart = document.getElementById('btn-start'); //essa variável é para o botão de iniciar o jogo, que também serve para reiniciar o jogo quando clicado novamente
const mensagem = document.getElementById('mensagem'); //essa variável é para mostrar mensagens para o jogador, como o nível atual ou mensagens de erro

// Adiciona um evento de clique no botão para iniciar o jogo
btnStart.addEventListener('click', iniciarJogo);

function iniciarJogo() { //essa função é para iniciar o jogo, resetando as variáveis e começando a primeira rodada
    sequencia = []; // Reseta a sequência do jogo
    sequenciaJogador = []; // Limpa a sequência do jogador
    nivel = 0; // Reinicia o nível
    jogoAtivo = true; // Ativa o jogo
    btnStart.innerText = "Reiniciar Jogo"; // Muda o texto do botão
    proximaRodada(); // Começa a primeira rodada
}

function proximaRodada() { //essa função é para avançar para a próxima rodada, gerando uma nova cor na sequência e tocando a sequência para o jogador seguir
    sequenciaJogador = []; // Limpa a sequência do jogador para a nova rodada
    nivel++; // Aumenta o nível
    mensagem.innerText = `Nível: ${nivel}`; // Atualiza a mensagem na tela
    
    // Escolhe uma cor aleatória do array
    const corAleatoria = cores[Math.floor(Math.random() * 4)];
    sequencia.push(corAleatoria); // Adiciona essa cor à sequência do jogo
    
    setTimeout(() => {
        tocarSequencia();
    }, 500); // Espera meio segundo e começa a mostrar a sequência
}

async function tocarSequencia() { //essa função é para tocar a sequência de cores para o jogador, fazendo cada cor brilhar e tocar seu som 
    jogoAtivo = false; // Desativa o clique do jogador enquanto a sequência é exibida
    // Percorre toda a sequência
    for (let i = 0; i < sequencia.length; i++) {
      const cor = sequencia[i]; // Pega a cor atual da sequência
      const elemento = document.querySelector(`.${cor}`); // Seleciona o elemento HTML correspondente à cor

      await new Promise((resolver) => { //essa parte é para garantir que cada cor seja mostrada com um intervalo
        // Faz a cor "piscar"
        setTimeout(() => {
          brilharCor(elemento, cor);
          resolver(); // Continua para a próxima cor
        }, 600);
      });
    }
    jogoAtivo = true; // Permite o jogador clicar novamente
}

function brilharCor(elemento, cor) { //essa função é para fazer a cor brilhar e tocar seu som
    // Verifica se existe um som para essa cor
    if (cor && sons[cor]) {
        sons[cor].currentTime = 0; // Reinicia o áudio caso já esteja tocando
        sons[cor].play(); // Toca o som da cor
    }
    elemento.classList.add('active'); // Adiciona uma classe CSS para efeito visual
    setTimeout(() => {
        elemento.classList.remove('active'); // Remove o efeito após um tempo
    }, 300); 
}

// Seleciona todos os botões do jogo
document.querySelectorAll('.genius div').forEach(botao => { //isso serve para adicionar um evento de clique a cada botão de cor, para que o jogador possa clicar e tentar seguir a sequência
    // Adiciona evento de clique em cada botão
    botao.addEventListener('click', (evento) => {
      // Se o jogo não estiver ativo, ignora o clique
      if (!jogoAtivo) return;

      const corClicada = evento.target.classList[0]; //essa parte é para identificar qual cor foi clicada, assumindo que a classe do botão corresponde à cor
      brilharCor(evento.target, corClicada); // Aplica o efeito visual e som
      sequenciaJogador.push(corClicada); // Adiciona a cor clicada na sequência do jogador

      verificarJogada(sequenciaJogador.length - 1); // Verifica se o jogador acertou até agora
    });
});

function verificarJogada(indice) { //essa função é para verificar se a jogada do jogador está correta
    if (sequenciaJogador[indice] !== sequencia[indice]) { //se a cor clicada pelo jogador não corresponder à cor na sequência do jogo, o jogo termina
        jogoAtivo = false; // Desativa o jogo
        
        sons.erro.play(); // Toca o som de erro

        const rodadasConcluidas = nivel - 1; // Calcula quantas rodadas o jogador completou
        
        setTimeout(() => {
            const jogarNovamente = confirm(`GAME OVER!\nVocê conseguiu em ${rodadasConcluidas} rodadas.\n\nGostaria de jogar denovo?`); // Mostra um alerta perguntando se quer jogar novamente
            
            if (jogarNovamente) {
                iniciarJogo(); // Reinicia o jogo se o jogador aceitar
            } else {
                mensagem.innerText = "Jogo Terminado!"; // Mostra mensagem final
                btnStart.innerText = "Iniciar Jogo"; // Reseta o texto do botão
            }
        }, 300);
        return; // Sai da função após erro
    }
    
    if (sequenciaJogador.length === sequencia.length) { //se o jogador completou a sequência corretamente, ele avança para a próxima rodada
        mensagem.innerText = "Boa! Próximo..."; // Mostra mensagem de acerto
        setTimeout(proximaRodada, 1000); // Vai para a próxima rodada após 1 segundo
    }
}