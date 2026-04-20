async function DESCRIPTION_ONMOUSE (ignoreCurrentPage=false) {
  if (options['DescriptionOnMouse'] === true && (current_page =="only_mod_page" || ignoreCurrentPage == true)) {
    if (SITE_URL.indexOf('trackingcentre')) {
      var ALL_LINKS = document.querySelectorAll(
        'td.tracking-mod a:not([DESCRIPTION_CLICK])'
      )
    }
    {
      var ALL_LINKS = document.querySelectorAll('a:not([DESCRIPTION_CLICK])')
    }
    const links = Array.from(ALL_LINKS).filter(link =>
      /\/mods\/\d+/.test(link.href.replace(/#$/, ''))
    )

    let descriptionTimeout
    var game_id,game_name;
    for (const link of links) {
      link.addEventListener('mouseenter', async ev => {
        const currentModId = await extrairID(SITE_URL)
        const linkModId = await extrairID(link.href.replace(/#$/, ''));
        game_name=link.href.split("/mods/")[0].split(".com/")[1] || null;
        if(game_name==null){
          return;
        }
        if (SITE_URL.indexOf('trackingcentre') != -1) {
           game_id = ev.target
            .closest("tr[id*='tracked-mod-']")
            .getAttribute('id')
            .replace('tracked-mod-', '')
            .split('-')[0]
        }
        if (
          options['DescriptionOnMouse'] === true &&
          lastDescriptionID !== linkModId &&
          linkModId !== currentModId &&
          link.href.indexOf('/mods/' + pageID) == -1
        ) {
          clearTimeout(descriptionTimeout)
          descriptionTimeout = setTimeout(async () => {
            lastDescriptionID = linkModId
            if (
              linkModId &&
              current_modTab != 'images' &&
              current_modTab != 'videos' &&
              current_modTab != 'files'
            ) {
              if (SITE_URL.indexOf('trackingcentre') != -1) {
                console.log(`Carregando MOD ID ${linkModId} do jogo ${game_id}`)
                CREATE_MOD_DESCRIPTION(game_id, linkModId, 'descricao')
              } else {
                 game_id = GAMES.find(g => g.domainName === game_name)?.id;
                console.log(
                  `Carregando MOD ID ${linkModId} do jogo ${game_id}`
                )
                CREATE_MOD_DESCRIPTION(game_id, linkModId, 'descricao')
              }
            }
          }, 800)
        }
      })

      link.addEventListener('mouseleave', () => {
        lastDescriptionID = 0
        clearTimeout(descriptionTimeout)
      })

      link.setAttribute('DESCRIPTION_CLICK', true)
    }
  }
}
