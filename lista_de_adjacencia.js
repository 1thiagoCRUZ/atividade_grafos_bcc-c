// Thiago Gabriel Silva Braga da Cruz | 2002246
// Vinícis Alves de Santana | 2002488

const readline = require('readline');

function criar_grafo() {
    return {};
}

function inserir_vertice(grafo, vertice) {
    if (!grafo[vertice]) {
        grafo[vertice] = [];
        return true;
    }
    return false;
}

function inserir_aresta(grafo, origem, destino, nao_direcionado = false) {
    inserir_vertice(grafo, origem);
    inserir_vertice(grafo, destino);

    if (!grafo[origem].includes(destino)) {
        grafo[origem].push(destino);
    }

    if (nao_direcionado) {
        if (!grafo[destino].includes(origem)) {
            grafo[destino].push(origem);
        }
    }
}

function vizinhos(grafo, vertice) {
    return grafo[vertice] || [];
}

function listar_vizinhos(grafo, vertice) {
    if (!grafo[vertice]) {
        console.log(`Vértice '${vertice}' não encontrado no grafo.`);
        return;
    }

    const lista_v = vizinhos(grafo, vertice);

    if (lista_v.length === 0) {
        console.log(`Vértice '${vertice}' não possui vizinhos.`);
    } else {
        console.log(`Vizinhos de '${vertice}': ${lista_v.join(', ')}`);
    }
}

function exibir_grafo(grafo) {
    const vertices = Object.keys(grafo);
    if (vertices.length === 0) {
        console.log("O grafo está vazio.");
        return;
    }

    vertices.sort();
    for (const vertice of vertices) {
        const lista_vizinhos_str = grafo[vertice].join(", ");
        console.log(`  ${vertice} -> [ ${lista_vizinhos_str} ]`);
    }
}

function remover_aresta(grafo, origem, destino, nao_direcionado = false) {
    if (grafo[origem]) {
        const idx = grafo[origem].indexOf(destino);
        if (idx > -1) {
            grafo[origem].splice(idx, 1);
        }
    }

    if (nao_direcionado) {
        if (grafo[destino]) {
            const idx = grafo[destino].indexOf(origem);
            if (idx > -1) {
                grafo[destino].splice(idx, 1);
            }
        }
    }
}

function remover_vertice(grafo, vertice) {
    if (!grafo[vertice]) {
        console.log(`Erro: Vértice '${vertice}' não encontrado.`);
        return false;
    }

    for (const v_atual of Object.keys(grafo)) {
        if (v_atual !== vertice && grafo[v_atual].includes(vertice)) {
            const idx = grafo[v_atual].indexOf(vertice);
            if (idx > -1) {
                grafo[v_atual].splice(idx, 1);
            }
        }
    }

    delete grafo[vertice];
    return true;
}

function existe_aresta(grafo, origem, destino) {
    return grafo[origem] && grafo[origem].includes(destino);
}

function grau_vertices(grafo) {
    const graus = {};
    const vertices = Object.keys(grafo);

    for (const v of vertices) {
        graus[v] = { 'in': 0, 'out': 0, 'total': 0 };
    }

    for (const u of vertices) {
        graus[u]['out'] = grafo[u].length;
        for (const v of vertices) {
            if (grafo[v].includes(u)) {
                graus[u]['in'] += 1;
            }
        }
    }

    for (const v of vertices) {
        graus[v]['total'] = graus[v]['in'] + graus[v]['out'];
    }

    return graus;
}

