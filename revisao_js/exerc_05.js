const notas = [7.3, 6.5, 8.3];

function situacaoAluno() {
    console.log("A primeria nota do aluno é " + notas[0]);
    console.log("A segunda nota do aluno é " + notas[1]);
    console.log("A terceira nota do aluno é " + notas[2]);

    const media = (notas[0] + notas[1] + notas[2]) / notas.length

    if (media < 7) {
        console.log("A média do aluno é " + media + " e ele está REPROVADO.");
    } else {
        console.log("A média do aluno é " + media + " e ele está APROVADO.")
    }
}

situacaoAluno();