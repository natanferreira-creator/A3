/* =========================================================
   Conexão Segura — JavaScript
   Três partes: 1) Quiz  2) Simulador de golpes  3) Verificador de senha
   ========================================================= */


/* =========================================================
   1) QUIZ
   ========================================================= */

// Lista de perguntas. "correta" é a posição da resposta certa em "opcoes"
// (a contagem começa no 0: 0 = primeira, 1 = segunda, e assim por diante).
const perguntas = [
  {
    texto: "O que é phishing?",
    opcoes: [
      "Um tipo de antivírus gratuito",
      "Um golpe que usa mensagens falsas para roubar seus dados",
      "Um navegador mais seguro",
      "Uma cópia de segurança na nuvem"
    ],
    correta: 1,
    explicacao: "Phishing é a “pescaria” de dados: o golpista se passa por um banco, loja ou órgão público para você entregar senhas e documentos."
  },
  {
    texto: "Qual destas senhas é a mais segura?",
    opcoes: [
      "123456",
      "joao1990",
      "Meu cachorro come 3 bananas!",
      "senha@123"
    ],
    correta: 2,
    explicacao: "Frases longas são difíceis de adivinhar e fáceis de lembrar. As outras opções aparecem entre as primeiras que criminosos testam."
  },
  {
    texto: "Você recebe um SMS do banco com um link para “atualizar seu cadastro”. O que fazer?",
    opcoes: [
      "Clicar rápido, antes que a conta seja bloqueada",
      "Responder o SMS com seus dados",
      "Não clicar e abrir o aplicativo ou o site oficial do banco por conta própria",
      "Encaminhar o SMS para os amigos avisarem"
    ],
    correta: 2,
    explicacao: "Nunca use o link da mensagem. Acesse o banco pelo aplicativo ou digitando o endereço oficial, e confira se existe mesmo um aviso lá."
  },
  {
    texto: "O cadeado ao lado do endereço (https) significa que o site é confiável?",
    opcoes: [
      "Sim, o site é 100% seguro",
      "Não: a conexão é criptografada, mas o site ainda pode ser falso",
      "Sim, significa que o site é do governo",
      "Sim, significa que o site não tem vírus"
    ],
    correta: 1,
    explicacao: "Sites de golpe também podem ter cadeado. Ele protege o caminho dos dados, mas não prova quem está do outro lado."
  },
  {
    texto: "Para que serve a verificação em duas etapas?",
    opcoes: [
      "Para trocar de senha todo mês",
      "Para deixar o login mais rápido",
      "Para exigir uma segunda prova de que é você, além da senha",
      "Para bloquear propagandas"
    ],
    correta: 2,
    explicacao: "Com a segunda etapa (um código no celular, por exemplo), descobrir sua senha não basta para invadir a conta."
  },
  {
    texto: "Você está em um Wi-Fi público de um café. Qual é o cuidado mais importante?",
    opcoes: [
      "Evitar acessar banco e digitar senhas, ou usar os dados móveis",
      "Nenhum, redes públicas são sempre seguras",
      "Desligar a tela do celular",
      "Usar a mesma senha de sempre, que você já conhece"
    ],
    correta: 0,
    explicacao: "Redes abertas podem ser monitoradas ou falsificadas. Para assuntos sensíveis, prefira os dados móveis."
  },
  {
    texto: "Alguém liga dizendo ser do seu banco e pede o código que chegou por SMS. E agora?",
    opcoes: [
      "Passar o código, afinal a pessoa sabe seu nome",
      "Passar só metade do código",
      "Pedir o CPF da pessoa para conferir",
      "Desligar e ligar para o número que está no cartão ou no aplicativo do banco"
    ],
    correta: 3,
    explicacao: "Bancos nunca pedem códigos nem senhas por telefone. Quem pede é golpista, mesmo que saiba seus dados."
  },
  {
    texto: "Qual é o risco de usar a mesma senha em vários sites?",
    opcoes: [
      "Nenhum, é mais prático",
      "Se um site vazar a senha, todas as suas contas ficam expostas",
      "A senha expira mais rápido",
      "O computador fica mais lento"
    ],
    correta: 1,
    explicacao: "Criminosos testam senhas vazadas em vários serviços. Uma senha diferente para cada conta limita o estrago."
  }
];

