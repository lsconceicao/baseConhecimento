// Seleciona o contêiner dos cards e o campo de pesquisa uma vez para reutilizá-los.
const cardContainer = document.querySelector(".card-container");
const searchInput = document.querySelector("input");

// Array para armazenar os dados carregados do JSON.
let dados = [];
let marcaSelecionada = 'todas'; // Começa mostrando tudo

// Função que carrega os dados do arquivo JSON.
async function carregarDados() {
  try {
    // Realiza a requisição para o arquivo data.json.
    const resposta = await fetch("data.json");

    // Se a resposta não for bem-sucedida (ex: erro 404), lança um erro.
    if (!resposta.ok) {
      throw new Error("Não foi possível carregar a base de dados.");
    }

    // Converte a resposta em formato JSON e armazena na variável 'dados'.
    dados = await resposta.json();

    gerarFiltrosMarcas(dados);

    // Renderiza todos os cards na tela assim que os dados são carregados.
    renderizarCards(dados);
  } catch (erro) {
    // Em caso de erro na requisição ou processamento, exibe uma mensagem amigável.
    console.error("Erro capturado:", erro);
    cardContainer.innerHTML = `
      <div style="text-align: center; color: var(--tertiary-color);">
        <h3>Ops! Ocorreu um erro.</h3>
        <p>Não conseguimos carregar as informações no momento.</p>
        <p>Detalhe técnico: ${erro.message}</p>
      </div>
    `;
  }
}

// Função para filtrar e exibir os cards com base no termo de busca.
function iniciarBusca() {
  // Pega o valor digitado no campo de pesquisa, remove espaços extras e converte para minúsculas.
  const termoPesquisa = searchInput.value.trim().toLowerCase();
  // Utiliza o método 'filter' para criar um novo array apenas com os itens que correspondem à busca.
  // 'filter' é mais moderno e conciso que um loop 'for' para esta tarefa.
  const resultados = dados.filter((dado) => {
    const nome = (dado.nome_equipamento || "").toLowerCase();
    const sku = (dado.sku_equipamento || "").toLowerCase();
    const id = (dado.id_equipamento || "").toLowerCase()
    const matchTexto = nome.includes(termoPesquisa) || sku.includes(termoPesquisa) || id.includes(termoPesquisa); // Verifica se o nome, sku ou id incluem o termo pesquisado
    const matchMarca = (marcaSelecionada === 'todas') || (dado.marca_equipamento === marcaSelecionada); // Verifica se a marca corresponde ou se "todas" está selecionada
    if (!matchMarca) return false; // Filtra pela marca selecionada

    return matchTexto && matchMarca;
  });

  // Renderiza os cards com os resultados filtrados.
  renderizarCards(resultados);
}

// Função que renderiza os cards na tela.
function renderizarCards(dadosParaRenderizar) {
  // Limpa o contêiner de cards para evitar duplicação de conteúdo.
  cardContainer.innerHTML = "";

  // Se o array de dados para renderizar estiver vazio, exibe uma mensagem.
  if (dadosParaRenderizar.length === 0) {
    cardContainer.innerHTML = "<p>Nenhum resultado encontrado.</p>";
    return;
  }

  // Para cada item no array, cria e adiciona um novo card no contêiner.
  dadosParaRenderizar.forEach((dado) => {
    const article = document.createElement("article");
    article.classList.add("card");

    // Preenche o conteúdo do card com os dados do item.
    article.innerHTML = `
      <img src="${dado.link_imagem}" alt="Imagem de ${dado.nome_equipamento}" class="card-img">
      <div class="card-content">
        <h2>Modelo: ${dado.nome_equipamento}</h2>
        <p>SKU: ${dado.sku_equipamento}</p>
        <p>ID Equipamento: ${dado.id_equipamento}</p>
        <p>SKU Capa: ${dado.id_acessorio_capas.join(", ")}</p>
        <p>SKU Pelicula: ${dado.id_acessorio_peliculas.join(", ")}</p>
        <p><a href="${dado.link_ficha_tecnica}" target="_blank">Ficha Tecnica</a></p>
      </div>
    `;
    cardContainer.appendChild(article);
  });
}

// Adiciona um "escutador de evento" que chama 'carregarDados' assim que o conteúdo HTML da página é carregado.
// Isso garante que os dados sejam exibidos assim que a página abre.
document.addEventListener("DOMContentLoaded", carregarDados);

// Adiciona um "escutador de evento" ao campo de pesquisa que chama 'iniciarBusca' toda vez que o usuário digita algo.
// Isso cria a funcionalidade de busca em tempo real.
searchInput.addEventListener("input", iniciarBusca);

function gerarFiltrosMarcas(dados) {
  const listaMarcas = document.getElementById("lista-marcas");
  const marcasUnicas = [...new Set(dados.map(dado => dado.marca_equipamento))].sort();
  listaMarcas.innerHTML = `<li class="$marcaSelecionada === 'todas' ? 'filtro-ativo' : ''}" onclick="filtrarPorMarca('todas')">Todas</li>`;
  marcasUnicas.forEach(marca => {
    const li = document.createElement("li");
    li.textContent = marca;
    if (marca === marcaSelecionada) li.classList.add("filtro-ativo");
    li.onclick = () => filtrarPorMarca(marca);
    listaMarcas.appendChild(li);
  });
};

function filtrarPorMarca(marca) {
  marcaSelecionada = marca;
  gerarFiltrosMarcas(dados);
  iniciarBusca();
}