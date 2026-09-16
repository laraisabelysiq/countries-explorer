let bd = {};

const selectBuscar = document.querySelector(".selectBuscar");
const main = document.querySelector(".Main");

// Combobox
colocarSelect();

async function colocarSelect() {
    try {
        const url = "https://countries.dev/countries";

        const resp = await fetch(url);

        if (!resp.ok) {
            throw new Error("Erro ao buscar os países.");
        }

        const resposta = await resp.json();

        console.log(resposta);

        selectBuscar.innerHTML = "";

        const defaultOption = document.createElement("option");
        defaultOption.value = "";
        defaultOption.textContent = "Selecione...";
        defaultOption.disabled = true;
        defaultOption.selected = true;
        selectBuscar.appendChild(defaultOption);

        resposta.sort((a, b) => {
            const nomeA = a.name || "";
            const nomeB = b.name || "";

            return nomeA.localeCompare(nomeB);
        });

        resposta.forEach((pais) => {
            const option = document.createElement("option");

            option.value = pais.alpha3Code;
            option.textContent = pais.name;

            selectBuscar.appendChild(option);
        });
    } catch (erro) {
        console.error("Erro ao carregar países:", erro);

        selectBuscar.innerHTML = `
            <option value="">
                Erro ao carregar países
            </option>
        `;
    }
}

// Seleção de um país
selectBuscar.addEventListener("change", () => {
    const id = selectBuscar.value;
    pegaPais(id);
});

// Limpa todas as informações anteriores
function limparInformacoes() {
    document.querySelector("#bandeira").src = "";
    document.querySelector("#bandeira").alt = "";

    document.querySelector("#nome").textContent = "";
    document.querySelector("#capital").textContent = "";
    document.querySelector("#continente").textContent = "";
    document.querySelector("#populacao").textContent = "";
    document.querySelector("#area").textContent = "";
    document.querySelector("#moedas").textContent = "";
    document.querySelector("#idiomas").textContent = "";
    document.querySelector("#iso").textContent = "";
    document.querySelector("#telefone").textContent = "";
    document.querySelector("#fusoHorario").textContent = "";
    document.querySelector("#mapas").textContent = "";
    document.querySelector("#fronteiras").textContent = "";
}

