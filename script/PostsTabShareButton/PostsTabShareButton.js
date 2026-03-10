var bugwatcherTimer
function BugsWatcher () {
  if (options['SharePostsLinks'] === true && current_modTab === 'bugs') {
    const comments = document.querySelectorAll(
      'td.table-bug-title a.issue-title'
    )
    comments.forEach(item => {
      item.addEventListener('click', () => {
        clearTimeout(bugwatcherTimer)
        setTimeout(CREATE_POSTS_BUTTONS, 1000)
      })
    })
  }
}
var ITEM_LOAD_EXECUTED = false
var SCROLL_CLICK;
async function CREATE_POSTS_BUTTONS () {
  try {
    document
      .querySelector('div.pagination')
      ?.addEventListener('click', PAGINATION_WATCHER)
    const urlFix = new URL(SITE_URL)
    const params = new URLSearchParams(urlFix.search)

    // Determine a página atual
    const pages = Array.from(document.querySelectorAll('div.pagination ul li'))
    const selectedPage = pages.find(li => li.querySelector('a.page-selected'))
    page_atual = selectedPage ? Number(selectedPage.innerText.trim()) : 0

    if (options['SharePostsLinks'] === true && current_modTab === 'posts') {
      const comments = document.querySelectorAll(
        'div#comment-container-wrapper ol li.comment:not([BUTTONS_SET])'
      )

      // Role para um comentário específico, se necessário
      const jumpToCommentId = params.get('jump_to_comment')
      if (jumpToCommentId) {
        const commentElement = document.querySelector(
          `li#comment-${jumpToCommentId}`
        )

          if (commentElement) {
        clearTimeout(SCROLL_CLICK)
        SCROLL_CLICK = setTimeout(() => {
            const yOffset = -90
            const y =
              commentElement.getBoundingClientRect().top +
              window.pageYOffset +
              yOffset

            window.scrollTo({
              top: y,
              behavior: 'smooth'
            })

            PAGINATION_WATCHER()
            setTimeout(() => commentElement.classList.add('blink-once'), 800)
         
        }, 900)
         }
      }

      // Crie o botão de compartilhamento
      const shareUrl = `${
        urlFix.origin + urlFix.pathname
      }?tab=posts&jump_to_comment=`
      if (!hiddenInput) {
        hiddenInput = document.createElement('input')
        hiddenInput.id = 'hiddenInput_CopyData'
        document.body.prepend(hiddenInput)
      }

      comments.forEach(post => {
        const postId = post.id.replace('comment-', '')
        const postButtons = post.querySelector('div.comment-actions ul.actions')

        if (postButtons) {
          const tempUrl = `${shareUrl}${postId}&page=${page_atual}`
          const li = document.createElement('li')
          li.setAttribute('url', tempUrl)
          li.className = 'nexusAdvance_PostLI'

          const div = document.createElement('div')
          const copy_i = document.createElement('i')
          const copy_span = document.createElement('span')

          copy_i.className = 'fa-solid fa-copy'
          copy_i.setAttribute('aria-hidden', true)
          copy_span.id = 'copySpan_PostLI'
          copy_span.textContent = translate_strings.FastCopy_Comment.message

          div.appendChild(copy_i)
          div.appendChild(copy_span)

          div.addEventListener('mouseenter', () => {
            copy_span.style.display = 'block'
          })

          div.addEventListener('mouseleave', () => {
            copy_span.style.display = 'none'
          })

          li.appendChild(div)
          postButtons.prepend(li)

          li.addEventListener('click', ev => {
            const li_data = li.getAttribute('url')
            hiddenInput.value = li_data
            hiddenInput.style.left = `${ev.clientX + 20}px`
            hiddenInput.style.top = `${ev.clientY + 20}px`
            hiddenInput.style.display = 'block'
            hiddenInput.select()
            hiddenInput.setSelectionRange(0, 99999)

            navigator.clipboard
              .writeText(hiddenInput.value)
              .then(() => {
                hiddenInput.style.display = 'none'
                li.querySelector('i').style.opacity = '0.5'
                copy_span.innerText =
                  translate_strings.FastCopy_Comment.description
              })
              .catch(() => {
                hiddenInput.style.display = 'block'
              })
          })

          post.setAttribute('BUTTONS_SET', true)
        }
      })
    }
    //COPY LINK FUNCTION TO BUGS TAB
    if (options['SharePostsLinks'] === true && current_modTab === 'bugs') {
      setInterval(BugsWatcher, 500)
      const comments = document.querySelectorAll(
        'td.bug-comment div.comments li.comment:not([BUTTONS_SET])'
      )
      // Role para um comentário específico, se necessário
      const JumpToBugId = params.get('jump_to_bug')
      const JumpToBugFromItem = params.get('fromItem')
      if (JumpToBugId && JumpToBugFromItem && ITEM_LOAD_EXECUTED == false) {
        ITEM_LOAD_EXECUTED = true
        const fromItElement = document.querySelector(
          "tr[id*='issue_" +
            JumpToBugFromItem +
            "'] td.table-bug-title a.issue-title"
        )
        if (!fromItElement) {
          return
        }
        if (fromItElement) {
          if (!document.querySelector(`li[id*='-${JumpToBugId}'`)) {
            fromItElement.click()
          }
          clearTimeout(SCROLL_CLICK)
          SCROLL_CLICK = setTimeout(() => {
            var commentElement = document.querySelector(
              `li[id*='-${JumpToBugId}'`
            )
            if (!commentElement) {
              return
            }
            commentElement.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
              inline: 'nearest'
            })
            PAGINATION_WATCHER()
            setTimeout(() => commentElement.classList.add('blink-once'), 400)
          }, 1000)
        }
      }

      // Crie o botão de compartilhamento
      const shareUrl = `${
        urlFix.origin + urlFix.pathname
      }?tab=bugs&jump_to_bug=`
      if (!hiddenInput) {
        hiddenInput = document.createElement('input')
        hiddenInput.id = 'hiddenInput_CopyData'
        document.body.prepend(hiddenInput)
      }

      comments.forEach(post => {
        const postId = post.id.replace('comment-', '')

        const postPai =
          '&fromItem=' +
          post
            .closest('tr.mod-issue-row')
            .querySelector('td.table-bug-title a.issue-title')
            .getAttribute('id')
            .replace('issueClickLink_', '')
        const postButtons = post.querySelector('div.comment-actions ul.actions')

        if (postButtons) {
          const tempUrl =
            `${shareUrl}${postId}${postPai}` + '&page=' + page_atual
          const li = document.createElement('li')
          li.setAttribute(
            'url',
            tempUrl
              .replace('bug-reply-tile-', '')
              .replace('bug-issue-tile-', '')
          )
          li.className = 'nexusAdvance_PostLI'

          const div = document.createElement('div')
          const copy_i = document.createElement('i')
          const copy_span = document.createElement('span')

          copy_i.className = 'fa-solid fa-copy'
          copy_i.setAttribute('aria-hidden', true)
          copy_span.id = 'copySpan_PostLI'
          copy_span.textContent = translate_strings.FastCopy_Comment.message

          div.appendChild(copy_i)
          div.appendChild(copy_span)

          div.addEventListener('mouseenter', () => {
            copy_span.style.display = 'block'
          })

          div.addEventListener('mouseleave', () => {
            copy_span.style.display = 'none'
          })

          li.appendChild(div)
          postButtons.prepend(li)

          li.addEventListener('click', ev => {
            const li_data = li.getAttribute('url')
            hiddenInput.value = li_data
            hiddenInput.style.left = `${ev.clientX + 20}px`
            hiddenInput.style.top = `${ev.clientY + 20}px`
            hiddenInput.style.display = 'block'
            hiddenInput.select()
            hiddenInput.setSelectionRange(0, 99999)

            navigator.clipboard
              .writeText(hiddenInput.value)
              .then(() => {
                hiddenInput.style.display = 'none'
                li.querySelector('i').style.opacity = '0.5'
                copy_span.innerText =
                  translate_strings.FastCopy_Comment.description
              })
              .catch(() => {
                hiddenInput.style.display = 'block'
              })
          })

          post.setAttribute('BUTTONS_SET', true)
        }
      })
    }
  } catch (e) {
    console.log('Erro ao criar botões de postagem:')
    console.error(e)
  }
}

