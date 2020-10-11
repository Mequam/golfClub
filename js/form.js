/*
	this is the local js code for the forms web page
*/
function getFrmData() {
	//php_given_json_text is expected to be set inside the php web file
	//by the back end, so we do not have to send the type and id values to the server twice
	return jsonApiStr(PHP_GIVEN_JSON_TEXT);
}

//this can be thought of as our main code, it runs when the window is loaded
window.onload = function () {
	let apiObj = getFrmData();
	document.getElementById("main").appendChild(obj2Form(apiObj.api.obj,apiObj.api.attr));
};
