import { Injectable } from '@angular/core';

import * as d3 from 'd3';
import * as textures from 'textures';

@Injectable()
export class GardenEditorService {
    containerStyle: any = null;
    svg: any = null;
    view: any = null;
    gX: any = null;
    gY: any = null;
    itemContainer: any = null;
    currentTransform: any = null;
    backdropContainer: any = null;
    backdrop: any = null;
    draggedSvg: any = null;
    item: any = null;
    selected: any = null;
    previousDraggedPosition: any = null;
    cubeResolution = 1;
    width = 0;
    height = 0;
    gardenHeight = 0;
    gardenWidth = 0;
    points: any = [];
    xScale: any = null;
    yScale: any = null;
    xAxis: any = null;
    yAxis: any = null;
    zoom: any = null;
    scaleX: any = null;
    scaleY: any = null;
    scale: any = null;
    slider: any = null;
    hidden = false;

    constructor(
    ) {
    }

    public initSvg(garden: any) {
        //VARS////////////
        this.containerStyle = document.querySelector('.editor-container').getBoundingClientRect();
        this.width = this.containerStyle.width;
        this.height = this.containerStyle.height;
        this.gardenHeight = garden.height;
        this.gardenWidth = garden.width;
        this.svg = null;
        this.view = null;
        this.gX = null;
        this.gY = null;
        this.itemContainer = null;
        this.currentTransform = null;
        this.backdropContainer = null;
        this.backdrop = null;
        this.draggedSvg = null;
        this.item = null;
        this.selected = null;
        this.previousDraggedPosition = null;
        this.cubeResolution = 1;
        this.points = [];
        this.xScale = null;
        this.yScale = null;
        this.xAxis = null;
        this.yAxis = null;
        this.zoom = null;
        this.scaleX = null;
        this.scaleY = null;
        this.scale = null;
        this.slider = null;
        this.hidden = false;

        //AXIS////////////
        this.xScale = d3.scaleLinear().domain([0, this.width]).range([0, this.width]);
        this.yScale = d3.scaleLinear().domain([0, this.height]).range([0, this.height]);
        this.xAxis = d3.axisBottom(this.xScale).ticks((this.width) / (this.height) * 10).tickSize(this.height).tickPadding(8 - this.height);
        this.yAxis = d3.axisRight(this.yScale).ticks(10).tickSize(this.width).tickPadding(8 - this.width);

        //ZOOM////////////
        this.zoom = d3.zoom()
            .scaleExtent([1, 40])
            .translateExtent([[0, 0], [Math.max(this.width, this.gardenWidth + 50), Math.max(this.height, this.gardenHeight + 50)]])
            .on("zoom", this.zoomed());

        this.scaleX = this.width / this.gardenWidth;
        this.scaleY = this.height / this.gardenHeight;
        this.scale = Math.min(this.scaleX, this.scaleY);

        d3.select(".bt2").on("click", this.addRect());
        d3.select(".bt").on("click", this.resetted());

        //SLIDER////////////
        this.slider = d3.select(".menu-container").append("input")
            .datum({})
            .attr("type", "range")
            .attr("value", 1)
            .attr("min", 1)
            .attr("max", Math.min(this.gardenHeight, this.gardenWidth))
            .attr("step", 1)
            .on("input", this.slided());

        //PROCESS////////////
        this.draw();
        this.resetted()();
    }

    private mouseLeave() {
        let self = this; // object context to preserve
        return function (d: any, i: any) {
            self.hidden = false;
            if (self.draggedSvg)
                self.draggedSvg.style("visibility", "hidden");
        }
    }

    private mouseEnter() {
        let self = this; // object context to preserve
        return function (d: any, i: any) {
            self.hidden = false;
            if (self.draggedSvg)
                self.draggedSvg.style("visibility", "visible");
        }
    }

    private mouseLeaveComplete() {
        let self = this; // object context to preserve
        return function (d: any, i: any) {
            self.hidden = false;
            if (self.draggedSvg)
                self.draggedSvg.style("visibility", "hidden");
            self.gX.on('mouseleave', null)
                .on('mouseenter', null);
            self.gY.on('mouseleave', null)
                .on('mouseenter', null);
        }
    }

