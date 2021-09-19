//version 1.00 03-09-2019 major design revisions using material icons as font-icons

var _Version = 1.00
var _AppName = "Music"

app.SetDebugEnabled( false );
app.SetOptions("IgnoreErrors")

app.LoadScript('settings.js');

//global variables
var forQueue,
    longPressSong,
    currentIndex,
    numberOfSongs,
    currentLayout,
    currentHomeLayout,
    lastBodyLayout, // to hold for the layout when 'now playing' layout is open
    songs,
    albums,
    artists;
    
var songTouch = false,
    albumTouch = false,
    artistTouch = false,
    searchTouch = false;

//global variables with intializations
var allSongsLoaded = false,
    allAlbumsLoaded = false,
    allArtistsLoaded = false, //allFavoritesLoaded = false,
    shuffle = false,
    queueData = [],
    queueFromSongs = false,
    queueSet = false; 
    // favorites = [];
    
var albumTitle ="Albums",
    albumOpen = false,
    artistTitle = "Artists",
    artistOpen = false;
    
var albumIndex,
    artistIndex;
    
var timerLayoutOpen = false,
    searchLayoutOpen = false,
    aboutLayoutOpen = false;
    
var repeatAll = false,
    repeatOne = false;
    
var headerDivider;
var songsForQueue;

