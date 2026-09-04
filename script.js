const translations = {
  pt: {
    navProfile: "Perfil",
    navWork: "Projetos",
    navExpertise: "Competencias",
    heroRole: "Engenheiro de Software & Desenvolvedor Roblox",
    heroStatement: "Desenvolvo sistemas digitais confiáveis entre backend, segurança, infraestrutura e experiências interativas.",
    exploreWork: "Explorar projetos selecionados",
    profileLabel: "Perfil profissional",
    profileTitle: "Amplitude generalista.<br><em>Profundidade técnica.</em>",
    profileLead: "Sou engenheiro de software com visão orientada a sistemas e capacidade de transitar entre produto, infraestrutura, segurança e desenvolvimento de jogos.",
    profileP1: "Meu trabalho inclui plataformas web em tempo real, runtimes em Rust, infraestrutura de releases multiplataforma, arquiteturas de serviços de IA, pesquisa em segurança, visão computacional e desenvolvimento de gameplay no Roblox. Em cada domínio, aplico a mesma disciplina: compreender a arquitetura, isolar as restrições e tomar decisões que continuem claras conforme o sistema cresce.",
    profileP2: "Tenho melhor desempenho em funções que valorizam amplitude técnica, autonomia e investigação cuidadosa. Consigo trabalhar desde contratos de API e modelos de dados até o comportamento do sistema operacional, e desde um protótipo inicial até testes, deploy, observabilidade e iteração.",
    careerLabel: "Momento atual",
    careerTitle: "Construindo sistemas<br><em>que as pessoas sentem.</em>",
    current: "Atual",
    roleLabel: "Desenvolvedor · NEXUS",
    nexusTitle: "Desenvolvimento de gameplay para uma experiência PvP de arena em evolução.",
    nexusBody: "Contribuo para o NEXUS no Roblox Studio, uma experiência de combate centrada em personagens distintos, habilidades, efeitos visuais e interação estratégica entre jogadores. O trabalho une lógica de gameplay, iteração rápida, colaboração técnica e atenção a como os sistemas se comportam durante o jogo.",
    viewExperience: "Ver experiência",
    workLabel: "Trabalhos de engenharia selecionados",
    workTitle: "Evidências acima<br><em>de adjetivos.</em>",
    workIntro: "Estudos de caso representativos selecionados entre meus repositórios públicos e privados. Bases de código confidenciais são descritas no nível de arquitetura, sem expor detalhes sensíveis de implementação.",
    privateCase: "Estudo de caso privado",
    challenge: "Desafio",
    evidence: "Evidências de engenharia",
    focus: "Foco tecnico",
    architecture: "Arquitetura",
    principle: "Princípio de design",
    microBody: "Exploração de um runtime modular em Rust para ambientes restritos. A arquitetura combina isolamento por features, suporte opcional a <code>no_std</code>, alocação customizada, caminhos de dados sem cópia, carregamento de modelos em memória, envelopes criptográficos, telemetria e validação automatizada da arquitetura.",
    microChallenge: "Unificar controle de memória em baixo nível, inferência, transporte e limites de confiança sem transformar o runtime em um monolito.",
    pdvBody: "Plataforma de operações para restaurantes com diferentes interfaces cobrindo produtos, mesas, pedidos, caixas, pedidos via QR Code, analytics, backups, controle de acesso e sincronização em tempo real.",
    airshipperBody: "Launcher desktop customizado e serviço de releases com mapeamento de artefatos por plataforma, integração com releases do GitHub, métricas, metadados em banco, instaladores e pipelines multiplataforma.",
    prismaBody: "Plataforma orientada a serviços para conectividade com WhatsApp e fluxos assistidos por IA. A arquitetura separa aplicação web, mensageria, processamento de IA, abstração de provedores, detecção de intenção, analytics, persistência, cache e operação em containers.",
    prismaPrinciple: "Manter provedores externos substituíveis e responsabilidades operacionais explícitas.",
    expertiseLabel: "Disciplinas de engenharia",
    expertiseTitle: "Amplitude com<br><em>um centro claro.</em>",
    discipline1: "Backend e engenharia de produto",
    discipline1Body: "APIs, sistemas full-stack, limites entre serviços, modelagem de dados, autenticação e comunicação em tempo real.",
    discipline2: "Sistemas e infraestrutura",
    discipline2Body: "Software consciente de memória, integração de plataformas, containers, pipelines, observabilidade, persistência e cache.",
    discipline3: "Engenharia de segurança",
    discipline3Body: "Pesquisa autorizada em binários, protocolos, Windows internals, comportamento de aplicações e validação defensiva.",
    discipline4: "Tecnologia interativa",
    discipline4Body: "Sistemas de gameplay, iteração rápida, visão computacional, automação e software orientado pelo retorno direto do usuário.",
    contactLabel: "Contato",
    contactTitle: "Vamos construir algo<br><em>que vale compreender.</em>",
    contactBody: "Aberto a oportunidades em engenharia de software, backend, sistemas, segurança de aplicações, DevSecOps, automação e tecnologia para jogos.",
    footerNote: "Trabalhos de segurança são conduzidos para educação, defesa e testes autorizados."
  }
};

const toggle = document.querySelector("#language-toggle");
const original = {};

document.querySelectorAll("[data-copy]").forEach((element) => {
  original[element.dataset.copy] = element.innerHTML;
});

let language = "en";

toggle.addEventListener("click", () => {
  language = language === "en" ? "pt" : "en";
  document.documentElement.lang = language === "pt" ? "pt-BR" : "en";
  toggle.textContent = language === "en" ? "PT" : "EN";
  toggle.setAttribute("aria-label", language === "en" ? "Switch to Portuguese" : "Mudar para inglês");

  document.querySelectorAll("[data-copy]").forEach((element) => {
    const key = element.dataset.copy;
    element.innerHTML = language === "pt" ? translations.pt[key] : original[key];
  });
});