    private mouseEnterComplete() {
        let self = this; // object context to preserve
        return function (d: any, i: any) {
            self.hidden = false;
            if (self.draggedSvg)
                self.draggedSvg.style("visibility", "visible");
            self.gX.on('mouseleave', self.mouseLeave())
                .on('mouseenter', self.mouseEnter());
            self.gY.on('mouseleave', self.mouseLeave())
                .on('mouseenter', self.mouseEnter());
        }
    }

    //DRAW////////////
    public draw() {
        this.svg = d3.select(".editor-container").append('svg');
        this.svg.attr("width", this.width);
        this.svg.attr("height", this.height);

        //Texture
        var t = textures.lines().thicker();
        this.svg.call(t);

        this.view = this.svg.append("g")
            .attr("class", "view");
        //.style("fill", t.url());

        if (this.currentTransform) {
            this.view.attr('transform', this.currentTransform);
        }

        this.view.append("rect")
            .attr("class", "view-rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", this.gardenWidth * this.xScale(1))
            .attr("height", this.gardenHeight * this.yScale(1));

        this.itemContainer = this.view.selectAll("g").attr("class", "itemContainer")
            .data(this.points).enter().append('g')
            .attr("transform", this.transformItems())
            .append('g')
            .on('mousedown', this.putDragged())
            .on('mousemove', this.moveDragged())
            .on('mouseleave', this.mouseLeave())
            .on('mouseenter', this.mouseEnter())
            .call(d3.drag()
                .on("start", this.dragstarted())
                .on("drag", this.dragged())
                .on("end", this.dragended()));

        this.backdropContainer = this.view
            .append('g')
            .attr('transform', this.transformItems());

        this.backdrop = this.backdropContainer
            .lower()
            .append('rect')
            .attr('x', 0)
            .attr('y', 0)
            .attr('class', 'table-backdrop')
            .attr('height', this.gardenHeight * this.yScale(1))
            .attr('width', this.gardenWidth * this.xScale(1))
            .attr('fill', "black")
            .attr('opacity', '0');

        this.backdrop
            .on('mousedown', this.putDragged())
            .on('mousemove', this.moveDragged())
            .on('mouseleave', this.mouseLeaveComplete())
            .on('mouseenter', this.mouseEnterComplete());

        this.item = this.itemContainer
            .append('rect')
            .attr('class', 'table-graphic')
            .attr('x', (d: any) => d.x)
            .attr('y', (d: any) => d.y)
            .attr('data-rotation', 0)
            .attr('width', (d: any) => d.res)
            .attr('height', (d: any) => d.res)
            .attr('fill', 'blue');

        this.gX = this.svg.append("g")
            .attr("class", "axis axis--x").on('mouseleave', this.mouseLeave())
            .on('mouseenter', this.mouseEnter())
            .call(this.xAxis);
        this.gY = this.svg.append("g")
            .attr("class", "axis axis--y").on('mouseleave', this.mouseLeave())
            .on('mouseenter', this.mouseEnter())
            .call(this.yAxis);

        this.svg.call(this.zoom);

        if (this.currentTransform) {
            this.svg.call(this.zoom.transform, d3.zoomIdentity.translate(this.currentTransform.x, this.currentTransform.y).scale(this.currentTransform.k));
        }
    };

    private transformItems() {
        let self = this; // object context to preserve
        return function (d: any, i: any) {
            return 'translate(' + self.xScale(0) + ',' + self.yScale(0) + ')';
        }
    }
    private resetted() {
        let self = this; // object context to preserve
        return function () {
            self.svg.call(self.zoom.transform, d3.zoomIdentity.translate(0, 0).scale(self.scale - self.scale * 0.05));
        }
    }

    private newItem(x: any, y: any) {
        this.points.push({
            x: x,
            y: y,
            res: this.cubeResolution
        });
        this.clearDrawing();
        this.draw();
    }


    //HELPERS////////////
    snapToGrid(p: any, r: any) {
        return Math.max(Math.floor(p)/* / r) * r*/, 0);
    }

    coorNum(pt: any) {
        return {
            x: parseInt(pt.x, 10),
            y: parseInt(pt.y, 10)
        };
    }

