async function GET_USER_FILTER_TRACKING(){
    try{
    const game_idTrack = document.querySelector("select#game_id").value;
    const sortByTrack = document.querySelector("select#sort_by").value;
    TrackingMods_link = "https://www.nexusmods.com/Core/Libs/Common/Widgets/TrackedModsTab?RH_TrackedModsTab=id:0,page_size:20,game_id:" + game_idTrack + ",sort_by:" + sortByTrack + ",page:" + PAGINA_ATUAL;
    current_url = TrackingMods_link;
  }catch(e){
    console.error("NexusMods Advance Error: "+e);
  }
}