function percurso_valido(grafo, caminho) {
    if (caminho.length < 2) {
        return true;
    }

    for (let i = 0; i < caminho.length - 1; i++) {
        const origem = caminho[i];
        const destino = caminho[i + 1];

        if (!existe_aresta(grafo, origem, destino)) {
            return false;
        }
    }
    return true;
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function perguntar(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

async function main() {
    const g = criar_grafo();
    
    const tipo_input = await perguntar("O grafo será Não-Direcionado? (s/n): ");
    const NAO_DIRECIONADO = tipo_input.trim().toLowerCase() === 's';

    if (NAO_DIRECIONADO) {
        console.log("\n--- Grafo Não-Direcionado Criado ---");
    } else {
        console.log("\n--- Grafo Direcionado Criado ---");
    }

    let rodando = true;
    while (rodando) {
        console.log("\n--- Menu de Opções ---");
        console.log(" 1. Exibir Grafo");
        console.log(" 2. Inserir Vértice");
        console.log(" 3. Inserir Aresta");
        console.log(" 4. Remover Vértice");
        console.log(" 5. Remover Aresta");
        console.log(" 6. Listar Vizinhos de um Vértice");
        console.log(" 7. Verificar existência de Aresta");
        console.log(" 8. Exibir Graus dos Vértices");
        console.log(" 9. Verificar Percurso Válido");
        console.log(" 0. Sair");
        
        const escolha = (await perguntar("Escolha uma opção: ")).trim();

        switch (escolha) {
            case '1':
                console.log("\n--- Grafo Atual ---");
                exibir_grafo(g);
                break;
            case '2':
                const v_inserir = (await perguntar("Nome do vértice a inserir: ")).trim();
                if (inserir_vertice(g, v_inserir)) {
                    console.log(`Vértice '${v_inserir}' inserido.`);
                } else {
                    console.log(`Vértice '${v_inserir}' já existe.`);
                }
                break;
            case '3':
                const o_inserir = (await perguntar("Vértice de origem: ")).trim();
                const d_inserir = (await perguntar("Vértice de destino: ")).trim();
                inserir_aresta(g, o_inserir, d_inserir, NAO_DIRECIONADO);
                if (NAO_DIRECIONADO) {
                    console.log(`Aresta ${o_inserir} <-> ${d_inserir} inserida.`);
                } else {
                    console.log(`Aresta ${o_inserir} -> ${d_inserir} inserida.`);
                }
                break;
            case '4':
                const v_remover = (await perguntar("Nome do vértice a remover: ")).trim();
                if (remover_vertice(g, v_remover)) {
                    console.log(`Vértice '${v_remover}' e todas as suas arestas foram removidos.`);
                }
                break;
            case '5':
                const o_remover = (await perguntar("Vértice de origem da aresta: ")).trim();
                const d_remover = (await perguntar("Vértice de destino da aresta: ")).trim();
                remover_aresta(g, o_remover, d_remover, NAO_DIRECIONADO);
                console.log(`Aresta entre ${o_remover} e ${d_remover} removida (se existia).`);
                break;
            case '6':
                const v_listar = (await perguntar("Listar vizinhos de qual vértice: ")).trim();
                listar_vizinhos(g, v_listar);
                break;
            case '7':
                const o_verificar = (await perguntar("Verificar origem: ")).trim();
                const d_verificar = (await perguntar("Verificar destino: ")).trim();
                if (existe_aresta(g, o_verificar, d_verificar)) {
                    console.log(`SIM, existe aresta ${o_verificar} -> ${d_verificar}.`);
                } else {
                    console.log(`NÃO, não existe aresta ${o_verificar} -> ${d_verificar}.`);
                }
                break;
            case '8':
                const graus = grau_vertices(g);
                console.log("\n--- Graus dos Vértices ---");
                const verticesGraus = Object.keys(graus);
                if (verticesGraus.length === 0) {
                    console.log("Grafo vazio.");
                } else {
                    verticesGraus.sort();
                    for (const v of verticesGraus) {
                        const d = graus[v];
                        console.log(`  ${v}: Saída=${d.out}, Entrada=${d.in}, Total=${d.total}`);
                    }
                }
                break;
            case '9':
                const caminho_str = await perguntar("Digite o caminho (vértices separados por vírgula): ");
                const caminho_lista = caminho_str.split(',').map(v => v.trim()).filter(v => v);
                
                if (caminho_lista.length === 0) {
                    console.log("Caminho vazio.");
                } else {
                    const caminho_formatado = caminho_lista.join(" -> ");
                    if (percurso_valido(g, caminho_lista)) {
                        console.log(`O caminho '${caminho_formatado}' é VÁLIDO.`);
                    } else {
                        console.log(`O caminho '${caminho_formatado}' é INVÁLIDO.`);
                    }
                }
                break;
            case '0':
                rodando = false;
                console.log("Saindo...");
                break;
            default:
                console.log("Opção inválida. Tente novamente.");
        }
    }
    
    rl.close();
}

main();