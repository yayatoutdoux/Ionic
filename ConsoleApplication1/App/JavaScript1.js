var containerStyle = document.querySelector('#chart-container').getBoundingClientRect();
var svg = null,
    width = containerStyle.width,
    height = containerStyle.height,
    cubeResolution = 50,
    previousDraggedPosition,
    selected = null,
    selectedElements = [],
    draggedSvg = null,
    view = null,
    itemContainer = null,
    backdropContainer = null,
    item = null,
    gX = null,
    gY = null,
    currentTransform = null;


var zoom = d3.zoom()
    .scaleExtent([0.5, 5])
    .translateExtent([
        [-width * 2, -height * 2],
        [width * 2, height * 2]
    ])
    .on("zoom", zoomed);

var xScale = d3.scaleLinear()
    .domain([-width / 2, width / 2])
    .range([0, width]);

var yScale = d3.scaleLinear()
    .domain([-height / 2, height / 2])
    .range([height, 0]);


var xAxis = d3.axisBottom(xScale)
    .ticks((width + 2) / (height + 2) * 10)
    .tickSize(height)
    .tickPadding(8 - height);

var yAxis = d3.axisRight(yScale)
    .ticks(10)
    .tickSize(width)
    .tickPadding(8 - width);


var slider = d3.select("body").append("p").append("input")
    .datum({})
    .attr("type", "range")
    .attr("value", 1)
    .attr("min", zoom.scaleExtent()[0])
    .attr("max", zoom.scaleExtent()[1])
    .attr("step", (zoom.scaleExtent()[1] - zoom.scaleExtent()[0]) / 100)
    .on("input", slided);

function draw() {
    svg = d3.select("#chart-container").append('svg');
    view = svg.append("g")
        .attr("class", "view")
    if (currentTransform) view.attr('transform', currentTransform);
    itemContainer = view.selectAll("g").attr("class", "itemContainer")
        .data(points).enter().append('g')
        .attr("transform", () => 'translate(' + xScale(0) + ',' + yScale(0) + ')')
        .append('g')
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));
    backdropContainer = view
        .append('g')
        .attr('transform', function () {
            return 'translate(' + xScale(0) + ',' + yScale(0) + ')';
        });
    backdrop = backdropContainer
        .lower()
        .append('rect')
        .attr('x', -width * 2)
        .attr('y', -height * 2)
        .attr('class', 'table-backdrop')
        .attr('height', height * 3)
        .attr('width', width * 3)
        .attr('opacity', '0');

    backdrop.on('mousedown', function () {
        var mouse = d3.mouse(this);
        if (draggedSvg && svg) {
            newItem(snapToGrid(mouse[0] - cubeResolution - 10, cubeResolution), snapToGrid(mouse[1] - cubeResolution - 10, cubeResolution));
        }
    }).on('mousemove', function () {
        var mouse = d3.mouse(this);
        if (draggedSvg) {
            var x = mouse[0] - cubeResolution - 10;
            var y = mouse[1] - cubeResolution - 10;
            draggedSvg.attr('x', x);
            draggedSvg.attr('y', y);
        }
    });

    item = itemContainer.append('rect').attr('class', 'table-graphic')
        .attr('x', d => d.x)
        .attr('y', d => d.y)
        .attr('data-rotation', 0)
        .attr('width', cubeResolution)
        .attr('height', cubeResolution)
        .attr('fill', 'blue')
        .on('click', function () {
            console.log('clicked');
            selected = this.parentNode;
        })



    gX = svg.append("g")
        .attr("class", "axis axis--x")
        .call(xAxis);

    gY = svg.append("g")
        .attr("class", "axis axis--y")
        .call(yAxis);

    svg.call(zoom)
        .on("wheel.zoom", null)
        .on('dblclick.zoom', null);
}
draw();

function addRect() {
    draggedSvg = backdropContainer.append('rect').attr('width', cubeResolution).attr('height', cubeResolution);
}



d3.select("button")
    .on("click", resetted);





function rotate(d) {
    if (selected) {
        var el = d3.select(selected).select('.table-graphic');
        var transVal = parseInt(el.attr('data-rotation'), 10);
        var newDegree = transVal && transVal < 360 ? transVal + 45 : 45;
        el.attr('data-rotation', newDegree);
        return el.attr('transform', () => {
            var center = getCenter(el.attr('x'), el.attr('y'), cubeResolution, cubeResolution);
            return "rotate(" + newDegree + "," + center.x + ',' + center.y + ")";
        });
    } else {
        return false;
    }
}




function collide(d, element) {
    node = d.nodes()[0];
    nodeBox = node.getBBox();
    nodeLeft = nodeBox.x;
    nodeRight = nodeBox.x + nodeBox.width;
    nodeTop = nodeBox.y;
    nodeBottom = nodeBox.y + nodeBox.height;
    var objects = d3.selectAll(".table-graphic");
    objects.nodes().forEach(object => {
        if (object !== node) {
            otherBox = object.getBBox();
            otherLeft = otherBox.x;
            otherRight = otherBox.x + otherBox.width;
            otherTop = otherBox.y;
            otherBottom = otherBox.y + otherBox.height;
            collideHoriz = nodeLeft < otherRight && nodeRight > otherLeft;
            collideVert = nodeTop < otherBottom && nodeBottom > otherTop;
            if (collideHoriz && collideVert) {
                console.log('collide');
                d3.select(node).style('fill', () => "tomato");
                d3.select(object).style('fill', () => "tomato");
                setTimeout(() => {
                    d3.select(object).style('fill', () => "blue")
                    d3.select(node).style('fill', () => "blue")
                }, 1000);
                if (previousDraggedPosition) {
                    d3.select(node).attr('x', () => previousDraggedPosition.x);
                    d3.select(node).attr('y', () => previousDraggedPosition.y);
                }

            } else {
                d3.select(object).style('fill', () => "blue");
                d3.select(node).style('fill', () => "blue");

            }

        } else {
            element.style('fill', () => 'blue');
        }
    });
}









function slided(d) {
    zoom.scaleTo(svg, d3.select(this).property("value"));
}




/*function resetted() {
    svg.transition()
        .duration(750)
        .call(zoom.transform, d3.zoomIdentity);
}*/