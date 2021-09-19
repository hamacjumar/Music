var searchSongs = [];
function _searchPage() {
    searchLayoutOpen = true;
    searchHome = app.CreateLayout("Linear", "Left, FillXY");
    searchHome.SetBackColor(color.white);
    app.AddLayout( searchHome );
    
        //header layout
        headerLayout = app.CreateLayout("Absolute");
        headerLayout.SetSize(1, 0.14);
        headerLayout.SetPadding( 0, 0.01, 0, 0.01 );
        //headerLayout.SetBackColor(color.light);
        searchHome.AddChild( headerLayout );
        
            //search input
            bg = app.CreateButton("", 0.92, -1, "Custom");
            bg.SetSize(app.GetScreenWidth()-50, 120, "px");
            bg.SetStyle( color.white, color.white, 50 , "#eeeeee", 1, 0);
            headerLayout.AddChild( bg );
            bg.SetPosition((1-bg.GetWidth())/2, 0.02);
            
            //header form
            headerForm = app.CreateLayout("Linear", "VCenter, Left, Horizontal");
            headerForm.SetSize(app.GetScreenWidth()-50, 120, "px");
            headerForm.SetPadding( 0.02, 0, 0, 0.01 );
            headerForm.SetPosition((1-bg.GetWidth())/2, 0.02);
            headerLayout.AddChild( headerForm );
                
                //search icon
                searchPageBackIcon = app.CreateButton( "arrow_backward", -1, -1);
                //searchPageBackIcon.SetSize(120, 120, "px")
                searchPageBackIcon.SetPadding( 0, 0, 0, 0 ); 
                searchPageBackIcon.SetTextSize(22);
                searchPageBackIcon.SetTextColor(color.black);
                searchPageBackIcon.SetFontFile(font.fontMaterial);
                searchPageBackIcon.SetOnTouch(
                	 function() {
                		searchHome.Hide();
                		app.HideKeyboard();
                	}
                );
                headerForm.AddChild(searchPageBackIcon);
                
                //text edit
                searchInput = app.CreateTextEdit( "", 0.5, -1, "Singleline");
                searchInput.SetBackColor("#00ffffff");
                searchInput.SetHint( "Search song..." );
                //searchInput.SetPadding( 0.025, 0.0235, 0, 0 );
                searchInput.SetTextColor(color.black);
                searchInput.SetCursorColor(color.dark);
                searchInput.Focus();
                headerForm.AddChild( searchInput );
                searchInput.SetOnEnter( _searchSong );
                searchInput.SetOnChange(
                    function() {
                        if( searchInput.GetText() != "" ) {
                            closeButton.Show();
                        } else {
                            closeButton.Hide();
                        }
                    }
                );
                
                //close button
                closeButton = app.CreateButton( "close", 0.1, 0.08);
                closeButton.SetBackColor( "#00000000" );
                closeButton.SetPadding( 0, 0, 0, 0 );
                closeButton.SetTextSize(22);
                closeButton.SetFontFile(font.fontMaterial);
                closeButton.SetTextColor(color.black);
                closeButton.Hide();
                headerForm.AddChild( closeButton );
                closeButton.SetOnTouch(
                    function() {
                        searchInput.SetText("");
                        closeButton.Hide();
                    }
                );
                
        searchSongList = app.CreateList( "", 1, 0.9);
        searchSongList.SetTextColor1(color.black);
        searchSongList.SetTextColor2(color.listBody);
        searchSongList.SetBackColor(color.white);
        searchSongList.SetFontFile(font.fontRegular);
        searchSongList.SetIconSize(24);
        searchSongList.SetTextSize1(16);
        searchSongList.SetTextSize2(14);
        searchSongList.SetEllipsize("end");
        searchSongList.SetDivider(0, color.white);
        searchSongList.SetIconMargins(0.015, -1, 0.01, -1);
        searchSongList.SetHiTextColor1(color.highlight);
        searchSongList.SetHiTextColor2(color.highlight);
        searchSongList.SetOnLongTouch(_searchMoreOptions);
        searchSongList.SetOnTouch( _searchSongList );
        searchHome.AddChild(searchSongList);
    
    app.ShowKeyboard( searchInput );
}

function divider() {
    var sep = app.CreateImage( null, 1, 0.001,"fix", 2, 2 );
    sep.SetSize( -1, 1, "px" );
    sep.SetColor("#cccccc");
    return sep;
}
function _searchSong() {
    app.HideKeyboard( true )
    searchSongList.SetList("");
    var q = searchInput.GetText();
    if( q != "" ) {
        for( var i=0; i<songs.length; i++ ) {
            var item = songs[i];
            if( item.title.toLowerCase().includes(q) == true) {
                searchSongs.push(item);
                var dur;
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
                searchSongList.AddItem(item.title, artist+" • "+dur, "[fa-music]");
            }
        }
    }    
}
function _searchSongList(title, body, type, index) {
    _resetListTouches("searchlist");
    queueData = searchSongs;
    numberOfSongs = queueData.length;
    currentIndex = index;
    player.SetFile( queueData[index].uri );
    this.SelectItemByIndex(index, false);
    albumsList.SelectItemByIndex(-1, false);
    artistsList.SelectItemByIndex(-1, false);
    musicList.SelectItemByIndex(-1, false);
    _setSongTitle();
    queueFromSongs = false;
}
function _searchMoreOptions() {
	backLayout = app.CreateLayout( "Linear", "VCenter, FillXY");
	backLayout.SetBackColor("#88000000");
	backLayout.SetOnTouch( 
		function () {
			backLayout.Hide();
		}
	);
	
		layout = app.CreateLayout("Absolute");
		layout.SetSize(0.9, -1);
		backLayout.AddChild(layout);
		
			bg = app.CreateButton("", 0.9, 0.11, "Custom");
			bg.SetStyle( color.white, color.white, 7, "#eeeeee", 1, 1);
			layout.AddChild(bg);
	
			actionLay = app.CreateLayout( "Absolute" );
			actionLay.SetSize(-1, -1);
			//actionLay.SetPosition(0.49, 0.0175);
			actionLay.SetPadding(0.01, 0.01, 0.01, 0.01);
			actionLay.SetBackColor( "#00000000" );
				
				data = "Shuffle, Play next, Add to queue, Settings, About";
				
				list = app.CreateList(data);
				list.SetSize(-1, -1);
				list.SetTextColor1(color.black );
				list.SetFontFile(font.fontRegular);
				list.SetTextMargins(0, 0.0075, 0, 0.0075);
				list.SetTextSize1(16);
				list.SetDivider(0, "white");
				list.SetOnTouch(
					function(title) {
						app.RemoveLayout(backLayout);
						app.ShowPopup(title, "Bottom");
					}
				);
				list.SetEllipsize("end");
				actionLay.AddChild(list );
				
				layout.AddChild(actionLay);
				
	app.AddLayout(backLayout);
	bg.SetSize(0.9, parseFloat(list.GetHeight())+0.04);
	actionLay.SetSize(9, list.GetHeight());
}