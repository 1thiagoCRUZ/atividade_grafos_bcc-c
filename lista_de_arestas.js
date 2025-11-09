// Thiago Gabriel Silva Braga da Cruz | 2002246
// Vinícis Alves de Santana | 2002488

const readline = require('readline');

function criar_grafo() {
    const vertices = [];
    const arestas = [];
    return { vertices, arestas };
}

function inserir_vertice(vertices, vertice) {
    if (!vertices.includes(vertice)) {
        vertices.push(vertice);
        return true;
    }
    return false;
}

function existe_aresta(arestas, origem, destino) {
    return arestas.some(a => a[0] === origem && a[1] === destino);
}

function inserir_aresta(vertices, arestas, origem, destino, nao_direcionado = false) {
    inserir_vertice(vertices, origem);
    inserir_vertice(vertices, destino);

    if (!existe_aresta(arestas, origem, destino)) {
        arestas.push([origem, destino]);
    }

    if (nao_direcionado) {
        if (!existe_aresta(arestas, destino, origem)) {
            arestas.push([destino, origem]);
        }
    }
}

function remover_aresta(arestas, origem, destino, nao_direcionado = false) {
    const idx_frente = arestas.findIndex(a => a[0] === origem && a[1] === destino);
    if (idx_frente > -1) {
        arestas.splice(idx_frente, 1);
    }

    if (nao_direcionado) {
        const idx_inversa = arestas.findIndex(a => a[0] === destino && a[1] === origem);
        if (idx_inversa > -1) {
            arestas.splice(idx_inversa, 1);
        }
    }
}

function remover_vertice(vertices, arestas, vertice) {
    if (!vertices.includes(vertice)) {
        console.log(`Erro: Vértice '${vertice}' não encontrado.`);
        return false;
    }

    const idx_v = vertices.indexOf(vertice);
    if (idx_v > -1) {
        vertices.splice(idx_v, 1);
    }

    const arestas_filtradas = arestas.filter(a => a[0] !== vertice && a[1] !== vertice);
    
    arestas.length = 0;
    arestas.push(...arestas_filtradas);

    console.log(`Vértice '${vertice}' e suas arestas foram removidos.`);
    return true;
}

function vizinhos(vertices, arestas, vertice) {
    const vizinhos_set = new Set();
    
    for (const [o, d] of arestas) {
        if (o === vertice) {
            vizinhos_set.add(d);
        }
    }
    
    return Array.from(vizinhos_set);
}

function grau_vertices(vertices, arestas, nao_direcionado = false) {
    if (nao_direcionado) {
        const graus = {};
        for (const v of vertices) { graus[v] = 0; }
        
        for (const [o, d] of arestas) {
            if (graus[o] !== undefined) {
                graus[o]++;
            }
        }
        return graus;
    } else {
        const graus = {};
        for (const v of vertices) { 
            graus[v] = { 'in': 0, 'out': 0, 'total': 0 }; 
        }
        
        for (const [o, d] of arestas) {
            if (graus[o]) {
                graus[o]['out']++;
            }
            if (graus[d]) {
                graus[d]['in']++;
            }
        }
        
        for (const v in graus) {
            graus[v]['total'] = graus[v]['in'] + graus[v]['out'];
        }
        return graus;
    }
}

function percurso_valido(arestas, caminho) {
    if (caminho.length < 2) {
        return true;
    }

    for (let i = 0; i < caminho.length - 1; i++) {
        const u = caminho[i];
        const v = caminho[i + 1];

        if (!existe_aresta(arestas, u, v)) {
            return false;
        }
    }
    return true;
}

function listar_vizinhos(vertices, arestas, vertice) {
    if (!vertices.includes(vertice)) {
        console.log(`Vértice '${vertice}' não encontrado no grafo.`);
        return;
    }

    const lista_v = vizinhos(vertices, arestas, vertice);

    if (lista_v.length === 0) {
        console.log(`Vértice '${vertice}' não possui vizinhos (arestas de saída).`);
    } else {
        console.log(`Vizinhos de '${vertice}': ${lista_v.join(', ')}`);
    }
}

function exibir_grafo(vertices, arestas) {
    if (vertices.length === 0) {
        console.log("O grafo está vazio.");
        return;
    }
    
    const v_sorted = [...vertices].sort();
    console.log(`Vértices: ${v_sorted.join(', ')}`);
    
    console.log("Arestas:");
    if (arestas.length === 0) {
        console.log("  (Nenhuma)");
    } else {
        const a_sorted = [...arestas].sort();
        for (const [o, d] of a_sorted) {
            console.log(`  ${o} -> ${d}`);
        }
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
    const { vertices, arestas } = criar_grafo();
    
    const tipo_input = (await perguntar("O grafo será Não-Direcionado? (s/n): ")).trim().toLowerCase();
    const NAO_DIRECIONADO = (tipo_input === 's');
    
    if (NAO_DIRECIONADO) {
        console.log("\n--- Grafo Não-Direcionado (Lista de Arestas) Criado ---");
    } else {
        console.log("\n--- Grafo Direcionado (Lista de Arestas) Criado ---");
    }

    let rodando = true;
    while (rodando) {
        console.log("\n--- Menu de Opções (Lista de Arestas) ---");
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
                console.log("\n--- Grafo Atual (Lista de Arestas) ---");
                exibir_grafo(vertices, arestas);
                break;
            case '2':
                const v_inserir = (await perguntar("Nome do vértice a inserir: ")).trim();
                if (inserir_vertice(vertices, v_inserir)) {
                    console.log(`Vértice '${v_inserir}' inserido.`);
                } else {
                    console.log(`Vértice '${v_inserir}' já existe.`);
                }
                break;
            case '3':
                const o_inserir = (await perguntar("Vértice de origem: ")).trim();
                const d_inserir = (await perguntar("Vértice de destino: ")).trim();
                inserir_aresta(vertices, arestas, o_inserir, d_inserir, NAO_DIRECIONADO);
                if (NAO_DIRECIONADO) {
                    console.log(`Aresta ${o_inserir} <-> ${d_inserir} inserida.`);
                } else {
                    console.log(`Aresta ${o_inserir} -> ${d_inserir} inserida.`);
                }
                break;
            case '4':
                const v_remover = (await perguntar("Nome do vértice a remover: ")).trim();
                remover_vertice(vertices, arestas, v_remover);
                break;
            case '5':
                const o_remover = (await perguntar("Vértice de origem da aresta: ")).trim();
                const d_remover = (await perguntar("Vértice de destino da aresta: ")).trim();
                remover_aresta(arestas, o_remover, d_remover, NAO_DIRECIONADO);
                console.log(`Aresta entre ${o_remover} e ${d_remover} removida (se existia).`);
                break;
            case '6':
                const v_listar = (await perguntar("Listar vizinhos de qual vértice: ")).trim();
                listar_vizinhos(vertices, arestas, v_listar);
                break;
            case '7':
                const o_verificar = (await perguntar("Verificar origem: ")).trim();
                const d_verificar = (await perguntar("Verificar destino: ")).trim();
                if (existe_aresta(arestas, o_verificar, d_verificar)) {
                    console.log(`SIM, existe aresta ${o_verificar} -> ${d_verificar}.`);
                } else {
                    console.log(`NÃO, não existe aresta ${o_verificar} -> ${d_verificar}.`);
                }
                break;
            case '8':
                const graus = grau_vertices(vertices, arestas, NAO_DIRECIONADO);
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
                        console.log(`  ${v}: Saída=${d.saida}, Entrada=${d.in}, Total=${d.total}`);
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
                    if (percurso_valido(arestas, caminho_lista)) {
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