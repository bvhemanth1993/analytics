var analytics = $.noConflict();

analytics(document).ready(function(){
	//get form data
	promiseFormData.then( value => {
	
		//var value=data//{"data": {"brands": ["micromax", "intex", "sony", "gionee", "alps", "lenovo", "xiaomi", "samsung", "oppo", "lava", "motorola", "asus", "vivo", "iball", "panasonic"], "battery_slabs": [6, 8, 1, 2, 10, 3, 4, 5, 9, 7], "org_names": ["jatl", "aavas"], "app_versions": ["118", "140", "146", "150"]}};
		for (var i = 0; i < value.data.battery_slabs.length; i++) {
	        analytics("#battery").append("<option value="+value.data.battery_slabs[i]+">" + value.data.battery_slabs[i] + "</option>");
	     }
	     for (var i = 0; i < value.data.app_versions.length; i++) {
	        analytics("#version").append("<option value="+value.data.app_versions[i]+">" + value.data.app_versions[i] + "</option>");
	     }
	     for (var i = 0; i < value.data.org_names.length; i++) {
	        analytics("#organization").append("<option value="+value.data.org_names[i]+">" + value.data.org_names[i] + "</option>");
	     }
	     for (var i = 0; i < value.data.brands.length; i++) {
	        analytics("#brand").append("<option value="+value.data.brands[i]+">" + value.data.brands[i] + "</option>");
	     }
	}, reason => {
		console.log(reason); // Error!
	} );
});

var promiseFormData = new Promise(function(resolve, reject) {
	analytics.ajax({
		type:'get',
		url:'https://analytics.loktra.com/api/v1/data-loss/form-data',
		contentType:"application/json",
		success:function(data)
		{
			console.log(data);	
			resolve(data);
		},error:function(xhr,error){
			reject(error);
		}
	});
});


//get data loss stats

analytics('#analyticsform').on('submit',function(e)
{
	e.preventDefault();
	var slabs=analytics("#battery").val().join(',');
	var org=analytics('#organization').val().join(',');
	var version=analytics('#version').val().join(',');
	var brands=analytics('#brand').val().join(',');
	var from=analytics('#fromDate').val();
	var to=analytics('#toDate').val();

	analytics.ajax({
		type:'get',
		url:'https://analytics.loktra.com/api/v1/data-loss/stats-listing?from_date='+from+'&to_date='+to+'&org_name='+org+'&brand='+brands+'&version='+version+'&battery_status='+slabs,
		contentType:'application/json',
		success:function(data)
		{	
			console.log(data);

			var table=document.getElementById('tableForstats');
			var json=data;
			console.log(json.data.length);
			var tableHead=[];

			var totalColumns = Object.keys(json.data[0]).length;
			var columnNames = [];
			columnNames = Object.keys(json.data[0]);

			for ( property in json.data[0] ) {
  				///console.log( property ); // Outputs: foo, fiz or fiz, foo
  				console.log(json.data[0][property]);
  				tableHead.push(property);
			}

			//console.log(json.data[0][org_name]);
			var table = document.createElement('table');
			table.setAttribute('id','table');
			table.style.width="100%";
			table.border = "1";

			//Add the header row.
			var row = table.insertRow(-1);
			for (var i = 0; i < totalColumns; i++) {
			  var headerCell = document.createElement("TH");
			  headerCell.innerHTML = columnNames[i];
			  row.appendChild(headerCell);
			}

			// Add the data rows.
			for (var i = 0; i < json.data.length; i++) {
			  row = table.insertRow(-1);
			  
			  	columnNames.forEach(function(columnName) {
			    	var cell = row.insertCell(-1);
			    	row.setAttribute(columnName,json.data[i][columnName]);
			    	cell.innerHTML = json.data[i][columnName];
			  	});
			}

			var dvTable = document.getElementById("tableForstats");
			dvTable.innerHTML = "";
			dvTable.appendChild(table);
			var tableclick=document.getElementById('table');
			tableclick.addEventListener('click',function(e){
				console.log(e.target.closest('tr'));
				var data=[];
				var objects = json.data[0];
				columnNames.forEach(function(columnName) {
					var addtribute=e.target.closest('tr').getAttribute(columnName);
			    	data.push(addtribute);
			    	if(addtribute=='undefined')
			    	{
			    		addtribute='';
			    	}
			    	if(addtribute=='N/A')
			    	{
			    		addtribute='';
			    	}
			    	objects[columnName] = addtribute;
			  	});
				objects['member_id']='';

				console.log(objects);

				//https://analytics.loktra.com/data-loss/agent-details?from_date=2017-11-27&to_date=2017-12-01&orgnisation=aavas&brand=all&version=all&member_id=none&battery_status=all

				analytics.ajax({
					type:'get',
					url:'https://analytics.loktra.com/api/v1/data-loss/agent-details?from_date='+from+'&to_date='+to+'&org_name='+objects['org_name']+'&brand='+objects['brand']+'&app_version='+version+'&member_id=&battery_status='+objects['battery_slab'],
					contentType:'application/json',
					success:function(data)
					{	
						console.log(data);
					},error:function(xhr,status,error)
					{
						console.log(xhr,status,error);
					
					}
				});	

			});

		},error:function(xhr,status,error)
		{
			console.log(xhr);
		}
	});

});
