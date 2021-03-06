

  var map, searchArea, pinLayer;
    var iscompare = true;
    var PolyColor = 0;

    function GetMap()
    {
        var countryList = {
            "Amsterdam, Netherlands": "52.37,4.89",
            "Athens, Greece": "37.98,23.72",
            "Barcelona, Spain" :"41.38,2.17",
            "Beijing, China": "39.90,116.40",
            "Istanbul, Turkey": "41,29",
            "London, England": "51.50,0.12",
            "Kuala Lumpur, Malaysia":"3.13,101.68",
            "Munich, Germany": "48.13,11.58",
            "New York, USA": "40.71,-74",
            "Rome, Italy": "41.54,12.27",
            "Singapore, Singapore": "1.35,103.81",
            "Tel Aviv, Israel": "32.08,34.78",
            "Tokyo, Japan": "35.68,139.69"
        }

       var selectedCoor = countryList[document.getElementById("cityList").value];
       var lat = selectedCoor.split(",")[0];
       var lon = selectedCoor.split(",")[1];
       console.log(lon)
       console.log(lat)

        //geocodeQuery("New York, NY");
        map = new Microsoft.Maps.Map('#myMap', {
            center: new Microsoft.Maps.Location(lat, lon),
            zoom: 11
        });
        
        

        //Add some random pushpins to a layer on the map. 
        pinLayer = new Microsoft.Maps.Layer();
        map.layers.insert(pinLayer);
        var pushpins = Microsoft.Maps.TestDataGenerator.getPushpins(10, map.getBounds(), { color: 'purple' });
        //Add the center point if it's needed.
        var pin = new Microsoft.Maps.Pushpin(new Microsoft.Maps.Location(lat, lon), { color: 'black' });
        pushpins.push(pin);
        pinLayer.add(pushpins);

        

        //Load the Spatial Math module.
        Microsoft.Maps.loadModule('Microsoft.Maps.SpatialMath');
    }

    function iscomparechecked()
    {  
        //document.getElementById("foodType").value
        if(iscompare){ iscompare = false;}
        else { iscompare = true}
        console.log(iscompare)
    }

    function clearMap()
    {
        //map.layers.clear();
        map.entities.clear();
        document.getElementById("totalvalue").value = "";
        PolyColor = 0;
        //map.entities.remove(searchArea);
    }
    
    function compareisochroneSearch()
    {
        var foods = document.getElementById("comparefood").value
        var ec2 = isochroneSearch(foods);
        setCO2Weight(ec2);
        

    }

    function isochroneSearch(selectedfood) {
        //These are values of carbon footprints of Foods
        //These are co2e values of per kilos
        var foodList = {
        "Lamb": 39.2,
        "Beef": 27,
        "Cheese": 13.5,
        "Pork": 12.1,
        "Turkey": 10.9,
        "Chicken": 6.9,
        "Tuna": 6.1,
        "Eggs": 4.8,
        "Potatoes": 2.9,
        "Rice": 2.7,
        "Nuts": 2.3,
        "Beans/tofu": 2,
        "Vegetables": 2,
        "Milk": 1.9,
        "Fruit": 1.1,
        "Lentils": 0.9
        }

        //retrieve co2e value of selected food 
        var co2ekg = foodList[selectedfood];
        console.log(co2ekg)

        //This is calculating value of selected food with the provided grams.
        var result =  document.getElementById("foodgrams").value;
        var co2evalue = parseFloat((result/1000)*parseFloat(co2ekg));
        console.log(co2evalue)
        
        // 1 co2e ~ 2.32mile ~ 3.73km of driving  
        var co2etokm = co2evalue * 3.73;
        
        //print value of selected product
        document.getElementById("totalvalue").value = (document.getElementById("totalvalue").value + selectedfood + ": " + co2evalue + " co2e, " + co2etokm  +" km -- ");
       


        //Show the loading icon.
        document.getElementById('loadingIcon').style.display = '';
        //Remove previous search area and set pushpin states back to normal.
        console.log(iscompare)
         if (searchArea) {
             if(!iscompare){
             map.entities.remove(searchArea);
             console.log("removed")
             }
         }
        // Get all the pushpins from the pinLayer.
        var pins = pinLayer.getPrimitives();
        //Clear any previously selected data.
        for (var i = 0; i < pins.length; i++) {
            pins[i].setOptions({ color: 'purple' });
        }
        
        //Create the REST isochrone query URL.
        var url = 'https://dev.virtualearth.net/REST/v1/Routes/Isochrones?&optimize=distance&travelMode=driving';
        //Use the center of the map as the waypoint for the isochrone.
        var center = map.getCenter();
        url += '&waypoint=' + center.latitude + ',' + center.longitude;
 
        //Set the max distance parameter for the isochrone query. This distance calculated above with users input
        url += '&distanceUnit=Kilometer&maxDistance=' +parseInt(co2etokm);   
        console.log(url);
        

        //Add key to query for authenication. 
        url += '&key=' + Microsoft.Maps.Credentials;
        callRestServiceCORS(url, function (data) {
            //console.log(data);
            //Hide loading icon.
            document.getElementById('loadingIcon').style.display = 'none';
            //Parse the REST response into polygon objects.
            searchArea = getIsochronePolygons(data);
            if (searchArea) {
                //Find all intersection pushpins in the search area polygon.
                var selectedPins = findIntersectingData(searchArea);
                //Do something with the selected pushpins.
                //Add the isochrone polygon to the map for visualization.
                map.entities.push(searchArea);
            } else {
                alert('Unable to generate isochrone.');
            }
        }, function (error) {
            alert('An error occured when requesting the isochrone.');
            //Hide loading icon.
            document.getElementById('loadingIcon').style.display = 'none';
        });

        return co2ekg;
    }
    function getIsochronePolygons(data) {
        if (data &&
            data.resourceSets &&
            data.resourceSets.length > 0 &&
            data.resourceSets[0].resources &&
            data.resourceSets[0].resources.length > 0 &&
            data.resourceSets[0].resources[0].polygons) {
            var polyData = data.resourceSets[0].resources[0].polygons;
            var polygons = [];
            for (var i = 0; i < polyData.length; i++) {
                var rings = [];
                for (var j = 0; j < polyData[i].coordinates.length; j++) {
                    var ring = [];
                    for (var k = 0; k < polyData[i].coordinates[j].length; k++) {
                        ring.push(new Microsoft.Maps.Location(polyData[i].coordinates[j][k][0], polyData[i].coordinates[j][k][1]));
                    }
                    //Need atleast 3 locations in a ring to create a polygon.
                    if (ring.length >= 3) {
                        rings.push(ring);
                    }
                }
                if (rings.length > 0) {
                    if(!iscompare){
                        polygons.push(new Microsoft.Maps.Polygon(rings));
                    }
                    else{
                        polygons.push(new Microsoft.Maps.Polygon(rings,{ fillColor: new Microsoft.Maps.Color(50, PolyColor, 255-PolyColor, PolyColor)}));
                        PolyColor += 20;
                        console.log(PolyColor)
                    }
                }
            }
            if (polygons.length > 0) {
                return polygons;
            }
        }
        return null;
    }
    //Find all pushpins on the map that intersect with the search area.
    function findIntersectingData(searchArea) {
        if (searchArea) {
            //Get all the pushpins from the pinLayer.
            var pins = pinLayer.getPrimitives();
            //Using spatial math find all pushpins that intersect with the drawn search area.
            //The returned data is a copy of the intersecting data and not a reference to the original shapes, 
            //so making edits to them will not cause any updates on the map.
            var intersectingPins = Microsoft.Maps.SpatialMath.Geometry.intersection(pins, searchArea);
            //The data returned by the intersection function can be null, a single shape, or an array of shapes. 
            if (intersectingPins) {
                //For ease of usem wrap individudal shapes in an array.
                if (intersectingPins && !(intersectingPins instanceof Array)) {
                    intersectingPins = [intersectingPins];
                }
                var selectedPins = [];
                
                //Loop through and map the intersecting pushpins back to their original pushpins by comparing their coordinates.
                for (var j = 0; j < intersectingPins.length; j++) {
                    for (var i = 0; i < pins.length; i++) {     
                        if (Microsoft.Maps.Location.areEqual(pins[i].getLocation(), intersectingPins[j].getLocation())) {
                            //Set the selected pin color to red.
                            pins[i].setOptions({ color: 'red' });
                            selectedPins.push(pins[i]);
                            break;
                        }
                    }
                }
               
                //Return the pushpins that were selected.
                return selectedPins;
            }
        }
        return null;
    }
    function callRestServiceCORS(requestUrl, callback, errorCallback) {
        if (callback) {
            var http = new XMLHttpRequest();
            http.open("GET", requestUrl, true);
            http.onreadystatechange = function () {
                if (http.readyState == 4 && http.status == 200) {
                    //Request was successful, do something with it.
                    var result = JSON.parse(http.responseText);
                    callback(result);
                }
            }
            http.onerror = errorCallback;
            http.send();
        }
    }