    findAndUpdate(oldPt: any, newPt: any) {
        for (var i = 0; i < this.points.length; i++) {
            if (this.points[i].x === oldPt.x && this.points[i].y === oldPt.y) {
                this.points[i] = {
                    x: newPt.x,
                    y: newPt.y
                };
                return this.points[i];
            }
        }
    }

    //DRAG N DROP////////////
    private dragstarted() {
        let self = this; // object context to preserve
        return function (d: any, i: any) {
            var el = d3.select(this);
            self.savePreviousDragPoint(el);
            el.raise().classed("dragging", true);
        }
    }

    private savePreviousDragPoint(el: any) {
        var elBox = el.nodes()[0].getBBox();
        if (!el.nodes()[0].classList.contains('dragging')) {
            this.previousDraggedPosition = {
                x: elBox.x,
                y: elBox.y
            };
        }
    }

    private dragged() {
        let self = this; // object context to preserve
        return function (d: any, i: any) {
            self.selected = this;
            /*var el = */d3.select(this)
                .select('.table-graphic')
                .attr("x", d.x = self.snapToGrid(d3.event.x, self.cubeResolution))
                .attr("y", d.y = self.snapToGrid(d3.event.y, self.cubeResolution));
        }
    }

    private dragended() {
        let self = this; // object context to preserve
        return function (d: any, i: any) {
            d3.select(this).classed("dragging", false);
            var newEl = d3.select(this).select('.table-graphic');
            var newPt = {
                x: newEl.attr('x'),
                y: newEl.attr('y')
            };
            var pt = self.findAndUpdate(self.coorNum(self.previousDraggedPosition), self.coorNum(newPt));
            if (pt) {
                self.previousDraggedPosition = pt;
            };
        }
    }
    private slided() {
        let self = this; // object context to preserve
        return function (d: any, i: any) {
            self.cubeResolution = self.slider.property("value");
            self.addRect();
        }
    }

    private clearDrawing() {
        if (this.draggedSvg)
            this.draggedSvg.remove();
        this.draggedSvg = null;
        if (this.svg) {
            this.svg.on('mousedown', null);
            this.view.exit().remove();
            this.svg.remove();
            this.svg = null;
        }
    }

    private putDragged() {
        let self = this; // object context to preserve
        return function (d: any, i: any) {
            var mouse = d3.mouse(this);
            if (self.draggedSvg && self.svg) {
                self.newItem(self.snapToGrid(mouse[0], self.cubeResolution), self.snapToGrid(mouse[1], self.cubeResolution));
            }
            self.addRect();
            self.moveRect(mouse);
        }
    }

    private addRect() {
        let self = this; // object context to preserve
        return function (d: any, i: any) {
            self.draggedSvg = self.backdropContainer
                .append('rect')
                .attr('width', self.cubeResolution)
                .attr('height', self.cubeResolution)
                .on('mousedown', self.putDragged())
                .on('mousemove', self.moveDragged())
                .on('mouseleave', self.mouseLeave())
                .on('mouseenter', self.mouseEnter())
                .attr('fill', 'blue')
                .style("visibility", self.hidden ? "hidden" : "visible");
        }
    }

    private zoomed() {
        let self = this; // object context to preserve
        return function (d: any, i: any) {
            self.currentTransform = d3.event.transform;
            self.view.attr("transform", d3.event.transform);
            self.gX.call(self.xAxis.scale(d3.event.transform.rescaleX(self.xScale)));
            self.gY.call(self.yAxis.scale(d3.event.transform.rescaleY(self.yScale)));
        }
    }

    //ADD RECT////////////
    moveRect(mouse: any) {
        if (this.draggedSvg) {
            var x = mouse[0] - this.cubeResolution / 2;
            var y = mouse[1] - this.cubeResolution / 2;
            this.draggedSvg.attr('x', x);
            this.draggedSvg.attr('y', y);
        }
    };

    private moveDragged() {
        let self = this; // object context to preserve
        return function (d: any, i: any) {
            var mouse = d3.mouse(this);
            if (self.draggedSvg) {
                self.moveRect(mouse);
            }
        }
    }
}
