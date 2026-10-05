var bugwatcherTimer;
var BUGS_WATCHER_RUNNING = false;
var PAGINATION_CLICK_WATCHER_SET = false;
function BugsWatcher() {
  if (
    options['SharePostsLinks'] !== true ||
    current_modTab !== 'bugs'
  ) {
    return;
  }

  for (const item of VISIBLE_ELEMENTS) {

    if (!item.isConnected) {
      VISIBLE_ELEMENTS.delete(item);
      continue;
    }

    if (
      !item.matches ||
      !item.matches('td.table-bug-title a.issue-title')
    ) {
      continue;
    }

    if (item.hasAttribute('BUG_WATCHER')) {
      continue;
    }

    item.addEventListener('click', () => {
      clearTimeout(bugwatcherTimer);

      bugwatcherTimer = setTimeout(() => {
        CREATE_POSTS_BUTTONS();
      }, 1000);
    });

    item.setAttribute('BUG_WATCHER', true);
  }
}
var ITEM_LOAD_EXECUTED = false
var SCROLL_CLICK;
var INFINITE_SCROLL_PAGE = 1;
var PAGINATION_UPDATE_PENDING = false;
function CREATE_POSTS_BUTTONS() {
   try {
      document.querySelector('div.pagination')?.addEventListener('click', ()=>{
        INFINITE_SCROLL_PAGE=-1;
        page_atual=0;
         
    PAGINATION_UPDATE_PENDING = true;
   });
     

      const urlFix = new URL(SITE_URL);
      const params = new URLSearchParams(urlFix.search);
      // Determina a página atual
      const pages = Array.from(document.querySelectorAll('div.pagination ul li'));
      const selectedPage = pages.find(li => li.querySelector('a.page-selected'));
      page_atual = selectedPage ? Number(selectedPage.innerText.trim()) : 0;
      
  if(INFINITE_SCROLL_PAGE>page_atual){
page_atual=INFINITE_SCROLL_PAGE;
  }
      // =========================================================
      // POSTS
      // =========================================================
      if (options['SharePostsLinks'] === true && current_modTab === 'posts') {
        BugsWatcher();
         const comments = [];
         // Pega somente os comentários presentes no VISIBLE_ELEMENTS
         // que ainda não foram processados.
         for (const post of VISIBLE_ELEMENTS) {
            if (!post.isConnected) {
               VISIBLE_ELEMENTS.delete(post);
               continue;
            }
            if (!post.matches || !post.matches('div#comment-container-wrapper ol li.comment')) {
               continue;
            }
            if (post.hasAttribute('BUTTONS_SET')) {
               continue;
            }
            comments.push(post);
         }
         // Role para um comentário específico, se necessário
         const jumpToCommentId = params.get('jump_to_comment');
         if (jumpToCommentId) {
            const commentElement = document.querySelector(`li#comment-${jumpToCommentId}`);
            if (commentElement) {
               clearTimeout(SCROLL_CLICK);
               SCROLL_CLICK = setTimeout(() => {
                  const y = commentElement.getBoundingClientRect().top + window.pageYOffset -100;
                  window.scrollTo({
                     top: y,
                     behavior: 'smooth'
                  });
                  PAGINATION_WATCHER();
                  setTimeout(() => {
                     commentElement.classList.add('blink-once');
                  }, 200);
               }, 300);
            }
         }
         // Cria URL de compartilhamento
         const shareUrl = `${urlFix.origin + urlFix.pathname}?tab=posts&jump_to_comment=`;
         // Cria input usado para copiar os links
         if (!hiddenInput) {
            hiddenInput = document.createElement('input');
            hiddenInput.id = 'hiddenInput_CopyData';
            document.body.prepend(hiddenInput);
         }
         // Cria os botões
         for (const post of comments) {
            try {
               const postId = post.id.replace('comment-', '');
               const postButtons = post.querySelector('div.comment-actions ul.actions');
               if (!postButtons) {
                  continue;
               }
               const tempUrl = `${shareUrl}${postId}&page=${page_atual}&NMA_page=${page_atual}`;
               const li = document.createElement('li');
               li.setAttribute('url', tempUrl);
               li.className = 'nexusAdvance_PostLI';
               const div = document.createElement('div');
               const copy_i = document.createElement('i');
               const copy_span = document.createElement('span');
               copy_i.className = 'fa-solid fa-copy';
               copy_i.setAttribute('aria-hidden', true);
               copy_span.id = 'copySpan_PostLI';
               copy_span.textContent = translate_strings.FastCopy_Comment.message;
               div.appendChild(copy_i);
               div.appendChild(copy_span);
               div.addEventListener('mouseenter', () => {
                  copy_span.style.display = 'block';
               });
               div.addEventListener('mouseleave', () => {
                  copy_span.style.display = 'none';
               });
               li.appendChild(div);
               postButtons.prepend(li);
               li.addEventListener('click', ev => {
                  const li_data = li.getAttribute('url');
                  hiddenInput.value = li_data;
                  hiddenInput.style.left = `${ev.clientX + 20}px`;
                  hiddenInput.style.top = `${ev.clientY + 20}px`;
                  hiddenInput.style.display = 'block';
                  hiddenInput.select();
                  hiddenInput.setSelectionRange(0, 99999);
                  navigator.clipboard.writeText(hiddenInput.value).then(() => {
                     hiddenInput.style.display = 'none';
                     li.querySelector('i').style.opacity = '0.5';
                     copy_span.innerText = translate_strings.FastCopy_Comment.description;
                  }).catch(() => {
                     hiddenInput.style.display = 'block';
                  });
               });
               // Só marca depois que o botão foi realmente criado
               post.setAttribute('BUTTONS_SET', true);
            } catch (e) {
               console.error('Erro ao criar botão de compartilhamento do comentário:', e);
            }
         }
      }
      // =========================================================
      // BUGS
      // =========================================================
      if (options['SharePostsLinks'] === true && current_modTab === 'bugs') {
        
         const comments = [];
         // Pega somente os comentários presentes no VISIBLE_ELEMENTS
         // que ainda não foram processados.
         for (const post of VISIBLE_ELEMENTS) {
            if (!post.isConnected) {
               VISIBLE_ELEMENTS.delete(post);
               continue;
            }
            if (!post.matches || !post.matches('td.bug-comment div.comments li.comment')) {
               continue;
            }
            if (post.hasAttribute('BUTTONS_SET')) {
               continue;
            }
            comments.push(post);
         }
         // Role para um comentário específico
         const JumpToBugId = params.get('jump_to_bug');
         const JumpToBugFromItem = params.get('fromItem');
         if (JumpToBugId && JumpToBugFromItem && ITEM_LOAD_EXECUTED === false) {
            ITEM_LOAD_EXECUTED = true;
            const fromItElement = document.querySelector("tr[id*='issue_" + JumpToBugFromItem + "'] td.table-bug-title a.issue-title");
            if (!fromItElement) {
               return;
            }
            if (!document.querySelector(`li[id*='-${JumpToBugId}']`)) {
               fromItElement.click();
            }
            clearTimeout(SCROLL_CLICK);
            SCROLL_CLICK = setTimeout(() => {
               const commentElement = document.querySelector(`li[id*='-${JumpToBugId}']`);
               if (!commentElement) {
                  return;
               }
               commentElement.scrollIntoView({
                  behavior: 'smooth',
                  block: 'center',
                  inline: 'nearest'
               });
               PAGINATION_WATCHER();
               setTimeout(() => {
                  commentElement.classList.add('blink-once');
               }, 400);
            }, 1000);
         }
         // Cria URL de compartilhamento
         const shareUrl = `${urlFix.origin + urlFix.pathname}?tab=bugs&jump_to_bug=`;
         // Cria input usado para copiar os links
         if (!hiddenInput) {
            hiddenInput = document.createElement('input');
            hiddenInput.id = 'hiddenInput_CopyData';
            document.body.prepend(hiddenInput);
         }
         // Cria os botões
         for (const post of comments) {
            try {
               const postId = post.id.replace('comment-', '');
               const issueRow = post.closest('tr.mod-issue-row');
               if (!issueRow) {
                  continue;
               }
               const issueTitle = issueRow.querySelector('td.table-bug-title a.issue-title');
               if (!issueTitle) {
                  continue;
               }
               const issueId = issueTitle.getAttribute('id')?.replace('issueClickLink_', '');
               if (!issueId) {
                  continue;
               }
               const postPai = '&fromItem=' + issueId;
               const postButtons = post.querySelector('div.comment-actions ul.actions');
               if (!postButtons) {
                  continue;
               }
               const tempUrl = `${shareUrl}${postId}${postPai}&page=${page_atual}`;
               const li = document.createElement('li');
               li.setAttribute('url', tempUrl.replace('bug-reply-tile-', '').replace('bug-issue-tile-', ''));
               li.className = 'nexusAdvance_PostLI';
               const div = document.createElement('div');
               const copy_i = document.createElement('i');
               const copy_span = document.createElement('span');
               copy_i.className = 'fa-solid fa-copy';
               copy_i.setAttribute('aria-hidden', true);
               copy_span.id = 'copySpan_PostLI';
               copy_span.textContent = translate_strings.FastCopy_Comment.message;
               div.appendChild(copy_i);
               div.appendChild(copy_span);
               div.addEventListener('mouseenter', () => {
                  copy_span.style.display = 'block';
               });
               div.addEventListener('mouseleave', () => {
                  copy_span.style.display = 'none';
               });
               li.appendChild(div);
               postButtons.prepend(li);
               li.addEventListener('click', ev => {
                  const li_data = li.getAttribute('url');
                  hiddenInput.value = li_data;
                  hiddenInput.style.left = `${ev.clientX + 20}px`;
                  hiddenInput.style.top = `${ev.clientY + 20}px`;
                  hiddenInput.style.display = 'block';
                  hiddenInput.select();
                  hiddenInput.setSelectionRange(0, 99999);
                  navigator.clipboard.writeText(hiddenInput.value).then(() => {
                     hiddenInput.style.display = 'none';
                     li.querySelector('i').style.opacity = '0.5';
                     copy_span.innerText = translate_strings.FastCopy_Comment.description;
                  }).catch(() => {
                     hiddenInput.style.display = 'block';
                  });
               });
               // Só marca depois que o botão foi realmente criado
               post.setAttribute('BUTTONS_SET', true);
            } catch (e) {
               console.error('Erro ao criar botão de compartilhamento do bug:', e);
            }
         }
      }
   } catch (e) {
      console.log('Erro ao criar botões de postagem:');
      console.error(e);
   }
}


