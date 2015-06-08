var max = 0;
var maxdepth = 0;

d3.json("JS/Tree.json", function(json) {
    
    var margin = {top: 0, right: 0, bottom: 0, left: 0},
        /*width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;*/
        width = window.innerWidth,
        height = window.innerHeight;
    
    
    function counter(d){
        max = max+1;
        if(d.depth>maxdepth){
            maxdepth = d.depth;
        }
    }

    var tree = d3.layout.tree()
        .separation(function(a, b) { 
            return a.parent === b.parent ? 1 : .5; 
        })
        .children(function(d) { 
            return d.parents; 
        })
        .size([height*128, width*2]);
    
    var zoom = d3.behavior.zoom()
        .scaleExtent([-2, 10])
        .on("zoom", zoomed);
    
    var drag = d3.behavior.drag()
        .origin(function(d) { return d; })
        .on("dragstart", dragstarted)
        .on("drag", dragged)
        .on("dragend", dragended);

    var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .call(zoom);
        
    var container = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    function click(d) {
      if (d.children) {
        d._children = d.children;
        d.children = null;
      } else {
        d.children = d._children;
        d._children = null;
      }
      update();
    }
    
    function flatten(root) {
      var nodes = [], i = 0;

      function recurse(node) {
        if (node.children) node.children.forEach(recurse);
        if (!node.id) node.id = ++i;
        nodes.push(node);
      }

      recurse(root);
      return nodes;
    }
    
    function update() {
      var nodes = flatten(json ),
          links = d3.layout.tree().links(nodes);

      // Restart the force layout.
      /*force
          .nodes(nodes)
          .links(links)
          .start();*/
        
        tree.nodes(nodes);
        
        var node = container.selectAll(".node")
        .data(nodes)
        .enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d) {
            counter(d);
           // console.log("x: "+d.x+" y: "+d.y+" depth: "+d.depth);
            return "translate(" + d.y + "," + d.x + ")"; 
        })

        node.append("text")
            .attr("class", "name")
            .attr("x", 4)
            .attr("y", function(d){return spaceScale(d.depth)})
            .attr("font-size", function(d){return fontScale(d.depth)+"px"})
            .text(function(d) { 
                return d.name; 
            });

        node.append("svg:circle")
            .attr("class", "node")
            .attr("cx", "0")
            .attr("cy", "0")
            //.attr("r", function(d) { return Math.sqrt(d.size) / 10 || 4.5; })
            .attr("r", "10")
            .style("fill", "black")
            .on("click", click);
    
      // Update the links…
      link = svg.selectAll(".link")
          .data(links, function(d) { return d.target.id; });

      // Enter any new links.
      link.enter().append("svg:path", ".node")
          .attr("class", "link")
          .attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; });
    /*var link = container.selectAll(".link")
        .data(tree.links(nodes))
    *var slink = link
        .enter().append("path")
        .attr("class", "link")
        .style("stroke", "grey")
        .style("stroke-width", "3px")
        .attr("d", diagonal);*/

      // Exit any old links.
      link.exit().remove();

      // Update the nodes…
      node = svg.selectAll("circle.node")
          .data(nodes, function(d) { return d.id; })
          .style("fill", "black");

      // Enter any new nodes.
      node.enter().append("svg:circle")
          .attr("class", "node")
          .attr("cx", function(d) { return d.x; })
          .attr("cy", function(d) { return d.y; })
          .attr("r", function(d) { return Math.sqrt(d.size) / 10 || 4.5; })
          .style("fill", "black")
          .on("click", click);
          //.call(force.drag);*/

      // Exit any old nodes.
      node.exit().remove();
    }
    
    
    
    
    var nodes = tree.nodes(json);
    //console.log(json);

    
    //
    
    var fontScale = d3.scale.linear()
        .domain([0, 12])
        .range([12,4]);
    
    var spaceScale = d3.scale.linear()
        .domain([0, 12])
        .range([-6, -1]);
    
    var diagonal = d3.svg.diagonal()
      // change x and y (for the left to right tree)
      .projection(function(d) { return [d.y, d.x]; });
    
    update();
    
/*
    var link = container.selectAll(".link")
        .data(tree.links(nodes))
        .enter().append("path")
        .attr("class", "link")
        .attr("d", diagonal);

    var node = container.selectAll(".node")
        .data(nodes)
        .enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d) {
            counter(d);
           // console.log("x: "+d.x+" y: "+d.y+" depth: "+d.depth);
            return "translate(" + d.y + "," + d.x + ")"; 
        })

    node.append("text")
        .attr("class", "name")
        .attr("x", 4)
        .attr("y", function(d){return spaceScale(d.depth)})
        .attr("font-size", function(d){return fontScale(d.depth)+"px"})
        .text(function(d) { 
            return d.name; 
        });
    
    node.append("svg:circle")
        .attr("class", "node")
        .attr("cx", "0")
        .attr("cy", "0")
        //.attr("r", function(d) { return Math.sqrt(d.size) / 10 || 4.5; })
        .attr("r", "10")
        .style("fill", "black")
        .on("click", click);

    /*node.append("text")
        .attr("x", 8)
        .attr("y", 8)
        .attr("dy", ".71em")
        .attr("class", "about lifespan")
        .text(function(d) { 
            return d.born + "–" + d.died; 
        });

    node.append("text")
        .attr("x", 8)
        .attr("y", 8)
        //.attr("dy", "1.86em")
        .attr("class", "about location")
        .text(function(d) { 
            return d.location; 
        });
    */
    //
    
    function elbow(d, i) {
        /*
        var diagonal = d3.svg.diagonal()
            .projection(function(q) { return [q.y, q.x]; });
        
        var o = {x: d.source.x0, y: d.source.y0};
        return diagonal({source: o, target: o});
        */
        return "M" + d.source.y + "," + d.source.x
            + "H" + d.target.y + "V" + d.target.x
            + (d.target.children ? "" : "h" + margin.right);
    }
    
    function zoomed() {
      container.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
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
});
