artistsLayout.SetBackColor("#f5f5f5");
artistsLayout.SetSize(1, 0.8);
artistsLayout.Hide();
    
    artistsLayoutArtist.SetSize(1, 0.8 );
    
        artistsList.SetTextColor1(color.list);
        artistsList.SetTextColor1(color.primary);
        artistsList.SetTextColor2(color.listBody);
        artistsList.SetBackColor(color.white);
        artistsList.SetFontFile(font.fontMedium);
        artistsList.SetIconSize(35, "dp");
        artistsList.SetTextSize1(16);
        artistsList.SetTextSize2(14);
        artistsList.SetEllipsize("end");
        artistsList.SetDivider(0, color.white);
        artistsList.SetIconMargins(12.5, 5, 12.5, 5, "dp");
        artistsList.SetHiTextColor1(color.highlight);
        artistsList.SetHiTextColor2(color.highlight);
        artistsList.SetOnTouch( _artistsListOnTouch );
        artistsLayoutArtist.AddChild(artistsList );
    
    artistsLayout.AddChild(artistsLayoutArtist);
    
    artistScroll = app.CreateScroller( 1.0, 0.8);
    artistScroll.Hide();
    artistsLayout.AddChild(artistScroll);
        
        showArtistsLayout = app.CreateLayout("Linear", "Left");
        showArtistsLayout.SetBackColor( color.white );
        artistScroll.AddChild(showArtistsLayout);
           
            //artist art
            artistArt = app.CreateImage(_createRandomImage(), 1, -1, "fill");
            showArtistsLayout.AddChild(artistArt);
        	
        	artistSongs = app.CreateList( "", 1, -1);
        	artistSongs.SetTextColor1(color.primary);
            artistSongs.SetTextColor2(color.listBody);
            artistSongs.SetBackColor(color.white);
            artistSongs.SetFontFile(font.fontRegular);
            artistSongs.SetIconSize(24);
            artistSongs.SetTextSize1(16);
            artistSongs.SetTextSize2(14);
            artistSongs.SetEllipsize("end");
            artistSongs.SetDivider(0, color.white);
            artistSongs.SetIconMargins(0.015, -1, 0.01, -1);
            artistSongs.SetHiTextColor1(color.highlight);
            artistSongs.SetHiTextColor2(color.highlight);
            artistSongs.SetOnTouch( _artistSongsOnTouch );
            showArtistsLayout.AddChild(artistSongs );
    
    // showArtistsLayout = app.CreateLayout("Linear");
    // showArtistsLayout.SetSize(1, 0.8);
    // showArtistsLayout.SetBackColor( color.light );
    // showArtistsLayout.Hide();
    
    //     //artist art
    //     artistArt = app.CreateImage(_createRandomImage(), 1, -1, "fill");
    //     showArtistsLayout.AddChild(artistArt);
        
    //     //Add seperator to menu layout.
    //     var sep = app.CreateImage( null, 0.75,0.001,"fix", 2,2 );
    //     sep.SetSize( -1, 1, "px" );
    //     sep.SetColor("#cccccc");
    //     showArtistsLayout.AddChild( sep );
    	
    // 	artistSongs = app.CreateList( "", 1, 1);
    //     artistSongs.SetTextColor1(color.list);
    //     artistSongs.SetTextColor2(color.list);
    //     artistSongs.SetBackColor("#f5f5f5");
    //     artistSongs.SetFontFile("fonts/Roboto-Regular.woff");
    //     artistSongs.SetIconSize(20);
    //     artistSongs.SetTextSize1(16);
    //     artistSongs.SetEllipsize("end");
    //     artistSongs.SetDivider(0, color.white);
    //     artistSongs.SetIconMargins(0.015, -1, 0.01, -1);
    //     artistSongs.SetHiTextColor1(color.highlight);
    //     artistSongs.SetHiTextColor2(color.highlight);
    //     artistSongs.SetOnTouch( _artistSongsOnTouch );
    //     showArtistsLayout.AddChild(artistSongs );
    
    // artistsLayout.AddChild(showArtistsLayout);

bodyLayout.AddChild(artistsLayout );;

var listHeightArtist = false;
function _artistsListOnTouch(title, body, type, index) {
    //Show artist art.
    artistArt.SetImage(_createRandomImage());
    artistArt.SetSize( 1, -1);

    forQueue = [];
    artistTitle+=" • "+title;
    titleTxt.SetText(title);
    artistScroll.Show();
    artistOpen = true;
    artistSongs.SetList("");
    for(var i = 0; i < songs.length; i ++) {
        var item = songs[i];
        if(item.artist == title) {
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
            artistSongs.AddItem(item.title, artist+" • "+dur, "[fa-music]");
            if(!listHeightArtist) {
    			listHeightArtist = artistSongs.GetHeight();
    		}
      }
    }
    var lstHght = parseFloat(listHeightArtist) * forQueue.length;
    artistSongs.SetSize(1, lstHght);
    numberOfSongs = forQueue.length;
    artistIndex = index;
}

function _artistSongsOnTouch (title, body, type, index) {
    _resetListTouches("artistlist");
    queueData = forQueue,
    currentIndex = index;
    player.SetFile( queueData[index].uri );
    this.SelectItemByIndex(index, false);
    artistsList.SelectItemByIndex(artistIndex, false);
    musicList.SelectItemByIndex(-1, false);
    artistsList.SelectItemByIndex(-1, false);
    _setSongTitle();
    _footerLeftLayoutOnTouchUp();
    queueFromSongs = false;
}