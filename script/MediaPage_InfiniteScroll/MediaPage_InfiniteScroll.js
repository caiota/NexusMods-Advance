function LOAD_URL_PARAMS (count = 20) {
  const params = url.searchParams

   page = parseInt(params.get('page')) || 1

  maxPage = getMaxPages()
 if (!page || page < 1 && maxPage>0) {
    page = 2
    page = getAtualPage()
    params.set('page', page)
    history.replaceState(null, '', url.toString())
    count=40;
  }
  var offset = (page - 1) * count
  if(offset==0 && maxPage>0 ){
    offset=20;
    page = 1;
    params.set('page', page)
    history.replaceState(null, '', url.toString())
  }
  
  if(maxPage<=0){
     page = 1;
    params.set('page', page)
    history.replaceState(null, '', url.toString())
  }
  // ----- OUTROS PARÂMETROS -----
  const categoryNamesRaw = params.getAll('categoryName')

  const categories = categoryNamesRaw.length
    ? categoryNamesRaw.map(c => decodeURIComponent(c.replace(/\+/g, ' ')))
    : null
  const gameNameRaw = params.get('gameName')
  const gameName = gameNameRaw
    ? decodeURIComponent(gameNameRaw.replace(/\+/g, ' '))
    : getGameNameFromPage()

  let timeRange = params.get('timeRange') || "allTime"
  if(isNaN(timeRange)==true||timeRange=="NaN"){
    timeRange="allTime"
    params.set('timeRange', timeRange)
    history.replaceState(null, '', url.toString())
  }

  const titleRaw = params.get('title') || params.get('keyword')
  const keyword = titleRaw
    ? decodeURIComponent(titleRaw.replace(/\+/g, ' '))
    : null
  const sort = params.get('sort') || 'createdAt'
  const sortDirection = params.get('sortDirection') || 'DESC'
  const ShowAdultContent = params.get('showAdultContent') || null
  const OnlyAdultContent = params.get('adultContent') || null
  return {
    offset,
    page,
    gameName,
    timeRange,
    sort,
    sortDirection,
    categories,
    ShowAdultContent,
    OnlyAdultContent,
    keyword
  }
}
function getGameNameFromPage () {
  const links = document.querySelectorAll('a[href*="/games/"]')

  for (const a of links) {
    const span = a.querySelector('span')
    if (!span) continue

    const name = span.textContent.trim()
    if (name.length > 0) {
      return name
    }
  }

  return null
}

function timeRangeToTimestamp (days) {
  const now = Date.now()
  const past = now - days * 24 * 60 * 60 * 1000
  return Math.floor(past / 1000)
}
function getMaxPages () {
  const buttons = document
    .querySelector("nav[role='navigation']")
    ?.querySelectorAll("button[aria-label*='Go to page ']")

  const last = buttons?.[buttons.length - 1].innerText || 0
  return last
}
function getAtualPage () {
  if (!document.querySelector("nav[role='navigation']")) {
    return 1
  }
  const buttonsPages = document
    .querySelector("nav[role='navigation']")
    ?.querySelector("button[aria-current='true']")

  const atualpage = parseInt(buttonsPages.innerText)
  return atualpage
}

var url = new URL(window.location.href)
var page = -1
var loadedIDs = new Set()
var existingUrls = new Set();
var maxPage = -1
var FETCH_BUSY = false
var currentPage = 0


var BLOCK_REMOVE_INTERVAL;
var lastUrlNormalized = null;
function normalizeUrl(url) {
  const u = new URL(url);
  u.searchParams.delete("page"); // ignora paginação
  return u.pathname + "?" + u.searchParams.toString();
}

async function REMOVE_MEDIA() {
  const currentNormalized = normalizeUrl(window.location.href);

  if (!lastUrlNormalized) {
    lastUrlNormalized = currentNormalized;
    return;
  }

  const mediaGrid = document.querySelector("div.media-grid");
  if (!mediaGrid) return;

  const medias = mediaGrid.querySelectorAll("div[INFINTE_SCROLL_ITEM]");

  if (currentNormalized !== lastUrlNormalized) {

    medias.forEach((media, index) => {
        media.style.display = "none";
        media.remove();
      
    });
    
 loadedIDs = new Set()
 existingUrls = new Set();
    lastUrlNormalized = currentNormalized;
  }
}

