var provinces=new Array();	
	  
	  //jQuery代码
		$(function(){
			$("body").css("height",window.innerHeight+"px");
			//$("#toc").css("height",$("#map").css("height"));
			/*$("#search").click(function(){
			//console.log($("#select_class")[0].value);
				$.get("php/hometownsum.php?class="+$("#select_class")[0].value,function(data,status){
					var obj=eval("("+data+")");
					for(var i=0;i<obj.length;i++){
						provinces[i]=obj[i][0];
					}
					//alert("获取成功！");
					alert(status);
				});
			});*/
			});
		
var map;
		var visible=[];
		var layer=[];
		var symbol;
		//var graphic;
		//dojo代码
		require([
		"dojo/dom","dojo/on",
		"esri/map","esri/layers/ArcGISDynamicMapServiceLayer","esri/layers/FeatureLayer",
		"esri/tasks/query", "esri/tasks/QueryTask","esri/symbols/SimpleFillSymbol","esri/InfoTemplate", "esri/geometry/Extent","dojo/_base/Color","esri/SpatialReference","esri/geometry/Point",
		"esri/tasks/IdentifyTask","esri/tasks/IdentifyParameters",
		"esri/request","dojo/_base/json",
		"dojox/charting/Chart", "dojox/charting/plot2d/Pie", "dojox/charting/action2d/Highlight",
         "dojox/charting/action2d/MoveSlice" , "dojox/charting/action2d/Tooltip",
         "dojox/charting/themes/Chris", "dojox/charting/widget/Legend",
		 "dojox/charting/axis2d/Default", "dojox/charting/plot2d/ClusteredColumns",
         "dojo/fx/easing" ,"dojo/domReady!"],
		function(dom,on,Map, ArcGISDynamicMapServiceLayer,FeatureLayer,Query, QueryTask,SimpleFillSymbol,InfoTemplate,Extent,Color,SpatialReference,Point,IdentifyTask,IdentifyParameters,esriRequest,dojoJson,
		Chart, Pie, Highlight, MoveSlice, Tooltip, Chris, Legend,Default, ClusteredColumns, easing){
			//var startExtent=new Extent(70.866,17.462,136.586,59.656,new SpatialReference({ wkid:4326 }));
			map = new Map("map");
			//map.centerAndZoom(new Point(108.972,31.81,new SpatialReference({ wkid:4326 })),0.5);
			layer = new ArcGISDynamicMapServiceLayer("http://localhost:6080/arcgis/rest/services/ChinaProvince/MapServer");
			//layer.initialExtent=new Extent(70.866,17.462,136.586,59.656,new SpatialReference({ wkid:4326 }));
            map.addLayer(layer);

			var queryTask = new QueryTask("http://localhost:6080/arcgis/rest/services/ChinaProvince/MapServer/0");
			  var query = new Query();
			   query.returnGeometry = true;
			    query.outFields=["Name"];
			
			symbol = new SimpleFillSymbol();
			 symbol.setStyle(SimpleFillSymbol.STYLE_SOLID);
			  symbol.setColor(new Color([255,255,0,1]));	
				
				//console.log(dom.byId("paint"));
				
			//事件绑定部分
			on(dom.byId("paint"),"click",sendRequest);
			on(map,"load",initIdentify);
			on(map,"click",doIdentify);
			on(layer,"load",loadLayerList);
			on(dom.byId("showpiechart"),"click",sendRequest2);
			on(dom.byId("showbarchart"),"click",sendRequest2);
			
			function initIdentify(){
			//alert("aaa");
				
				identifyTask=new IdentifyTask("http://localhost:6080/arcgis/rest/services/ChinaProvince/MapServer");
				identifyParams = new IdentifyParameters();
				identifyParams.tolerance = 3;
				//进行Identify的图层
				identifyParams.layerIds=[0];
				//进行Identify的图层为全部
				identifyParams.layerOption = IdentifyParameters.LAYER_OPTION_ALL;
			}
			
			function doIdentify(evt){
			//alert(evt);
			//Identify的geometry
				identifyParams.geometry=evt.mapPoint;
				//Identify范围
			identifyParams.mapExtent = map.extent;
			identifyTask.execute(identifyParams, function(idResults) { showIdentifyResults(idResults, evt); });
			}
	
				
				//发送ajax请求，返回json数组
			function sendRequest(){
				//alert("a");
				//console.log(classname);
				var classname = dom.byId("select_class").value;
				var request = esriRequest({
				url:"./php/hometownsum.php?class="+classname,
				handleAs:"json"
				});
				
				request.then(function(data){
					//console.log(data);
					paintZhuantitu(data);  //调用绘制专题图函数
				},function(error){
					console.log("error:",error.message);
					//console.log("x");
				});
			}
			
			//查询生源地省份
			function paintZhuantitu(info){
				provinces = info;
				//console.log(provinces);
				map.graphics.clear();
				for (var i =0;i<provinces.length;i++){
				//console.log(provinces[i]);				
				query.text=provinces[i][0];
				queryTask.execute(query,showResults);
				}
			}
			
			//绘制出生源地专题图
			function showResults(results){
				  var graphic = results.features[0];
				  graphic.setSymbol(symbol);
				  //infoTemplate = new InfoTemplate();
				//graphic.setInfoTemplate(infoTemplate);
					   map.graphics.add(graphic);	
			}
			
			//显示identify的结果
			function showIdentifyResults(idResults,evt){
				idProvince=idResults[0].value;  //识别出来的省份信息
				//console.log(idProvince);
				for (var i =0;i<provinces.length;i++){
					if(provinces[i][0]==idProvince){
						var count = provinces[i][1];  //获取识别省份人数
					}
				}
				map.infoWindow.setTitle("详细信息");
				map.infoWindow.setContent("<b>省份：</b>"+idProvince+"<br><b>学生人数：</b>"+count);
				map.infoWindow.show(evt.screenPoint,map.getInfoWindowAnchor(evt.screenPoint));
				
			}
			
			
			function loadLayerList(layers)
			{
				//alert("aaa");
				//console.log(layers);
				var html="";
				var infos=layers.layer.layerInfos;
				
				//console.log(infos);
				//获取图层的信息
				for(var i =0;i<infos.length;i++){
					var info=infos[i];
					//console.log(info);
					if(info.defaultVisibility){
						visible.push(info.id);
					}
					//输出图层列表的html
					html=html+"<div><input id='"+info.id+"' name='layerList' class='listCss' type='checkbox' value='checkbox' "+(info.defaultVisibility ? "checked":"")+" />"+info.name+"</div>"
					//dom.byId("toc").innerHTML=html;
					
				}
				//设置可见图层
				layer.setVisibleLayers(visible);
				//console.log(html);
				dom.byId("toc").innerHTML+=html;
				//console.log(info.id);
				//console.log(dom.byId("'"+info.id+"'"));
				//var id="'"+info.id+"'";
				//console.log(id);
				//console.log(dom.byId("'"+0+"'"));
				
				on(dom.byId('0'),"click",setLayerVisibility);
				
			}
			
			function setLayerVisibility(){
				//alert("a");
					var inputs= dojo.query(".listCss");
					visible=[];
					for(var i=0;i<inputs.length;i++){
						if(inputs[i].checked){
							visible.push(inputs[i].id);
							}
					}
					layer.setVisibleLayers(visible);
			}
			
			function sendRequest2(evt){
				//alert(evt.currentTarget.id);
				if(evt.currentTarget.id=="showbarchart"){
					var request = esriRequest({
					url:"./php/popsum.php",
					handleAs:"json"
					});
					request.then(function(data){
						//console.log(data);
						drawBarChart(data);  //调用绘制柱状图函数
					});
				}
				else{
					var classname = dom.byId("select_class").value;
					var request = esriRequest({
					url:"./php/boygirlsum.php?class="+classname,
					handleAs:"json"
					});
					
					request.then(function(data){
						//console.log(data);
							drawPieChart(data);  //调用绘制饼图函数
					},function(error){
						console.log("error:",error.message);
					});
				}
			}
			
			function drawPieChart(info){
				dom.byId("chartTwo").innerHTML="";  //清空div
				dom.byId("legendTwo").innerHTML="";
				//console.log(info);
				//转整型
				for (var i =0;i<info.length;i++){
					info[i][1]=parseInt(info[i][1]);
				}
				var chartTwo = new Chart("chartTwo");
				chartTwo.setTheme(Chris)
				 .addPlot("default", {
					type: Pie,
					font: "normal normal 11pt Tahoma",
					fontColor: "black",
					labelOffset: -30,
					//animate: { duration: 2000, easing: easing.elasticInOut },
					radius: 80
				}).addSeries("Series", [
					{y: info[0][1], text: info[0][0],  stroke: "black", tooltip: info[0][0]+"生比例"+(info[0][1]/(info[0][1]+info[1][1])*100).toFixed(1)+"%"},
					{y: info[1][1], text: info[1][0], stroke: "black", tooltip: info[1][0]+"生比例"+(info[1][1]/(info[0][1]+info[1][1])*100).toFixed(1)+"%"}
				]);
				var anim_a = new MoveSlice(chartTwo, "default");
				var anim_b = new Highlight(chartTwo, "default");
				var anim_c = new Tooltip(chartTwo, "default");
				chartTwo.render();
				var legendTwo = new Legend({chart: chartTwo}, "legendTwo");
			}
			
			function drawBarChart(info){
				dom.byId("chartTwo").innerHTML="";  //清空div
				dom.byId("legendTwo").innerHTML="";
				//console.log(info);
				//console.log(typeof(info[0][1]));
				//console.log(info[0][1]+info[2][1]);
				//将数组中的字符型转换成整型
				for (var i =0;i<info.length;i++){
					info[i][1]=parseInt(info[i][1]);
				}
				var chartTwo = new Chart("chartTwo");
				chartTwo.setTheme(Chris)
				.addAxis("x", { title:"年级",titleOrientation:"away",fixLower: "minor", fixUpper: "minor", natural: true,
					labels:[{value:1,text:"2012级"},{value:2,text:"2013级"},{value:3,text:"2014级"},
					{value:4,text:"2015级"}]}).
				  addAxis("y", { title:"人数",vertical: true, fixLower: "major", fixUpper: "major", includeZero: true }).
				  addPlot("default", { type: ClusteredColumns, gap: 10, animate: { duration: 2000, easing: easing.bounceInOut } }).
				   //addSeries("Series A", [ 2, 1, 0.5, 1, 2 ] ).
     // addSeries("Series B", [ 2, 1, 0.5, 1, 2 ] ).
      //addSeries("Series C", [ 1, 0.5, 1, 2, 3 ] ).
				  addSeries("女生人数", [info[0][1],info[2][1],info[4][1],info[6][1]]).
				  addSeries("男生人数", [info[1][1],info[3][1],info[5][1],info[7][1]]).
				  addSeries("所有人数", [ info[0][1]+info[1][1],info[2][1]+info[3][1],info[4][1]+info[5][1],info[6][1]+info[7][1]] );
				  var anim_b = new Highlight(chartTwo, "default");
				  var anim_c = new Tooltip(chartTwo, "default");
				  chartTwo.render();
				  var legendTwo = new Legend({chart: chartTwo}, "legendTwo");
			}
			
			});