function PAGINATION_WATCHER () {
  const urlFix2 = new URL(window.location.href)
  const params2 = new URLSearchParams(urlFix2.search)

  const pages = Array.from(document.querySelectorAll('div.pagination ul li'))
  const selectedPage = pages.find(li => li.querySelector('a.page-selected'))
  page_atual2 = selectedPage ? Number(selectedPage.innerText.trim()) : 0
  params2.set('page', page_atual2)
  const newUrl2 = `${urlFix2.pathname}?${params2.toString()}`
  window.history.replaceState({}, '', newUrl2)
}
var FORCE_LOAD_PAGE = 0
async function PAGINATION_FIX () {
  if (document.querySelectorAll('div.pagination ul li')) {
    const urlFix = new URL(window.location.href)
    const params = new URLSearchParams(urlFix.search)
    const pages = Array.from(document.querySelectorAll('div.pagination ul li'))
    const selectedPage = pages.find(li => li.querySelector('a.page-selected'))
    page_atual = selectedPage ? Number(selectedPage.innerText.trim()) - 1 : 0

    // Atualize o parâmetro da página, se necessário
    if (params.get('page') && !pageAct) {
      clearTimeout(timerLoop)
      timerLoop = setTimeout(() => {
        pageAct = Number(params.get('page'))
        console.log('Página atual: ' + pageAct)

        var lastButton = pages.find(
          li => li.textContent.trim() === page_atual.toString()
        )
        if (lastButton) {
          lastButton.querySelector('a').click()
          FORCE_LOAD_PAGE = 1
        }

        params.set('page', pageAct)
        const newUrl = `${urlFix.pathname}?${params.toString()}`
        window.history.replaceState({}, '', newUrl)
      }, 500)
    }
    if (FORCE_LOAD_PAGE == 1) {
      pageAct = Number(params.get('page'))
      pageButton = pages.find(
        li => li.textContent.trim() === pageAct.toString()
      )
      if (pageButton) {
        pageButton.querySelector('a').click()
        PAGINATION_WATCHER()
        setTimeout(CREATE_POSTS_BUTTONS, 1000)
        FORCE_LOAD_PAGE = 2
      }
    }
  }
}
