/*
	this function submits the data from the given form element to the
	server
*/
let resp;
function getAllGroups() {
	grabJSON_AJAX("./api/groups.php",(readyState,status,responseText,object) => {
		//if we get good responces store the responce object
		if (readyState == 4 && status == 200) {
			resp = object;
		}
	})
}

window.onload = getAllGroups;
