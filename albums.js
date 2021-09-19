albumsLayout.SetBackColor(color.white);
albumsLayout.SetSize(1, 0.8);
albumsLayout.Hide();

    albumsLayoutAlbums.SetSize(1, 0.8);
    albumsLayout.AddChild(albumsLayoutAlbums);
    
        albumsList.SetTextColor1(color.primary);
        albumsList.SetTextColor2(color.listBody);
        albumsList.SetBackColor(color.white);
        albumsList.SetFontFile(font.fontMedium);
        albumsList.SetIconSize(35, "dp");
        albumsList.SetTextSize1(16);
        albumsList.SetTextSize2(14);
        albumsList.SetEllipsize("end");
        albumsList.SetDivider(0, color.white);
        albumsList.SetIconMargins(12.5, 5, 12.5, 5, "dp");
        albumsList.SetHiTextColor1(color.highlight);
        albumsList.SetHiTextColor2(color.highlight);
        albumsList.SetOnTouch( _albumsListOnTouch );
        albumsLayoutAlbums.AddChild(albumsList);
        
    albumScroll = app.CreateScroller( 1.0, 0.8);
    albumScroll.Hide();
    albumsLayout.AddChild(albumScroll);
 
        showAlbumsLayout = app.CreateLayout("Linear", "Left");
        showAlbumsLayout.SetBackColor( color.white );
        albumScroll.AddChild(showAlbumsLayout);
            
            //album art
            albumArt = app.CreateImage(_createRandomImage(), 1, -1, "fill");
            showAlbumsLayout.AddChild( albumArt );
            albumArt.SetPosition(0, 0.4);
            
            //album songs
            albumSongs = app.CreateList( "", 1, -1);
            albumSongs.SetTextColor1(color.primary);
            albumSongs.SetTextColor2(color.listBody);
            albumSongs.SetBackColor(color.white);
            albumSongs.SetFontFile(font.fontRegular);
            albumSongs.SetIconSize(35, "dp");
            albumSongs.SetTextSize1(16);
            albumSongs.SetTextSize2(14);
            albumSongs.SetEllipsize("end");
            albumSongs.SetDivider(0, color.white);
            albumSongs.SetIconMargins(12.5, 5, 12.5, 5, "dp");
            albumSongs.SetHiTextColor1(color.highlight);
            albumSongs.SetHiTextColor2(color.highlight);
            albumSongs.SetOnTouch( _albumSongsOnTouch );
            showAlbumsLayout.AddChild(albumSongs);
                
bodyLayout.AddChild(albumsLayout);

var listHeight = false;
function _albumsListOnTouch(title, body, type, index) {
    //Show album art.
    var albumId = albums[index].id;
    var setAlbumArt = media.GetAlbumArt( albumArt, albumId, "external" );  
    if(!setAlbumArt) {
        albumArt.SetImage( _createRandomImage());
    }
    albumArt.SetSize( 1, -1);
    
    forQueue = [];
    albumTitle+=" • "+title;
    titleTxt.SetText(title);
    albumScroll.Show();
    albumOpen = true;
    albumSongs.SetList("");
    //songsForQueue = "";
    for(var i = 0; i < songs.length; i++) {
        var item = songs[i];
        if(item.albumId == albumId) {
            forQueue.push(item);
            var min = Math.floor((Math.round(item.duration/1000)/60));
            var sec = (Math.round(item.duration/1000)) % 60;
            if(sec < 10)
                sec = "0"+sec;
            if(!min && !sec)
                dur = "00:01";
            else if(!min && sec)
                dur = "00:"+sec;
            else
                dur = min+":"+sec;
                
            var artist = "Unknown artist";
            if(item.artist != "<unknown>") {
                artist = item.artist;
            }
            //add song to music list
            albumSongs.AddItem(item.title, artist+" • "+dur, "Img/icon3.png");
    				//songsForQueue+=item.title+":"+artist+":null,";
    		if(!listHeight) {
    			listHeight = albumSongs.GetHeight();
    		}
        }
    }
    //app.ShowPopup(songsForQueue );
    //app.ShowPopup(listHeight);
    var lstHght = parseFloat(listHeight) * forQueue.length;
    albumSongs.SetSize(1, lstHght);
    numberOfSongs = forQueue.length;
    albumIndex = index;
    if(lstHght > 1) {
    	//setInterval( _albumScrollPos, 300 );
    }
}

function _albumSongsOnTouch(title, body, type, index) {
    _resetListTouches("albumlist");
    queueData = forQueue,
    currentIndex = index;
    player.SetFile( queueData[index].uri );
    this.SelectItemByIndex(index, false);
    albumsList.SelectItemByIndex(albumIndex, false);
    musicList.SelectItemByIndex(-1, false);
    artistsList.SelectItemByIndex(-1, false);
    _setSongTitle();
    _footerLeftLayoutOnTouchUp();
    queueFromSongs = false;
    app.SaveCookies();
}

function _albumScrollPos() {
    var y = albumScroll.GetScrollY();
    if(y > 0.1) {
    	headerDivider.Show();
    }
}