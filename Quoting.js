inject(); //0.1.5
//run();  //0.1.3
//update(); //unknown

function getMessage(element) {
	var msg = "";
	
	while (!(element.classList.contains("message-group")))
		element = element.parentElement;
	
	var body = element.getElementsByClassName("first")[0]
		.getElementsByClassName("body")[0];
		
	var time = body.getElementsByTagName("h2")[0]
		.getElementsByTagName("span")[0].innerText;

	var username = body.getElementsByTagName("h2")[0]
		.getElementsByClassName("user-name")[0].innerText;
	
	var comments = element.getElementsByClassName("comment")[0]
		.getElementsByClassName("message");
	
	for (var i = 0, im = comments.length; im > i; i++) {
		var text = comments[i].getElementsByClassName("markup")[0]
			.innerText
			.replace("(edited)", "")
			.replace("\n\r", "")
			.replace("_", "");
			
		if (!(text == ""))
			msg = msg + "[" + time + "] " + username + ": _" + text + "_\n" ;
	}
	return msg;
}

function checkVal(a) {
	if (typeof a == "undefined")
		return 300;
	if (typeof a.getElementsByTagName("h2")[0] == "undefined")
		return 300;
	return a.getElementsByTagName("h2")[0].childNodes.length;
}

function clicked(messageElement) {
	var textArea = document.getElementsByTagName("textarea")[0];
	const message = getMessage(messageElement.parentElement.parentElement);
	const oldMsg = textArea.value;
	
	textArea.value = (oldMsg == "" ? oldMsg : oldMsg + "\n") + message + "\n";	//append if text is already in the text box

	resize(textArea);
}

function resize(textArea){
	textArea.onkeydown = function() {
		var key = event.keyCode || event.charCode;
		if(key == 8 || key == 46)
			resize(this);
	};
	textArea.style.height = textArea.scrollHeight > textArea.clientHeight ? (textArea.scrollHeight) + "px" : "60px";
}

function inject() {
	document.addEventListener("DOMNodeInsertedIntoDocument", function() {
		update();
	}, false);
	document.addEventListener("DOMNodeInserted", function() {
		update();
	}, false);
}


//Run whilst you can
//__________								 .__	 .__ .__			 __															._.
//\______   \ __ __   ____		  __  _  __|  |__  |__||  |	_______/  |_		 ___.__.  ____   __ __	   ____  _____	 ____ | |
// |	   _/|  |  \ /	\		 \ \/ \/ /|  |  \ |  ||  |   /  ___/\   __\	   <   |  | /  _ \ |  |  \	_/ ___\ \__  \   /	\| |
// |	|   \|  |  /|   |  \		 \	 / |   Y  \|  ||  |__ \___ \  |  |		  \___  |(  <_> )|  |  /	\  \___  / __ \_|   |  \\|
// |____|_  /|____/ |___|  /		  \/\_/  |___|  /|__||____//____  > |__|		  / ____| \____/ |____/	  \___  >(____  /|___|  /__
//		\/			 \/					   \/				\/				\/							 \/	  \/	  \/ \/


//The code powering this is really hackky and was never intended to be released
//	You may not want to witness anything past this line

































function update(){
	if ((typeof(document.getElementsByClassName("messages")[0]) !== 'undefined') 
			&& (document.getElementsByClassName("messages")[0] !== null)) {
		var elements = document.getElementsByClassName("messages")[0]
			.getElementsByTagName("div");
		for (var i = 0, im = elements.length; im > i; i++) {
			var element = elements[i]
				.getElementsByTagName("span");
			for (var ia = 0, ima = element.length; ima > ia; ia++) {
				var content = element[ia].parentElement.parentElement;
				if ((content.className == "body") && (checkVal(content) == 2))
					content.getElementsByTagName("h2")[0].appendChild(createSpan())
			}
		}
	}
}

function createSpan(){
	var span = document.createElement("span");
	span.setAttribute("style", "display:inline-block");
	span.innerText = "Quote";
	span.setAttribute("onclick", "clicked(this);");
	return span;
}