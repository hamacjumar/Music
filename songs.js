//Create the main layout
songsLayout.SetBackColor(color.white);
songsLayout.SetSize(1, 0.8);
    
    musicList.SetTextColor1(color.primary);
    musicList.SetTextColor2(color.listBody);
    musicList.SetBackColor(color.white);
    musicList.SetFontFile(font.fontRegular);
    musicList.SetIconSize(35, "dp");
    musicList.SetTextSize1(16);
    musicList.SetTextSize2(14);
    musicList.SetEllipsize("end");
    musicList.SetDivider(0, color.white);
    musicList.SetIconMargins(12.5, 5, 12.5, 5, "dp");
    musicList.SetHiTextColor1(color.highlight);
    musicList.SetHiTextColor2(color.highlight);
    musicList.SetOnTouch( _musicListOnTouch );
    songsLayout.AddChild(musicList);

bodyLayout.AddChild(songsLayout);

function _musicListOnTouch(title, body, type, index) {
    _resetListTouches("songlist");
    queueData = songs;
    currentIndex = index;
    player.SetFile( queueData[index].uri );
    this.SelectItemByIndex(index, false);
    albumsList.SelectItemByIndex(-1, false);
    artistsList.SelectItemByIndex(-1, false);
    _setSongTitle();
    _footerLeftLayoutOnTouchUp();
    queueFromSongs = true;
}