/*	
	this function takes an object and the properties of that object and returns a row for that object
	where each td in the row has the desired class
	
	NOTE: this function is ALMOST the same as the obj2TblRow function. It does everything the same
	EXCEPT that the td elements in the row have classes appended to them
*/
function group2Elem(grp,properties,additionalElements) {
	//create the row for the object using the obj2TblRow function	
	let row = obj2TblRow(grp,properties,(prop,data) => {
		data.setAttribute("class","row-"+prop);
		return data;
	});

	//add any additional elements to the row	
	additionalElements.forEach(e => row.appendChild(e.cloneNode(true)));
	
	//return the row
	return row;
}

//this function takes a list of groups and displays them in the given table display
function displayGroups(tbl,groupApiObj) {
	//clear out the table in case it has other groups in it
	tbl.innerHTML = ""
	
	//add every group to the table
	let i = 0;	
	groupApiObj.api.groups.forEach( ele => {
			let r = group2Elem(ele);
			r.setAttribute("id","grpRow_"+i);
		
			tbl.appendChild(r);
			i += 1;
		}
	);
}
//this is a helper function that creates block links containing the given text
function createBlockLink(linkText) {
	let td = document.createElement("td");
	let a = document.createElement("a");
	a.appendChild(document.createTextNode(linkText));

	a.setAttribute("class","block-link");		
	a.setAttribute("href","#");

	td.appendChild(a);	
	return td
}
/*
	this function takes an api object and returns the object represented as a table
*/
function createObjTable(object) {
	//load the elements in the table
		
		let topHeaders = []
		let topHeadersTxt = []
		if (object.api.manageAble) {
			//save the node that represents the management button
			topHeaders.push(createBlockLink("manage"));
			//we want to display manage as a text header
			topHeadersTxt.push("manage");
		}
		if (object.api.deleteAble) {
			//we tell the program that we want to have delete added to the table
			topHeaders.push(createBlockLink("delete"));
			topHeadersTxt.push("delete");
		}
		
		
		//create the table with the given headers
		let tbl = createTableBootstrap(
			object.api.groups, //the list of objects we build with
			object.api.headers.concat(topHeadersTxt), //the text headers for the top of that table
			obj => group2Elem(obj,object.api.headers,topHeaders) //the function to convert those objects to table rows, I miss haskells curried function
		);
		
		//set the class of the table to what we want
		tbl.setAttribute("class","table table-hover table-striped")	
		tbl.childNodes[0].setAttribute("class","thead-dark")	
		
		//return the table to the caller
		return tbl;
}

//this function loads the given api for the table
function loadTblApi(apiLnk) {	
	grabJSON_AJAX(apiLnk,(readyState,status,responseText,object) => {
		//if we get good responces store the responce object
		if (readyState == 4 && status == 200) {
			document.getElementById("main").innerHTML = "";
			document.getElementById("main").appendChild(createObjTable(object));
			document.getElementById("head").innerHTML = "";
			document.getElementById("head").appendChild(document.createTextNode(object.api.objType));
		}
	});
}
//this can be thought of as our main code, it runs when the window is loaded
window.onload = function () {
	loadTblApi("./api/groups.php");
};
