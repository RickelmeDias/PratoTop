let carrinhoDeProdutos = [];

function adicionarProduto(produto) {
    elementoPai = document.getElementById('lista-comidas');
    let listaDeComposicao = "";    
    for(let ele of produto.composicao) {
        listaDeComposicao += `
            <li>
                ${ele}
            </li>
        `
    }

    let escolhaDeAdicionais = "";
    for(let ele of produto.adicional) {
        escolhaDeAdicionais += `
        <div>
            <input type="checkbox" value="${ele.preco}" id="${ele.nome}_${produto.nome}" data-product="${produto.nome}" data-addon="${ele.nome}">
            <label for="${ele.nome}_${produto.nome}">
                R$ ${ele.preco.toLocaleString('pt-br', {minimumFractionDigits: 2})} - ${ele.nome}
            </label>
        </div>   
        `
    }

    const produtoCard = `
    <div class="col-sm-12 col-md-6 col-lg-4 mb-5">
        <div class="card h-100 w-100">
            <img class="card-img-top" src="../${produto.imagem}" alt="${produto.nome}" style="object-fit: contain;" height=200>
            <div class="card-body d-flex justify-content-between" style="flex-direction: column;">
                <div>
                    <h5 class="card-title">${produto.nome}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">${produto.tipo}</h6>
                </div>
                <ul class="list-unstyled">
                    ${listaDeComposicao}
                </ul>
                <div>
                    <div>
                        ${escolhaDeAdicionais}
                    </div>
                    <div>
                        <h3>R$ ${produto.preco.toLocaleString('pt-br', {minimumFractionDigits: 2})}</h3>
                        <div class="form-group mt-3">
                            <label for="input-quantidade-${produto.nome}">Quantidade</label>
                            <input step="1" value="0" type="number" id="input-quantidade-${produto.nome}" class="form-control" min="0"/>
                        </div>
                        <button type="button" class="btn btn-primary w-100" onclick="adicionarProdutoCarrinho('${produto.nome}', '${produto.imagem}', ${produto.preco})">Adicionar Produto</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;

    elementoPai.insertAdjacentHTML('beforeend', produtoCard);
}

function processarCardapio () {
    fetch('https://raw.githubusercontent.com/RickelmeDias/PratoTop/main/cardapio.json')
    .then(response => {
        if (!response.ok) {
            throw new Error("HTTP error " + response.status);
        }
        return response.json();
    })
    .then(cardapioEmJson => {
        cardapioEmJson.forEach((produtoDoCardapio) => {
            adicionarProduto(produtoDoCardapio);
        })
    })
    .catch(function () {
        this.dataError = true;
    })
}

processarCardapio();

function adicionarProdutoCarrinho(nome, imagem, preco, quantidade=undefined) {
    quantidade = quantidade == undefined ? document.getElementById(`input-quantidade-${nome}`).value : quantidade;

    if (quantidade > 0) {
        const inputsCheckboxAdicionais = document.querySelectorAll(`input[type="checkbox"][data-product='${nome}']`);
        const adicionaisMarcados = Array.from(inputsCheckboxAdicionais).filter(checkbox => checkbox.checked);
        let adicionais = [];
        let precoAdicionais = 0;
    
        for (let a of adicionaisMarcados) {
            adicionais.push({nome: a.getAttribute('data-addon'), preco: a.value})
            precoAdicionais+=Number(a.value);
        }
    
        const precoFinal = (precoAdicionais + preco)*quantidade;
        const precoUnidade = (preco+precoAdicionais);
        carrinhoDeProdutos.push({quantidade, nome, imagem, preco: precoUnidade, adiconal: adicionais, precoFinal });
        document.getElementById(`input-quantidade-${nome}`).value=0;
        atualizaCarrinho();
    }
}

function adicionarCombo() {
    adicionarProdutoCarrinho("Guaraná Lata", "/assets/produtos/guarana.jpg", 3.00, 1);
    adicionarProdutoCarrinho("X-Salada", "/assets/produtos/xsalada.jpg", 25.75, 1);
}

function removerProdutoCarrinho(index) {
    if (index >= 0 && index < carrinhoDeProdutos.length) {
        carrinhoDeProdutos.splice(index, 1);
    }
    atualizaCarrinho();
}

function atualizaCarrinho() {
    const carrinhoDivElePai = document.getElementById("carrinho");

    if (carrinhoDeProdutos.length > 0) {
        let index=0;
        let listaProdutosNoCarrinho="";

        for (let produto of carrinhoDeProdutos) {        
            listaProdutosNoCarrinho += `
            <li class="list-group-item d-flex my-2">
                <img src="../${produto.imagem}" alt="${produto.nome}" style="object-fit: contain;" height=200 width=200>
                        <div class="card-body d-flex justify-content-between" style="flex-direction: column;">
                            <div>
                                <h5 class="card-title">${produto.nome}</h5>
                                <h6 class="card-subtitle mb-2 text-muted">Quantidade: ${produto.quantidade}</h6>
                                <h6 class="card-subtitle mb-2 text-muted">Preço por unidade: ${produto.preco}</h6>
                            </div>
                            <div>
                                <div>                           
                                    <h3>TOTAL: R$ ${produto.precoFinal.toLocaleString('pt-br', {minimumFractionDigits: 2})}</h3>
                                    <button type="button" class="btn btn-outline-danger w-100" onclick="removerProdutoCarrinho(${index})">Remover Produto</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </li>
            `;
        }
        index++;
        carrinhoDivElePai.innerHTML = listaProdutosNoCarrinho;
    }else{
        carrinhoDivElePai.innerHTML = "";
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const carrinhoForm = document.getElementById('form-carrinho');
    
    carrinhoForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        finalizarPedido();        
    });
});
 
function limparCarrinho() {
    carrinhoDeProdutos=[];
    atualizaCarrinho();
}

function finalizarPedido() {
    if (carrinhoDeProdutos.length > 0) {
        const urlParam = new URLSearchParams();
        for (const key in carrinhoDeProdutos) {
            urlParam.append(key, carrinhoDeProdutos[key].quantidade);
            urlParam.append(key, carrinhoDeProdutos[key].nome);
            urlParam.append(key, carrinhoDeProdutos[key].adiconal.length);
            urlParam.append(key, carrinhoDeProdutos[key].precoFinal);
        }
      
        const url = 'resumo-pedido.html?' + urlParam.toString();
        window.location.href = url;
    }
}