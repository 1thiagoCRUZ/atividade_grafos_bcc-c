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
        if (adj.has(origem)) {
            adj.get(origem).push(destino);
        }
    }
    return adj;
}

function busca_em_profundidade(vertices, arestas, inicio) {
    if (!vertices.includes(inicio)) {
        return `o nó '${inicio}' não existe no grafo.`;
    }

    const adj = converter_para_mapa_adjacencia(vertices, arestas);
 
    const pilha = [inicio]; 
    const visitados = new Set();
    const ordem_visitacao = [];

    
    while (pilha.length > 0) {
        const u = pilha.pop();

        if (!visitados.has(u)) {
            visitados.add(u);
            ordem_visitacao.push(u);

            const vizinhos_u = adj.get(u) || [];

            for (let i = vizinhos_u.length - 1; i >= 0; i--) {
                const v = vizinhos_u[i];
                if (!visitados.has(v)) {
                    pilha.push(v); 
                }
            }
        }
    }
    
    return ordem_visitacao;
}

function menor_caminho_bfs(vertices, arestas, inicio, alvo) {
    if (!vertices.includes(inicio) || !vertices.includes(alvo)) {
        return `Erro: Nó de início '${inicio}' ou alvo '${alvo}' não existe no grafo.`;
    }

    if (inicio === alvo) {
        return [inicio];
    }
    
    const adj = converter_para_mapa_adjacencia(vertices, arestas);
    
    const fila = [inicio]; 
    const visitados = new Set([inicio]);
    const pais = new Map(); 

    let caminho_encontrado = false;
    while (fila.length > 0) {
        const u = fila.shift(); 
        
        if (u === alvo) {
            caminho_encontrado = true;
            break; 
        }

        const vizinhos_u = adj.get(u) || [];
        for (const v of vizinhos_u) {
            if (!visitados.has(v)) {
                visitados.add(v);
                fila.push(v);
                pais.set(v, u); 
            }
        }
    }

    
    if (!caminho_encontrado) {
        return `Caminho de ${inicio} para ${alvo} não encontrado.`;
    }
    
    const caminho = [];
    let atual = alvo;
    while (atual !== undefined) {
        caminho.push(atual);
        atual = pais.get(atual);
    }
    return caminho.reverse();
}
const grafo = criar_grafo();
grafo.vertices.push('A', 'B', 'C', 'D', 'E', 'F');
grafo.arestas.push(['A', 'B'], ['B', 'A']);
grafo.arestas.push(['A', 'C'], ['C', 'A']);
grafo.arestas.push(['B', 'D'], ['D', 'B']);
grafo.arestas.push(['C', 'E'], ['E', 'C']);
grafo.arestas.push(['D', 'F'], ['F', 'D']);
grafo.arestas.push(['E', 'F'], ['F', 'E']);


console.log("--- Busca em Largura ---");
console.log("\n## Busca em Profundidade");
const ordem_dfs = busca_em_profundidade(grafo.vertices, grafo.arestas, 'A');
console.log(`Aresta inicial: A`);
console.log(`Ordem de Visita: ${ordem_dfs.join(' -> ')}`);

console.log("\n## Busca de Menor Caminho ");
const inicio_bfs = 'A';
const alvo_bfs = 'F';

const caminho_menor = menor_caminho_bfs(grafo.vertices, grafo.arestas, inicio_bfs, alvo_bfs);

if (Array.isArray(caminho_menor)) {
    console.log(`Início: ${inicio_bfs}, Alvo: ${alvo_bfs}`);
    console.log(`Menor Caminho encontrado: ${caminho_menor.join(' -> ')}`);
    console.log(`Comprimento do Caminho (Arestas): ${caminho_menor.length - 1}`);
} else {
    console.log(caminho_menor); 
}