// Variáveis que guardam o estado do quiz
let quizIndice = 0;        // em qual pergunta estamos
let quizPontos = 0;        // quantas o usuário já acertou
let quizRespondeu = false; // já respondeu a pergunta atual?

const quizArea = document.getElementById("quiz-area");

// Mostra a pergunta atual na tela
function mostrarPergunta() {
  quizRespondeu = false;
  const p = perguntas[quizIndice];

  // Monta o HTML da pergunta
  quizArea.innerHTML = `
    <p class="progresso">Pergunta ${quizIndice + 1} de ${perguntas.length}</p>
    <div class="barra"><div class="barra-preenchida" id="quiz-barra"></div></div>
    <h3 class="pergunta">${p.texto}</h3>
    <div id="quiz-opcoes"></div>
    <div class="feedback" id="quiz-feedback" aria-live="polite"></div>
    <button class="botao" id="quiz-proxima" hidden></button>
  `;

  // Largura da barra de progresso
  document.getElementById("quiz-barra").style.width =
    (quizIndice / perguntas.length) * 100 + "%";

  // Cria um botão para cada opção de resposta
  const caixaOpcoes = document.getElementById("quiz-opcoes");
  p.opcoes.forEach(function (textoOpcao, posicao) {
    const botao = document.createElement("button");
    botao.className = "opcao";
    botao.textContent = textoOpcao;
    botao.addEventListener("click", function () {
      responderQuiz(posicao);
    });
    caixaOpcoes.appendChild(botao);
  });

  document.getElementById("quiz-proxima").addEventListener("click", proximaPergunta);
}

// Chamada quando o usuário clica em uma opção
function responderQuiz(escolhida) {
  if (quizRespondeu) return; // impede responder duas vezes
  quizRespondeu = true;

  const p = perguntas[quizIndice];
  const botoes = document.querySelectorAll("#quiz-opcoes .opcao");
  const feedback = document.getElementById("quiz-feedback");

  // Trava todos os botões e pinta a resposta certa de verde
  botoes.forEach(function (botao, posicao) {
    botao.disabled = true;
    if (posicao === p.correta) botao.classList.add("certo");
  });

  if (escolhida === p.correta) {
    quizPontos++;
    feedback.className = "feedback ok";
    feedback.innerHTML = "<strong>Correto!</strong>" + p.explicacao;
  } else {
    botoes[escolhida].classList.add("errado");
    feedback.className = "feedback erro";
    feedback.innerHTML = "<strong>Não foi dessa vez.</strong>" + p.explicacao;
  }

  // Mostra o botão de avançar (com texto diferente na última pergunta)
  const proxima = document.getElementById("quiz-proxima");
  proxima.textContent =
    quizIndice === perguntas.length - 1 ? "Ver resultado" : "Próxima pergunta";
  proxima.hidden = false;
  proxima.focus();
}

function proximaPergunta() {
  quizIndice++;
  if (quizIndice < perguntas.length) {
    mostrarPergunta();
  } else {
    mostrarResultadoQuiz();
  }
}

function mostrarResultadoQuiz() {
  let mensagem;
  if (quizPontos >= 7) {
    mensagem = "Excelente! Você já reconhece a maioria dos golpes. Compartilhe o que sabe com a família.";
  } else if (quizPontos >= 4) {
    mensagem = "Bom começo! Revise as explicações que errou e tente o simulador de golpes.";
  } else {
    mensagem = "Sem problema, é para isso que serve o quiz. Leia as dicas abaixo e tente de novo.";
  }

  quizArea.innerHTML = `
    <div class="resultado">
      <h3>Você acertou ${quizPontos} de ${perguntas.length}</h3>
      <p>${mensagem}</p>
      <button class="botao" id="quiz-reiniciar">Refazer o quiz</button>
    </div>
  `;

  document.getElementById("quiz-reiniciar").addEventListener("click", function () {
    quizIndice = 0;
    quizPontos = 0;
    mostrarPergunta();
  });
}