function OnStart() {
    app.EnableBackKey(false);
    
    //create the home layout
    homeLayout = app.CreateLayout("Frame", "FillXY");
    homeLayout.SetBackColor(color.white);
    
        //create another frame layout that will be the container of the remaining layouts
        mainLayout = app.CreateLayout("Linear", "FillXY");
        mainLayout.SetBackColor(color.white);
        
            //header layout
            headerLayout = app.CreateLayout("Absolute");
            headerLayout.SetSize(1, 0.1);
            headerLayout.SetBackColor(color.white);

                //create menu button
                menuBtn = app.CreateButton( "menu", -1, 0.1, "Custom" );
                menuBtn.SetStyle(color.white,color.white, 40, color.primary, 0, 0 );
                menuBtn.SetTextSize(24);
                menuBtn.SetFontFile(font.fontMaterial );
                menuBtn.SetPosition(0, 0.005);
                menuBtn.SetTextColor(color.black);
                menuBtn.SetOnTouch(_openDrawer);
                headerLayout.AddChild(menuBtn);
                
                //create title text
                titleTxt = app.CreateText("Songs", 0.6, -1, "Left");
                titleTxt.SetEllipsize("marq");
                titleTxt.SetPosition(0.175, 0.025, -1, 0.1);
                titleTxt.SetTextSize(20);
                titleTxt.SetFontFile(font.fontBold );
                titleTxt.SetTextColor(color.black);
                headerLayout.AddChild(titleTxt);
                
            mainLayout.AddChild(headerLayout);
            
            //Add seperator to menu layout.
            headerDivider = app.CreateImage( null, 1, 0.001,"fix", 2,2 );
            headerDivider.SetSize( -1, 2, "px" );
            headerDivider.SetColor("#cccccc");
            headerDivider.Hide();
            mainLayout.AddChild(headerDivider);
        
            //layout for the songs, albums, artists, and favorites
            bodyLayout = app.CreateLayout("Frame");
            bodyLayout.SetSize(1, 0.8);
            
                //songs layout
                songsLayout = app.CreateLayout( "Linear");	
                musicList = app.CreateList( "", 1, 0.8);
                app.LoadScript("songs.js");
                
                //albums layout
            	albumsLayout = app.CreateLayout( "Frame");
            	albumsLayoutAlbums = app.CreateLayout("Linear");
            	albumsList = app.CreateList( "", 1, 0.8);
        	    app.LoadScript("albums.js");
        	    
        	    //artists layout
            	artistsLayout = app.CreateLayout("Frame");
            	artistsLayoutArtist=app.CreateLayout("Linear");
            	artistsList = app.CreateList( "", 1, 0.8);
            	app.LoadScript("artists.js");
            
            mainLayout.AddChild(bodyLayout);
            
            //Add seperator to menu layout.
            var sep = app.CreateImage( null, 1,0.001,"fix", 2,2 );
            sep.SetSize( -1, 1, "px" );
            sep.SetColor( "#cccccc" );
            mainLayout.AddChild( sep );
            
            //footer layout
            footerLayout = app.CreateLayout("Linear", "VCenter, Horizontal");
            footerLayout.SetSize(1, 0.1);
            footerLayout.SetBackColor(color.white);
            
                //create footer left layout
                footerLeftLayout = app.CreateLayout("Linear", "VCenter, Horizontal");
                footerLeftLayout.SetSize(0.82, 0.1);
                footerLeftLayout.SetOnTouchUp( _footerLeftLayoutOnTouchUp);
                    
                    //create song title text
                    songTitle = app.CreateText("Song title", 0.82, -1, "Center");
                    songTitle.SetTextColor(color.black);
                    songTitle.SetFontFile(font.fontMedium);
                    songTitle.SetTextSize(18);
                    songTitle.SetEllipsize("end");
                    songTitle.SetOnTouchUp( _footerLeftLayoutOnTouchUp);
                    footerLeftLayout.AddChild(songTitle);
                    
                footerLayout.AddChild(footerLeftLayout);
                
                //create footer right layout
                footerRightLayout = app.CreateLayout("Linear", "VCenter, Horizontal");
                footerRightLayout.SetSize(0.18, 0.1);
                    
                    //create play/pause button
                    playPauseBtn = app.CreateButton("play_arrow", -1, 0.1, "Custom, Fontawesome" );
                    playPauseBtn.SetStyle(color.white, color.white, 40, color.primary, 0, 0);
                    playPauseBtn.SetTextSize(30);
                    playPauseBtn.SetMargins(0, 0.0075, 0, 0);
                    playPauseBtn.SetFontFile(font.fontMaterial);
                    playPauseBtn.SetTextColor(color.black);
                    playPauseBtn.SetOnTouch(_playPauseBtnOnTouch);
                    footerRightLayout.AddChild(playPauseBtn);
                
                footerLayout.AddChild(footerRightLayout);
                
            mainLayout.AddChild(footerLayout);
            
        homeLayout.AddChild(mainLayout);
        
        //create layout for "Now Playing"
        nowPlaying = app.CreateLayout("Linear", "FillXY");
        nowPlaying.SetBackColor(color.white);
        nowPlaying.Hide();
        
            //header layout
            nowPlayingHeader = app.CreateLayout("Linear", "Horizontal, VCenter");
            nowPlayingHeader.SetSize(1, 0.1);
            nowPlayingHeader.SetBackColor(color.white);
            
                arrowDownBtn = app.CreateButton( "arrow_downward", 0.15, 0.1, "Custom, Fontawesome" );
                arrowDownBtn.SetStyle(color.white, color.white, 40, color.primary, 0, 0 );
                arrowDownBtn.SetMargins(0, 0.006, 0, 0);
                arrowDownBtn.SetTextSize(22);
                arrowDownBtn.SetFontFile(font.fontMaterial);
                arrowDownBtn.SetTextColor(color.black);
                arrowDownBtn.SetOnTouch(
                    function() {
                        nowPlaying.Animate("SlideToBottom");
                        app.UnlockDrawer("Left");
                	    mainMenu.SelectItemByIndex(lastBodyLayout, true);
                    }
                );
                nowPlayingHeader.AddChild(arrowDownBtn);
            
                playingSongTitle = app.CreateText("Now Playing", 0.7, -1, "Left");
                playingSongTitle.SetFontFile(font.fontBold);
                playingSongTitle.SetTextSize(18);
                playingSongTitle.SetEllipsize("end");
                playingSongTitle.SetTextColor(color.black);
                playingSongTitle.SetPadding(0, 0, 0.025, 0);
                playingSongTitle.SetTouchable(true );
                playingSongTitle.SetOnTouchDown(
                    function() {
                    	nowPlaying.Animate("SlideToBottom");
                    	app.UnlockDrawer("Left");
                    	mainMenu.SelectItemByIndex(lastBodyLayout, true);
                    }
                );
                nowPlayingHeader.AddChild(playingSongTitle);
            
                queueBtn = app.CreateButton( "queue_music", -1, 0.1, "Custom, Fontawesome" );
                queueBtn.SetStyle(color.white, color.white, 40, color.primary, 0, 0 );
                queueBtn.SetMargins(0, 0.005, 0, 0);
                queueBtn.SetTextSize(22);
                queueBtn.SetTextColor(color.black);
                queueBtn.SetFontFile(font.fontMaterial);
                queueBtn.SetOnTouch(_queueBtnOnTouch);
                nowPlayingHeader.AddChild(queueBtn);
            
            nowPlaying.AddChild(nowPlayingHeader);
            
            //Add seperator to menu layout.
            var sep = app.CreateImage( null, 1,0.001,"fix", 2,2 );
            sep.SetSize( -1, 1, "px" );
            sep.SetColor("#cccccc");
            nowPlaying.AddChild( sep );
                
            //create now playing layout body
            nowPlayingBody = app.CreateLayout("Frame");
            nowPlayingBody.SetSize(1, 0.775);
            
                npPlayingBodyMain = app.CreateLayout( "Absolute");
                app.LoadScript("npmain.js");
                
                npPlayingBodyQueue = app.CreateLayout( "Linear", "VCenter");
                app.LoadScript("npqueue.js");
            
            nowPlaying.AddChild(nowPlayingBody);
            
            //Add seperator to menu layout.
            var sep = app.CreateImage( null, 1,0.001,"fix", 2,2 );
            sep.SetSize( -1, 1, "px" );
            sep.SetColor("#cccccc");
            nowPlaying.AddChild( sep );
            
            nowPlayingBodyLayout = app.CreateLayout("Linear", "VCenter, Horizontal, Left");
            nowPlayingBodyLayout.SetSize(1, 0.125);
            //nowPlayingBodyLayout.SetPadding(0,0,0,0);
            
                npRepeatSongBtn = app.CreateButton("repeat", 0.1875, 0.1, "Custom");
                npRepeatSongBtn.SetStyle("white" , "white", 40, color.primary, 0, 0 );
                npRepeatSongBtn.SetTextSize(20);
                npRepeatSongBtn.SetTextColor(color.primary);
                npRepeatSongBtn.SetFontFile(font.fontMaterial);
                npRepeatSongBtn.SetOnTouch(
                    function() {
                        if(!repeatAll && !repeatOne) {
                            npRepeatSongBtn.SetTextColor(color.primary);
                            repeatAll = true;
                            app.ShowPopup("Repeat all songs.", "Bottom");
                        } else if(repeatAll && !repeatOne) {
                            npRepeatSongBtn.SetText("repeat_one");
                            npRepeatSongBtn.SetTextColor(color.primary);
                            repeatOne = true;
                            app.ShowPopup("Repeat current song.", "Bottom");
                        } else if(repeatOne) {
                            npRepeatSongBtn.SetText("repeat");
                            npRepeatSongBtn.SetTextColor(color.light);
                            repeatAll = false;
                            repeatOne = false;
                            app.ShowPopup("Repeat is off.", "Bottom");
                        }
                    }
                );
                nowPlayingBodyLayout.AddChild(npRepeatSongBtn);
            
                npPreviousSongBtn = app.CreateButton("fast_rewind", 0.1875, 0.1, "Custom, Fontawesome");
                npPreviousSongBtn.SetStyle("white" , "white", 40, color.primary, 0, 0 );
                npPreviousSongBtn.SetTextSize(28);
                npPreviousSongBtn.SetTextColor(color.primary);
                npPreviousSongBtn.SetFontFile(font.fontMaterial);
                npPreviousSongBtn.SetOnTouch(_previousSong);
                nowPlayingBodyLayout.AddChild(npPreviousSongBtn);
            
                npPlayPauseBtn = app.CreateButton("play_circle_outline", 0.25, 0.125, "Custom, Fontawesome");
                npPlayPauseBtn.SetStyle("white" , "white", 40, color.primary, 0, 0 );
                npPlayPauseBtn.SetTextSize(50);
                npPlayPauseBtn.SetTextColor(color.primary);
                npPlayPauseBtn.SetFontFile(font.fontMaterial);
                npPlayPauseBtn.SetOnTouch(_playPauseBtnOnTouch);
                nowPlayingBodyLayout.AddChild(npPlayPauseBtn);
                
                npForwardSongBtn = app.CreateButton("fast_forward", 0.1875, 0.1, "Custom, Fontawesome");
                npForwardSongBtn.SetStyle("white" , "white", 40, color.primary, 0, 0 );
                npForwardSongBtn.SetTextSize(28);
                npForwardSongBtn.SetTextColor(color.primary);
                npForwardSongBtn.SetFontFile(font.fontMaterial);
                npForwardSongBtn.SetOnTouch(_forwardSong);
                nowPlayingBodyLayout.AddChild(npForwardSongBtn);
                
                npShuffleBtn = app.CreateButton("shuffle", 0.1875, 0.1, "Custom");
                npShuffleBtn.SetStyle("white" , "white", 40, color.primary, 0, 0 );
                npShuffleBtn.SetTextSize(20);
                npShuffleBtn.SetTextColor(color.light);
                npShuffleBtn.SetFontFile(font.fontMaterial);
                npShuffleBtn.SetOnTouch( _npShuffleBtnOnTouch );
                nowPlayingBodyLayout.AddChild(npShuffleBtn);
            
            nowPlaying.AddChild(nowPlayingBodyLayout);
            
        homeLayout.AddChild(nowPlaying);
        
        //create intro page
        introLayout = app.CreateLayout("Linear", "VCenter, FillXY");
        introLayout.SetBackColor(color.white);
        
            //icon image
            imageIcon = app.CreateImage("Img/Music.png", 0.25)
            introLayout.AddChild(imageIcon)
            
        homeLayout.AddChild(introLayout)
        
	//create drawer menu
	_createDrawer();
	
	//Create media player.
    player = app.CreateMediaPlayer();
    player.SetOnReady( _playerOnReady );
    player.SetOnComplete(_playerOnComplete );
    dur = null;
	
	//create media store
	media = app.CreateMediaStore();
    media.SetOnMediaResult( _onMediaResult );
    media.SetOnArtistsResult( _onArtistsResult );
    media.SetOnAlbumsResult( _onAlbumsResult );
	
	//caling for the load songs, albums and artists function
    _getAllSongs();
    //_getAllAlbums();
    //_getAllArtists();
	
	//Add layout to app
	app.AddLayout( homeLayout );
	
	app.LoadScript("onback.js");
	setInterval( "Update()", 1000);
	
	//load more options layout
	app.LoadScript("timer.js");
	app.LoadScript("about.js");
	
	//Get first shared file (if any).
	sharedFiles = app.GetSharedFiles();
	if( sharedFiles ) {
		player.SetFile(sharedFiles[0]);
		_footerLeftLayoutOnTouchUp();
	}
  app.SetSharedApp( "MyPlayer" );
	
}