async function GENERATE_INFINITE_SCROLL_MEDIA () {
  if (FETCH_BUSY == true) {
    console.warn('fetch busy')
    setTimeout(() => {
      FETCH_BUSY = false
    }, 500)
    return
  }
  try {
    canScroll = true
    FETCH_BUSY = true
    url = new URL(window.location.href)
    var {
      page: currentPage,
      offset,
      gameName,
      timeRange,
      sort,
      sortDirection,
      categories,
    ShowAdultContent,
    OnlyAdultContent,
    keyword
    } = LOAD_URL_PARAMS()

    if (currentPage > maxPage) {
      FETCH_BUSY = false
      return
    }

    clearInterval(BLOCK_REMOVE_INTERVAL)
BLOCK_REMOVE_INTERVAL=setInterval(async ()=>{await REMOVE_MEDIA();},20);

    if(currentPage==2&&offset==20){
      offset=40;
    }
    console.warn(
      `CARREGANDO PÁGINA ${currentPage} | OFFSET ${offset} | MaxPage ${maxPage} | PAGE ${currentPage} | gameName ${gameName} | timeRange ${timeRange} | sortDirection ${sortDirection} | Categories ${categories}`
    )
if (OnlyAdultContent == false || OnlyAdultContent == 'false') {
      adultContentFilter = [{ op: 'EQUALS', value: false }]
    } else if (ShowAdultContent == true || ShowAdultContent == 'true') {
      adultContentFilter = [{ op: 'EQUALS', value: true }]
    } else {
      adultContentFilter = []
    }
    const variables = {
      count: 20,
      offset,
      facets: {},
      filter: {
        adultContent: adultContentFilter,
        filter: [
          {
            op: 'OR',
            type: [{ op: 'EQUALS', value: 'image' }]
          }
        ],
        mediaStatus: [{ op: 'EQUALS', value: 'published' }],
        
        generalSearch: keyword
          ? [
              {
                op: 'WILDCARD',
                value: keyword
              }
            ]
          : []
      },
      sort: {
        createdAt: { direction: sortDirection }
      }
    }

    if (url.pathname.includes('/media')) {
      variables.filter.filter = [
        {
          op: 'OR',
          type: [
            { op: 'EQUALS', value: 'image' },
            { op: 'EQUALS', value: 'video' }
          ]
        }
      ]
    }
    if (url.pathname.includes('/supporterimages')) {
      variables.filter.filter[0].type[0].value = 'supporter_image'
    }

    if (categories && categories.length) {
      variables.facets.category = categories
    }
    if (sort) {
      variables.sort = [
        {
          [sort]: {
            direction: sortDirection
          }
        }
      ]
    }
    if (gameName) {
      variables.filter.filter.push({
        gameName: [{ op: 'EQUALS', value: gameName }],
        op: 'OR'
      })
    }

    if (timeRange&&timeRange!="allTime") {
      variables.filter.createdAt = [
        {
          op: 'GTE',
          value: String(timeRangeToTimestamp(parseInt(timeRange, 10)))
        }
      ]
    
    }

    const response = await fetch('https://api-router.nexusmods.com/graphql', {
      method: 'POST',
      headers: {
        accept: '*/*',
        'content-type': 'application/json',
        'x-graphql-operationname': 'ImagesMedia'
      },
      credentials: 'include',
      body: JSON.stringify({
        query: `
        query Media($count: Int, $facets: MediaFacet, $filter: MediaSearchFilter, $offset: Int, $sort: [MediaSearchSort!]) {
          media(
            count: $count
            facets: $facets
            filter: $filter
            offset: $offset
            sort: $sort
          ) {
            totalCount
            facetsData
            nodes {
              __typename
              ...MediaFragment
            }
          }
        }

        fragment MediaFragment on MediaUnion {
          __typename
          ...MediaImage
          ...MediaSupporterImage
          ...MediaVideo
        }

        fragment MediaImage on Image {
          game {
            domainName
            name
          }
          id
          mediaStatus
          owner { name }
          rating
          siteUrl
          title
          thumbnailUrl
          views
        }

        fragment MediaSupporterImage on SupporterImage {
          game { domainName name }
          id
          mediaStatus
          owner { name }
          rating
          siteUrl
          title
          thumbnailUrl
          views
        }

        fragment MediaVideo on Video {
          game { domainName name }
          id
          mediaStatus
          owner { name }
          rating
          siteUrl
          title
          thumbnailUrl
          views
        }
    `,
        variables,
        operationName: 'Media'
      })
    })

    const json = await response.json()
    const items = json.data?.media?.nodes || []

    const container = document.querySelector('div.media-grid')
     existingUrls = new Set(
      Array.from(container.querySelectorAll('a[href]')).map(a => a.href)
    )

    items.forEach(node => {
      const itemUrl = new URL(node.siteUrl, location.origin).href

      // 🔥 Já existe no DOM → ignora
      if (existingUrls.has(itemUrl)) return

      // 🔥 Já carregado por fetch anterior → ignora
      if (loadedIDs.has(node.id)) return

      loadedIDs.add(node.id)
      existingUrls.add(itemUrl)
      const card = createMediaTile({
        type: node.__typename,
        gameName: node.game?.name || '',
        gameUrl: 'https://www.nexusmods.com/' + (node.game?.domainName || ''),
        imageUrl: node.thumbnailUrl,
        itemUrl,
        title: node.title,
        author: node.owner?.name || 'Unknown',
        endorsements: node.rating || 0,
        views: node.views || 0
      })

      container.appendChild(card)
    })

    // ----- AVANÇA A PÁGINA -----
    const nextPage = currentPage + 1
    url.searchParams.set('page', nextPage)
    history.replaceState(null, '', url.toString())
    FETCH_BUSY = false
  } catch (err) {
    console.error('ERRO NO FETCH MEDIA:', err)
  } finally {
    FETCH_BUSY = false
  }
}