function PAGINATION_WATCHER () {
  const urlFix2 = new URL(window.location.href)
  const params2 = new URLSearchParams(urlFix2.search)

  const pages = Array.from(document.querySelectorAll('div.pagination ul li'))
  const selectedPage = pages.find(li => li.querySelector('a.page-selected'))
  page_atual2 = selectedPage ? Number(selectedPage.innerText.trim()) : 0
  params2.set('page', page_atual2)
  params2.set('NMA_page', page_atual2)
  
ATUAL_PAGE=page_atual2
  const newUrl2 = `${urlFix2.pathname}?${params2.toString()}`
  window.history.replaceState({}, '', newUrl2)
}
var FORCE_LOAD_PAGE = 0
 function PAGINATION_FIX() {
    const urlFix = new URL(window.location.href);
    const params = new URLSearchParams(urlFix.search);

    const pageParam =
        params.get('NMA_page') || params.get('page') ;

    if (!pageParam || pageAct) {
        return;
    }

    const pageNumber = Number(pageParam);

    if (!Number.isInteger(pageNumber) || pageNumber < 1) {
        return;
    }

    clearTimeout(timerLoop);

    timerLoop = setTimeout(() => {

        console.log('Forçando página via Jump:', pageNumber);

        // Procura o botão/container do Jump
        const jump = document.querySelector(
            '#select2-page_t-container'
        );

        if (!jump) {
            console.log('Jump não encontrado.');
            return;
        }

jump.dispatchEvent(new MouseEvent('mousedown', {
    bubbles: true,
    cancelable: true,
    view: window
}));

        // Espera o Select2 criar o input
        let attempts = 0;

        const waitForInput = setInterval(() => {

            attempts++;

            const input = document.querySelector(
                'input.select2-search__field'
            );

            if (!input) {
                if (attempts >= 100) {
                    clearInterval(waitForInput);
                    console.log(
                        'Input do Jump não apareceu.'
                    );
                }

                return;
            }

            clearInterval(waitForInput);

            // Coloca o número da página
            input.focus();
            input.value = pageNumber;

            // Dispara input para o Select2 perceber a alteração
            input.dispatchEvent(
                new Event('input', {
                    bubbles: true
                })
            );

            // Enter
            input.dispatchEvent(
                new KeyboardEvent('keydown', {
                    key: 'Enter',
                    code: 'Enter',
                    keyCode: 13,
                    which: 13,
                    bubbles: true
                })
            );

            console.log(
                'Jump enviado para página:',
                pageNumber
            );
            pageAct = pageNumber;

        }, 50);

    }, 500);
}
