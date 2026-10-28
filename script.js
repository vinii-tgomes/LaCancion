
const telaInicial = document.getElementById("telaInicial");
const telaMusica = document.getElementById("telaMusica");

const botaoIniciar = document.getElementById("iniciar");
const botaoVoltar = document.getElementById("voltar");

const linhasLetra = [
    ...document.querySelectorAll(".linha-letra")
];

const estadoPlayer = document.getElementById("estadoPlayer");

const URI_MUSICA = "spotify:track:0fea68AdmYNygeTGI4RC18";

// Tempos provisórios, em segundos.
// O primeiro verso começa depois da introdução vocal.
const tempos = [
    0,
    2,
    5,
    8,
    12,
    15,
    18,
    21,
    24,
    26,
];

let IFrameAPI = null;
let spotifyController = null;
let playerInicializado = false;
let posicaoMusica = 0;
let musicaPausada = true;

function abrirMusica() {
    telaInicial.hidden = true;
    telaMusica.hidden = false;

    inicializarPlayer();
}

function voltarInicio() {
    telaMusica.hidden = true;
    telaInicial.hidden = false;

    // A música não é pausada automaticamente.
    // O controle de reprodução permanece no Spotify.
}

botaoIniciar.addEventListener("click", abrirMusica);
botaoVoltar.addEventListener("click", voltarInicio);

function atualizarLetra() {
    let indiceAtual = -1;

    for (let i = 0; i < tempos.length; i++) {
        if (posicaoMusica >= tempos[i]) {
            indiceAtual = i;
        } else {
            break;
        }
    }

    linhasLetra.forEach((linha, indice) => {
        linha.classList.toggle(
            "ativa",
            indice === indiceAtual
        );
    });
}

function receberAtualizacao(event) {
    const dados = event.data;

    if (!dados) {
        return;
    }

    // A API fornece a posição em milissegundos.
    if (typeof dados.position === "number") {
        posicaoMusica = dados.position / 1000;
    }

    musicaPausada = Boolean(dados.isPaused);

    atualizarLetra();

    if (musicaPausada) {
        estadoPlayer.textContent = "Música pausada.";
    } else {
        estadoPlayer.textContent = "Reprodução em andamento.";
    }
}

function inicializarPlayer() {
    if (!IFrameAPI || playerInicializado) {
        return;
    }

    const elementoPlayer = document.getElementById("spotifyPlayer");

    if (!elementoPlayer) {
        console.error("Contêiner do Spotify não encontrado.");
        return;
    }

    playerInicializado = true;
    estadoPlayer.textContent = "Carregando o Spotify...";

    IFrameAPI.createController(
        elementoPlayer,
        {
            uri: URI_MUSICA,
            width: "100%",
            height: 152
        },
        (controller) => {
            spotifyController = controller;

            controller.addListener(
                "playback_update",
                receberAtualizacao
            );

            estadoPlayer.textContent =
                "Dê play no Spotify para iniciar a experiência.";

            console.log("Player do Spotify inicializado.");
        }
    );
}

// A API chama esta função quando estiver pronta.
window.onSpotifyIframeApiReady = (api) => {
    IFrameAPI = api;

    console.log("API do Spotify carregada.");

    // Caso a pessoa já tenha aberto a tela.
    inicializarPlayer();
};

console.log("La Canción carregada com sucesso.");