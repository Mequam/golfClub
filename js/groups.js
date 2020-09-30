//this function takes a SINGLE group and returns an html row corisponding to that group
function group2Elem(grp) {
	//create the row for the object using the obj2TblRow function	
	let row = obj2TblRow(grp,["name","owner"],(prop,data) => {
		data.setAttribute("class",(prop == "name") ? "golfTeamRowName" : "golfTeamRowOwner");
		return data;
	});
	
	//create the link for managing the groups	
	let btn_td = document.createElement("td");	
	
	let lnk = document.createElement("a");
	lnk.setAttribute("href","./manage.php?team_name=" + grp.name);
	lnk.setAttribute("class","block-link");
	lnk.innerHTML = "manage";
	
	btn_td.appendChild(lnk);

	//add the custom button to the row 
	row.appendChild(btn_td);
	
	//set the row class attribute
	row.setAttribute("class","golfTeamRow");
	
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

//this can be thought of as our main code, it runs when the window is loaded
window.onload = function () {	
	grabJSON_AJAX("./api/groups.php",(readyState,status,responseText,object) => {
		//if we get good responces store the responce object
		if (readyState == 4 && status == 200) {
		//load the elements in the table
			let tbl = createTableBootstrap(object.api.groups,["NAME","OWNER","MANAGE"],group2Elem)
			tbl.setAttribute("class","table table-hover table-striped")	
			tbl.childNodes[0].setAttribute("class","thead-dark")	
			//add the bootstrap table to the document
			document.getElementById("main").appendChild(tbl);

			//displayGroups(document.getElementById("group-table-display"),object);
		}
	})
};
