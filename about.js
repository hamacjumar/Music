aboutBackLayout = app.CreateLayout( "Linear", "VCenter, FillXY");
aboutBackLayout.SetBackColor("#88000000");
aboutBackLayout.SetOnTouch( 
    function () {
        aboutBackLayout.Hide();
        aboutLayoutOpen = false;
    }
);
aboutBackLayout.Hide();

    aboutLayout = app.CreateLayout("Linear", "Vertical, Left");
    aboutLayout.SetSize(0.85, -1);
    aboutLayout.SetBackColor(color.light);
    aboutLayout.Hide();
    
        //about header
        aboutHeader = app.CreateLayout("Linear", "VCenter, Left, Horizontal");   
        aboutHeader.SetSize(0.85, 0.075);
        aboutHeader.SetPadding(0.05, 0, 0.05, 0);
            
            //about title text
            aboutIcon = app.CreateText("info");
            aboutIcon.SetFontFile(font.fontMaterial);
            aboutIcon.SetTextSize(24);
            aboutIcon.SetMargins( 0, 0, 0.05, 0 );
            aboutIcon.SetTextColor(color.primary);
            aboutHeader.AddChild(aboutIcon);
            
            aboutTitle = app.CreateText("About", -1, -1);
            aboutTitle.SetFontFile(font.fontBold);
            aboutTitle.SetTextSize(18);
            aboutTitle.SetTextColor(color.primary);
            aboutHeader.AddChild(aboutTitle);
            
        aboutLayout.AddChild(aboutHeader);
        
        //Add seperator to menu layout.
        var sep = app.CreateImage( null, 1,0.001,"fix", 2,2 );
        sep.SetSize( -1, 1, "px" );
        sep.SetColor( "#cccccc" );
        //aboutLayout.AddChild( sep );
        
        //about body
        aboutBody = app.CreateLayout("Linear", "Vertical");   
        aboutBody.SetSize(0.85, -1);
        aboutBody.SetPadding(0.075, 0.01, 0.075, 0);
            
            var text = "";
            text+="<p>";
            text+="This app is created using Droidscript";
                text+="</p>";
                text+="<p><b>A very big thanks to the Droidscript community who contributed a lot for the Droidscript software to keep going.</b></p>";
                
                text+="<p>";
                    text+="Version: "+_Version.toFixed(2)+"<br>";
                    text+="Developer: Jumar Hamac<br>";
                    text+="Email: hamacjumar@gmail.com";
                text+="</p>";
            
        	bodyText = app.CreateText( text, -1, -1, "Html, Multiline, Left" );
        	bodyText.SetTextColor(color.dark);
        	bodyText.SetFontFile(font.fontRegular);
        	aboutBody.AddChild( bodyText );
            
        aboutLayout.AddChild( aboutBody );
        
        //about footer
        aboutFooter = app.CreateLayout("Linear", "Horizontal, Right");   
        aboutFooter.SetSize(0.85, 0.1);
        aboutFooter.SetPadding(0.05, 0, 0.05, 0);
        //aboutFooter.SetPosition(0, 0.8);
            
            //modal control
            setaboutButtonOk = app.CreateButton("CLOSE", -1, -1, "Custom");
            setaboutButtonOk.SetStyle(color.light , color.light, 4, color.primary, 0, 0 );
            setaboutButtonOk.SetTextSize(16);
            setaboutButtonOk.SetFontFile(font.fontMedium);
            setaboutButtonOk.SetTextColor(color.primary);
            setaboutButtonOk.SetOnTouch(
                //pause music if playing
                function() {
                    aboutLayout.Animate("SlideToBottom");
                    aboutBackLayout.Hide();
                    aboutLayoutOpen = false;
                }
            );
            aboutFooter.AddChild(setaboutButtonOk);
            
        aboutLayout.AddChild( aboutFooter );
        
    aboutBackLayout.AddChild(aboutLayout);
homeLayout.AddChild(aboutBackLayout);