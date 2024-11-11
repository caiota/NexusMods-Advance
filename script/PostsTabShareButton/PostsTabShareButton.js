async function CREATE_POSTS_BUTTONS() {
    try {
        if (options['SharePostsLinks'] === true && current_modTab === "posts") {
            const comments = document.querySelectorAll("div#comment-container-wrapper ol li.comment:not([BUTTONS_SET])");
            const urlFix = new URL(SITE_URL);
            const params = new URLSearchParams(urlFix.search);

            // Determine a página atual
            const pages = Array.from(document.querySelectorAll("div.pagination ul li"));
            const selectedPage = pages.find(li => li.querySelector('a.page-selected'));
            page_atual = selectedPage ? Number(selectedPage.innerText.trim()) - 1 : 0;

            // Atualize o parâmetro da página, se necessário
            if (params.get('page') && !pageAct) {
                clearTimeout(timerLoop);
                timerLoop = setTimeout(() => {
                    pageAct = Number(params.get('page')) + 1;
                    console.log("Página atual: " + pageAct);

                    const pageButton = pages.find(li => li.textContent.trim() === pageAct.toString());
                    if (pageButton) {
                        pageButton.querySelector("a").click();
                    }

                    params.set('page', pageAct);
                    const newUrl = `${urlFix.pathname}?${params.toString()}`;
                    window.history.replaceState({}, '', newUrl);
                }, 2000);
            }

            // Role para um comentário específico, se necessário
            const jumpToCommentId = params.get('jump_to_comment');
            if (jumpToCommentId) {
                const commentElement = document.querySelector(`li#comment-${jumpToCommentId}`);
                if (commentElement) {
                    commentElement.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
                    setTimeout(() => commentElement.classList.add('blink-once'), 500);
                }
            }

            // Crie o botão de compartilhamento
            const shareUrl = `${urlFix.origin + urlFix.pathname}?tab=posts&jump_to_comment=`;
            if (!hiddenInput) {
                hiddenInput = document.createElement("input");
                hiddenInput.id = "hiddenInput_CopyData";
                document.body.prepend(hiddenInput);
            }

            comments.forEach(post => {
                const postId = post.id.replace("comment-", "");
                const postButtons = post.querySelector("div.comment-actions ul.actions");

                if (postButtons) {
                    const tempUrl = `${shareUrl}${postId}&page=${page_atual}`;
                    const li = document.createElement("li");
                    li.setAttribute("url", tempUrl);
                    li.className = "nexusAdvance_PostLI";

                    const div = document.createElement("div");
                    const copy_i = document.createElement("i");
                    const copy_span = document.createElement("span");

                    copy_i.className = 'fa-solid fa-copy';
                    copy_i.setAttribute("aria-hidden", true);
                    copy_span.id = 'copySpan_PostLI';
                    copy_span.textContent = translate_strings.FastCopy_Comment.message;

                    div.appendChild(copy_i);
                    div.appendChild(copy_span);

                    div.addEventListener("mouseenter", () => {
                        copy_span.style.display = 'block';
                    });

                    div.addEventListener("mouseleave", () => {
                        copy_span.style.display = 'none';
                    });

                    li.appendChild(div);
                    postButtons.prepend(li);

                    li.addEventListener("click", (ev) => {
                        const li_data = li.getAttribute("url");
                        hiddenInput.value = li_data;
                        hiddenInput.style.left = `${ev.clientX + 20}px`;
                        hiddenInput.style.top = `${ev.clientY + 20}px`;
                        hiddenInput.style.display = 'block';
                        hiddenInput.select();
                        hiddenInput.setSelectionRange(0, 99999);

                        navigator.clipboard.writeText(hiddenInput.value).then(() => {
                            hiddenInput.style.display = 'none';
                            li.querySelector("i").style.opacity = "0.5"
                            copy_span.innerText = translate_strings.FastCopy_Comment.description;
                        }).catch(() => {
                            hiddenInput.style.display = 'block';
                        });
                    });

                    post.setAttribute("BUTTONS_SET", true);
                }
            });
        }
    } catch (e) {
        console.log("Erro ao criar botões de postagem:");
        console.error(e);
        console.error("NexusMods Advance Error:" + E);
    }
}