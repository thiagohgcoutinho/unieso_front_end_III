function dobrarNumeros(listaNumeros){
    return listaNumeros.map(function(numero){
        return numero * 2;
    });
}

const numeros = [1, 2, 3, 4, 5];

const numerosDobrados = dobrarNumeros(numeros);

console.log(numerosDobrados);