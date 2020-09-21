//this function takes a SINGLE group and returns an html row corisponding to that group
function group2Elem(grp) {
	let tr = document.createElement("tr");
	tr.setAttribute("class","golfTeamRow");

//create the text display elements for the table
	let name = document.createElement("td");	
	name.setAttribute("class","golfTeamRowName");
	let txtName = document.createElement("p");

	let owner = document.createElement("td");
	owner.setAttribute("class","golfTeamRowOwner");
	let txtOwner = document.createElement("p");

//add there text

	//txtName.innerHTML = grp.name, this wierd long method helps ensure the browser doesnt confuse grp.name for html and allow xss
	txtName.appendChild(
		document.createTextNode(grp.name)
	);
	name.appendChild(txtName);

	//owner.innerHTML = grp.owner, this wierd long method helps ensure the browser doesnt confuse grp.name for html and allow xss  
	txtOwner.appendChild(
		document.createTextNode(grp.owner)
	);
	owner.appendChild(txtOwner);

//create and the link for managing the groups	
	let btn_td = document.createElement("td");	
	
	let lnk = document.createElement("a");
	lnk.setAttribute("href","./manage.php?team_name=" + grp.name);
	lnk.setAttribute("class","block-link");
	lnk.innerHTML = "manage";
	
	btn_td.appendChild(lnk);

//finalize and return the table row
	tr.appendChild(name);
	tr.appendChild(owner);
	tr.appendChild(btn_td);
	
	return tr;
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
			displayGroups(document.getElementById("group-table-display"),object);
		}
	})
};
