//GLOBAL VARS :D
let SITE_URL = window.location.href;
var page_atual = 0;
var PAGINA_ATUAL = 0;
var gameID_Number=null;
var max_pages = 0;
var lastOptions = {};
var last_modTab = "";
var current_modTab = "description";
var current_page = "home_page";
var currentImageIndex = 0;
var modPreview_element = null;
var modPopup_element = null;
var modFiles_element = null;
var imageUrls = null;
var gameId = 0;
var offsetX, offsetY;
var isDragging = false;
let isThrottling = false;
var messageLoop = null;
var scrollPage = 1;
const NEXUS_WIDGET_GENERIC_URL="https://www.nexusmods.com/Core/Libs/Common/Widgets/";
const MOD_LIST_GENERIC_URL="https://www.nexusmods.com/Core/Libs/Common/Widgets/ModList";
var last24Hours = MOD_LIST_GENERIC_URL+"?RH_ModList=nav:false,home:false,type:0,user_id:0,game_id:" + gameId + ",advfilt:true,time:1,sort_by:date,show_game_filter:false,page_size:20"
var last30Days = MOD_LIST_GENERIC_URL+"?RH_ModList=nav:false,home:false,type:0,user_id:0,game_id:" + gameId + ",advfilt:true,time:30,sort_by:OLD_downloads,order:DESC,show_game_filter:false,page_size:20"
var lastWeek = MOD_LIST_GENERIC_URL+"?RH_ModList=nav:false,home:false,type:0,user_id:0,game_id:" + gameId + ",advfilt:true,time:7,sort_by:date,show_game_filter:false,page_size:20"
var popularAllTime = MOD_LIST_GENERIC_URL+"?RH_ModList=nav:false,home:false,type:0,user_id:0,game_id:" + gameId + ",advfilt:true,sort_by:OLD_downloads,order:DESC,show_game_filter:false,page_size:20"
var moreTrending = MOD_LIST_GENERIC_URL+"?RH_ModList=nav:false,home:false,type:0,user_id:0,game_id:" + gameId + ",advfilt:true,time:7,exclude_first_elements:0,sort_by:one_week_ratings,order:DESC,show_game_filter:false,page_size:20"
var trendingAllTime =  MOD_LIST_GENERIC_URL+"?RH_ModList=nav:false,home:false,type:0,user_id:0,game_id:" + gameId + ",advfilt:true,trackingCategory:,trackingAction:,sort_by:OLD_endorsements,order:DESC,page_size:20,show_game_filter:false,open:false,time:0,include_adult:false"
var recentUpdated = MOD_LIST_GENERIC_URL+"?RH_ModList=nav:false,home:false,type:0,user_id:0,game_id:" + gameId + ",advfilt:true,only_updated:true,sort_by:lastupdate,order:DESC,show_game_filter:false,page_size:20"
var searchLink = MOD_LIST_GENERIC_URL+"?RH_ModList=nav:false,home:false,type:0,user_id:0,game_id:" + gameId + ",advfilt:true,show_game_filter:false,page_size:20";
var TrackingMods_link = NEXUS_WIDGET_GENERIC_URL+"TrackedModsTab?RH_TrackedModsTab=id:0,page_size:20";
var TrackingAuthors_link = NEXUS_WIDGET_GENERIC_URL+"TrackedAuthorsTab/?game_id=0";
var TrackingComments_link = NEXUS_WIDGET_GENERIC_URL+"TrackedCommentsTab/?game_id=0";
var media_24Hours = NEXUS_WIDGET_GENERIC_URL+"MediaList?RH_MediaList=game_id:" + gameId + ",time:1,nav:true,page_size:20";
var media_30Days = NEXUS_WIDGET_GENERIC_URL+"MediaList?RH_MediaList=game_id:" + gameId + ",time:30,nav:true,page_size:20";
var media_thisWeek = NEXUS_WIDGET_GENERIC_URL+"MediaList?RH_MediaList=game_id:" + gameId + ",time:7,nav:true,page_size:20";
var media_AllTime = NEXUS_WIDGET_GENERIC_URL+"MediaList?RH_MediaList=game_id:1704,sort_by:views,order:DESC,nav:false,page_size:20";
var media_AllPages = NEXUS_WIDGET_GENERIC_URL+"MediaList?RH_MediaList=game_id:" + gameId + ",order:DESC,nav:false,page_size:20";
var videosAll = NEXUS_WIDGET_GENERIC_URL+"VideoList?RH_VideoList=user_id:0,nav:false,game_id:" + gameId + ",show_game_filter:false,page_size:16";

var pageAct = null;
var current_url = "#?";
var canScroll = true;
var lastDescriptionID = 0;
var pageID = 0;
var canScrollMore = false;
var GAME_DATA = [];
var WORD_LIST = [];
var HIDDEN_MODS = {};
var GALLERY = [];
let STILL_LOADING = true;
let GALLERY_STARTED = false;
var curPage = 1;
var maxPages1 = 1;
var maxPages2 = 1
var lastModPopID = 0;
var hiddenInput;
let Ignore_Requirements_maxTry = 90;

var translate_strings = {};
var options = [];

var GLOBAL_MOUSE_X, GLOBAL_MOUSE_Y;
var http_headers = {
  headers: {
    "accept": "text/html, */*; q=0.01",
    "accept-language": "pt-BR,pt;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
    "priority": "u=1, i",
    "sec-ch-ua": "\"Not/A)Brand\";v=\"8\", \"Chromium\";v=\"126\", \"Microsoft Edge\";v=\"126\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "x-requested-with": "XMLHttpRequest"
  },
  referrer: window.location.href,
  referrerPolicy: "strict-origin-when-cross-origin",
  method: "GET",
  mode: "cors",
  credentials: "include"
}
let NEED_OVERALLRELOAD = false;
let FLOATING_MENU_TIMER=null;
let NOTIFICATION_WAITER_TIMER=null;
let NOTIFICATION_OVERALL_LOOP=null;
let lastImgUrl = "";
let CURRENT_TAB = "all_itens";
let controller; 
var YOUTUBE_LOOP, NOTIFICATION_LOOP;
let NEED_UPDATE = true;
var searchDiv = null;
var notification_Element, count = 0;
let VIDEO_ID = 0;
let elementView = null;
var FIRST_IMAGE_POPUP = true;
var needMove = false;
var GAMES = [];
let gameMap;
var temp_gameID;
var lastImg = null;
var currentImg = null;
var funcLoop = null;
var postsTimeout;
var YOUTUBE_STATUS = 'lock';
var zoomLevel = 1.0;
let currentTargetNode = null;
var bodyObserver=null;
var GeneratorBusy = false;
var imgPopup = null;
var loop;
var timerLoop;
const timeoutMap = {};
var tempWindow = null;
let modBlocksTimeout;
let elementsToObserve = 0;
let observer;
const FAVORITE_GAMES = [];
let FLOATING_COMMENTS_LOOP = false;
let BUSY_LIST_REMAKE = false;
let PAUSE_GIFS_BUSY = false;
let divDetails;
let FILTERS_SET = false;
const gameElementsMap = new Map();
let STARTED = false;

let cachedGameCards = [];
let filterInput;
var excludedPaths = [
  "/mods/today",
  "/mods/thisweek",
  "/mods/popular/",
  "/mods/moretrending",
  "/mods/trending",
  "/mods/updated/",
  "/mods/popularalltime"
];
const unsupportedPaths = ["/mods/motm", "/mods/edit", "/mods/add"];
const changelogs_cache = {};
