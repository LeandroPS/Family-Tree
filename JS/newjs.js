jQuery.fn.d3Click = function () {
  this.each(function (i, e) {
    var evt = document.createEvent("MouseEvents");
    evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);

    e.dispatchEvent(evt);
  });
};

var margin = {top: 20, right: 120, bottom: 20, left: 120},
    width = 960 - margin.right - margin.left,
    height = 500 - margin.top - margin.bottom;
    
var i = 0,
    duration = 500,
    root;

///
var drag = d3.behavior.drag()
    .origin(function(d) { return d; })
    .on("dragstart", dragstarted)
    .on("drag", dragged)
    .on("dragend", dragended);

function dragstarted(d) {
  d3.event.sourceEvent.stopPropagation();
  d3.select(this).classed("dragging", true);
}

function dragged(d) {
  d3.select(this).attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
}

function dragended(d) {
  d3.select(this).classed("dragging", false);
}

var tree = d3.layout.tree().nodeSize([70, 40]);
        

    var svg;
    var diagonal = d3.svg.diagonal()
            .projection(function(d) { return [d.y, d.x]; });

coun = 0;
csearch = 0;

function counter(){
    coun++;
    return coun;
}

function counterSearch(){
    csearch++;
}

$data = jQuery("<div></div>");

org = [];

function search(str) {
    var result = [];
    function sear(e){
        if(e.name.split(",")[0].toLowerCase().indexOf(str.toLowerCase())!= -1){
            var object = {};
            object.name = e.name.split(",")[0];
            object.title = e.name.split(/,| - /)[1].trim();
            object.hierarchyId = e.hierarchyId;
            result.push(object);
        }
        if (e.children) {     
            e.children.forEach(sear);
        }else if(e._children){
            e._children.forEach(sear);
        }
    }
    sear(root);
    return result;  
}

