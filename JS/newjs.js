var margin = {top: 20, right: 120, bottom: 20, left: 120},
    width = 960 - margin.right - margin.left,
    //height = 800 - margin.top - margin.bottom;
    height = 550 - margin.top - margin.bottom;
    
var i = 0,
    duration = 750,
    root;

var tree = d3.layout.tree()
        .size([height, width]);

/*  var zoom = d3.behavior.zoom()
        .scaleExtent([-2, 10])
        .on("zoom", zoomed);
    
    var drag = d3.behavior.drag()
        .origin(function(d) { return d; })
        .on("dragstart", dragstarted)
        .on("drag", dragged)
        .on("dragend", dragended);*/

    var svg;
    var diagonal = d3.svg.diagonal()
            .projection(function(d) { return [d.y, d.x]; });

    //Toggle children on click.


coun = 0;

function counter(){
    coun++;
}

$data = jQuery("<div></div>");

org = [];

$data.load("orgChart.html", function(){
    console.log($data);
    //console.log("hey");
    $data.find("a").remove();
    $data.children("div").children("ul").children("li").each(function(d, e){
        ob = {};
        ob.name = $(e).text().trim();
        //$(e).contents().filter(function() { return this.nodeType == Node.TEXT_NODE; })[1].data;
        ob.children = [];
        //console.log($(e).text().trim());
        $(e).children("ul").children("li").each(function(i, el){
            //console.log($(el).contents().filter(function() { return this.nodeType == Node.TEXT_NODE; }));
            //console.log($(el).text());
            obj = {};
            //obj.text = $(el).contents().filter(function() { return this.nodeType == Node.TEXT_NODE; })[0].data;
            obj.name = $(el).text().trim();
            obj.children = [];
            
            $(el).children("ul").children("li").each(function(i, ele){
                obje = {};
                //obj.text = $(el).contents().filter(function() { return this.nodeType == Node.TEXT_NODE; })[0].data;
                obje.name = $(ele).text().trim();
                obje.children = [];
                
                $(ele).children("ul").children("li").each(function(i, elem){
                    objec = {};
                    objec.name = $(elem).text().trim();
                    objec.children = [];
                    
                    $(elem).children("ul").children("li").each(function(i, eleme){
                        object = {};
                        object.name = $(eleme).text().trim();
                        object.children = [];
                        
                        $(eleme).children("ul").children("li").each(function(i, elemen){
                            objects = {};
                            objects.name = $(elemen).text().trim();
                            objects.children = [];
                            
                            $(elemen).children("ul").children("li").each(function(i, element){
                                objectss = {};
                                objectss.name = $(element).text().trim();
                                objectss.children = [];
                                
                                $(element).children("ul").children("li").each(function(i, elements){
                                    objectsss = {};
                                    objectsss.name = $(elements).text().trim();
                                    objectsss.children = [];
                                    
                                    $(elements).children("ul").children("li").each(function(i, elementss){
                                        objectssss = {};
                                        objectssss.name = $(elementss).text().trim();
                                        objectssss.children = [];
                                        
                                        objectsss.children.push(objectssss);
                                        counter();
                                    });
                                    
                                    objectss.children.push(objectsss);
                                    counter();
                                });
                                
                                objects.children.push(objectss);
                                counter();
                            });
                            
                            object.children.push(objects);
                            counter();
                        });
                        
                        objec.children.push(object);
                        counter();
                    });
                    
                    
                    obje.children.push(objec);
                    counter();
                });
                
                obj.children.push(obje);
                counter();
            });
            
            ob.children.push(obj);
            counter();
        });
        
        
        org.push(ob);
        counter();
    });

console.log(org);

//d3.json(/*"JS/Tree.json"*/org[0], function(flare, error) {
    flare = org[0];
    
    svg = d3.select("body div.panel svg")//.append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);//.call(zoom);
    
    svg = svg.append("g")
        .attr("class","main")
        .attr("transform","translate(0,0)")
        .attr("x", "0");//.call(zoom);

    

   /* var svg = d3.select("body").append("svg")
        .attr("width", width + margin.right + margin.left)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");*/

    
    

    
    
    
    //console.log(error);
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
//});

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
          .on('click', click);

        nodeEnter.append("circle")
          .attr("r", 1e-6)
          .style("fill", function(d) { 
            return d._children ? "lightsteelblue" : "#fff"; 
            });

        nodeEnter.append("text")
          .attr("x", function(d) { 
              //return d.children || d._children ? 10 : -10;
              if(d.children!=null){
                  return -10;
              }else{
                  return 10;
              }
          })
          .attr("dy", ".35em")
          .attr("text-anchor", function(d) { 
            //return d.children || d._children ? "end" : "start";
            if(d.children!=null){
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
              //return d.children || d._children ? 10 : -10;
              if(d.children!=null){
                  return -10;
              }else{
                  return 10;
              }
          })
          .attr("dy", "1.35em")
          .attr("text-anchor", function(d) { 
            //return d.children || d._children ? "end" : "start";
            if(d.children!=null){
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
            var o = {x: source.x0+50, y: source.y0};
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
            var o = {x: source.x+50, y: source.y};
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
        //console.log(d.y);
        g = d3.select("svg g");
        if (d.children) {
            d._children = d.children;
            d.children = null;
            //g._x = parseInt(g.attr("x"))+180;
            //g._x = d.depth*(-180) + 180;
            g._x = (d.depth*(-300))+300
            g.transition().attr("transform","translate("+g._x+","+0+") scale("+1+")");//.attr("x", g._x);
            
            
        } else if (d._children!=null){
            d.children = d._children;
            d._children = null;
            //g._x = parseInt(g.attr("x"))-180;
            g._x = d.depth*(-300) ;
            //g._x = 0;
            g.transition().attr("transform","translate("+(g._x)+","+0+") scale("+/*(d.depth*0.5+1)*/1+")");//.attr("x", g._x);
        }
        update(d);
    }
    
});