/* =========================================================
   2) SIMULADOR DE GOLPES
   ========================================================= */

// Cada mensagem tem: canal, remetente, texto, se é golpe e os sinais que explicam.
// "assunto" e "contexto" são opcionais.
const mensagens = [
  {
    canal: "sms",
    de: "CORREIOS-AVISO",
    texto: "Sua encomenda está retida. Pague a taxa de R$ 7,90 em até 24h: correios-taxa.top/rastreio",
    golpe: true,
    sinais: [
      "Cobra uma taxa que você não esperava.",
      "Cria urgência: “em até 24h”.",
      "O endereço termina em .top e não é o site oficial dos Correios."
    ]
  },
  {
    canal: "email",
    de: "atendimento@banco-seguranca.net",
    assunto: "Sua conta será bloqueada hoje",
    texto: "Detectamos um acesso suspeito. Clique em “Confirmar identidade” e informe CPF, senha e token para evitar o bloqueio.",
    golpe: true,
    sinais: [
      "O remetente usa um domínio genérico, que não é o do banco.",
      "Ameaça de bloqueio imediato para você agir com medo.",
      "Pede senha e token, que nenhum banco pede por e-mail."
    ]
  },
  {
    canal: "whatsapp",
    de: "Número desconhecido",
    texto: "Oi, mãe! Mudei de número, salva o novo. Estou sem acesso ao banco, você consegue fazer um Pix urgente pra mim?",
    golpe: true,
    sinais: [
      "O número é desconhecido, mas a pessoa finge ser alguém da família.",
      "Pede dinheiro com urgência.",
      "Antes de qualquer Pix, ligue para o número antigo ou faça uma pergunta que só a pessoa saberia responder."
    ]
  },
  {
    canal: "app",
    de: "Aplicativo do seu banco",
    contexto: "Você acabou de pagar uma compra no mercado do bairro.",
    texto: "Compra aprovada de R$ 42,90 em Mercado Central. Não reconhece? Abra o aplicativo para contestar.",
    golpe: false,
    sinais: [
      "É a notificação de uma compra que você acabou de fazer.",
      "Não traz link nem pede dados.",
      "Manda você abrir o aplicativo por conta própria, que é o caminho seguro."
    ]
  },
  {
    canal: "email",
    de: "premios@sorteio-oficial.click",
    assunto: "Parabéns! Você ganhou um celular novo",
    texto: "Você foi sorteado! Para receber o prêmio, informe seu CPF e os dados do cartão para pagar apenas o frete.",
    golpe: true,
    sinais: [
      "Prêmio de um sorteio do qual você não participou.",
      "Pede dados do cartão para “pagar só o frete”.",
      "O domínio termina em .click e não tem relação com nenhuma empresa conhecida."
    ]
  },
  {
    canal: "sms",
    de: "Banco (código de acesso)",
    contexto: "Você acabou de tentar entrar no aplicativo do seu banco.",
    texto: "Seu código de acesso é 482913. Válido por 5 minutos. Não compartilhe com ninguém.",
    golpe: false,
    sinais: [
      "Chegou logo depois de você pedir o acesso.",
      "Não tem link e não pede nada além de usar o código no aplicativo.",
      "Atenção: se um código assim chegar sem você ter pedido, alguém pode estar tentando entrar na sua conta. Nunca passe o código para ninguém."
    ]
  }
];

// Nomes bonitos para cada canal
const nomesCanais = {
  sms: "SMS",
  email: "E-mail",
  whatsapp: "WhatsApp",
  app: "Notificação do aplicativo"
};

