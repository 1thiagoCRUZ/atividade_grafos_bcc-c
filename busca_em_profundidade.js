function criar_grafo() {
    const vertices = [];
    const arestas = [];
    return { vertices, arestas };
}

function converter_para_mapa_adjacencia(vertices, arestas) {
    const adj = new Map();
    for (const v of vertices) {
        adj.set(v, []);
    }
    for (const [origem, destino] of arestas) {
        if (adj.has(origem)) adj.get(origem).push(destino);
    }
    return adj;
}

function busca_em_profundidade(vertices, arestas, inicio) {
    if (!vertices.includes(inicio)) return [`Erro: Nó '${inicio}' não existe.`];

    const adj = converter_para_mapa_adjacencia(vertices, arestas);
    const pilha = [inicio];
    const visitados = new Set();
    const ordem_visitacao = [];

    while (pilha.length > 0) {
        const u = pilha.pop();

        if (!visitados.has(u)) {
            visitados.add(u);
            ordem_visitacao.push(u);
            const vizinhos = adj.get(u) || [];
            for (const v of vizinhos) {
                if (!visitados.has(v)) {
                    pilha.push(v);
                }
            }
        }
    }
    return ordem_visitacao;
}

function detectar_ciclos(vertices, arestas) {
    const adj = converter_para_mapa_adjacencia(vertices, arestas);
    const visitados_geral = new Set();
    const ciclosEncontrados = []; 
    const mapaPais = new Map(); 

    function verificar_componente(inicio) {
        const pilha = [{ vertice: inicio, pai: null }];
        const visitados_locais = new Set();

        while (pilha.length > 0) {
            const { vertice: u, pai: p } = pilha.pop();

            if (!visitados_locais.has(u)) {
                visitados_locais.add(u);
                visitados_geral.add(u);
                if (p !== null) mapaPais.set(u, p);

                const vizinhos = adj.get(u) || [];

                for (const v of vizinhos) {
                    const ja_visitado = visitados_locais.has(v);
                    
                    if (!ja_visitado) {
                        pilha.push({ vertice: v, pai: u });
                    } else {
                        if (v !== p) {
                            let caminhoCiclo = [];
                            let atual = u;
                            
                            while (atual !== v && atual !== undefined) {
                                caminhoCiclo.push(atual);
                                atual = mapaPais.get(atual);
                            }
                            caminhoCiclo.push(v); 
                            caminhoCiclo.reverse(); 
                            caminhoCiclo.push(v); 
                            
                            ciclosEncontrados.push(caminhoCiclo.join(' -> '));
                        }
                    }
                }
            }
        }
    }

    for (const v of vertices) {
        if (!visitados_geral.has(v)) {
            verificar_componente(v);
        }
    }

    if (ciclosEncontrados.length > 0) {
        console.log(`Foram encontrados ${ciclosEncontrados.length} ciclo(s).`);
        console.log("Ciclos identificados:");
        ciclosEncontrados.forEach((ciclo, index) => {
            console.log(`  ${index + 1}. ${ciclo}`);
        });
    } else {
        console.log("Não encontrou nenhum ciclo.");
    }
}


const grafoComCiclo = criar_grafo();
grafoComCiclo.vertices.push('A', 'B', 'C', 'D', 'E', 'F');
grafoComCiclo.arestas.push(['A', 'B'], ['B', 'A']);
grafoComCiclo.arestas.push(['A', 'C'], ['C', 'A']);
grafoComCiclo.arestas.push(['B', 'D'], ['D', 'B']);
grafoComCiclo.arestas.push(['C', 'E'], ['E', 'C']);
grafoComCiclo.arestas.push(['D', 'F'], ['F', 'D']);
grafoComCiclo.arestas.push(['E', 'F'], ['F', 'E']); 

console.log("\n###Busca em Profundidade Padrão (Ordem de Visita)");
const resultadoBusca = busca_em_profundidade(grafoComCiclo.vertices, grafoComCiclo.arestas, 'A');
console.log(`Ordem percorrida partindo de A: ${resultadoBusca.join(' -> ')}`);

console.log("\n###Detecção de Ciclos (Grafo COM Ciclos)");
detectar_ciclos(grafoComCiclo.vertices, grafoComCiclo.arestas);

console.log("\n###Detecção de Ciclos (Grafo SEM Ciclos)");
const grafoSemCiclo = criar_grafo();
grafoSemCiclo.vertices.push('A', 'B', 'C', 'D', 'E', 'F');
grafoSemCiclo.arestas.push(['A', 'B'], ['B', 'A']);
grafoSemCiclo.arestas.push(['A', 'C'], ['C', 'A']);
grafoSemCiclo.arestas.push(['B', 'D'], ['D', 'B']);
grafoSemCiclo.arestas.push(['C', 'E'], ['E', 'C']);
grafoSemCiclo.arestas.push(['D', 'F'], ['F', 'D']);

detectar_ciclos(grafoSemCiclo.vertices, grafoSemCiclo.arestas);