function _createDrawer() {
    //Create a layout for the drawer.
	drawerWidth = 0.85;
    drawerScroll = app.CreateScroller( drawerWidth, 1 );
    drawerScroll.SetBackColor(color.white);
	layDrawer = app.CreateLayout( "Linear", "Left" );
	drawerScroll.AddChild( layDrawer );
	
	//Create layout for top of drawer.
	layDrawerTop = app.CreateLayout( "Linear", "VCenter, Horizontal, Left")
	layDrawerTop.SetBackGradient(color.white, color.white)
	layDrawerTop.SetPadding(0, 12, 0, 12, "dp")
	layDrawer.AddChild(layDrawerTop)
	
	//Add an icon to top layout.
	var img = app.CreateImage( "Img/Music.png", 0.15 )
	img.SetMargins(16, 0, 16, 0, "dp")
	layDrawerTop.AddChild(img)
	
	//Add user name to top layout.
	var txtAppName = app.CreateText(_AppName, -1, -1, "Bold")
	txtAppName.SetPosition( drawerWidth*0.07, 0.155 );
	txtAppName.SetTextColor(color.dark);
	txtAppName.SetTextSize(20, "sp")
	layDrawerTop.AddChild( txtAppName );
	
	//Add seperator to menu layout.
    var sep = app.CreateImage( null, drawerWidth,0.001,"fix", 2,2 );
    sep.SetSize( -1, 1, "px" );
    sep.SetColor( "#cccccc" );
    layDrawer.AddChild( sep );
	
	//Create menu layout.
	layMenu = app.CreateLayout( "Linear", "Left" );
	layDrawer.AddChild( layMenu );
	
    //Add a list to menu layout (with the menu style option).
    var listItems = "Now Playing::[fa-circle-thin], Songs::[fa-laptop], Albums::[fa-folder-o], Artist::[fa-user-o]";
    mainMenu = app.CreateList( listItems, drawerWidth, -1, "Menu,Expand" );
    //mainMenu.SetTextColor1("#546e7a");
    mainMenu.SetTextColor1(color.black);
    mainMenu.SetFontFile(font.fontBold);
    mainMenu.SetTextColor2("#546e7a");
    mainMenu.SetColumnWidths( -1, 0.35, 0.18 );
    mainMenu.SelectItemByIndex( 1, true );
    //mainMenu.SetItemByIndex( 0, "Now Playing");
    mainMenu.SetOnTouch(
        function(title, body, type, index) {
            app.CloseDrawer( "Left" );
            
            //Highlight the chosen menu item in the appropriate list.
            this.SelectItemByIndex( index, true );
            
            if(index == 0) {
                nowPlaying.Show();
                currentHomeLayout = nowPlaying;
            } else {
                nowPlaying.Hide();
                mainLayout.Show();
                lastBodyLayout = index;
            }
        
            if(index == 1) {
                _getAllSongs();
            } else if(index == 2) {
                _getAllAlbums();
            } else if(index == 3) {
            	_getAllArtists();
            }
        }
    );
    layMenu.AddChild( mainMenu );
    
    //Add title between menus.
	txtMoreOptions = app.CreateText( "MORE OPTIONS",-1,-1,"Left");
	txtMoreOptions.SetTextColor( "#light" );
	txtMoreOptions.SetMargins( 16,0,0,0, "dip" );
	txtMoreOptions.SetTextSize( 14, "dip" );
	layMenu.AddChild( txtMoreOptions );
	
    //Add a second list to menu layout.
    var listItems = "Timer::[fa-clock-o],About::[fa-info-circle]";
    moreMenu = app.CreateList( listItems, drawerWidth, -1, "Menu,Expand" );
    moreMenu.SetColumnWidths( -1, 0.35, 0.18 );
    moreMenu.SetTextColor1(color.black);
    moreMenu.SetTextColor2("#546e7a");
    moreMenu.SetOnTouch(
        function(title, body, type, index) {
            //Close the drawer.
            app.CloseDrawer( "Left" );
            
            if(index == 0 && !timerLayoutOpen) {
                timerBackLayout.Show();
                timerLayout.Animate("SlideFromBottom");
                timerLayoutOpen = true;
            } else if(index == 1) {
                aboutBackLayout.Show();
                aboutLayout.Animate("SlideFromBottom");
                aboutLayoutOpen = true;
            }  
        }
    );
    layMenu.AddChild( moreMenu );
}