// Estado do simulador
let simIndice = 0;
let simPontos = 0;
let simRespondeu = false;

const simArea = document.getElementById("simulador-area");

function mostrarMensagem() {
  simRespondeu = false;
  const m = mensagens[simIndice];

  // Partes opcionais: só aparecem se a mensagem tiver "contexto" ou "assunto"
  const contextoHTML = m.contexto ? `<p class="contexto">${m.contexto}</p>` : "";
  const assuntoHTML = m.assunto ? `<p class="mensagem-assunto">${m.assunto}</p>` : "";

  simArea.innerHTML = `
    <p class="progresso">Mensagem ${simIndice + 1} de ${mensagens.length}</p>
    <div class="barra"><div class="barra-preenchida" id="sim-barra"></div></div>
    ${contextoHTML}
    <div class="mensagem canal-${m.canal}">
      <div class="mensagem-topo">
        <span>${nomesCanais[m.canal]}</span>
        <span>De: ${m.de}</span>
      </div>
      ${assuntoHTML}
      <p class="mensagem-texto">${m.texto}</p>
    </div>
    <div class="veredito" id="sim-veredito">
      <button class="botao-golpe" id="sim-golpe">É golpe</button>
      <button class="botao-legitima" id="sim-legitima">É legítima</button>
    </div>
    <div class="feedback" id="sim-feedback" aria-live="polite"></div>
    <button class="botao" id="sim-proxima" hidden></button>
  `;

  document.getElementById("sim-barra").style.width =
    (simIndice / mensagens.length) * 100 + "%";

  // Cada botão envia a resposta do usuário (true = "é golpe")
  document.getElementById("sim-golpe").addEventListener("click", function () {
    responderSimulador(true);
  });
  document.getElementById("sim-legitima").addEventListener("click", function () {
    responderSimulador(false);
  });
  document.getElementById("sim-proxima").addEventListener("click", proximaMensagem);
}

function responderSimulador(achouQueEGolpe) {
  if (simRespondeu) return;
  simRespondeu = true;

  const m = mensagens[simIndice];
  const acertou = achouQueEGolpe === m.golpe;
  if (acertou) simPontos++;

  // Trava os dois botões
  document.getElementById("sim-golpe").disabled = true;
  document.getElementById("sim-legitima").disabled = true;

  // Monta a lista de sinais
  let listaSinais = "";
  m.sinais.forEach(function (sinal) {
    listaSinais += "<li>" + sinal + "</li>";
  });

  const titulo = m.golpe ? "Era um golpe." : "Era uma mensagem legítima.";
  const subtitulo = m.golpe ? "Sinais de alerta:" : "Por que ela é confiável:";

  const feedback = document.getElementById("sim-feedback");
  feedback.className = acertou ? "feedback ok" : "feedback erro";
  feedback.innerHTML =
    "<strong>" + (acertou ? "Acertou! " : "Errou desta vez. ") + titulo + "</strong>" +
    subtitulo + "<ul>" + listaSinais + "</ul>";

  const proxima = document.getElementById("sim-proxima");
  proxima.textContent =
    simIndice === mensagens.length - 1 ? "Ver resultado" : "Próxima mensagem";
  proxima.hidden = false;
  proxima.focus();
}

function proximaMensagem() {
  simIndice++;
  if (simIndice < mensagens.length) {
    mostrarMensagem();
  } else {
    mostrarResultadoSimulador();
  }
}

