function checkLoginCredentials() {	
	submitFormAjax(document.getElementById("frmLogin")	
		,function () {
			//valid username and password
			if (this.readyState == 4 && this.status == 200) {	
				window.location.href = "./menu.html"
			}
			//invalud username and password
			else if (this.readyState == 4 && this.status == 401) {
				document.getElementById("login_err").innerHTML 
				= "Invalid username or password";
			}
				
		}
	);	
}
