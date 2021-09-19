npPlayingBodyQueue.SetBackColor("#f5f5f5");
npPlayingBodyQueue.SetSize(1, 0.775);
npPlayingBodyQueue.Hide();

    //create queue list
    queueSongs = app.CreateList( "", 1, 0.775);
    queueSongs.SetTextColor1(color.primary);
    queueSongs.SetTextColor2(color.listBody);
    queueSongs.SetBackColor(color.white);
    queueSongs.SetFontFile(font.fontRegular);
    queueSongs.SetIconSize(24);
    queueSongs.SetTextSize1(16);
    queueSongs.SetTextSize2(14);
    queueSongs.SetEllipsize("end");
    queueSongs.SetDivider(0, color.white);
    queueSongs.SetIconMargins(0.015, -1, 0.01, -1);
    queueSongs.SetHiTextColor1(color.highlight);
    queueSongs.SetHiTextColor2(color.highlight);
    queueSongs.SetOnTouch( _queueSongsOnTouch );
    npPlayingBodyQueue.AddChild(queueSongs);

nowPlayingBody.AddChild(npPlayingBodyQueue);

function _queueSongsOnTouch(title, body, type, index) {
    if(title != "Queue is empty.") {
        currentIndex = index;
        player.SetFile( queueData[index].uri );
        this.SelectItemByIndex(index, false);
        songTitle.SetText(queueData[currentIndex].title);
        _setSongArt();
        
        if(queueFromSongs) {
            musicList.SelectItemByIndex(index, true);
        }
    }
}