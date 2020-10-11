<!DOCTYPE html>
<html>
<head>
	<title>Groups</title>
	<meta name="viewport" content="width=device-width, initial-scale=1">	
 	  
	<!--Bootsrap 4 CDN-->
	<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">
    
	<!--Custom styles-->
	<link rel="stylesheet" type="text/css" href="./css/main.css">	
	<link rel="stylesheet" type="text/css" href="./css/groups.css">	
</head>
<body>
	<script>
		<!--realisticaly this would be set by a php function from another php file in the future-->
		<?php echo 'const PHP_GIVEN_JSON_TEXT=\'{"obj":{"name":"Obie","status":"Good Boy","age":8},"attr":["name","status","age"]}\''?>
	</script>
	<div class="main_content container">
		<div class="jumbotron header">
			<h1 id="head"></h1>		
		</div>
		<div id="main" class="main">
			<!--
			<table class="table table-hover table-striped">
				<thead class="thead-dark">
					<tr>
						<th>Name</th>
						<th>Owner</th>
						<th>Manage</th>
					</tr>
				</thead>	
				<tbody id="group-table-display"></tbody>
			</table>
			-->
		</div>
		<div class="row footer">
		</div>
	</div>
	<script type="text/javascript" src="./js/main.js"></script>
	<script type="text/javascript" src="./js/form.js"></script>
</body>
</html>
