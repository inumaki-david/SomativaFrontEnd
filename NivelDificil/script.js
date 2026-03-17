const display = document.getElementById('display');

// adiciona números ou operadores ao visor
function addTela(input) {
    display.value += input;
}

// limpa tudo
function limparTela() {
    display.value = "";
}

// apaga o último caractere
function deletarUltimo() {
    display.value = display.value.slice(0, -1);
}

// realiza o cálculo
function calcular() {
    try {
        // eval() resolve a string matemática (ex: "2+2" vira 4)
        display.value = eval(display.value);
    } catch (error) {
        display.value = "Erro";
        setTimeout(clearDisplay, 1500); // limpa o visor após mostrar o erro
    }
}