//Called when hardware menu key pressed.
function OnMenu( name ) {  
   app.OpenDrawer("Left");
}

function _openDrawer() {
    app.OpenDrawer("Left");
}

function _getAllSongs() {
    titleTxt.SetText("Songs");
    if(currentHomeLayout) {
    	currentHomeLayout.Hide();
    }
    if(!allSongsLoaded) {
        media.QueryMedia( "", "Title", "External");
    }
    songsLayout.Show();
    currentHomeLayout = songsLayout;
}

function _getAllAlbums() {
    titleTxt.SetText(albumTitle);
    currentHomeLayout.Hide();
    if(!allAlbumsLoaded) {
        media.QueryAlbums( "", "", "External" );
    }
    albumsLayout.Show();
    currentHomeLayout = albumsLayout;
}

function _getAllArtists() {
    titleTxt.SetText("Artist");
    currentHomeLayout.Hide();
    if(!allArtistsLoaded) {
        media.QueryArtists( "", "", "External" );
    }
	artistsLayout.Show();
	currentHomeLayout = artistsLayout;
}

//Show media query results.
function _onMediaResult( result ) {
    //alert(JSON.stringify(result));
    forQueue = result;
    songs = result;
    var dur, i = 0;
    for( i; i<result.length; i++ ) {
        var item = result[i];
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
        //st.push(item.title+":"+artist+" • "+dur+":Img/icon2.png");
        musicList.AddItem(item.title, artist+" • "+dur, "Img/icon3.png");
    	//musicList.SetIconMargins(25, 10, 25, 10, "px");
    }
    //musicList.SetList(st);
    _closeIntroPage();
    allSongsLoaded = true;
    numberOfSongs = result.length;
    mainMenu.SetItemByIndex( 1, "Songs", numberOfSongs);
}

