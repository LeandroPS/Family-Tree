jQuery.fn.d3Click = function () {
  this.each(function (i, e) {
    var evt = document.createEvent("MouseEvents");
    evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);

    e.dispatchEvent(evt);
  });
};

var margin = {top: 20, right: 120, bottom: 20, left: 120},
    width = 960 - margin.right - margin.left,
    height = 750 - margin.top - margin.bottom;
    
var i = 0,
    duration = 750,
    root;

var tree = d3.layout.tree()
        .size([height, width + margin.bottom + margin.top]);

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

function search(str){
    var result = [];
    for(var a = 0; a<org.length; a++){
        counterSearch();
        if(org[a].name.split(",")[0].toLowerCase().indexOf(str.toLowerCase())!= -1){
            ob = {};
            ob.name = org[a].name.split(",")[0];
            ob.title = org[a].name.split(/,| - /)[1].trim();
            ob.hierarchyId = org[a].hierarchyId;
            result.push(ob);
        }
        
        children = org[a].children || org[a]._children;
        
        for(var b = 0; b<children.length; b++){
            counterSearch();
            if(children[b].name.split(",")[0].toLowerCase().indexOf(str.toLowerCase())!= -1){
                ob = {};
                ob.name = children[b].name.split(",")[0];
                ob.title = children[b].name.split(/,| - /)[1].trim();
                ob.hierarchyId = children[b].hierarchyId;
                result.push(ob);
            }
            var childre = children[b].children || children[b]._children;
            
            for(var c = 0; c < childre.length; c++){
                counterSearch();
                if(childre[c].name.split(",")[0].toLowerCase().indexOf(str.toLowerCase())!= -1){
                    ob = {};
                    ob.name = childre[c].name.split(",")[0];
                    ob.title = childre[c].name.split(/,| - /)[1].trim();
                    ob.hierarchyId = childre[c].hierarchyId;
                    result.push(ob);
                }
                
                var childr = childre[c].children || childre[c]._children;
                
                for(var d = 0; d < childr.length; d++){
                    counterSearch();
                    if(childr[d].name.split(",")[0].toLowerCase().indexOf(str.toLowerCase())!= -1){
                        ob = {};
                        ob.name = childr[d].name.split(",")[0];
                        ob.title = childr[d].name.split(/,| - /)[1].trim();
                        ob.hierarchyId = childr[d].hierarchyId;
                        result.push(ob);
                    }
                    
                    var child = childr[d].children || childr[d]._children;
                    
                    for(var e = 0; e < child.length; e++){
                        counterSearch();
                        if(child[e].name.split(",")[0].toLowerCase().indexOf(str.toLowerCase())!= -1){
                            ob = {};
                            ob.name = child[e].name.split(",")[0];
                            ob.title = child[e].name.split(/,| - /)[1].trim();
                            ob.hierarchyId = child[e].hierarchyId;
                            result.push(ob);
                        }
                        
                        var chil = child[e].children || child[e]._children;
                        
                        for(var f = 0; f < chil.length; f++){
                            counterSearch();
                            if(chil[f].name.split(",")[0].toLowerCase().indexOf(str.toLowerCase())!= -1){
                                ob = {};
                                ob.name = chil[f].name.split(",")[0];
                                ob.title = chil[f].name.split(/,| - /)[1].trim();
                                ob.hierarchyId = chil[f].hierarchyId;
                                result.push(ob);
                            }
                            
                            var chi = chil[f].children || chil[f]._children;
                            
                            for(var g = 0; g < chi.length; g++){
                                counterSearch();
                                if(chi[g].name.split(",")[0].toLowerCase().indexOf(str.toLowerCase())!= -1){
                                    ob = {};
                                    ob.name = chi[g].name.split(",")[0];
                                    ob.title = chi[g].name.split(/,| - /)[1].trim();
                                    ob.hierarchyId = chi[g].hierarchyId;
                                    result.push(ob);
                                }
                                
                                var ch = chi[g].children || chi[g]._children;
                                
                                for(var h = 0; h < ch.length; h++){
                                    counterSearch();
                                    if(ch[h].name.split(",")[0].toLowerCase().indexOf(str.toLowerCase())!= -1){
                                        ob = {};
                                        ob.name = ch[h].name.split(",")[0];
                                        ob.title = ch[h].name.split(/,| - /)[1].trim();
                                        ob.hierarchyId = ch[h].hierarchyId;
                                        result.push(ob);
                                    }
                                    
                                    var childrens = ch[h].children || ch[h]._children;
                                    
                                    for(var i = 0; i < childrens.length; i++){
                                        counterSearch();
                                        if(childrens[i].name.split(",")[0].toLowerCase().indexOf(str.toLowerCase())!= -1)  {
                                            ob = {};
                                            ob.name = childrens[i].name.split(",")[0];
                                            ob.title = childrens[i].name.split(/,| - /)[1].trim();
                                            ob.hierarchyId = childrens[i].hierarchyId;
                                            result.push(ob);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return result;
}

$data.load("orgChart.html", function(){
    
    $("button.search").click(function(){
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
    
    console.log($data);
    //console.log("hey");
    $data.find("a").remove();
    
    /*
    var pointer = $data.children("div").children("ul").children("li");
    
    if($(pointer).children("ul").children("li:not(.checked)")).size()!=0){
        var hierarchy = [];
        var hierarchyId = [];
        ob = {};
        ob.id = counter();
        ob.name = $(pointer).text().trim();
        hierarchy[0] = ob.name;
        hierarchyId[0] = ob.id;
        ob.hierarchy = hierarchy.slice(0,1);
        ob.hierarchyId = hierarchyId.slice(0,1);
        ob.children = [];
    }
    
    */////
    
    
    
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

    flare = org[0];
    
    svg = d3.select("body div.panel svg")//.append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);//.call(zoom);
    
    svg = svg.append("g")
        .attr("class","main")
        .attr("transform","translate(0,0)")
        .attr("x", "0");//.call(zoom);

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

    root.children.forEach(collapse);
    update(root);
    $("div.hierarchy").append("<span class='text'>"+org[0].name.split(",")[0]+"</span>");

    d3.select(self.frameElement).style("height", "800px");

    function zoomed() {
      svg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    }
    
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

    function update(source) {
        
        // Compute the new tree layout.
        var nodes = tree.nodes(root).reverse(),
          links = tree.links(nodes);

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
          .on('click', click);

        nodeEnter.append("circle")
          .attr("r", 1e-6)
          .style("fill", function(d) { 
            return d._children ? "lightsteelblue" : "#fff"; 
            });

        nodeEnter.append("text")
          .attr("x", function(d) { 
              //return d.children || d._children ? 10 : -10;
              if(d.depth==0){
                  return -10;
              }else{
                  return 10;
              }
          })
          .attr("dy", ".35em")
          .attr("text-anchor", function(d) { 
            //return d.children || d._children ? "end" : "start";
            if(d.depth==0){
                return "end";
            }else{
                return "start";
            }
          })
          .text(function(d) { return d.name.split(",")[0]; })
          .style("fill-opacity", 1e-6)
          .style("cursor", "pointer");
        
        nodeEnter.append("text")
          .attr("x", function(d) { 
              if(d.depth==0){
                  return -10;
              }else{
                  return 10;
              }
          })
          .attr("dy", "1.35em")
          .attr("text-anchor", function(d) { 
            if(d.depth==0){
                return "end";
            }else{
                return "start";
            }
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

    function click(d) {
        console.log(d.hierarchy);
        console.log("foi");
        
        g = d3.select("svg g");
        
        if (d.children) {
            d._children = d.children;
            d.children = null;
            g._x = (d.depth*(-300))+300
            g.transition().attr("transform","translate("+g._x+","+0+") scale("+1+")");
            
        } else if (d._children!=null){
            d.children = d._children;
            d._children = null;
            
            g._x = d.depth*(-300) ;
            g.transition().attr("transform","translate("+(g._x)+","+0+") scale("+1+")");
        }
        update(d);
        $("div.hierarchy").empty();
        for(var i = 0; i<d.hierarchy.length; i++){
            text_span = jQuery("<span class='text' data-id='"+d.hierarchyId[i]+"'>"+d.hierarchy[i].split(",")[0]+"</span>").on("click", function(){
                console.log(d.hierarchyId[i]);
                console.log($(this).attr("data-id"));
                $("svg g[data-id='"+$(this).attr("data-id")+"']").d3Click();
            });
            
            $("div.hierarchy").append(text_span);
            if(i<d.hierarchy.length-1){
                $("div.hierarchy").append("<span class='fa fa-chevron-right separator'></span>");
            }
        }
    }
    
});