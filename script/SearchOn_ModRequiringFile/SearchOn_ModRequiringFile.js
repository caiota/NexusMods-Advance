// Cache global melhorado
let requirementsCache = null;
let searchInProgress = false;
let lastSearch = '';
let currentSearchId = 0; // ID para controlar buscas
let activeChunkTimeout = null; // Para cancelar timeouts ativos

// Otimização: Indexar os dados para busca mais rápida
async function buildSearchIndex() {
    console.log("Processando chunks")
    const items = document.querySelectorAll(
        'dl.accordion table.desc-table td.table-require-name'
    );
    
    if (!items.length) return null;
    
    return Array.from(items).map(item => ({
        element: item,
        row: item.closest('tr'),
        text: item.innerText.toLowerCase(),
        words: item.innerText.toLowerCase().split(/\s+/).filter(w => w)
    }));
}

async function Search_RequiringFileTab() {
    try {
    let inicio2 = performance.now()
        if (
            current_page == 'only_mod_page' &&
            current_modTab == 'description' &&
            document.querySelector('div.accordionitems dl.accordion dt') &&
            !document.querySelector('input.Search_Bar')
        ) {
            const tables = document.querySelector(
                'div.accordionitems dl.accordion dt'
            );
            if (tables.innerText.toLowerCase() != 'requirements') {
                return;
            }
            
            clearSearchCache();
            // Pré-construir o índice quando a aba é carregada
            requirementsCache = await buildSearchIndex();
            
            var Search_1 = document.createElement('input');
            Search_1.setAttribute('type', 'text');
            Search_1.addEventListener('click', SearchCLick);

            const SearchMods_Debounced = debounce(inputEl => {
                SearchMods(inputEl.value);
            }, 300);

            Search_1.addEventListener('input', (e) => {
                // Cancelar busca anterior ao começar nova
                cancelCurrentSearch();
                SearchMods_Debounced(e.target);
            });

            Search_1.classList.add('Search_Bar');
            Search_1.setAttribute(
                'placeholder',
                translate_strings.searchRequerimentsTab.message
            );
            tables.append(Search_1);
            
    let fim2 = performance.now()
    let tempoExecucao3 = parseInt(fim2 - inicio2)
    console.log(`Search Setup executado em: ${tempoExecucao3} ms`)
        }
        
    } catch (e) {
        console.error('Error in Search_RequiringFileTab:', e);
    }
}

// Função para cancelar busca atual
function cancelCurrentSearch() {
    currentSearchId++; // Incrementa ID para invalidar busca anterior
    searchInProgress = false;
    
    // Cancelar qualquer timeout ativo
    if (activeChunkTimeout) {
        if ('requestIdleCallback' in window) {
            // Não podemos cancelar requestIdleCallback, mas podemos marcar como cancelado
        } else {
            clearTimeout(activeChunkTimeout);
        }
        activeChunkTimeout = null;
    }
}

// Função de busca otimizada
function SearchMods(value) {
    const SEARCH_STRING = value.toLowerCase().trim();
    
    // Se a busca for igual à anterior, não refazer
    if (SEARCH_STRING === lastSearch) return;
    lastSearch = SEARCH_STRING;
    
    // Se cache não existe, criar
    if (!requirementsCache) {
        requirementsCache = buildSearchIndex();
        if (!requirementsCache) return;
    }
    
    // Para busca vazia, mostrar tudo rapidamente
    if (SEARCH_STRING.length === 0) {
        cancelCurrentSearch();
        showAllRows();
        return;
    }
    
    // Usar requestAnimationFrame para busca mais suave
    requestAnimationFrame(() => {
        performSearch(SEARCH_STRING);
    });
}

function performSearch(searchString) {
    // Gerar novo ID para esta busca
    const thisSearchId = ++currentSearchId;
    
    // Cancelar buscas anteriores
    if (searchInProgress) {
        // Se já está em progresso, marcar a anterior como cancelada
    }
    
    searchInProgress = true;
    
    const searchWords = searchString.split(/\s+/).filter(w => w);
    const useExactMatch = searchString.includes('"') 
        ? searchString.match(/"([^"]+)"/)?.[1] 
        : null;
    
    // Se houver menos de 200 itens, busca síncrona é ok
    if (requirementsCache.length < 200) {
        // Verificar se ainda é a busca atual
        if (thisSearchId !== currentSearchId) return;
        
        processBatch(0, requirementsCache.length, searchString, searchWords, useExactMatch, thisSearchId);
        searchInProgress = false;
        return;
    }
    
    // Para muitos itens, usar chunks com melhor performance
    processInChunks(searchString, searchWords, useExactMatch, thisSearchId);
}

function processBatch(start, end, searchString, searchWords, useExactMatch, searchId) {
    // Verificar se esta busca ainda é válida
    if (searchId !== currentSearchId) return;
    
    for (let i = start; i < end && i < requirementsCache.length; i++) {
        const item = requirementsCache[i];
        
        if (useExactMatch) {
            // Busca exata com aspas
            item.row.style.display = item.text.includes(useExactMatch.toLowerCase()) 
                ? '' 
                : 'none';
        } else if (searchWords.length > 1) {
            // Busca com múltiplas palavras (AND lógico)
            const allWordsMatch = searchWords.every(word => 
                item.words.some(w => w.includes(word))
            );
            item.row.style.display = allWordsMatch ? '' : 'none';
        } else {
            // Busca simples
            item.row.style.display = item.text.includes(searchString) ? '' : 'none';
        }
    }
}

function processInChunks(searchString, searchWords, useExactMatch, searchId) {
    const chunkSize = 300;
    let index = 0;
    
    function processNextChunk() {
        // Verificar se esta busca ainda é válida
        if (searchId !== currentSearchId) {
            searchInProgress = false;
            return;
        }
        
        const start = index;
        const end = Math.min(index + chunkSize, requirementsCache.length);
        
        processBatch(start, end, searchString, searchWords, useExactMatch, searchId);
        
        index += chunkSize;
        
        if (index < requirementsCache.length) {
            // Usar idle callback para processar quando o navegador estiver ocioso
            if ('requestIdleCallback' in window) {
                activeChunkTimeout = requestIdleCallback(processNextChunk, { timeout: 100 });
            } else {
                activeChunkTimeout = setTimeout(processNextChunk, 0);
            }
        } else {
            searchInProgress = false;
            activeChunkTimeout = null;
        }
    }
    
    processNextChunk();
}

function showAllRows() {
    if (!requirementsCache) return;
    
    // Mostrar todos de uma vez
    for (const item of requirementsCache) {
        item.row.style.display = '';
    }
}

function SearchCLick(e) {
    e.stopPropagation();
}

function debounce(fn, delay) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), delay);
    };
}

// Limpar cache quando necessário (ex: ao sair da página)
function clearSearchCache() {
    cancelCurrentSearch();
    requirementsCache = null;
    lastSearch = '';
}