//Show albums query results.
function _onAlbumsResult( result ) {
    albums = result;
    for(var i=0; i<result.length; i++) {
        var item = result[i];    
        var sngTxt = "Song";
        if(item.numSongs > 1) {
            sngTxt = "Songs";
        }
        albumsList.AddItem(item.album, item.artist+" • "+item.numSongs+" "+sngTxt, "Img/album.png");
    }
    allAlbumsLoaded = true;
    mainMenu.SetItemByIndex( 2, "Albums", result.length);
}

function _onArtistsResult(result) {
    artists = result;
    for(var i=0; i<result.length; i++) {
        var item = result[i];    
        artistsList.AddItem(item.artist, "Albums "+item.numAlbums+" • Tracks "+item.numTracks, "Img/artist.png");
    }
    allArtistsLoaded = true;
    mainMenu.SetItemByIndex( 3, "Artists", result.length);
}

//Called when file is ready to play.
function _playerOnReady() {
    playPauseBtn.SetText("pause");
    npPlayPauseBtn.SetText("pause_circle_outline");
	dur = player.GetDuration();
    player.Play();
    
    //set the duration counter
    songDuration.SetText(_createHourMinute(dur));
}

//Called when playback is complete
function _playerOnComplete() {
	_forwardSong();
}

function _playPauseBtnOnTouch() {
    if(player.IsPlaying()) {
        playPauseBtn.SetText("play_arrow");
        npPlayPauseBtn.SetText("play_circle_outline");
        player.Pause();
    } else if(currentIndex <  numberOfSongs) {
        playPauseBtn.SetText("pause");
        npPlayPauseBtn.SetText("pause_circle_outline");
        player.Play();
    }
}

