/*
	this function submits the data from the given form element to the
	server
*/
function submitFormAjax(formEle,rdyStateChange) {

	//the form data that we will be sending
	let frmData = new FormData(formEle);

	frmData.append('email','placeholder@test.com');

	let xhttp = new XMLHttpRequest();
	
	//store what we do on the ready state change
	xhttp.onreadystatechange = rdyStateChange
	
	if (formEle.method.toLowerCase() == "post") {
		xhttp.open("POST",formEle.action,true);
	}

	//send the actual data from the form
	xhttp.send(frmData);

}