function createMediaTile (item) {
  const div = document.createElement('div')
  div.setAttribute('data-e2eid', 'media-tile');
  div.setAttribute("INFINTE_SCROLL_ITEM","YESSSSSSSSS")
  var videoPlay = '';
  if (item.type == 'Video') {
    videoPlay = `<span class="pointer-events-none absolute top-1/2 left-1/2 z-10 flex size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-stroke-subdued bg-translucent-dark-600 text-neutral-strong"><svg viewBox="0 0 24 24" role="presentation" style="width: 1.5rem; height: 1.5rem;"><path d="M8,5.14V19.14L19,12.14L8,5.14Z" style="fill: currentcolor;"></path></svg></span>
`
  }

  div.innerHTML = `
        <a class="hover-overlay relative block overflow-hidden rounded before:z-10 before:rounded"
            href="${item.itemUrl}">

            <div class="bg-surface-translucent-low group/image relative z-0 flex aspect-video items-center justify-center">
                <img alt="${item.title}" class="absolute z-2 max-h-full stretch_modImage"
                    src="${item.imageUrl}">
            </div>${videoPlay}
        </a>

        <div class="mt-2 space-y-1">

            <a class="nxm-link nxm-link-variant-secondary nxm-link-info typography-body-sm block truncate"
                href="${item.gameUrl}">
                ${item.gameName}
            </a>

            <a class="nxm-link nxm-link-variant-secondary nxm-link-strong typography-body-md block truncate"
                data-e2eid="media-tile-title" href="${item.itemUrl}">
                ${item.title}
            </a>

            <div class="flex items-center gap-x-2">

                <a class="nxm-link nxm-link-variant-secondary nxm-link-subdued typography-body-sm block truncate leading-4"
                    data-e2eid="media-tile-author" href=/profile/${item.author} target="_blank">
                    by ${item.author}
                </a>

                <span class="self-stretch border-r border-r-stroke-weak"></span>

                <div class="flex shrink-0 items-center gap-x-3">
                    <span>
                        <p class="typography-body-sm text-neutral-weak flex items-center gap-x-1 leading-4">
                        <svg viewBox="0 0 24 24" role="presentation" class="shrink-0" style="width: 1rem; height: 1rem;"><path d="M23,10C23,8.89 22.1,8 21,8H14.68L15.64,3.43C15.66,3.33 15.67,3.22 15.67,3.11C15.67,2.7 15.5,2.32 15.23,2.05L14.17,1L7.59,7.58C7.22,7.95 7,8.45 7,9V19A2,2 0 0,0 9,21H18C18.83,21 19.54,20.5 19.84,19.78L22.86,12.73C22.95,12.5 23,12.26 23,12V10M1,21H5V9H1V21Z" style="fill: currentcolor;"></path></svg>
                            <span data-e2eid="media-tile-endorsements">${item.endorsements}</span>
                        </p>
                    </span>

                    <span>
                        <p class="typography-body-sm text-neutral-weak flex items-center gap-x-1 leading-4">
                        <svg viewBox="0 0 24 24" role="presentation" class="shrink-0" style="width: 1rem; height: 1rem;"><path d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z" style="fill: currentcolor;"></path></svg>
                            <span data-e2eid="media-tile-views">${item.views}</span>
                        </p>
                    </span>
                </div>

            </div>

        </div>
    `

  return div
}