function _previousSong() {
    if(dur) {
    	var n = currentIndex - 1;
    if(shuffle) {
        n = Math.floor(Math.random() * (numberOfSongs - 0 + 1)) + 0;
    }
    
    if(n < 0) {
        currentIndex = numberOfSongs - 1;
        musicList.SelectItemByIndex(currentIndex, true);
        queueSongs.SelectItemByIndex(currentIndex, true);
        player.SetFile( queueData[currentIndex].uri );  
        _setSongTitle();
    } else if(currentIndex){
        currentIndex = n;
        musicList.SelectItemByIndex(currentIndex, true);
        queueSongs.SelectItemByIndex(currentIndex, true);
        player.SetFile( queueData[currentIndex].uri );  
        _setSongTitle();
    }
    
    }
}

function _forwardSong() {
    if(dur) {
    	var n = currentIndex + 1;
        if(shuffle) {
            n = Math.floor(Math.random() * (numberOfSongs - 0 + 1)) + 0;
        } else if(repeatOne) {
            n = currentIndex;
        } else if(repeatAll) {
            
        }
        
        if(n >= numberOfSongs && repeatAll) {
            currentIndex = 0;
            musicList.SelectItemByIndex(currentIndex, true);
            queueSongs.SelectItemByIndex(currentIndex, true);
            player.SetFile( queueData[currentIndex].uri ); 
            _setSongTitle();
        } else if(n >= numberOfSongs && !repeatAll) {
            //do nothing
        } else {
            currentIndex = n;
            musicList.SelectItemByIndex(currentIndex, true);
            queueSongs.SelectItemByIndex(currentIndex, true);
            player.SetFile( queueData[currentIndex].uri ); 
            _setSongTitle();
        }
    }
}

