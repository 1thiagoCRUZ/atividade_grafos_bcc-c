// Thiago Gabriel Silva Braga da Cruz | 2002246
// Vinícis Alves de Santana | 2002488

const readline = require('readline');

function criar_grafo() {
    const matriz = [];
    const vertices = [];
    return { matriz, vertices };
}

function inserir_vertice(matriz, vertices, vertice) {
    if (vertices.includes(vertice)) {
        return false;
    }

    vertices.push(vertice);
    const n = vertices.length;

    for (const linha of matriz) {
        linha.push(0);
    }

    const nova_linha = Array(n).fill(0);
    matriz.push(nova_linha);

    return true;
}

function inserir_aresta(matriz, vertices, origem, destino, nao_direcionado = false) {
    inserir_vertice(matriz, vertices, origem);
    inserir_vertice(matriz, vertices, destino);

    const i = vertices.indexOf(origem);
    const j = vertices.indexOf(destino);

    matriz[i][j] = 1;

    if (nao_direcionado) {
        matriz[j][i] = 1;
    }
}

function remover_vertice(matriz, vertices, vertice) {
    if (!vertices.includes(vertice)) {
        console.log(`Erro: Vértice '${vertice}' não encontrado.`);
        return false;
    }

    const idx = vertices.indexOf(vertice);

    matriz.splice(idx, 1);

    for (const linha of matriz) {
        linha.splice(idx, 1);
    }

    vertices.splice(idx, 1);

    console.log(`Vértice '${vertice}' removido com sucesso.`);
    return true;
}

function remover_aresta(matriz, vertices, origem, destino, nao_direcionado = false) {
    if (!vertices.includes(origem) || !vertices.includes(destino)) {
        console.log("Erro: Vértice de origem ou destino não encontrado.");
        return;
    }

    const i = vertices.indexOf(origem);
    const j = vertices.indexOf(destino);

    matriz[i][j] = 0;

    if (nao_direcionado) {
        matriz[j][i] = 0;
    }

    console.log(`Aresta entre '${origem}' e '${destino}' removida.`);
}

function existe_aresta(matriz, vertices, origem, destino) {
    if (!vertices.includes(origem) || !vertices.includes(destino)) {
        return false;
    }

    const i = vertices.indexOf(origem);
    const j = vertices.indexOf(destino);

    return matriz[i][j] === 1;
}

function vizinhos(matriz, vertices, vertice) {
    const lista_vizinhos = [];

    if (!vertices.includes(vertice)) {
        return lista_vizinhos;
    }

    const i = vertices.indexOf(vertice);

    for (let j = 0; j < matriz[i].length; j++) {
        const conexao = matriz[i][j];
        if (conexao === 1) {
            lista_vizinhos.push(vertices[j]);
        }
    }

    return lista_vizinhos;
}

function grau_vertices(matriz, vertices, nao_direcionado = false) {
    const graus = {};
    const n = vertices.length;

    for (let i = 0; i < n; i++) {
        const nome_vertice = vertices[i];

        if (nao_direcionado) {
            const grau = matriz[i].reduce((acc, val) => acc + val, 0);
            graus[nome_vertice] = grau;
        } else {
            const grau_saida = matriz[i].reduce((acc, val) => acc + val, 0);
            
            let grau_entrada = 0;
            for (let k = 0; k < n; k++) {
                grau_entrada += matriz[k][i];
            }
            
            graus[nome_vertice] = {
                "saida": grau_saida,
                "entrada": grau_entrada,
                "total": grau_saida + grau_entrada
            };
        }
    }
    return graus;
}

function percurso_valido(matriz, vertices, caminho) {
    if (caminho.length < 2) {
        return true;
    }

    for (let i = 0; i < caminho.length - 1; i++) {
        const u = caminho[i];
        const v = caminho[i + 1];

        if (!existe_aresta(matriz, vertices, u, v)) {
            return false;
        }
    }
    return true;
}

function listar_vizinhos(matriz, vertices, vertice) {
    if (!vertices.includes(vertice)) {
        console.log(`Vértice '${vertice}' não encontrado no grafo.`);
        return;
    }

    const lista_v = vizinhos(matriz, vertices, vertice);

    if (lista_v.length === 0) {
        console.log(`Vértice '${vertice}' não possui vizinhos.`);
    } else {
        console.log(`Vizinhos de '${vertice}': ${lista_v.join(', ')}`);
    }
}

