var minutes;
var minutesFromNow;	
var lastTIndex = -1;
timerBackLayout = app.CreateLayout( "Linear", "VCenter, FillXY");
timerBackLayout.SetBackColor("#88000000");
timerBackLayout.SetOnTouch( 
    function () {
        timerBackLayout.Hide();
        timerLayoutOpen = false;
    }
);
timerBackLayout.Hide();

    timerLayout = app.CreateLayout("Linear", "Vertical, Left");
    timerLayout.SetSize(0.85, -1);
    timerLayout.SetBackColor(color.light);
    timerLayout.Hide();
    
        //timer header
        timerHeader = app.CreateLayout("Linear", "VCenter, Left");   
        timerHeader.SetSize(0.85, 0.075);
        timerHeader.SetPadding(0.05, 0, 0.05, 0);
            
            //timer title text
            timerTitle = app.CreateText("Set Sleep Timer");
            timerTitle.SetFontFile(font.fontRegular);
            timerTitle.SetTextSize(17);
            timerTitle.SetTextColor(color.primary);
            timerHeader.AddChild(timerTitle);
            
        timerLayout.AddChild(timerHeader);
        
        //Add seperator to menu layout.
        var sep = app.CreateImage( null, 1,0.001,"fix", 2,2 );
        sep.SetSize( -1, 1, "px" );
        sep.SetColor( "#cccccc" );
        timerLayout.AddChild( sep );
        
        //timer body
        var choices = "After 10 minutes:[fa-circle-thin], After 20 minutes:[fa-circle-thin], After 30 minutes:[fa-circle-thin], After 40 minutes:[fa-circle-thin], After 50 minutes:[fa-circle-thin]";
        timerChoices = app.CreateList( choices, 0.85, -1 );
        timerChoices.SetTextColor1(color.list);
        timerChoices.SetTextColor2(color.list);
        timerChoices.SetFontFile(font.fontRegular);
        timerChoices.SetIconSize(20);
        timerChoices.SetTextSize1(16);
        timerChoices.SetDivider(0, color.white);
        timerChoices.SetIconMargins(0.015, -1, 0.01, -1);
        timerChoices.SetTextMargins(0, 0.01, 0, 0.01);
        timerChoices.SetMargins(0, 0.02, 0, 0);
        //timerChoices.SetHiTextColor1(color.primary);
        //timerChoices.SetHiTextColor2(color.primary);
        timerChoices.SetOnTouch(
            function(title, body, type, index) {
                //this.SelectItemByIndex(index, false);
                this.SetItemByIndex(lastTIndex, null, null, "[fa-circle-thin]");
                this.SetItemByIndex(index, null, null, "[fa-circle]");
                minutes = (index + 1) * 10;
                lastTIndex = index;
            }
        );
        timerLayout.AddChild( timerChoices );
        
        //time input
        inputTimeLayout = app.CreateLayout("Linear", "Horizontal");
        inputTimeLayout.SetSize(0.85, -1);
        inputTimeLayout.SetMargins(0,0,0,0.03);
            
            timeInputText = app.CreateText("Enter time in minutes ");
            timeInputText.SetTextColor(color.list);
            timeInputText.SetTextSize(16);
            inputTimeLayout.AddChild(timeInputText);
            
            timeInput = app.CreateTextEdit("", -1, -1, "Number");
            timeInput.SetHint("1-360");
            timeInput.SetTextColor(color.dark);
            timeInput.SetTextSize(18);
            timeInput.SetOnChange(
                function() {
                    minutes = this.GetText();
                }
            );
            inputTimeLayout.AddChild(timeInput);
            
        timerLayout.AddChild(inputTimeLayout);
        
        //timer header
        timerFooter = app.CreateLayout("Linear", "Horizontal, Right");   
        timerFooter.SetSize(0.85, 0.1);
        timerFooter.SetPadding(0.05, 0, 0.05, 0);
        timerFooter.SetPosition(0, 0.8);
            
            //buttons controlls
            setTimerButtonCancel = app.CreateButton("Cancel", -1, 0.1, "Custom");
            setTimerButtonCancel.SetStyle(color.light , color.light, 40, color.primary, 0, 0 );
            setTimerButtonCancel.SetTextSize(16);
            setTimerButtonCancel.SetTextColor(color.primary);
            setTimerButtonCancel.SetOnTouch(
                function() {
                    timerLayout.Animate("SlideToBottom");
                    timerBackLayout.Hide();
                    timerLayoutOpen = false;
                }
            );
            timerFooter.AddChild(setTimerButtonCancel);
            
            setTimerButtonOk = app.CreateButton("Ok", -1, 0.1, "Custom");
            setTimerButtonOk.SetStyle(color.light , color.light, 40, color.primary, 0, 0 );
            setTimerButtonOk.SetTextSize(16);
            setTimerButtonOk.SetTextColor(color.primary);
            setTimerButtonOk.SetOnTouch(
                //pause music if playing
                function() {
                    if(minutes > 0) {
                        minutesFromNow = (minutes * 60) * 1000;
                        setTimeout(
                            function() {
                                if(player.IsPlaying()) {
                                    player.Pause();
                                }
                            },
                            minutesFromNow
                        );
                        app.ShowPopup("Music will stop after " + minutes +" minutes.", "Bottom, Short");
                    }
                    timerLayout.Animate("SlideToBottom");
                    timerBackLayout.Hide();
                    timerLayoutOpen = false;
                }
            );
            timerFooter.AddChild(setTimerButtonOk);
            
        timerLayout.AddChild( timerFooter );
        
    timerBackLayout.AddChild(timerLayout);
homeLayout.AddChild(timerBackLayout);