// Busca as informações do país selecionado
async function pegaPais(id) {
    if (!id) return;

    limparInformacoes();

    try {
        const url = `https://countries.dev/alpha/${id}?full=true`;

        const resp = await fetch(url);

        if (!resp.ok) {
            throw new Error("Erro ao buscar as informações do país.");
        }

        const resposta = await resp.json();

        console.log("País selecionado:", resposta);

        bd = resposta;

        mostraInfo(bd);

        document.querySelector(".Main").style.display = "block";
    } catch (erro) {
        console.error("Erro ao carregar país:", erro);

        document.querySelector("#nome").textContent =
            "Não foi possível carregar as informações deste país.";

        document.querySelector(".Main").style.display = "block";
    }
}
// Mostra todas as informações do país
function mostraInfo(pais) {
    //bandeira
    const bandeira = document.querySelector("#bandeira");
    bandeira.src = pais.flags?.png || "";
    bandeira.alt = `Bandeira de ${pais.name || "país"}`;

    //nome do país
    const nome = document.querySelector("#nome");
    nome.innerHTML = `
        <p>
            <strong>Nome do país (Inglês):</strong>
            ${pais.name || "Não informado"}
        </p>

        <p>
            <strong>Nome nativo do país:</strong>
            ${pais.nativeName || "Não informado"}
        </p>
    `;

    // Capitais
    const capital = document.querySelector("#capital");

    capital.innerHTML = `
        <strong>Capital do país:</strong>
        ${pais.capital || "Não informado"}
    `;

    // Continentes
    const continente = document.querySelector("#continente");
    continente.innerHTML = `
        <strong>Continente:</strong>
        ${pais.region || "Não informado"}

        <br>

        <strong>Sub-região:</strong>
        ${pais.subregion || "Não informado"}
    `;

    // População
    const populacao = document.querySelector("#populacao");

    populacao.innerHTML = `
        <strong>População do país:</strong>
        ${
            pais.population?.toLocaleString("pt-BR") ||
            "Não informado"
        } pessoas
    `;

    // Área
    const area = document.querySelector("#area");

    area.innerHTML = `
        <strong>Área do país:</strong>
        ${
            pais.area?.toLocaleString("pt-BR") ||
            "Não informado"
        } km²
    `;

    // Moedas
    const moedas = document.querySelector("#moedas");
    const moedasDisponiveis = pais.currencies || [];

    const listaMoedas = moedasDisponiveis
        .map((moeda) => {
            const simbolo = moeda.symbol
                ? ` (${moeda.symbol})`
                : "";

            return `${moeda.name}${simbolo}`;
        })
        .join(", ");

    moedas.innerHTML = `
        <strong>Moeda(s) do país:</strong>
        ${listaMoedas || "Não informado"}
    `;

    // Idiomas
    const idiomas = document.querySelector("#idiomas");
    const idiomasDisponiveis = pais.languages || [];

    const listaIdiomas = idiomasDisponiveis
        .map((idioma) => idioma.name)
        .join(", ");

    idiomas.innerHTML = `
        <strong>Idioma(s) do país:</strong>
        ${listaIdiomas || "Não informado"}
    `;

    // Códigos ISO
    const iso = document.querySelector("#iso");

    iso.innerHTML = `
        <strong>Código ISO de 2 caracteres:</strong>
        ${pais.alpha2Code || "Não informado"}

        <br>

        <strong>Código ISO de 3 caracteres:</strong>
        ${pais.alpha3Code || "Não informado"}
    `;

    // Código telefônico internacional
    const telefone = document.querySelector("#telefone");

    const codigosTelefone = pais.callingCodes || [];

    telefone.innerHTML = `
        <strong>Código telefônico internacional:</strong>
        ${
            codigosTelefone.length
                ? codigosTelefone.map((codigo) => `+${codigo}`).join(", ")
                : "Não informado"
        }
    `;

    // Fusos horários
    const fusoHorario = document.querySelector("#fusoHorario");

    const fusos = pais.timezones || [];

    fusoHorario.innerHTML = `
        <strong>Fuso(s) horário(s):</strong>
        ${fusos.length ? fusos.join(", ") : "Não informado"}
    `;

    // Mapas
    const mapas = document.querySelector("#mapas");

    const googleMaps = pais.maps?.googleMaps;
    const openStreetMaps = pais.maps?.openStreetMaps;

    mapas.innerHTML = `
        <strong>Mapas:</strong>
        <br>

        ${
            googleMaps
                ? `<a href="${googleMaps}" target="_blank" rel="noopener noreferrer">
                    Ver no Google Maps
                </a>`
                : "Google Maps não disponível"
        }

        <br>

        ${
            openStreetMaps
                ? `<a href="${openStreetMaps}" target="_blank" rel="noopener noreferrer">
                    Ver no OpenStreetMap
                </a>`
                : "OpenStreetMap não disponível"
        }
    `;

    mostrarFronteiras(pais.borders || []);
}

// Mostra as fronteiras do país
async function mostrarFronteiras(codigosFronteiras) {
    const fronteiras = document.querySelector("#fronteiras");

    if (!codigosFronteiras || codigosFronteiras.length === 0) {
        fronteiras.textContent =
            "Este país não possui fronteiras terrestres.";
        return;
    }

    fronteiras.textContent = "Carregando fronteiras...";

    try {
        const promessas = codigosFronteiras.map(async (codigo) => {
            const url = `https://countries.dev/alpha/${codigo}`;

            const resp = await fetch(url);

            if (!resp.ok) {
                throw new Error(`Erro ao buscar a fronteira ${codigo}.`);
            }

            const paisFronteira = await resp.json();

            return {
                codigo,
                nome: paisFronteira.name || codigo
            };
        });

        const fronteirasEncontradas = await Promise.all(promessas);

        fronteiras.innerHTML = "";

        fronteirasEncontradas.forEach((paisFronteira) => {
            const item = document.createElement("span");

            item.className = "fronteiraItem";
            item.dataset.paisCode = paisFronteira.codigo;
            item.textContent = paisFronteira.nome;

            item.addEventListener("click", () => {
                selectBuscar.value = paisFronteira.codigo;
                pegaPais(paisFronteira.codigo);
            });

            fronteiras.appendChild(item);
        });
    } catch (erro) {
        console.error("Erro ao carregar fronteiras:", erro);

        fronteiras.textContent =
            "Não foi possível carregar as fronteiras.";
    }
}