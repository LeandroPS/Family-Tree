/*Array.prototype.clone = function() {
	return this.slice(0);
};

function updateHierarchy(hi){
    console.log(hi.length);
    console.log(hi);
    $("div.hierarchy").empty();
    for(var i = 0; i<=hi.length; i++){
        $("div.hierarchy").append("<span class='text'>"+hi[i]+"</span>");
    }
}
*/
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
csearch = 0;

function counter(){
    coun++;
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
            result.push(ob);
        }
        
        children = org[a].children || org[a]._children;
        
        for(var b = 0; b<children.length; b++){
            counterSearch();
            if(children[b].name.split(",")[0].toLowerCase().indexOf(str.toLowerCase())!= -1){
                ob = {};
                ob.name = children[b].name.split(",")[0];
                ob.title = children[b].name.split(/,| - /)[1].trim();
                result.push(ob);
            }
            //console.log(children[b]);
            var childre = children[b].children || children[b]._children;
            
            for(var c = 0; c < childre.length; c++){
                counterSearch();
                if(childre[c].name.split(",")[0].toLowerCase().indexOf(str.toLowerCase())!= -1){
                    ob = {};
                    ob.name = childre[c].name.split(",")[0];
                    ob.title = childre[c].name.split(/,| - /)[1].trim();
                    result.push(ob);
                }
                
                var childr = childre[c].children || childre[c]._children;
                
                for(var d = 0; d < childr.length; d++){
                    counterSearch();
                    if(childr[d].name.split(",")[0].toLowerCase().indexOf(str.toLowerCase())!= -1){
                        ob = {};
                        ob.name = childr[d].name.split(",")[0];
                        ob.title = childr[d].name.split(/,| - /)[1].trim();
                        result.push(ob);
                    }
                    
                    var child = childr[d].children || childr[d]._children;
                    
                    for(var e = 0; e < child.length; e++){
                        counterSearch();
                        if(child[e].name.split(",")[0].toLowerCase().indexOf(str.toLowerCase())!= -1){
                            ob = {};
                            ob.name = child[e].name.split(",")[0];
                            ob.title = child[e].name.split(/,| - /)[1].trim();
                            result.push(ob);
                        }
                        
                        var chil = child[e].children || child[e]._children;
                        
                        for(var f = 0; f < chil.length; f++){
                            counterSearch();
                            if(chil[f].name.split(",")[0].toLowerCase().indexOf(str.toLowerCase())!= -1){
                                ob = {};
                                ob.name = chil[f].name.split(",")[0];
                                ob.title = chil[f].name.split(/,| - /)[1].trim();
                                result.push(ob);
                            }
                            
                            var chi = chil[f].children || chil[f]._children;
                            
                            for(var g = 0; g < chi.length; g++){
                                counterSearch();
                                if(chi[g].name.split(",")[0].toLowerCase().indexOf(str.toLowerCase())!= -1){
                                    ob = {};
                                    ob.name = chi[g].name.split(",")[0];
                                    ob.title = chi[g].name.split(/,| - /)[1].trim();
                                    result.push(ob);
                                }
                                
                                var ch = chi[g].children || chi[g]._children;
                                
                                for(var h = 0; h < ch.length; h++){
                                    counterSearch();
                                    if(ch[h].name.split(",")[0].toLowerCase().indexOf(str.toLowerCase())!= -1){
                                        ob = {};
                                        ob.name = ch[h].name.split(",")[0];
                                        ob.title = ch[h].name.split(/,| - /)[1].trim();
                                        result.push(ob);
                                    }
                                    
                                    var childrens = ch[h].children || ch[h]._children;
                                    
                                    for(var i = 0; i < childrens.length; i++){
                                        counterSearch();
                                        if(childrens[i].name.split(",")[0].toLowerCase().indexOf(str.toLowerCase())!= -1)  {
                                            ob = {};
                                            ob.name = childrens[i].name.split(",")[0];
                                            ob.title = childrens[i].name.split(/,| - /)[1].trim();
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
        //$("input.search").delay(1000).focus();
    });
    
    $("input.search").keyup(function(){
        req = $(this).val();
        if(req!=""){
            res = search(req);
            $("div.search ul").empty();
            for(i = 0; i<res.length; i++){
                $("div.search ul").append("<li><span class='name'>"+res[i].name+"</span><span class='title'>"+res[i].title+"</span></li>");
            }
        }else{
            $("div.search ul").empty();
        }
    });
    
    console.log($data);
    //console.log("hey");
    $data.find("a").remove();
    $data.children("div").children("ul").children("li").each(function(d, e){
        var hierarchy = [];
        ob = {};
        ob.name = $(e).text().trim();
        hierarchy[0] = ob.name;
        ob.hierarchy = hierarchy.slice(0,1);
        ob.children = [];
        //ob.id
        $(e).children("ul").children("li").each(function(i, el){
            obj = {};
            obj.name = $(el).text().trim();
            obj.children = [];
            hierarchy[1] = obj.name;
            obj.hierarchy = hierarchy.slice(0,2);
            
            $(el).children("ul").children("li").each(function(i, ele){
                obje = {};
                obje.name = $(ele).text().trim();
                obje.children = [];
                hierarchy[2] = obje.name;
                obje.hierarchy = hierarchy.slice(0,3);
                
                $(ele).children("ul").children("li").each(function(i, elem){
                    objec = {};
                    objec.name = $(elem).text().trim();
                    objec.children = [];
                    hierarchy[3] = objec.name;
                    objec.hierarchy = hierarchy.slice(0,4);
                    
                    $(elem).children("ul").children("li").each(function(i, eleme){
                        object = {};
                        object.name = $(eleme).text().trim();
                        object.children = [];
                        hierarchy[4] = object.name;
                        object.hierarchy = hierarchy.slice(0,5);
                        
                        $(eleme).children("ul").children("li").each(function(i, elemen){
                            objects = {};
                            objects.name = $(elemen).text().trim();
                            objects.children = [];
                            hierarchy[5] = objects.name;
                            objects.hierarchy = hierarchy.slice(0,6);
                            
                            $(elemen).children("ul").children("li").each(function(i, element){
                                objectss = {};
                                objectss.name = $(element).text().trim();
                                objectss.children = [];
                                hierarchy[6] = objectss.name;
                                objectss.hierarchy = hierarchy.slice(0,7);
                                
                                $(element).children("ul").children("li").each(function(i, elements){
                                    objectsss = {};
                                    objectsss.name = $(elements).text().trim();
                                    objectsss.children = [];
                                    hierarchy[7] = objectsss.name;
                                    objectsss.hierarchy = hierarchy.slice(0,8);
                                    
                                    $(elements).children("ul").children("li").each(function(i, elementss){
                                        objectssss = {};
                                        objectssss.name = $(elementss).text().trim();
                                        objectssss.children = [];
                                        hierarchy[8] = objectssss.name;
                                        objectssss.hierarchy = hierarchy.slice(0,9);
                                        
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

//console.log(org);

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
    $("div.hierarchy").append("<span class='text'>"+org[0].name.split(",")[0]+"</span>");
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
        /*
        $("button.search").click(function(){
            $("div.search, button.search").toggleClass("expanded");
            $("button.search span").toggleClass("fa-search fa-times");
        });
        */
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
    /*
    var search_panel = d3.select("body div.panel svg").append("g")
        .attr("transform", "translate("+(width + margin.left + margin.right)+",0)")

    var search_panel_rect = search_panel.append("rect")
        .attr("width", 300)
        .attr("height", height + margin.top + margin.bottom)
        .style("fill","rgba(255,255,255,0.8)")
        .style("stroke","none");
    
    var button_search = d3.select("body div.panel svg").append("g")
        .attr("width", 30)
        .attr("height", 30)
        .attr("transform", "translate("+(width + margin.left + margin.right-45)+","+40+")");
        //.attr("y", 15)
        //.style("fill","#000")
        //.style("stroke","none");
    
    var button_search_text = button_search.append("text")
        .attr("class", "button-search")
        .attr("font-family","FontAwesome")
        .style("cursor","pointer")
        .style("fill","#E0E0E0")
        .attr('font-size', function(d) { return '30px';} )
        .text(function(d) { return '\uf002'; })
        .on("click", function(){
            if(search_panel.attr("class") == "expanded"){
                button_search_text.text('\uf002');
            }else{
                button_search_text.text('\uf00d');
            }
            search_panel.transition().duration(700)
                .attr("transform", function(){
                    if(search_panel.attr("class") == "expanded"){
                        return "translate("+(width + margin.left + margin.right)+",0)";
                        button_search_text.text('\uf002');
                    }else{
                        return "translate("+(width + margin.left + margin.right - 300)+",0)";
                        button_search_text.text('\uf00d');
                    }
                })
                .attr("class", function(){
                    if(search_panel.attr("class") == "expanded"){
                        return "";
                    }else{
                        return "expanded";
                    }
                });
        });
    
    var keydown = function() {
        if (!focused) return;
        var text = focused.text;
        var code = d3.event.keyCode;
        if (code == 8) { // Backspace
            d3.event.preventDefault();
            text = text.substring(0,text.length-1);
        };
        if (code == 13) { // Enter
            focused.stroke = d3.rgb(240,240,240);
            focused.callback();
        };
        //console.log("keydown: code: "+ code + ", text: "+text);
        focused.text = text;
    }

    var keypress = function() {
        if (!focused) return;
        var text = focused.text;
        var code = d3.event.keyCode;
        text = text+String.fromCharCode(code);
        //console.log("keypress: code: "+ code + ", text: "+text);
        focused.text = text;
    }

    var focused = null;
    d3.select("body")
        .on("keydown",keydown)
        .on("keypress",keypress)
        .on("click", function() {
            if (focused) {
                focused.stroke = d3.rgb(240,240,240);
                focused = null;
            }
	});
    /*
    t = new Textbox(search_panel);

    function Textbox(parent) {
        var text = "text",
            fontsize = 12,
            x = 15,
            y = 15,
            width = 225,
            height = 30,
            stroke = d3.rgb(240,240,240),
            fill = d3.rgb(255,255,255);
        var textgroup = parent.append("g")
            .attr("transform", "translate(" + x + "," + y + ")");
        var rct = textgroup.append("rect")
            .attr("width", width)
            .attr("height", height)
            .style("fill",fill)
            .style("stroke-width","1px")
            .style("stroke",stroke)
            .style("opacity", 1);
        var txt = textgroup.append("text")
            .text(text)
            .style("fill","black")
            .style("font", fontsize+"px 'Open Sans, sans-serif'");
        var cover = textgroup.append("rect") // Transparent cover to hide cursor when mousing over text
            .attr("width", width)
            .attr("height", height)
            .style("opacity", 0);

        var txt_width = txt.node().getComputedTextLength();
        txt.attr("x",.5*(width-txt_width));
        txt.attr("y",.5*(height+fontsize)-2);

        var callback = function() {
            console.log("Text: "+txt.text());
        }

        var aligntext = function() {
            txt.attr("x",.5*(width-txt_width));
            txt.attr("y",.5*(height+fontsize)-2);
        };

        function textbox() {
        }

        Object.defineProperty(textbox,"text",{
            get: function() {return text;},
            set: function(_) {
                text = _;
                txt.text(_);
                txt_width = txt.node().getComputedTextLength();
                aligntext();
            },
            enumerable: true,
            cofigurable: true
        });

        Object.defineProperty(textbox,"x",{
            get: function() {return x;},
            set: function(_) {
                x = _;
                textgroup.attr("transform", "translate(" + x + "," + y + ")");
            },
            enumerable: true,
            cofigurable: true
        });
            Object.defineProperty(textbox,"y",{
            get: function() {return y;},
            set: function(_) {
                y = _;
                textgroup.attr("transform", "translate(" + x + "," + y + ")");
            },
            enumerable: true,
            cofigurable: true
        });

        Object.defineProperty(textbox,"width",{
            get: function() {return width;},
            set: function(_) {
                width = _;
                    rct.attr("width",_);
                    cover.attr("width",_);
                    aligntext();
                },
                enumerable: true,
                cofigurable: true
        });

        Object.defineProperty(textbox,"height",{
            get: function() {return height;},
            set: function(_) {
                height = _;
                rct.attr("height",_);
                cover.attr("height",_);
                aligntext();
            },
            enumerable: true,
            cofigurable: true
        });

        Object.defineProperty(textbox,"position",{
            get: function() {return [x, y, width, height];},
            set: function(_) {
                textbox.x = _[0]; 
                textbox.y = _[1];
                textbox.width = _[2];
                textbox.height = _[3];
            },
            enumerable: true,
            cofigurable: true
        })

        Object.defineProperty(textbox,"stroke",{
            get: function() {return stroke;},
            set: function(_) {
                stroke = _;
                rct.style("stroke",stroke);
            },
            enumerable: true,
            cofigurable: true
        });

        Object.defineProperty(textbox,"cover",{
            get: function() {return cover;},
            enumerable: true,
            cofigurable: true
        });

        Object.defineProperty(textbox,"callback",{
            get: function() {return callback;},
            set: function(_) {
                callback = _;
            },
            enumerable: true,
            cofigurable: true
        });

        cover.on("click", function() {
            focused = textbox;
            rct.style("stroke","#347bbe");
            d3.event.stopPropagation();
        });

        return textbox;
    }
    */

    function click(d) {
        console.log(d.hierarchy);
        console.log("foi");
        
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
        $("div.hierarchy").empty();
        for(var i = 0; i<d.hierarchy.length; i++){
            $("div.hierarchy").append("<span class='text'>"+d.hierarchy[i].split(",")[0]+"</span>");
            if(i<d.hierarchy.length-1){
                $("div.hierarchy").append("<span class='fa fa-chevron-right separator'></span>");
            }
        }
    }
    
});