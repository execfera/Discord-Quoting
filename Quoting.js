//META{"name":"DCMQuotingPlugin"}*// 

//Crossplatform script... IE 8 -> Chrome -> Better discord "support"

//This class is for hacky QUOTE INJECTION only
function DCMQuotingPlugin(){
    var ghostModId = 3;

    this.load = function(){};

    this.start = function(){
        inject(); 
    };

    this.unload = function(){
        removeAllEvents(document, "DOMNodeInsertedIntoDocument");
        removeAllEvents(document, "DOMNodeInserted");
    };

    this.stop = function(){
        removeAllEvents(document, "DOMNodeInsertedIntoDocument");
        removeAllEvents(document, "DOMNodeInserted");
    };

    var checkVal = function(a){
        if (typeof a === "undefined")
            return 300;
            
        var h2 = a.getElementsByTagName("h2")[0];
        
        if (typeof h2 === "undefined")
            return 300;
            
        return h2.childNodes.length;
    };

    var inject = function(){
        window.DCMQuoting.enabled = true;
        
        document.addEventListener("DOMNodeInsertedIntoDocument", function() {
            update();
        }, false);
        document.addEventListener("DOMNodeInserted", function() {
            update();
        }, false);
    };

    var createSpan = function(){
        var span = document.createElement("span");
        span.setAttribute("style", "display:inline-block");
        span.innerText = " [quote]";
        span.className = "timestamp";
        span.setAttribute("onclick", "DCMQuoting.clicked(this);");
        return span;
    };

    //Still no good way to get all messages with BetterDiscord (afaik meaning I'm probably wrong)... copy OP whilst using a mod id (mod id = expected amount of ghosts scripted installed + 2)
    var update = function(){
        if ((typeof(document.getElementsByClassName("messages")[0]) !== 'undefined') 
            && (document.getElementsByClassName("messages")[0] !== null)
            && (window.DCMQuoting.enabled)) {
            
            var elements = document.getElementsByClassName("messages")[0]
                .getElementsByTagName("div");
            for (var i = 0, im = elements.length; im > i; i++) {
                var element = elements[i]
                    .getElementsByTagName("span");
                for (var ia = 0, ima = element.length; ima > ia; ia++) {
                    var content = element[ia].parentElement.parentElement;
                    if ((content.className == "body") && (checkVal(content) == ghostModId))
                        content.getElementsByTagName("h2")[0].appendChild(createSpan())
                }
            }
        }
    };
};

DCMQuotingPlugin.prototype.getName = function() { 
    return "Quoting"; 
}; 

DCMQuotingPlugin.prototype.getDescription = function() { 
    return "Quoting from Discord Client Modding ported by NotGGhost"; 
}; 
 
DCMQuotingPlugin.prototype.getVersion = function() { 
    return "0.1.9"; 
}; 

DCMQuotingPlugin.prototype.getAuthor = function() { 
    return "Ghost"; 
}; 

DCMQuotingPlugin.prototype.getSettingsPanel = function() { 
    return '<center><img src="https://s14.postimg.org/6w6z0pdpd/NJa3g_V_1.png"></img><br><b style="font-size: 40px;"> Nothing to see here yet... </b></center>'; 
}; 

var CDCMQuoting = function(){
    this.enabled = true;

    this.getMessage = function(element) {
        var msg = "";
        
        while (!(element.classList.contains("message-group")))
            element = element.parentElement;
        
        var body = element.getElementsByClassName("first")[0]
            .getElementsByClassName("body")[0];
            
        var time = body.getElementsByTagName("h2")[0]
            .getElementsByTagName("span")[2]
            .innerText
            .replace("Today at ", "");

        var username = body.getElementsByTagName("h2")[0]
            .getElementsByClassName("user-name")[0].innerText;
        
        var comments = element.getElementsByClassName("comment")[0]
            .getElementsByClassName("message");
               
        var index;
        for (index = 0; index < comments.length; ++index) {
            var text = comments[index].getElementsByClassName("markup")[0]
                .innerText
                .replace("(edited)", "")
                .replace("\n\r", "")
                .replace("_", "");
                
            if (!(text == ""))
                msg = msg + "[" + time + "] " + username + ": _" + text + "_\n"; //TODO: string#format (+that too)
        }
        return msg;
    };
    this.resize = function(textArea){
        const oldSize = textArea.style.height;
        const newSize = textArea.scrollHeight > textArea.clientHeight 
                    ? textArea.scrollHeight 
                    : textArea.value == "" 
                        ? 18 
                        : 80;

        textArea.style.height = newSize + "px";

        textArea.onkeyup = function() {
            var key = event.keyCode || event.charCode;
            
            if (((key == 8) || (key == 46)) && (textArea.value.length < 0))
               window.DCMQuoting.resize(this);
               
            if ((key == 13) && (!event.shiftKey)) 
                textArea.style.height = "18px";
        };
    }

    this.clicked = function(messageElement){
        var textArea = document.getElementsByTagName("textarea")[0];
        
        const message = window.DCMQuoting.getMessage(messageElement);
        const oldMsg = textArea.value;
        
        var quote = (oldMsg == "" ? oldMsg : oldMsg + "\n") + message + "\n";    //append if text is already in the text box

        if ((typeof(betterDiscordIPC) !== 'undefined') && (betterDiscordIPC !== null)) { 
            $(textArea).focus().val("").val(quote);
        } else {
            textArea.value = quote;
        }

        window.DCMQuoting.resize(textArea);
        textArea.scrollTop = textArea.scrollHeight;
    };
};

window.DCMQuoting = new CDCMQuoting();

function removeAllEvents(node, event) {
    window.DCMQuoting.enabled = false;
};

if (!((typeof(betterDiscordIPC) !== 'undefined') && (betterDiscordIPC !== null))) {
    var str = "Warning: This Discord Quoting script is designed to work in BetterDiscord only!\nHOWEVER it is still trying to load\n\n(Discord Client Modding is deprecated)";
    console.log(str);
    alert(str);
    new DCMQuotingPlugin().start();
}