function mostrarResultadoSimulador() {
  let mensagem;
  if (simPontos === mensagens.length) {
    mensagem = "Perfeito! Você identificou todas. Na dúvida, o melhor caminho é sempre sair da mensagem e procurar o canal oficial.";
  } else if (simPontos >= 4) {
    mensagem = "Muito bem! Releia os sinais das que errou: urgência, endereços estranhos e pedidos de dados aparecem em quase todo golpe.";
  } else {
    mensagem = "Golpistas são bons em parecer reais. Refaça o simulador prestando atenção em quem envia, no endereço do link e no que a mensagem pede.";
  }

  simArea.innerHTML = `
    <div class="resultado">
      <h3>Você acertou ${simPontos} de ${mensagens.length}</h3>
      <p>${mensagem}</p>
      <button class="botao" id="sim-reiniciar">Jogar de novo</button>
    </div>
  `;

  document.getElementById("sim-reiniciar").addEventListener("click", function () {
    simIndice = 0;
    simPontos = 0;
    mostrarMensagem();
  });
}


/* =========================================================
   3) VERIFICADOR DE SENHA
   ========================================================= */

const campoSenha = document.getElementById("campo-senha");
const mostrarSenha = document.getElementById("mostrar-senha");
const medidor = document.getElementById("medidor");
const medidorPreenchido = document.getElementById("medidor-preenchido");
const nivelTexto = document.getElementById("nivel-texto");
const senhaAviso = document.getElementById("senha-aviso");

// Pedaços de senhas muito usadas. Se a senha contiver um deles, ela perde pontos.
const senhasComuns = [
  "123456", "12345678", "senha", "password", "qwerty",
  "abc123", "111111", "123123", "admin", "brasil", "iloveyou"
];

// Nome de cada nível, do 1 ao 5
const nomesNiveis = ["", "Muito fraca", "Fraca", "Média", "Forte", "Muito forte"];

// Mostra ou esconde a senha digitada
mostrarSenha.addEventListener("change", function () {
  campoSenha.type = mostrarSenha.checked ? "text" : "password";
});

// Avalia a senha a cada tecla digitada
campoSenha.addEventListener("input", avaliarSenha);

function avaliarSenha() {
  const senha = campoSenha.value;

  // Cada regra vale true (cumprida) ou false (não cumprida)
  const regras = {
    tamanho: senha.length >= 12,
    minuscula: /[a-z]/.test(senha),
    maiuscula: /[A-Z]/.test(senha),
    numero: /[0-9]/.test(senha),
    simbolo: /[^A-Za-z0-9]/.test(senha)
  };

  // Atualiza a lista de regras (✓ ou ✗)
  for (const nome in regras) {
    const item = document.getElementById("regra-" + nome);
    if (senha.length === 0) {
      item.className = "";  // campo vazio: sem ✓ nem ✗
    } else {
      item.className = regras[nome] ? "ok" : "falta";
    }
  }

  // Campo vazio: volta ao estado inicial
  if (senha.length === 0) {
    medidor.className = "medidor";
    medidorPreenchido.style.width = "0";
    nivelTexto.textContent = "Digite para testar";
    senhaAviso.textContent = "";
    return;
  }

  // Pontos = quantas regras foram cumpridas (de 0 a 5)
  let pontos = Object.values(regras).filter(Boolean).length;

  // Senha curta ou comum nunca passa de "Fraca"
  if (senha.length < 8) {
    pontos = Math.min(pontos, 2);
  }

  const ehComum = senhasComuns.some(function (comum) {
    return senha.toLowerCase().includes(comum);
  });
  if (ehComum) {
    pontos = Math.min(pontos, 1);
    senhaAviso.textContent = "Esta senha contém um padrão muito comum, que é um dos primeiros que criminosos testam.";
  } else {
    senhaAviso.textContent = "";
  }

  // Garante pelo menos o nível 1 quando há algo digitado
  const nivel = Math.max(pontos, 1);

  medidor.className = "medidor nivel-" + nivel;
  medidorPreenchido.style.width = (nivel / 5) * 100 + "%";
  nivelTexto.textContent = "Força: " + nomesNiveis[nivel];
}


/* =========================================================
   INICIALIZAÇÃO
   ========================================================= */

// Ano no rodapé
document.getElementById("ano").textContent = new Date().getFullYear();

// Começa o quiz e o simulador
mostrarPergunta();
mostrarMensagem();