function _setSongTitle() {
    if(currentIndex || currentIndex >= 0) {
        songTitle.SetText(queueData[currentIndex].title);
        playingSongTitle.SetText(queueData[currentIndex].title);
        _setSongArt();
    }
}

function _setSongArt() {
    var setSongArt = media.GetSongArt(songArtImg, queueData[currentIndex].id, "external");  
    if(!setSongArt) {
        songArtImg.SetImage(_createRandomImage());
    }
    songArtImg.SetSize( 1, 0.775 );
}

function _footerLeftLayoutOnTouchUp() {
	app.LockDrawer("Left");
	nowPlaying.Animate("SlideFromBottom");
	mainMenu.SelectItemByIndex(0, true);
}

function Update() {
  if(player.IsPlaying()) {
    prog = player.GetPosition();
	if( dur ) {
	    seekBar.SetValue( prog / dur );
	    songTimeCounter.SetText(_createHourMinute(prog));
	}
  }
}

function _npShuffleBtnOnTouch() {
    if(shuffle) {
        npShuffleBtn.SetTextColor(color.light);
        shuffle = false;
        app.ShowPopup("Shuffle is off.", "Bottom");
    } else {
        npShuffleBtn.SetTextColor(color.primary);
        shuffle = true;
        app.ShowPopup("Shuffle is on.", "Bottom");
    }
}

function _queueBtnOnTouch() {
    if(npPlayingBodyQueue.GetVisibility() == "Hide") {
        npPlayingBodyQueue.Animate("SlideFromRight");
        queueBtn.SetText("chevron_right");
        playingSongTitle.SetText("Now Playing");
        _setQueueSongs();
        
        if(queueData.length < 1) {
            queueSongs.SetList("");
            queueSongs.AddItem("Queue is empty.", null, "[fa-frown-o]");
        } else {
            _setQueueSongs();   
        }
    } else {
        npPlayingBodyQueue.Animate("SlideToRight");
        queueBtn.SetText("queue_music");
        _setSongTitle();
    }
}

function _setQueueSongs() {
    if(!queueSet) {
        queueSongs.SetList("");
        var dur, i = 0;
        //app.ShowProgress("");
        for( i; i<queueData.length; i++ ) {
            var item = queueData[i];
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
            queueSongs.AddItem(item.title, artist+" • "+dur, null);
        }
        //app.HideProgress();
        queueSet = true;
    }
    //queueSongs.SetList(songsForQueue );
    queueSongs.SelectItemByIndex(currentIndex, true);
}

function _resetListTouches(list) {
    if(list == "songlist") {
        if(!songTouch) {
            queueSet = false;
            albumTouch = false;
            artistTouch = false;
            favoriteTouch = false;
        } else {
            queueSet = true;   
        }
    } else if(list == "albumlist") {
        if(!albumTouch) {
            queueSet = false;
            songTouch = false;
            artistTouch = false;
            favoriteTouch = false;
        } else {
            queueSet = true;   
        }
    } else if(list == "artistlist") {
        if(!artistTouch) {
            queueSet = false;
            songTouch = false;
            albumTouch = false;
            favoriteTouch = false;
        } else {
            queueSet = true;   
        }
    } else if(list == "searchlist") {
        if(!searchTouch) {
            queueSet = false;
            songTouch = false;
            albumTouch = false;
            favoriteTouch = false;
        } else {
            queueSet = true;   
        }
    }
}

function _closeIntroPage() {
    introLayout.Hide(); 
    app.AddDrawer( drawerScroll, "Left", drawerWidth );
}

function _randomNumber(number) {
   return Math.floor(Math.random() * (number - 0 + 1)) + 0;
}

function _createRandomImage() {
    var imgNumber = _randomNumber(4);
    var tmpAlbumArt = "Img/" + imgNumber + ".jpg";
    return tmpAlbumArt;
}

function _createHourMinute(ms) {
    console.log(ms);
    var min = Math.floor((Math.round(ms)/60));
    var sec = (Math.round(ms)) % 60;
    if(sec < 10)
        sec = "0"+sec;
    if(min < 10)
        min = "0"+min;
    return min+":"+sec;
}