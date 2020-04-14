/**
 * Copyright (c) 2008-2013 GIANTS Software GmbH, Confidential, All Rights Reserved.
 * Copyright (c) 2003-2013 Christian Ammann and Stefan Geiger, Confidential, All Rights Reserved.
 */

function loadWebStats(url, showIsAdmin, showModVersion) {
	var getVehicleType = (function () {
	    // Maps individual vehicle types to vehicle group names
	    var vehicleGroupMapping = {
	    	  // this is for proper point color on map
	    	  // tool - yellow point
	    	  // vehicle - green point
	    	  // trailer - blue point
	    	  // harvester - red point 
	    	  
	    	  // tool is default, so if any new is tool
	    	  // you dont have to specified it here
	        // Default
	        '@': 'tool',

	        // vehicles
	        'vehicle': 'vehicle',
	        'VEHICLES': 'vehicle',
	        'baseDrivable':'vehicle',
	        'conveyorBelt':'vehicle',
	        'drivableMixerWagon':'vehicle',
	        'selfPropelledSprayer':'vehicle',
	        'tractor':'vehicle',
	        'TRACTORSL': 'vehicle',
  		  	  'TRACTORSS': 'vehicle',
	        'TRACTORSM': 'vehicle',
	        'woodTruck':'vehicle',
	        'carFillable': 'vehicle',
	        'CARS': 'vehicle',
	        'TRUCKS': 'vehicle',

	        // harvesters
	        'harvester': 'harvester',
	        'HARVESTERS': 'harvester',
	        'cottonHarvester':'harvester',
	        'combineDrivable': 'harvester',

	        // trailers
	        'trailer': 'trailer',
	        'TRAILERS': 'trailer',
	        'forwarderTrailer':'trailer',
	        'loaderVehicle':'trailer',
	        'manureTrailer':'trailer',
	        'MANURESPREADERS': 'trailer',
	        'LOADERWAGONS': 'trailer',
	        'LOWLOADERS': 'trailer',
	        'CUTTERTRAILERS': 'trailer',
	        'DOLLYS': 'trailer',
	        'TIPPERS': 'trailer',
	        'AUGERWAGONS': 'trailer',
	        'trainTrailer':'trailer',
  		  	  'trainTimberTrailer':'trailer',

	        // groups
	        'WHEELLOADERS': {
	            '@': 'vehicle',
	            'dynamicMountAttacherImplement': 'tool',
	            'shovel_animated': 'tool',
	            'shovel_dynamicMountAttacher': 'tool'
	        },
	        'TELELOADERS': {
	            '@': 'vehicle',
	            'dynamicMountAttacherImplement': 'tool',
	            'implementDynamicMountAttacher': 'tool',
	            'strawBlower':'tool',  
	            'baleGrab': 'tool',
	            'shovel_dynamicMountAttacher': 'tool',
	            'shovel_animated': 'tool'
	        },
	        'SKIDSTEERS': {
	            '@': 'vehicle',
	            'dynamicMountAttacherImplement': 'tool',
	            'shovel': 'tool',
	            'shovel_dynamicMountAttacher': 'tool',
	            'stumpCutter': 'tool',
	            'treeSaw': 'tool'
	        },
	        'GATORPACK': {
	            '@': 'vehicle',
	            'carFillable':'vehicle',
	            'FS19_JohnDeereGatorPack.jdUniversalTankTrailer':'trailer',
					'FS19_JohnDeereGatorPack.jdUniversalTankTrailer':'trailer',	            
	        },	        
	        'FORAGEHARVESTERS': {
	            '@': 'harvester',
	            'attachableCombine': 'tool'
	        },
	        'POTATOHARVESTING': {
	            '@': 'harvester',
	            'defoliator_animated': 'tool'
	        },
	        'BEETHARVESTING': {
	            '@': 'harvester',
	            'defoliater_cutter_animated': 'tool'
	        },
	        'FRONTLOADERS': {
	            '@': 'tool',
	            'wheelLoader': 'vehicle'
	        },
	        'SPRAYERS': {
	            '@': 'tool',
	            'selfPropelledSprayer': 'vehicle'
	        },
	        'BALING': {
	            '@': 'tool',
	            'transportTrailer': 'trailer',
	            'baleLoader': 'trailer',
	            'baler': 'trailer'
	        },
	        'WOOD': {
	            '@': 'tool',
	            'transportTrailer': 'trailer',
	            'forwarderTrailer_steerable': 'trailer',
	            'woodCrusherTrailer': 'trailer',
	            'combine_animated': 'vehicle',
	            'forwarder': 'vehicle',
	            'woodHarvester': 'vehicle'
	        },
	        'MISC': {
	            '@': 'tool',
	            'fuelTrailer': 'trailer'
	        },
	        'SLURRYTANKS': {
	            '@': 'trailer',
	            'manureBarrelCultivator': 'tool'
	        },
	        'ANIMALS': {
	            '@': 'trailer',
	            'selfPropelledMixerWagon': 'vehicle'
	        },
	        
	    };

	    return function (vehicleType, vehicleSubtype) {
            var mapping = vehicleGroupMapping[vehicleType] || vehicleGroupMapping['@'];

            if (mapping instanceof Object) {
                mapping = mapping[vehicleSubtype] || mapping['@']
            }

            return mapping;
	    };
	}());

	$.get(url, function(data){
        
		var Server = $(data).find("Server");
        
		if (Server != null) {
			$("#webStatsVersion").text($(Server).attr("version"));
			$("#webStatsGame").text($(Server).attr("game"));
			$("#webStatsServer").text($(Server).attr("server"));
			$("#webStatsName").text($(Server).attr("name"));
			$("#webStatsMapName").text($(Server).attr("mapName"));
			$("#webStatsMapSize").text($(Server).attr("mapSize"));
			//$("#webStatsMoney").text($(statistics).attr("money"));

			var mapSize = $(Server).attr("mapSize");
			var mapSizeHalf = mapSize / 2;

			var webStatsPlayers = $("#webStatsPlayers");
			var Players = $(data).find("Server Slots Player");
			if (webStatsPlayers != null && Players != null) {
				Players.each(function(index, element) {
					var Player = $(element);
					if (Player.attr("isUsed") == "true") {
					
						var uptime = Player.attr("uptime");
						var hours = Math.floor(uptime/60);
						var minutes = Math.floor(uptime-(hours*60));

						var adminStr = "";
						if (showIsAdmin) {
							if (Player.attr("isAdmin") == "true") {
								adminStr = "Admin";
							} else {
								adminStr = "Farmár";
							}
							adminStr = "<td>"+adminStr+"</td>";
						}
						
						var x = Player.attr("x");
						var y = Player.attr("y");
						var z = Player.attr("z");

						var posStr = "";
						if (typeof x !== "undefined" && typeof y !== "undefined" && typeof z !== "undefined") {
							posStr = "<td>" + x + " " + y + " " + z + "</td>";
						} else {
							posStr = "<td>vo vozidle</td>";
						}
						

						if (minutes < 10) {minutes = "0"+minutes;}
						webStatsPlayers.append("<tr><td>"+Player.text()+"</td><td>"+hours+":"+minutes+"</td>"+posStr+adminStr+"</tr>");
					}
				});
			}
			/* online players count */
			var PlayersCount = $(data).find("Server Slots");
			$("#webStatsPlCount").text("Hráči ("+PlayersCount.attr("numUsed")+"/"+PlayersCount.attr("capacity")+")");
			
			var webStatsMods = $("#webStatsMods");
			var Mods = $(data).find("Server Mods Mod");
			if (webStatsMods != null && Mods != null) {
				Mods.each(function(index, element) {
					var Mod = $(element);
				
					var versionStr = "";
					if (showModVersion) {
						versionStr = "<td>" + Mod.attr("version") + "</td>";
					}

					var authorText = ""
					if (Mod.attr("author").length > 50) {
						authorText = Mod.attr("author").substring(0, 50) + "...";
					} else {
						authorText = Mod.attr("author");
					}	

					var modText = ""
					if (Mod.text().length > 40) {
						modText = Mod.text().substring(0, 40) + "...";
					} else {
						modText = Mod.text();
					}				
				
					webStatsMods.append("<tr><td>"+modText+"</td><td>"+authorText+"</td><td>"+Mod.attr("hash")+"</td>"+versionStr+"</tr>");
				});
			}
			
			
			var webStatsVehicles = $("#webStatsVehicles");
			var Vehicles = $(data).find("Server Vehicles Vehicle");
			// var i = 0;
			if (webStatsVehicles != null && Vehicles != null) {
				Vehicles.each(function(index, element) {
					var veh = $(element);
					// console.log(veh);
					/* translate operator */
					switch(veh.attr("controller")) {
					  	case undefined:
					    	controller = "žiadny";
					    	break;				    	
					   default:
    						controller = veh.attr("controller");
					}
					function formatThousands(n,dp,f) {
						// dp - decimal places
						// f - format >> 'us', 'eu'
						if (n == 0) {
							if(f == 'eu') {
								return "0," + "0".repeat(dp);	
							}
							return "0." + "0".repeat(dp);
						}

						/* round to 2 decimal places */
						//n = Math.round( n * 100 ) / 100;
  						var s = ''+(Math.floor(n)), d = n % 1, i = s.length, r = '';
  						while ( (i -= 3) > 0 ) { r = ',' + s.substr(i, 3) + r; }
  						var a = s.substr(0, i + 3) + r + (d ? '.' + Math.round((d+1) * Math.pow(10,dp)).toString().substr(1,dp) : '.' + "0".repeat(dp));
  						/* change format from 20,000.00 to 20.000,00 */
  						if (f == 'eu') {
							var b = a.toString().replace(".", "#");
							b = b.replace(",", ".");
							return b.replace("#", ",");
  						}					
						return a;
					}
					/* translate each fill type, when multiple */
					var fillTypes = "";
					if (typeof veh.attr("fillTypes") !== 'undefined') {
						fillTypesArray = veh.attr("fillTypes").split(' ');	
						fillTypesArray.forEach(function(element, index) {
							/* translate element */					
							element = $.i18n._(element.trim());
							/* recreate concanate string of fill types */
							if (fillTypesArray.length-1 == index) {
								fillTypes = fillTypes + element;
							} else {
								fillTypes = fillTypes + element + " | ";
							}
						});
					} else {
						/* if veh.attr("fillTypes") undefined */
						fillTypes = "žiadny";
					}
					/* format numbers */
					/*console.log(veh.attr("fillTypes"));*/
					var fillLevels = "";
					if (typeof veh.attr("fillLevels") !== 'undefined') {
						fillLevelsArray = veh.attr("fillLevels").split(' ');	
						fillLevelsArray.forEach(function(element, index) {							
							/* format number */					
							element = formatThousands(element,2,'eu');
							/* recreate concanate string of fill levels */
							if (fillLevelsArray.length-1 == index) {
								fillLevels = fillLevels + element;
							} else {
								fillLevels = fillLevels + element + " | ";
							}
						});
					} else {
						/* if veh.attr("fillLevels") undefined */
						fillLevels = "0,00";
					}		
					webStatsVehicles.append("<tr><td>"+$.i18n._(veh.attr("name"))+"</td><td>"+$.i18n._(veh.attr("category"))+"</td><td>"+$.i18n._(veh.attr("type"))+"</td><td>"+$.i18n._(fillTypes)+"</td><td>"+fillLevels+"</td><td>"+controller+"</td><td>"+veh.attr("x")+" "+veh.attr("y")+" "+veh.attr("z")+"</td></tr>");
				});
			}	
            
			var webStatsMap = $("#webStatsMap");
            var Vehicles = $(data).find("Server Vehicles Vehicle");
			if (webStatsMap != null && Vehicles != null) {
            
                var linkToServer = url.replace("dedicated-server-stats.xml", "dedicated-server-stats-map.jpg");
                
                var imageQuality = 90;          // 60, 75, 90
                var imageSize = 1024;           // 256, 512, 1024, 2048

                var linkToImage = linkToServer.concat("&quality=");
                linkToImage = linkToImage.concat(imageQuality);
                linkToImage = linkToImage.concat("&size=");
                linkToImage = linkToImage.concat(imageSize);

                var machineIconSize = 10.0;
                
                webStatsMap.append( "<img src=\"" + linkToImage + "\"  />" );
                
                var stringToAppend = "<div id=\"mapElementsContainer\" >";                
                var i = 0;                
                Vehicles.each(function(index, element) {
                    var veh = $(element);
                    i = i + 1;
        
                    var x = (parseFloat(veh.attr("x")) + mapSizeHalf) / (mapSize / imageSize);
                    var z = (parseFloat(veh.attr("z")) + mapSizeHalf) / (mapSize / imageSize);
                    
                    x = x - (machineIconSize)/2;
                    // change to add -8 because I dont know why but there is 8 more then needed
                    //z = z - (machineIconSize-1)/2;
                    z = z - 8 - (machineIconSize)/2;
                    
                    var vehicleGroup = getVehicleType(veh.attr("category"), veh.attr("type"));

                    var icon = "http://fs19.nuba.synology.me/wp-content/html5/icons/" + vehicleGroup + ".png";
                    var iconHover = "http://fs19.nuba.synology.me/wp-content/html5/icons/" + vehicleGroup + "_selected.png";
                    var backgroundColor = "#4dafd7";
                                        
                    var curString = "<div id=\"vehicle" + i + "Container\" ";
                    curString = curString + "style=\"position:absolute; left: " + x + "px; top: " + z + "px; \"";                     
                    curString = curString + "onmouseout=\"document.getElementById('vehicle" + i + "').style.display='none'; "; 
                    curString = curString + "document.getElementById('vehicle" + i + "Image').src='" + icon + "'; ";
                    curString = curString + "document.getElementById('vehicle" + i + "Container').style.zIndex=1; \" ";                    
                    curString = curString + "onmouseover=\"document.getElementById('vehicle" + i + "').style.display='block'; "; 
                    curString = curString + "document.getElementById('vehicle" + i + "Image').src='" + iconHover + "'; ";
                    curString = curString + "document.getElementById('vehicle" + i + "Container').style.zIndex=10; \"";                    
                    curString = curString + " > ";                    
                    curString = curString + "<image id=\"vehicle" + i + "Image\" src=\"" + icon + "\" width=\"" + machineIconSize + "\" height=\"" + machineIconSize + "\" />";                    
                    curString = curString + "<div id=\"vehicle" + i + "\" style=\"display:none; position:absolute; bottom:0px; left:" + (machineIconSize+1) + "; background:" + backgroundColor + "; padding-left:8px; padding-right:8px; color:#ffffff; \">";                     
                    curString = curString + "<nobr>" + veh.attr("name") + "</nobr>";                    
                    curString = curString + "</div> </div>";                    
                    stringToAppend = stringToAppend + curString;
				});                
                stringToAppend = stringToAppend + "</div>";
                webStatsMap.append(stringToAppend);
			}
		
			
		}

    });            
	
}

