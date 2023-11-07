function obterParametrosURL() {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = {};

    for (const [key, value] of urlSearchParams) {
        if (!params[key]) {
            params[key] = [];
        }
        params[key].push(value);
    }

    return params;
}

document.addEventListener("DOMContentLoaded", function() {
    const parametros = obterParametrosURL();
    const tabelaProdutosElemento = document.getElementById('tabela-produtos');
    const valorTotalElemento = document.getElementById('valor-total');
    let valorTotal = 0;

    for (const chave in parametros) {
        if (parametros.hasOwnProperty(chave)) {            
            const param = parametros[chave];

            valorTotal += Number(param[3]);
            const quantidade = param[0];
            const nome = decodeURIComponent(param[1]);
            const adicionais = param[2];
            const precoFinal = `R$ ${Number(param[3]).toLocaleString('pt-br', {minimumFractionDigits: 2})}`;
            
            const row = document.createElement('tr');

            const quantidadeCell = document.createElement('td');
            quantidadeCell.textContent = quantidade;
            row.appendChild(quantidadeCell);

            const nomeCell = document.createElement('td');
            nomeCell.textContent = nome;
            row.appendChild(nomeCell);

            const adicionaisCell = document.createElement('td');
            adicionaisCell.textContent = adicionais;
            row.appendChild(adicionaisCell);

            const precoFinalCell = document.createElement('td');
            precoFinalCell.textContent = precoFinal;
            row.appendChild(precoFinalCell);
            tabelaProdutosElemento.appendChild(row);
        }
        valorTotalElemento.innerHTML =  `R$ ${Number(valorTotal).toLocaleString('pt-br', {minimumFractionDigits: 2})}`;;        
    }
});
