function LOAD_URL_MOD_PARAMS (count = 20) {
  const params = url.searchParams

  let page = parseInt(params.get('page')) || 1

  maxPage = getMaxPages()
  if (!page || page < 1 && maxPage>0) {
    page = 2
    page = getAtualPage()
    params.set('page', page)
    history.replaceState(null, '', url.toString())
    count=40;
  console.warn("MAX PAGES: "+maxPage)
  }
  var offset = (page - 1) * count
  if(offset==0 && maxPage>0){
    offset=20;
    page = 2;
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
  const tagsContainsraw = params.getAll('tag')

  const tagsContains = tagsContainsraw.length
    ? tagsContainsraw.map(c => decodeURIComponent(c.replace(/\+/g, ' ')))
    : null
  const tagsExcluderaw = params.getAll('excludedTag')

  const tagsExclude = tagsExcluderaw.length
    ? tagsExcluderaw.map(c => decodeURIComponent(c.replace(/\+/g, ' ')))
    : null
  const languageraw = params.getAll('languageName')

  const language = languageraw.length
    ? languageraw.map(c => decodeURIComponent(c.replace(/\+/g, ' ')))
    : null

  const titleRaw = params.get('title') || params.get('keyword')
  const title = titleRaw
    ? decodeURIComponent(titleRaw.replace(/\+/g, ' '))
    : null

  const descriptionRaw = params.get('description')
  const description = descriptionRaw
    ? decodeURIComponent(descriptionRaw.replace(/\+/g, ' '))
    : null

  const gameNameRaw = params.get('gameName')
  var gameName = gameNameRaw
    ? decodeURIComponent(gameNameRaw.replace(/\+/g, ' '))
    : getGameNameFromPage()
  if (gameName) {
    gameName = gameName.toLowerCase().trim().replaceAll(' ', '')
    checkFromGames=findBySimilarDomain(GAMES,gameName);
    if(checkFromGames){
      gameName=checkFromGames.domainName;
      console.log(checkFromGames)
    }
  }

  if (gameName == 'moddingtools') {
    gameName = 'site'
  }
  const rawTimeRange = params.get('timeRange') || 'allTime'
  let timeRange = parseTimeRange(rawTimeRange)

  if (isNaN(timeRange) == true || timeRange == 'NaN') {
    timeRange = 'allTime'
    params.set('timeRange', timeRange)
    history.replaceState(null, '', url.toString())
  }

  const sort = params.get('sort') || 'downloads'
  const sortDirection = params.get('sortDirection') || 'DESC'
  const ShowAdultContent = params.get('showAdultContent') || null
  const OnlyAdultContent = params.get('adultContent') || null
  const vortexSupport = params.get('supportsVortex') || null
  const onlyUpdatedMods = params.get('hasUpdated') || null
  return {
    offset,
    page,
    gameName,
    timeRange,
    sort,
    sortDirection,
    categories,
    tagsContains,
    tagsExclude,
    title,
    description,
    language,
    ShowAdultContent,
    OnlyAdultContent,
    vortexSupport,
    onlyUpdatedMods
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
function parseTimeRange (timeRange) {
  if (!timeRange || timeRange === 'allTime') {
    return null
  }

  // intervalo absoluto: 2025-12-24|2025-12-25
  if (timeRange.includes('|')) {
    const [start, end] = timeRange.split('|')

    const startUnix = dateToUnix(start, true) // início do dia
    const endUnix = dateToUnix(end, false) // fim do dia

    return {
      type: 'absolute',
      from: startUnix,
      to: endUnix
    }
  }

  // intervalo relativo (1, 7, 30…)
  const days = parseInt(timeRange, 10)
  if (!isNaN(days)) {
    return {
      type: 'relative',
      days
    }
  }

  return null
}
function dateToUnix (dateStr, startOfDay = true) {
  const date = new Date(dateStr + 'T00:00:00Z')

  if (!startOfDay) {
    date.setUTCHours(23, 59, 59, 999)
  }

  return Math.floor(date.getTime() / 1000)
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
    return 2
  }
  const buttonsPages = document
    .querySelector("nav[role='navigation']")
    ?.querySelector("button[aria-current='true']")

  const atualpage = parseInt(buttonsPages.innerText)
  return atualpage
}

var url = new URL(window.location.href)
var page = -1
var gameName
var timeRange
var sort
var sortDirection
const loadedIDsMods = new Set()
var maxPage = -1
var FETCH_BUSY = false
var timeRange2

let adultContentFilter = []

var BLOCK_REMOVE_INTERVAL;
var lastUrlNormalized = null;
function normalizeUrl(url) {
  const u = new URL(url);
  u.searchParams.delete("page"); // ignora paginação
  return u.pathname + "?" + u.searchParams.toString();
}

async function REMOVE_MODS() {
  const currentNormalized = normalizeUrl(window.location.href);

  if (!lastUrlNormalized) {
    lastUrlNormalized = currentNormalized;
    return;
  }

  const modGrid = document.querySelector("div.mods-grid");
  if (!modGrid) return;

  const mods = modGrid.querySelectorAll("div[INFINTE_SCROLL_ITEM]");

  if (currentNormalized !== lastUrlNormalized) {

    mods.forEach((mod, index) => {
        mod.style.display = "none";
        mod.remove();
      
    });

    lastUrlNormalized = currentNormalized;
  }
}


async function GENERATE_INFINITE_SCROLL_MODS () {
  if (FETCH_BUSY == true) {
    console.warn('fetch busy')
    setTimeout(() => {
      FETCH_BUSY = false
    }, 2000)
    return
  }
  try {
    canScroll = true
    FETCH_BUSY = true
    url = new URL(window.location.href)

    const {
      page: currentPage,
      offset,
      gameName,
      timeRange,
      sort,
      sortDirection,
      categories,
      tagsContains,
      tagsExclude,
      title,
      description,
      language,
      ShowAdultContent,
      OnlyAdultContent,
      vortexSupport,
      onlyUpdatedMods
    } = LOAD_URL_MOD_PARAMS()

    if (currentPage > maxPage || maxPage == 0) {
      FETCH_BUSY = false
      return
    }
    clearInterval(BLOCK_REMOVE_INTERVAL)
BLOCK_REMOVE_INTERVAL=setInterval(async ()=>{await REMOVE_MODS();},20);
    console.warn(
      `CARREGANDO PÁGINA ${currentPage} | OFFSET ${offset} | MaxPage ${maxPage} | gameName ${gameName} | timeRange ${timeRange} | sortDirection ${sortDirection} | Categories ${categories}`
    )
    console.warn(
      `tagContains ${tagsContains} | tagsExcluse ${tagsExclude} | title ${title} | description ${description} | languages ${language} | ShowAdultContent ${ShowAdultContent} | vortexSupport ${vortexSupport} | onlyUpdatedMods ${onlyUpdatedMods} | OnlyAdultContent ${OnlyAdultContent}`
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

      facets: {
        categoryName: categories || [],
        languageName: language || [],
        tag: tagsContains || []
      },

      filter: {
        filter: [],

        adultContent: adultContentFilter,

        gameDomainName: gameName
          ? [
              {
                op: 'EQUALS',
                value: gameName
              }
            ]
          : [],

        hasUpdated: onlyUpdatedMods
          ? [
              {
                op: 'EQUALS',
                value: Boolean(onlyUpdatedMods)
              }
            ]
          : [],
        supportsVortex: vortexSupport
          ? [
              {
                op: 'EQUALS',
                value: Boolean(vortexSupport)
              }
            ]
          : [],

        name: title
          ? [
              {
                op: 'WILDCARD',
                value: title
              }
            ]
          : []
      },

      postFilter: {
        tag: []
      },

      sort: {
        downloads: {
          direction: sortDirection
        }
      }
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
    if (description) {
      variables.filter.description = [
        {
          op: 'MATCHES',
          value: String(description)
        }
      ]
    }
    if (timeRange?.type === 'absolute') {
      variables.filter.filter.push({
        op: 'AND',
        createdAt: [
          { op: 'GTE', value: String(timeRange.from) },
          { op: 'LTE', value: String(timeRange.to) }
        ]
      })
    }

    if (timeRange?.type === 'relative') {
      const from = Math.floor((Date.now() - timeRange.days * 86400000) / 1000)

      variables.filter.filter.push({
        op: 'AND',
        createdAt: [{ op: 'GTE', value: String(from) }]
      })
    }

    if (tagsExclude) {
      variables.postFilter.tag = [
        {
          op: 'NOT_EQUALS',
          value: String(tagsExclude)
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
        query ModsListing($count: Int = 0, $facets: ModsFacet, $filter: ModsFilter, $offset: Int, $postFilter: ModsFilter, $sort: [ModsSort!]) {\n  mods(\n    count: $count\n    facets: $facets\n    filter: $filter\n    offset: $offset\n    postFilter: $postFilter\n    sort: $sort\n    viewUserBlockedContent: false\n  ) {\n    facetsData\n    nodes {\n      ...ModTileFragment\n    }\n    totalCount\n  }\n}\n    fragment ModTileFragment on Mod {\n  adultContent\n  createdAt\n  downloads\n  endorsements\n  fileSize\n  game {\n    domainName\n    id\n    name\n  }\n  modCategory {\n    categoryId\n    name\n  }\n  modId\n  name\n  status\n  summary\n  thumbnailUrl\n  thumbnailBlurredUrl\n  uid\n  updatedAt\n  uploader {\n    avatar\n    memberId\n    name\n  }\n  viewerDownloaded\n  viewerEndorsed\n  viewerTracked\n  viewerUpdateAvailable\n  viewerIsBlocked\n}`,
        variables,
        operationName: 'ModsListing'
      })
    })

    const json = await response.json()
    const items = json.data?.mods?.nodes || []

    const container = document.querySelector('div.mods-grid')
    const existingUrls = new Set(
      Array.from(
        container.querySelectorAll(
          'div.relative a[href][data-e2eid="mod-tile-title"]'
        )
      ).map(a => a.href)
    )
    items.forEach(node => {
      const itemUrl = `https://www.nexusmods.com/${node.game.domainName}/mods/${node.modId}`

      if (existingUrls.has(itemUrl)) return
      if (loadedIDsMods.has(node.modId)) return

      loadedIDsMods.add(node.modId)
      existingUrls.add(itemUrl)
      const item = mapNodeToModItem(node, Boolean(ShowAdultContent))
      const tile = createModTile(item, gameName)
      container.appendChild(tile)
    })

    // ----- AVANÇA A PÁGINA -----
    const nextPage = currentPage + 1
    url.searchParams.set('page', nextPage)
    history.replaceState(null, '', url.toString())
    FETCH_BUSY = false
    setTimeout(GET_VISIBLE_BLOCKS, 150)
  } catch (err) {
    console.error('ERRO NO FETCH MEDIA:', err)
  } finally {
    FETCH_BUSY = false
  }
}

function mapNodeToModItem (node, showAdult = false) {
  if (showAdult == null) {
    showAdult = false
  }
  const gameDomain = node.game.domainName
  return {
    // URLs
    gameUrl: `https://www.nexusmods.com/${gameDomain}`,
    gameName: `${node.game.name}`,
    itemUrl: `https://www.nexusmods.com/${gameDomain}/mods/${node.modId}`,
    imageUrl: node.thumbnailUrl,

    // Texto
    title: node.name,
    summary: node.summary,

    // Autor
    author: node.uploader.name,
    authorUrl: `https://www.nexusmods.com/profile/${node.uploader.name}`,
    authorAvatar: node.uploader.avatar,

    // Categoria
    categoryName: node.modCategory?.name ?? null,
    categoryUrl: node.modCategory
      ? `https://www.nexusmods.com/games/${gameDomain}/mods?categoryName=${encodeURIComponent(
          node.modCategory.name
        )}`
      : null,

    // Stats
    endorsements: formatNumber(node.endorsements),
    downloads: formatNumber(node.downloads),

    //Tamanho
    fileSize: formatFileSize(node.fileSize),
    // Datas (se quiser usar depois)
    createdAt: timeAgo(node.createdAt),
    updatedAt: timeAgo(node.updatedAt),

    // Flags úteis
    adultContent: node.adultContent,
    viewerDownloaded: !!node.viewerDownloaded,
    viewerUpdateAvailable: !!node.viewerUpdateAvailable
  }
}

function formatFileSize (kbytes, decimals = 1) {
  if (!kbytes || kbytes === 0) return '0 B'

  const bytes = kbytes * 1024

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))
  const value = bytes / Math.pow(k, i)

  return `${parseFloat(value.toFixed(dm))}${sizes[i]}`
}

function formatNumber (num) {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'm'
  if (num >= 1_000) return (num / 1_000).toFixed(1) + 'k'
  return String(num)
}

function timeAgo (dateInput) {
  const date = new Date(dateInput)
  const now = new Date()

  const seconds = Math.floor((now - date) / 1000)

  if (seconds < 60) return 'just now'

  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`

  const days = Math.floor(hours / 24)
  if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`

  const weeks = Math.floor(days / 7)
  if (weeks < 4) return `${weeks} week${weeks > 1 ? 's' : ''} ago`

  const months = Math.floor(days / 30)
  if (months < 12) return `${months} month${months > 1 ? 's' : ''} ago`

  const years = Math.floor(days / 365)
  return `${years} year${years > 1 ? 's' : ''} ago`
}

function createModTile (item, gameNameString) {
  const root = document.createElement('div')
  const downloadedBadgeHTML = item.viewerDownloaded
    ? `
  <div class="downloadedBadge absolute top-2.5 left-2.5 z-10 rounded bg-neutral-50 px-1.5 py-1 shadow-md">
    <span>
      <p class="typography-title-sm flex items-center gap-x-1 leading-4 text-neutral-inverted"
         data-e2eid="mod-tile-downloaded" style="display:inline-block;">
        <svg viewBox="0 0 24 24" role="presentation" class="shrink-0" style="width:1rem;height:1rem;display:inline">
          <path d="M21,5L9,17L3.5,11.5L4.91,10.09L9,14.17L19.59,3.59L21,5M3,21V19H21V21H3Z"
                style="fill:currentcolor;"></path>
        </svg>
        <span class="downloadedBadge-tooltip" style="display:inline;">
          ${item.viewerUpdateAvailable ? 'Update available' : ''}
        </span>
      </p>
    </span>
  </div>
  `
    : ''
  const adultHtml = item.adultContent
    ? `
<span class="bg-neutral-subdued inline-flex size-[3px] shrink-0 rotate-45 align-middle leading-normal mx-1.5 hidden @3xs/mod-tile:inline-flex"></span>
<span class="typography-body-sm text-danger-strong"><span>Adult</span></span>
`
    : ''
  const gameNameHtml = !gameNameString
    ? `
<a class="nxm-link nxm-link-variant-secondary nxm-link-moderate typography-body-sm inline" data-e2eid="mod-tile-game" href="${item.gameUrl}">${item.gameName}</a>
<span class="bg-neutral-subdued inline-flex size-[3px] shrink-0 rotate-45 align-middle leading-normal mx-1.5 hidden @3xs/mod-tile:inline-flex"></span>
`
    : ''
  root.className =
    '@container/mod-tile group/mod-tile bg-surface-mid flex min-h-108 flex-col rounded'
  root.setAttribute('data-e2eid', 'mod-tile')
  root.setAttribute('INFINTE_SCROLL_ITEM', 'yes_sir')

  root.innerHTML = `
<div class="relative">
  <a href="${item.itemUrl}">
    <div class="bg-surface-translucent-low group/image relative z-0 flex aspect-video items-center justify-center overflow-hidden rounded-t">
      <img
        alt="${item.title}"
        class="absolute z-2 max-h-full transition-transform group-hover/image:scale-105"
        src="${item.imageUrl}"
      >
    </div>
  </a>

  ${downloadedBadgeHTML}

<!-- CONTENT -->
<div class="px-3 pt-3 pb-5">
  <div class="divide-y divide-solid divide-stroke-weak">

    <!-- TITLE + AUTHOR -->
    <div class="space-y-1.5 pb-2">
      <a
        class="nxm-link nxm-link-variant-secondary nxm-link-moderate typography-body-lg line-clamp-2 font-semibold break-words"
        data-e2eid="mod-tile-title"
        href="${item.itemUrl}"
      >
        ${item.title}
      </a>

      <a
        class="nxm-link nxm-link-variant-secondary nxm-link-moderate typography-body-sm gap-x-1.5 flex"
        data-e2eid="user-link"
        href="${item.authorUrl}"
        target="_blank"
      >
        <img
          class="size-4 shrink-0 rounded-full"
          loading="lazy"
          src="${item.authorAvatar}"
        >
        <span class="truncate">${item.author}</span>
      </a>
    </div>

    <!-- CATEGORY -->
    <div class="flex flex-col space-y-0.5 py-2 leading-none @3xs/mod-tile:block @3xs/mod-tile:space-y-0">
    
        ${gameNameHtml}
      <a
        class="nxm-link nxm-link-variant-secondary nxm-link-moderate typography-body-sm inline"
        data-e2eid="mod-tile-category"
        href="${item.categoryUrl}"
      >
        ${item.categoryName} ${adultHtml}
      </a>
    </div>

    <!-- DATES -->
    <div class="flex flex-col gap-x-4 gap-y-1 py-2 @3xs/mod-tile:flex-row @3xs/mod-tile:gap-y-0">
      <p class="typography-body-sm text-neutral-subdued flex items-center gap-x-1" data-e2eid="mod-tile-updated">
       <svg viewBox="0 0 24 24" role="presentation" style="width: 1rem; height: 1rem;"><path d="M21,10.12H14.22L16.96,7.3C14.23,4.6 9.81,4.5 7.08,7.2C4.35,9.91 4.35,14.28 7.08,17C9.81,19.7 14.23,19.7 16.96,17C18.32,15.65 19,14.08 19,12.1H21C21,14.08 20.12,16.65 18.36,18.39C14.85,21.87 9.15,21.87 5.64,18.39C2.14,14.92 2.11,9.28 5.62,5.81C9.13,2.34 14.76,2.34 18.27,5.81L21,3V10.12M12.5,8V12.25L16,14.33L15.28,15.54L11,13V8H12.5Z" style="fill: currentcolor;"></path></svg>
        <span><time datetime="${item.updatedAt}">${item.updatedAt}</time></span>
      </p>

      <p class="typography-body-sm text-neutral-subdued flex items-center gap-x-1" data-e2eid="mod-tile-uploaded">
        <svg viewBox="0 0 24 24" role="presentation" style="width:1rem;height:1rem;">
          <path d="M9,16V10H5L12,3L19,10H15V16H9M5,20V18H19V20H5Z" style="fill:currentcolor;"></path>
        </svg>
        <span><time datetime="${item.createdAt}">${item.createdAt}</time></span>
      </p>
    </div>

    <!-- SUMMARY -->
    <div
      class="typography-body-sm text-neutral-subdued line-clamp-4 pt-2 break-words"
      data-e2eid="mod-tile-summary"
    >
      ${item.summary || ''}
      <br><br>
    </div>
  </div>
</div>

<!-- FOOTER -->
<div class="mt-auto flex min-h-8 items-center gap-x-4 rounded-b bg-surface-high px-3">
  <span>
    <p class="typography-body-sm text-neutral-moderate flex items-center gap-x-1 leading-4">
   <svg viewBox="0 0 24 24" role="presentation" class="shrink-0" style="width: 1rem; height: 1rem;"><path d="M23,10C23,8.89 22.1,8 21,8H14.68L15.64,3.43C15.66,3.33 15.67,3.22 15.67,3.11C15.67,2.7 15.5,2.32 15.23,2.05L14.17,1L7.59,7.58C7.22,7.95 7,8.45 7,9V19A2,2 0 0,0 9,21H18C18.83,21 19.54,20.5 19.84,19.78L22.86,12.73C22.95,12.5 23,12.26 23,12V10M1,21H5V9H1V21Z" style="fill: currentcolor;"></path></svg>
      <span data-e2eid="mod-tile-endorsements">${item.endorsements}</span>
    </p>
  </span>

  <span>
    <p class="typography-body-sm text-neutral-moderate flex items-center gap-x-1 leading-4">
      <svg viewBox="0 0 24 24" role="presentation" class="shrink-0" style="width:1rem;height:1rem;">
        <path d="M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z" style="fill:currentcolor;"></path>
      </svg>
      <span data-e2eid="mod-tile-downloads">${item.downloads}</span>
    </p>
  </span>

  <span>
    <p class="typography-body-sm text-neutral-moderate flex items-center gap-x-1 leading-4">
    <svg viewBox="0 0 24 24" role="presentation" class="shrink-0" style="width: 1rem; height: 1rem;"><path d="M4.90625 10.6887L7.30312 5.90188C7.43766 5.63114 7.64505 5.4033 7.90197 5.24398C8.1589 5.08465 8.45518 5.00016 8.7575 5H16.4925C16.7948 5.00016 17.0911 5.08465 17.348 5.24398C17.605 5.4033 17.8123 5.63114 17.9469 5.90188L20.3437 10.6887H4.90625ZM4.5 16.375V11.5H20.75V16.375C20.75 16.806 20.5788 17.2193 20.274 17.524C19.9693 17.8288 19.556 18 19.125 18H6.125C5.69402 18 5.2807 17.8288 4.97595 17.524C4.6712 17.2193 4.5 16.806 4.5 16.375ZM7.9375 13.9375C7.38522 13.9375 6.9375 14.3852 6.9375 14.9375C6.9375 15.4898 7.38522 15.9375 7.9375 15.9375H7.9475C8.49978 15.9375 8.9475 15.4898 8.9475 14.9375C8.9475 14.3852 8.49978 13.9375 7.9475 13.9375H7.9375ZM10.1875 14.9375C10.1875 14.3852 10.6352 13.9375 11.1875 13.9375H11.1975C11.7498 13.9375 12.1975 14.3852 12.1975 14.9375C12.1975 15.4898 11.7498 15.9375 11.1975 15.9375H11.1875C10.6352 15.9375 10.1875 15.4898 10.1875 14.9375Z" style="fill: currentcolor;"></path></svg>
      <span data-e2eid="mod-tile-file-size">${item.fileSize}</span>
    </p>
  </span>
</div>
  `

  return root
}