function exibir_grafo(matriz, vertices) {
    if (vertices.length === 0) {
        console.log("O grafo está vazio.");
        return;
    }

    const n = vertices.length;

    let header = "     ";
    for (const v of vertices) {
        header += v.padEnd(3, " ");
    }
    console.log(header);
    console.log("-".repeat(5 + n * 3));

    for (let i = 0; i < n; i++) {
        let linhaStr = `${vertices[i].padEnd(3, " ")} | `;
        for (let j = 0; j < n; j++) {
            linhaStr += String(matriz[i][j]).padEnd(3, " ");
        }
        console.log(linhaStr);
    }
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function perguntar(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

async function main() {
    const { matriz, vertices } = criar_grafo();
    
    const tipo_input = (await perguntar("O grafo será Não-Direcionado? (s/n): ")).trim().toLowerCase();
    const NAO_DIRECIONADO = (tipo_input === 's');
    
    if (NAO_DIRECIONADO) {
        console.log("\n--- Grafo Não-Direcionado (Matriz) Criado ---");
    } else {
        console.log("\n--- Grafo Direcionado (Matriz) Criado ---");
    }

    let rodando = true;
    while (rodando) {
        console.log("\n--- Menu de Opções (Matriz de Adjacência) ---");
        console.log(" 1. Exibir Grafo (Matriz)");
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
                console.log("\n--- Grafo Atual (Matriz de Adjacência) ---");
                exibir_grafo(matriz, vertices);
                break;
            case '2':
                const v_inserir = (await perguntar("Nome do vértice a inserir: ")).trim();
                if (inserir_vertice(matriz, vertices, v_inserir)) {
                    console.log(`Vértice '${v_inserir}' inserido.`);
                } else {
                    console.log(`Vértice '${v_inserir}' já existe.`);
                }
                break;
            case '3':
                const o_inserir = (await perguntar("Vértice de origem: ")).trim();
                const d_inserir = (await perguntar("Vértice de destino: ")).trim();
                inserir_aresta(matriz, vertices, o_inserir, d_inserir, NAO_DIRECIONADO);
                if (NAO_DIRECIONADO) {
                    console.log(`Aresta ${o_inserir} <-> ${d_inserir} inserida.`);
                } else {
                    console.log(`Aresta ${o_inserir} -> ${d_inserir} inserida.`);
                }
                break;
            case '4':
                const v_remover = (await perguntar("Nome do vértice a remover: ")).trim();
                remover_vertice(matriz, vertices, v_remover);
                break;
            case '5':
                const o_remover = (await perguntar("Vértice de origem da aresta: ")).trim();
                const d_remover = (await perguntar("Vértice de destino da aresta: ")).trim();
                remover_aresta(matriz, vertices, o_remover, d_remover, NAO_DIRECIONADO);
                break;
            case '6':
                const v_listar = (await perguntar("Listar vizinhos de qual vértice: ")).trim();
                listar_vizinhos(matriz, vertices, v_listar);
                break;
            case '7':
                const o_verificar = (await perguntar("Verificar origem: ")).trim();
                const d_verificar = (await perguntar("Verificar destino: ")).trim();
                if (existe_aresta(matriz, vertices, o_verificar, d_verificar)) {
                    console.log(`SIM, existe aresta ${o_verificar} -> ${d_verificar}.`);
                } else {
                    console.log(`NÃO, não existe aresta ${o_verificar} -> ${d_verificar}.`);
                }
                break;
            case '8':
                const graus = grau_vertices(matriz, vertices, NAO_DIRECIONADO);
                console.log("\n--- Graus dos Vértices ---");
                const vNomes = Object.keys(graus);

                if (vNomes.length === 0) {
                    console.log("Grafo vazio.");
                } else if (NAO_DIRECIONADO) {
                    vNomes.sort();
                    for (const v of vNomes) {
                        console.log(`  ${v}: Grau = ${graus[v]}`);
                    }
                } else {
                    vNomes.sort();
                    for (const v of vNomes) {
                        const d = graus[v];
                        console.log(`  ${v}: Saída=${d.saida}, Entrada=${d.entrada}, Total=${d.total}`);
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
                    if (percurso_valido(matriz, vertices, caminho_lista)) {
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