$data.load("orgChart.html", function(){
    
    $("button.search").click(function(){
        $("div.search input.search").delay(1000).focus();
        $("div.not-scrollable").scrollLeft(0);
        $("div.search, button.search").toggleClass("expanded");
        $("button.search span").toggleClass("fa-search fa-times");
        
    });
    
    $("input.search").keyup(function(){
        req = $(this).val();
        if(req!=""){
            res = search(req);
            $("div.search ul").empty();
            for(i = 0; i<res.length; i++){
                $("div.search ul").append("<li data-hierarchy-id='"+res[i].hierarchyId+"'><span class='name'>"+res[i].name+"</span><span class='title'>"+res[i].title+"</span></li>");
            }
        }else{
            $("div.search ul").empty();
        }
    });
    
    $("div.panel div.search ul").on("click", "li", function(){
        hierarchyId = $(this).data("hierarchyId").split(",");
        console.log(hierarchyId);
        
        root.children.forEach(collapse);
        update(root);
        
        d3.select("g.main").transition().attr("transform","translate(0,0)");
        var i = 1;
            
        clock = setInterval(function(){
            if(i<hierarchyId.length){
                $("svg g[data-id='"+hierarchyId[i]+"']").d3Click();
            }else{
                clearInterval(clock);
            }
            i++
        }, 1000);
    });
    
    $data.find("a").remove();
    
    
    
    function InsertChildren(array, obj){
        curr = employees;
        for(var i=0; i<array.length; i++){
            curr.children.forEach(function(o){
                if(o.id === array[i]){
                    curr = o;
                }
            });
        }
        curr.children.push(obj);
    }
    
    var hierarchy = [];
    var hierarchyId = [];
    var current = $data.find("li").first();
    var count = 0;
    var counting = $data.find("li:not(.used)").size();
    var employees = {};
    
    while(counting >0){
        
        //console.log(current);
        if(current.hasClass("used")){

            if(current.children("ul").children("li:not(.used)").size() > 0){
                
                current = current.children("ul").children("li:not(.used)").first();
            }else if(current.parent().parent().is("li")){
                
                current = current.parent().parent();
                hierarchy.pop();
                hierarchyId.pop();
            }
            
        }else{
            count++;
            var object = {};
            
            object.name = current.text().trim();
            object.id = count;
            hierarchy.push(object.name);
            hierarchyId.push(count);
            
            $(current).addClass("used");
            
            counting--;
            
            if(current.children("ul").children("li:not(.used)").size() > 0){
                
                current = current.children("ul").children("li:not(.used)").first();
            }else if(current.parent().parent().is("li")){
                
                current = current.parent().parent();
                hierarchy.pop();
                hierarchyId.pop();
            }
        }
    }
    console.log(employees);
    //});
    //console.log($data);
    
    $data.children("div").children("ul").children("li").each(function(d, e){
        
        
        var hierarchy = [];
        var hierarchyId = [];
        ob = {};
        ob.id = counter();
        ob.name = $(e).text().trim();
        hierarchy[0] = ob.name;
        hierarchyId[0] = ob.id;
        ob.hierarchy = hierarchy.slice(0,1);
        ob.hierarchyId = hierarchyId.slice(0,1);
        ob.children = [];
        
        $(e).children("ul").children("li").each(function(i, el){
            obj = {};
            obj.id = counter();
            obj.name = $(el).text().trim();
            obj.children = [];
            hierarchy[1] = obj.name;
            hierarchyId[1] = obj.id;
            obj.hierarchy = hierarchy.slice(0,2);
            obj.hierarchyId = hierarchyId.slice(0,2);
            
            $(el).children("ul").children("li").each(function(i, ele){
                obje = {};
                obje.id = counter();
                obje.name = $(ele).text().trim();
                obje.children = [];
                hierarchy[2] = obje.name;
                hierarchyId[2] = obje.id;
                obje.hierarchy = hierarchy.slice(0,3);
                obje.hierarchyId = hierarchyId.slice(0,3);
                
                $(ele).children("ul").children("li").each(function(i, elem){
                    objec = {};
                    objec.id = counter();
                    objec.name = $(elem).text().trim();
                    objec.children = [];
                    hierarchy[3] = objec.name;
                    hierarchyId[3] = objec.id;
                    objec.hierarchy = hierarchy.slice(0,4);
                    objec.hierarchyId = hierarchyId.slice(0,4);
                    
                    $(elem).children("ul").children("li").each(function(i, eleme){
                        object = {};
                        object.id = counter();
                        object.name = $(eleme).text().trim();
                        object.children = [];
                        hierarchy[4] = object.name;
                        hierarchyId[4] = object.id;
                        object.hierarchy = hierarchy.slice(0,5);
                        object.hierarchyId = hierarchyId.slice(0,5);
                        
                        $(eleme).children("ul").children("li").each(function(i, elemen){
                            objects = {};
                            objects.id = counter();
                            objects.name = $(elemen).text().trim();
                            objects.children = [];
                            hierarchy[5] = objects.name;
                            hierarchyId[5] = objects.id;
                            objects.hierarchy = hierarchy.slice(0,6);
                            objects.hierarchyId = hierarchyId.slice(0,6);
                            
                            $(elemen).children("ul").children("li").each(function(i, element){
                                objectss = {};
                                objectss.id = counter();
                                objectss.name = $(element).text().trim();
                                objectss.children = [];
                                hierarchy[6] = objectss.name;
                                hierarchyId[6] = objectss.id;
                                objectss.hierarchy = hierarchy.slice(0,7);
                                objectss.hierarchyId = hierarchyId.slice(0,7);
                                
                                $(element).children("ul").children("li").each(function(i, elements){
                                    objectsss = {};
                                    objectsss.id = counter();
                                    objectsss.name = $(elements).text().trim();
                                    objectsss.children = [];
                                    hierarchy[7] = objectsss.name;
                                    hierarchyId[7] = objectsss.id;
                                    objectsss.hierarchy = hierarchy.slice(0,8);
                                    objectsss.hierarchyId = hierarchyId.slice(0,8);
                                    
                                    $(elements).children("ul").children("li").each(function(i, elementss){
                                        objectssss = {};
                                        objectssss.id = counter();
                                        objectssss.name = $(elementss).text().trim();
                                        objectssss.children = [];
                                        hierarchy[8] = objectssss.name;
                                        hierarchyId[8] = objectssss.id;
                                        objectssss.hierarchy = hierarchy.slice(0,9);
                                        objectssss.hierarchyId = hierarchyId.slice(0,9);
                                        
                                        objectsss.children.push(objectssss);
                                    });
                                    
                                    objectss.children.push(objectsss);
                                });
                                
                                objects.children.push(objectss);
                            });
                            
                            object.children.push(objects);
                        });
                        
                        objec.children.push(object);
                    });
                    
                    obje.children.push(objec);
                });
                
                obj.children.push(obje);
            });
            
            ob.children.push(obj);
        });
        
        org.push(ob);
    });
	
	/*
		var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(org));
		var dlAnchorElem = document.getElementById('downloadAnchorElem');
		dlAnchorElem.setAttribute("href",     dataStr     );
		dlAnchorElem.setAttribute("download", "scene.json");
		dlAnchorElem.click();
	*/
	
    flare = org[0];
    
    function zoom() {
        svg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    }
    
    var zoomListener = d3.behavior.zoom().scaleExtent([0.1, 3]).on("zoom", zoom);
    
    svgM = d3.select("body div.panel svg")//.append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .call(zoomListener);//.call(zoom);
    
    svg = svgM.append("g")
        .attr("class","main")
        .attr("transform", "translate(" + margin.top + "," + margin.top + ")");
        //.attr("x", "0")
        //.call(drag);//.call(zoom);

    console.log(flare);
    root = flare;
    root.x0 = height / 2;
    root.y0 = 0;

    function collapse(d) {
        if (d.children) {
            d._children = d.children;
            d._children.forEach(collapse);
            d.children = null;
        }
    }
    
    function unCollapse(d) {
        if (d._children) {
            d.children = d._children;
            d.children.forEach(unCollapse);
            d._children = null;
        }
    }

    root.children.forEach(collapse);
    update(root);
    centerNode(root);
    $("div.hierarchy").append("<span class='text'>"+org[0].name.split(",")[0]+"</span>");
    
    card = svgM.append("g")
        .attr("class", "card")
        .attr("height", 100)
        .attr("transform", "translate(15,385)")
        .style("opacity", "1");

    cont = card.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("rx", 5)
        .attr("ry", 5)
        .attr("width", 250)
        .attr("height", 100)
        .attr("fill", "rgba(255,255,255,0.7)");
        //.attr("fill", "green");

    card.append("text")
        .attr("x", 10)
        .attr("y", 22)
        .attr("text-anchor", "start")
        .text(org[0].name.split(",")[0])
        .style("fill-opacity", 1)
        .style('font-family', 'Open Sans')
        .style("font-size", "11pt")
        .style("fill", "#000")
        .style("font-weight", "bold")
        .style("cursor", "pointer");

    card.append("text")
        .attr("x", 10)
        .attr("y", 40)
        .attr("text-anchor", "start")
        .text(org[0].name.split(/,| - /)[1])
        .style("fill-opacity", 1)
        .style("font-size", "9.5pt")
        .style("fill", "grey")
        .style("cursor", "pointer");

    card.append("text")
        .attr("x", 10)
        .attr("y", 72)
        .attr("width", 10)
        .attr("text-anchor", "start")
        .style('font-family', 'FontAwesome')
        .style('font-size', "12px" )
        .text('\uf095');

    card.append("text")
        .attr("x", 10)
        .attr("y", 89)
        .attr("text-anchor", "start")
        .style('font-family', 'FontAwesome')
        .style('font-size', "12px" )
        .text('\uf003');

    card.append("text")
        .attr("x", 28)
        .attr("y", 72)
        .attr("text-anchor", "start")
        .style('font-family', 'Open Sans')
        .style('font-size', "12px" )
        .text('(206) 222 2222');

    card.append("text")
        .attr("x", 28)
        .attr("y", 89)
        .attr("text-anchor", "start")
        .style('font-family', 'Open Sans')
        .style('font-size', "12px" )
        .text('leandro.pires.souza@outlook.com');

    d3.select(self.frameElement).style("height", "800px");
    
    function update(source) {
        
        // Compute the new tree layout.
        var nodes = tree.nodes(root).reverse(),
            links = tree.links(nodes);

        //centerNode(root);
        // Normalize for fixed-depth.
        nodes.forEach(function(d) { 
            d.y = d.depth * 300 +200; 
            d.x = d.x;
        });

        // Update the nodes…
        var node = svg.selectAll("g.node")
          .data(nodes, function(d) { 
              return d.id || (d.id = ++i); 
          });

        // Enter any new nodes at the parent's previous position.
        var nodeEnter = node.enter().append("g").on("click", click)
          .attr("class", "node")
          .attr("transform", function(d) { 
              return "translate(" + source.y0 + "," + source.x0 + ")" 
          })
          .attr("data-id", function(d) { 
              return d.id; 
            })
          .attr("data-depth", function(d) { 
              return d.depth; 
          })
          .on('click', click);

        nodeEnter.append("circle")
          .attr("r", 1e-6)
          .style("fill", function(d) { 
                return d._children ? "lightsteelblue" : "#fff"; 
            });

        nodeEnter.append("text")
          .attr("x", function(d) { 
              //return d.children || d._children ? 10 : -10;
              /*if(d.depth==0){
                  return -10;
              }else{
                  return 10;
              }*/
              return d.depth==0 ? -10 : 10; 
          })
          .attr("dy", ".35em")
          .attr("text-anchor", function(d) { 
            //return d.children || d._children ? "end" : "start";
            /*if(d.depth==0){
                return "end";
            }else{
                return "start";
            }*/
            return d.depth==0 ? "end" : "start"; 
          })
          .text(function(d) { return d.name.split(",")[0]; })
          .style("fill-opacity", 1e-6)
          .style("cursor", "pointer");
        
        nodeEnter.append("text")
          .attr("x", function(d) { 
              /*if(d.depth==0){
                  return -10;
              }else{
                  return 10;
              }*/
              return d.depth==0 ? -10 : 10; 
          })
          .attr("dy", "1.35em")
          .attr("text-anchor", function(d) { 
            /*if(d.depth==0){
                return "end";
            }else{
                return "start";
            }*/
            return d.depth==0 ? "end" : "start"; 
          })
          .text(function(d) { return d.name.split(/,| - /)[1]; })
          .style("fill-opacity", 1)
          .style("font-size", "10pt")
          .style("fill", "grey")
          .style("cursor", "pointer");

        // Transition nodes to their new position.
        var nodeUpdate = node.transition()
          .duration(duration)
          .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

        nodeUpdate.select("circle")
          .attr("r", 4.5)
          .style("fill", function(d) { return d._children ? "#9E9E9E" : "#fff"; })
            .style("stroke", "#9E9E9E")
            .style("stroke-width", 2);

        nodeUpdate.select("text")
          .style("fill-opacity", 1);

        // Transition exiting nodes to the parent's new position.
        var nodeExit = node.exit().transition()
          .duration(duration)
          .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
          .remove();

        nodeExit.select("circle")
          .attr("r", 1e-6);

        nodeExit.select("text")
          .style("fill-opacity", 1e-6);

        // Update the links…
        var link = svg.selectAll("path.link")
          .data(links, function(d) { return d.target.id; });

        // Enter any new links at the parent's previous position.
        link.enter().insert("path", "g")
          .attr("class", "link")
          .attr("d", function(d) {
            var o = {x: source.x0, y: source.y0};
            return diagonal({source: o, target: o});
          });

        // Transition links to their new position.
        link.transition()
          .duration(duration)
          .attr("d", diagonal);

        // Transition exiting nodes to the parent's new position.
        link.exit().transition()
          .duration(duration)
          .attr("d", function(d) {
            var o = {x: source.x, y: source.y};
            return diagonal({source: o, target: o});
          })
          .remove();

        // Stash the old positions for transition.
        nodes.forEach(function(d) {
            d.x0 = d.x;
            d.y0 = d.y;
        });
    }

    function centerNode(source) {
        scale = zoomListener.scale();
        x = -source.y0;
        y = -source.x0;
        x = x * scale + width / 2;
        y = y * scale + height / 2;
        d3.select('g').transition()
            .duration(duration)
            .attr("transform", "translate(" + x + "," + y + ")scale(" + scale + ")");
        zoomListener.scale(scale);
        zoomListener.translate([x, y]);
    }
    
    function click(d) {
        console.log(d.hierarchy);
        console.log("foi");
        
        g = d3.select("svg g");
        
        if($("svg g.card text.card-name").text() != d.name.split(",")[0]){
            if(card!=null){
                var old_card = d3.select("svg g.card");

                card.transition().duration(900)
                    .attr("class", "old-card")
                    .attr("transform", "translate(15,420)")
                    .style("opacity","0");
                
                setTimeout(function(){
                    $("svg g.old-card").remove();
                }, 900);
            }
            
            card = svgM.append("g")
                .attr("class", "card")
                .attr("height", 100)
                .attr("transform", "translate(15,420)")
                .style("opacity", "0");

            card.transition()
                .duration(900)
                .attr("transform", "translate(15,385)")
                .style("opacity", "1");
                /*.attr("x", 15)
                .attr("y", height - 200);*/

            cont = card.append("rect")
                .attr("x", 0)
                .attr("y", 0)
                .attr("rx", 5)
                .attr("ry", 5)
                .attr("width", 250)
                .attr("height", 100)
                .attr("fill", "rgba(255,255,255,0.7)");
                //.attr("fill", "green");

            card.append("text")
                .attr("class", "card-name")
                .attr("x", 10)
                .attr("y", 22)
                .attr("text-anchor", "start")
                .text(d.name.split(",")[0])
                .style("fill-opacity", 1)
                .style('font-family', 'Open Sans')
                .style("font-size", "11pt")
                .style("fill", "#000")
                .style("font-weight", "bold")
                .style("cursor", "pointer");

            card.append("text")
              .attr("x", 10)
              .attr("y", 40)
              .attr("text-anchor", "start")
              .text(d.name.split(/,| - /)[1])
              .style("fill-opacity", 1)
              .style("font-size", "9.5pt")
              .style("fill", "grey")
              .style("cursor", "pointer");

            card.append("text")
              .attr("x", 10)
              .attr("y", 72)
              .attr("width", 10)
              .attr("text-anchor", "start")
              .style('font-family', 'FontAwesome')
              .style('font-size', "12px" )
              .text('\uf095');

            card.append("text")
              .attr("x", 10)
              .attr("y", 89)
              .attr("text-anchor", "start")
              .style('font-family', 'FontAwesome')
              .style('font-size', "12px" )
              .text('\uf003');

            card.append("text")
              .attr("x", 28)
              .attr("y", 72)
              .attr("text-anchor", "start")
              .style('font-family', 'Open Sans')
              .style('font-size', "12px" )
              .text('(206) 222 2222');

            card.append("text")
              .attr("x", 28)
              .attr("y", 89)
              .attr("text-anchor", "start")
              .style('font-family', 'Open Sans')
              .style('font-size', "12px" )
              .text('leandro.pires.souza@outlook.com');
        }
        
        if (d.children) {
            d._children = d.children;
            d.children = null;    
        } else if (d._children!=null){
            d.children = d._children || [] ;
            d._children = null;
        }
        
        update(d);
        
        $("div.hierarchy").empty();
        for(var i = 0; i<d.hierarchy.length; i++){
            text_span = jQuery("<span class='text' data-id='"+d.hierarchyId[i]+"'>"+d.hierarchy[i].split(",")[0]+"</span>").on("click", function(){
                console.log($(this).attr("data-id"));
                
                var o = d3.select("svg g[data-id='"+$(this).attr("data-id")+"']");
                $("svg g[data-id='"+$(this).attr("data-id")+"']").d3Click();
            });
            
            $("div.hierarchy").append(text_span);
            if(i<d.hierarchy.length-1){
                $("div.hierarchy").append("<span class='fa fa-chevron-right separator'></span>");
            }
        }
        centerNode(d);
    }
    
    
});