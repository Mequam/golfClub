/*
	this is a syntatic sugar function that returns an object used for parsing variables in the link
	of the web page 
*/
function getQueryStringObj() {
	//return the object used to deal with query strings
	return new URLSearchParams(window.location.search);
}
/*
	This function submits the data from the given form element to the
	server
	
	TODO: this needs to be defined for GET forms right now its only defined for POST
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

/*
	this function is purly syntax sugar, it runs an ajax request with the given hooks for ready
	state change
*/
function callAjax(link,hooks) {
	xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {	
		hooks(this.readyState,this.status,this.responseText);
	};
	xhttp.open("GET",link,true);
	xhttp.send();
}

/*
	this is a helper function that parses an incoming string as an api object
	
	message status is metadata about the responce of the server that we get the str json text from
*/
function jsonApiStr(str,msgStat=200) {
	return {api:JSON.parse(str),msg_status:msgStat};
}
/*
	this function takes an api link, and a hook function which accepts the readyState State and responce text of the connection
	in addition to a javascript object that is passed down by this fuction from the api link

	NOTE: this function is designed for hooks to set an external object to the jsonObj passed to it as apposed to using
	a return value as this is effectivly async, event based code
*/
function grabJSON_AJAX(link,hooks = (rdyState,stat,respTxt,jsonObj) => {}) {
	
	//this is the object that we will be passing to the hook eventualy
	let obj = {};

	//call the ajax with the given hooks wrapped in our gode
	callAjax(link,(readyState,status,responseText) => {	
		
		//this is the good case, it means we have a responce so parse the JSON data and pas it to whatever hooks the user has in place
		if (readyState == 4 && status == 200) {		
			obj = jsonApiStr(responseText,200);
		}
		
		//this is the super bad case, we have been denied privelage by the server or somthing went wrong on the server end
		//pass the object with a bad status
		else if ((readyState == 4 || readyState == 2) && status != 200) {
			obj = {object:{},msg_status:status};	
		}
	
		//actually pass the data down to the user defined hooks	
		hooks(readyState,status,responseText,obj);
	});
}

//this function represents the default adding behavior obj2TblRow function
function defAddProps(obj,prop,hooks) {
			//create the table data element for the given object property
			let tdEl = document.createElement("td")

			//create a p element to place inside the td
			let pEl = document.createElement("p")
				
			//connect the elements together	
			pEl.append(
				document.createTextNode(obj[prop])
			);
			tdEl.append(pEl);
			
			//set the headers of the td element
			tdEl.setAttribute("headers",prop.toUpperCase());

			//append that element to the table row object
			return hooks(prop,tdEl);
}
/*
	this is a generic function that converts a js object into an html element for display
	the type of element is decided by the html element and the function converting the properties of the
	element into html elements is defaultAddProps, it's default behavior is to create tr objects
	
	NOTE: propOrder is required for the order of the properties, it is possible to simply loop over those properties
	but we cannot rely on order when doing that, if that is the wanted behavior a re-map of this function could achive that
*/
function Obj2Html(obj,propOrder, html="" ,hooks = (prop,data) => data, defaultAddProps = defAddProps) {
		
	//make the html element
	let ele = document.createElement(html);
	
	//foreach property specified in the property order, add the property element to the html element
	propOrder.forEach(props => {ele.appendChild(defaultAddProps(obj,props,hooks))});

	//return the html element
	return ele;		
	
}

//this is a helper fuction that returns a form element based on the given variables
function createFormElement(eleName,obj,propName,eleAttributes) {
	let retVal = document.createElement(eleName);	
	
	retVal.setAttribute("id",eleName + "-frmInput-" + propName);
	retVal.setAttribute("placeholder",obj[propName]);
	retVal.setAttribute("name",propName);
	
	eleAttributes.forEach(attrPair => {
		retVal.setAttribute(attrPair.attr,attrPair.val);
	});

	return retVal;
}

//this is the default behavior for adding sub elements in the obj2Form function
function defAddPropsForm(obj,prop,hooks = (prop,ele) => ele) {
	
	//we return our form element as a bootstrap form group
	let frmGroup = document.createElement("div");
	frmGroup.setAttribute("class","form-group");

	//default value for ele	
	let ele = document.createElement("span");
	switch (typeof obj[prop]) {
		case "string":
			ele = createFormElement("input",obj,prop,[{"attr":"type","val":"text"}]);
			break;
		case "number":
			ele = createFormElement("input",obj,prop,[{"attr":"type","val":"number"}]);
			break;	
		break;
	}

	//make sure that the previous class is maintained
	ele.setAttribute("class",ele.getAttribute("class") + " form-control");

//create the label for the element
	let lbl = document.createElement("label");
	lbl.setAttribute("for",ele.getAttribute("id")); //its good practice to grab the id from the actual element, even if we could get it else where
	lbl.innerHTML = obj[prop];

//append the label and the element
	frmGroup.append(lbl);
	frmGroup.appendChild(ele);
	return hooks(prop,frmGroup);
}
//syntactic sugar command that converts an object to an html form
function obj2Form(obj,propOrder, hooks = (prop,data) => data, defaultAddProps = defAddPropsForm) {
	return Obj2Html(obj,propOrder,"form",hooks,defaultAddProps);
}
//syntatic sugar command that converts an object to a table row in the order of properties in propOrder
function obj2TblRow(obj,propOrder, hooks = (prop,data) => data, defaultAddProps = defAddProps) {	
	return Obj2Html(obj,propOrder,"tr",hooks,defaultAddProps);
}

//returns a list of text values contained within the th of the first row of the given table
function getTblHeaders(tbl) {
	let retVal = [];
	tbl.querySelectorAll("th").forEach(
		th => {retVal.push(th.innerHTML.toLowerCase())}
		);
	return retVal;
}

//this function takes a table element and an object, and converts that object into a
//table row for that talble using the table headers of the table as properties for the object
function convForTable(tbl,obj,hooks = (prop,data) => data,defaultAddProps = defAddProps) {
	return obj2TblRow(obj,getTblHeaders(tbl), hooks, defaultAddProps)
}
/*
	This function takes a list of objects, and a list of headers that are properties of an object
	and returns the table corisponding to that object.
*/
function createTable(objList,headers,objConv = obj2TblRow,hooks = (prop,data) => data, defaultAddProps = defAddProps) { 
	let tbl = document.createElement("table");
	let tblHead = document.createElement("thead");
	let tblBod = document.createElement("tbody");
		
	//populate the table Header
	headers.forEach(head => {
		let th = document.createElement("th");
		th.appendChild(document.createTextNode(head.toUpperCase()));
		tblHead.appendChild(th);
	});
	//populate the table Body
	objList.forEach(obj => {
		tblBod.appendChild(objConv(obj,headers,hooks,defaultAddProps));
	});

	//append the head and the body of the table to the table	
	tbl.appendChild(tblHead);
	tbl.appendChild(tblBod);

	return tbl;
}

//convienence wrapper for the createTable function that adds bootstrap table classes to the table
function createTableBootstrap(objList,headers,objConv = obj2TblRow,hooks = (prop,data) => data, defaultAddProps = defAddProps) { 	
	let tbl = createTable(objList,headers,objConv,hooks, defaultAddProps);
	tbl.setAttribute("class","table");	
	return tbl;
}
