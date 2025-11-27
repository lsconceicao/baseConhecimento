// Seleciona o contêiner dos cards e o campo de pesquisa uma vez para reutilizá-los.
const cardContainer = document.querySelector(".card-container");
const searchInput = document.querySelector("input");

// Array para armazenar os dados carregados do JSON.
let dados = [];

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

  // Se o campo de pesquisa estiver vazio, renderiza todos os dados novamente.
  if (termoPesquisa === "") {
    renderizarCards(dados);
    return;
  }

  // Utiliza o método 'filter' para criar um novo array apenas com os itens que correspondem à busca.
  // 'filter' é mais moderno e conciso que um loop 'for' para esta tarefa.
  const resultados = dados.filter((dado) => {
    const nome = dado.nome.toLowerCase();
    const descricao = dado.descricao.toLowerCase();
    // Retorna 'true' se o nome ou a descrição incluírem o termo pesquisado.
    return nome.includes(termoPesquisa) || descricao.includes(termoPesquisa);
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
      <img src="${dado.link_imagem}" alt="Imagem de ${dado.nome}" class="card-img">
      <div class="card-content">
        <h2>${dado.nome}</h2>
        <p>${dado.ano}</p>
        <p>${dado.descricao}</p>
      </div>
    `;
    cardContainer.appendChild(article);
  });
}

// --- CONFIGURAÇÃO DOS EVENTOS ---

// Adiciona um "escutador de evento" que chama 'carregarDados' assim que o conteúdo HTML da página é carregado.
// Isso garante que os dados sejam exibidos assim que a página abre.
document.addEventListener("DOMContentLoaded", carregarDados);

// Adiciona um "escutador de evento" ao campo de pesquisa que chama 'iniciarBusca' toda vez que o usuário digita algo.
// Isso cria a funcionalidade de busca em tempo real.
searchInput.addEventListener("input", iniciarBusca);