function loadCareerSavegame(url) {
	$.get(url, function(data){
      
	      /* game money */
		var statsMoney = $(data).find("careerSavegame statistics money");
		var money = statsMoney[0].childNodes[0];
	        
		if (money != null) {
			$("#webStatsMoney").text(money.nodeValue.replace(/(.)(?=(\d{3})+$)/g,'$1.')+",00 €");
		} else {
			$("#webStatsMoney").text("0,00 €");
		}

		/* game difficulty code */
		var statsDiff = $(data).find("careerSavegame settings difficulty");
		var diffCode = statsDiff[0].childNodes[0].nodeValue;
	        
		if (diffCode != null) {
			/* game difficulty text */
			switch(true) {
				case (diffCode == 1):
					diffText = "ľahká";
					break;
				case (diffCode == 2):
					diffText = "stredná";
					break;				    									    	
				case (diffCode == 3):
					diffText = "ťažká";
					break;				
				default:
	    				diffText = "";
	    		}
		}
		$("#webStatsDiff").text(diffText);
		
		/* game played time */
		var statsTime = $(data).find("careerSavegame statistics playTime");
		var playTime = statsTime[0].childNodes[0].nodeValue;
		var hours = Math.floor(playTime/60);
		var minutes = Math.floor(playTime-(hours*60));
		var days = Math.floor(hours/24);
		var dayHours = hours - Math.floor(days*24);
						
		if (playTime != null) {
			/* format hours text */
			switch(true) {
				case (dayHours == 1):
					hoursText = " hodinu";
					break;
				case (dayHours < 4):
					hoursText = " hodiny";
					break;				    									    	
				default:
	    				hoursText = " hodín";
			}
			/* format days text */
			switch(true) {
				case (days == 1):
					daysText = " deň";
					break;
				case (days < 4):
					daysText = " dni";
					break;				    									    	
				default:
	    				daysText = " dní";
			}
			/* format minutes text */
			switch(true) {
				case (minutes == 1):
					minutesText = " minútu";
					break;
				case (minutes < 4):
					minutesText = " minuty";
					break;				    									    	
				default:
	    				minutesText = " minút";
			}	

			$("#webStatsTime").text(days+daysText+", "+dayHours+hoursText+", "+minutes+minutesText);
			//$("#webStatsTime").text(playTime);
		} else {
			$("#webStatsTime").text("0 dní, 0 hodín, 0 minút");
		}

	});
}