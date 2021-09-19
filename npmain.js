npPlayingBodyMain.SetBackColor("#f5f5f5");
npPlayingBodyMain.SetSize(1, 0.8);

    //create songArt image
    // let imgNumber = _randomNumber(4);
    // let tmpAlbumArt = "Img/" + imgNumber + ".jpg";
    
    songArtImg = app.CreateImage(_createRandomImage(), 1, 0.775, "fill");
    npPlayingBodyMain.AddChild(songArtImg);
    
    // nowPlayingSongInfo = app.CreateLayout("Frame");
    // nowPlayingSongInfo.SetSize(1, 0.075);
    // nowPlayingSongInfo.SetBackColor("#f5f5f5");
        
        
       // nowPlayingSongInfo.AddChild( seekBar );
    
    //npPlayingBodyMain.AddChild(nowPlayingSongInfo);
    
    
    //layout for the seekbar and other song info
    moreSongInfo = app.CreateLayout("Absolute");
    moreSongInfo.SetSize(1, 0.1);
    moreSongInfo.SetBackColor("#10000000");
    moreSongInfo.SetPosition(0, 0.7);
    
        seekBar = app.CreateSeekBar(1, -1);
        seekBar.SetRange( 1.0 );
        seekBar.SetValue( 0 );
        seekBar.SetColorFilter("#ffaadd4e", "Add");
        seekBar.SetOnTouch(
            function(value) {
                if(player.IsPlaying()) {
                    player.SeekTo( dur * value );
                }
            } 
        );
        moreSongInfo.AddChild( seekBar );
        
        //song time counter
        songTimeCounter = app.CreateText("00:00", 0.1);
        songTimeCounter.SetFontFile(font.fontRegular);
        songTimeCounter.SetPosition(0, 0.05);
        songTimeCounter.SetTextColor(color.white);
        songTimeCounter.SetTextSize(12);
        moreSongInfo.AddChild(songTimeCounter);
        
        //song duration
        songDuration = app.CreateText("00:01", 0.1);
        songDuration.SetFontFile(font.fontRegular);
        songDuration.SetTextColor(color.white);
        songDuration.SetPosition(0.9, 0.05);
        songDuration.SetTextSize(12);
        moreSongInfo.AddChild(songDuration);
    
    npPlayingBodyMain.AddChild(moreSongInfo);

nowPlayingBody.AddChild(npPlayingBodyMain);