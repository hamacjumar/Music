function OnBack() {
    if(timerLayoutOpen) {
        timerLayout.Animate("SlideToBottom");
        timerBackLayout.Hide();
        timerLayoutOpen = false;
    } else if(aboutLayoutOpen) {
        aboutLayout.Animate("SlideToBottom");
        aboutBackLayout.Hide();
        aboutLayoutOpen = false;
    } else if( searchLayoutOpen == true ) {
        searchHome.Animate( "SlideToBottom", null, 200 );
        app.RemoveLayout( searchHome );
        searchLayoutOpen = false;
    } else if(albumOpen) {
        albumTitle = "Albums";
        titleTxt.SetText(albumTitle);
        albumScroll.Hide();
        albumOpen = false;
    } else if(artistOpen) {
        artistTitle = "Artists";
        titleTxt.SetText(artistTitle);
        artistScroll.Hide();
        artistOpen = false;
    } else if(!albumOpen && !artistOpen) {
        nowPlaying.Show();
    } else {
        exitAppDialog = app.CreateDialog("Exit MyPlayer");
    	exitAppDialog.SetBackColor(color.white);
    		
    		exitAppDialogLayout = app.CreateLayout( "Linear", "Horizontal" );
    		exitAppDialogLayout.SetPadding(0.1, 0.01, 0.1, 0.01);
    		
    		    yesExitBtn  = app.CreateButton( "YES", 0.3, 0.1, "Custom");
    		    yesExitBtn.SetMargins(0,0, 0.025, 0);
    		    yesExitBtn.SetStyle(color.primary,color.primary, 3, color.primary, 0, 0 );
    			exitAppDialogLayout.AddChild(yesExitBtn);
    			yesExitBtn.SetOnTouch(
    			    function() {
    			        app.Exit();
    			    }
    			);
    			
    			noExitBtn  = app.CreateButton( "NO", 0.3, 0.1, "Custom" );
    			noExitBtn.SetStyle(color.primary,color.primary, 3, color.primary, 0, 0 );
    			exitAppDialogLayout.AddChild(noExitBtn);
    			noExitBtn.SetOnTouch(
    			    function() {
    			        exitAppDialog.Hide();
    			    }
    			);
    		
    		exitAppDialog.AddLayout(exitAppDialogLayout );
    		
    	exitAppDialog.Show();
    }
    
}