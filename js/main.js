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
	this function takes an api link, and a hook function which accepts the readyState State and responce text of the connection
	in addition to a javascript object that is passed down by this fuction from the api link
*/
function grabJSON_AJAX(link,hooks = (rdyState,state,respTxt,jsonObj) => {}) {
	
	//this is the object that we will be passing to the hook eventualy
	let obj = {};

	//call the ajax with the given hooks wrapped in our gode
	callAjax(link,(readyState,status,responseText) => {	
		
		//this is the good case, it means we have a responce so parse the JSON data and pas it to whatever hooks the user has in place
		if (readyState == 4 && status == 200) {		
			obj = {api:JSON.parse(responseText),msg_status:200};
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

//converts an object to a table row in the order of properties in propOrder
function obj2TblRow(obj,propOrder, hooks = (prop,data) => data, defaultAddProps = defAddProps) {	
	
	//make the table row element
	let tr = document.createElement("tr");
	
	//foreach property specified in the property order, add the element to the table row
	propOrder.forEach(props => {tr.appendChild(defaultAddProps(obj,props,hooks))});

	//return the table row
	return tr;
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
		th.appendChild(document.createTextNode(head));
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
