

d3.json("JS/Tree.json", function(json) {
    
    var margin = {top: 0, right: 320, bottom: 0, left: 0},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;
    

    var tree = d3.layout.tree()
        .separation(function(a, b) { return a.parent === b.parent ? 1 : .5; })
        .children(function(d) { 
            return d.parents; 
        })
        .size([height, width]);
    
    var zoom = d3.behavior.zoom()
        .scaleExtent([1, 10])
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

    
    var nodes = tree.nodes(json);
    console.log(json);

    var link = container.selectAll(".link")
        .data(tree.links(nodes))
        .enter().append("path")
        .attr("class", "link")
        .attr("d", elbow);

    var node = container.selectAll(".node")
        .data(nodes)
        .enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d) { 
            return "translate(" + d.y + "," + d.x + ")"; 
        })

    node.append("text")
        .attr("class", "name")
        .attr("x", 8)
        .attr("y", -6)
        .text(function(d) { 
            return d.name; 
        });

    node.append("text")
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
        .attr("dy", "1.86em")
        .attr("class", "about location")
        .text(function(d) { 
            return d.location; 
        });
    
    function elbow(d, i) {
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
