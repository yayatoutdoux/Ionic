import { Component, ViewChild, Input } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser';

import * as d3 from 'd3';
import * as textures from 'textures';

import { Slides, ActionSheet, ActionSheetController, Config, AlertController, App, FabContainer, ItemSliding, List, ModalController, NavController, ToastController, LoadingController, Refresher } from 'ionic-angular';

@Component({
  selector: 'garden-editor',
  templateUrl: 'garden-editor.html'
})
export class GardenEditor {
    @Input() garden : any;
    @Input() slides: Slides;

    constructor(
    ) {
        
    }

    initSvg() {

        var containerStyle = document.querySelector('#chart-container').getBoundingClientRect();
        var svg:any = null;
        var view:any = null;
        var gX:any = null;
        var gY:any = null;
        var itemContainer:any = null;
        var currentTransform: any = null;
        var backdropContainer: any = null;
        var backdrop: any = null;
        var draggedSvg: any = null;
        var item: any = null;
        var selected: any = null;
        var previousDraggedPosition: any = null;
        var cubeResolution = 1;
        var width = containerStyle.width;
        var height = containerStyle.height;
        var points: any = [];

        //w > h !!!!!!!!

        var xScale = d3.scaleLinear()
            .domain([0, width])
            .range([0, width]);

        var yScale = d3.scaleLinear()
            .domain([0, height])
            .range([0, height]);

        var xAxis = d3.axisBottom(xScale)
            .ticks((width) / (height) * 10)
            .tickSize(height)
            .tickPadding(8 - height);

        var yAxis = d3.axisRight(yScale)
            .ticks(10)
            .tickSize(width)
            .tickPadding(8 - width);

        var zoom = d3.zoom()
            .scaleExtent([1, 40])
            .translateExtent([[0, 0], [width, height]])
            .on("zoom", zoomed);

        var putDragged = function() {
            var mouse = d3.mouse(this);
            if (draggedSvg && svg) {
                newItem(snapToGrid(mouse[0], cubeResolution), snapToGrid(mouse[1], cubeResolution));
            }
        };

        var moveDragged = function () {
            var mouse = d3.mouse(this);
            if (draggedSvg) {
                var x = mouse[0] - cubeResolution/2;
                var y = mouse[1] - cubeResolution/2;
                draggedSvg.attr('x', x);
                draggedSvg.attr('y', y);
            }
        };


        var draw = () => {
            svg = d3.select("#chart-container").append('svg');
            svg.attr("width", width);
            svg.attr("height", height);

            //Texture
            var t = textures.lines()
                .thicker();

            svg.call(t);

            view = svg.append("g")
                .attr("class", "view");
                //.style("fill", t.url());

            if (currentTransform) {
                view.attr('transform', currentTransform);
            }

            view.append("rect")
                .attr("class", "view-rect")
                .attr("x", 0)
                .attr("y", 0)
                .attr("width", this.garden.width * xScale(1))
                .attr("height", this.garden.height * yScale(1));

            itemContainer = view.selectAll("g").attr("class", "itemContainer")
                .data(points).enter().append('g')
                .attr("transform", () => 'translate(' + xScale(0) + ',' + yScale(0) + ')')
                .append('g').on('mousedown', putDragged).on('mousemove', moveDragged)
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
                .attr('x', 0)
                .attr('y', 0)
                .attr('class', 'table-backdrop')
                .attr('height', this.garden.height * yScale(1))
                .attr('width', this.garden.width * xScale(1))
                .attr('fill', "black")
                .attr('opacity', '0');

            backdrop
                .on('mousedown', putDragged)
                .on('mousemove', moveDragged);

            item = itemContainer.append('rect').attr('class', 'table-graphic')
                .attr('x', (d: any) => d.x)
                .attr('y', (d: any) => d.y)
                .attr('data-rotation', 0)
                .attr('width', (d: any) => d.res)
                .attr('height', (d: any) => d.res)
                .attr('fill', 'blue')
                .on('click', function () {
                    console.log('clicked');
                    selected = this.parentNode;
                })

            /*svg.call(zoom)
                .on("wheel.zoom", null)
                .on('dblclick.zoom', null);*/

            gX = svg.append("g")
                .attr("class", "axis axis--x")
                .call(xAxis);

            gY = svg.append("g")
                .attr("class", "axis axis--y")
                .call(yAxis);

            svg
                .call(zoom)

            if (currentTransform) {
                svg.call(zoom.transform, d3.zoomIdentity.translate(currentTransform.x, currentTransform.y).scale(currentTransform.k));
            }
        };
        draw();

        //Autozoom
        var scaleX = width / this.garden.width;
        var scaleY = height / this.garden.height;
        var scale = Math.min(scaleX, scaleY);

        function addRect() {
            draggedSvg = backdropContainer
                .append('rect')
                .attr('width', cubeResolution)
                .attr('height', cubeResolution)
                .on('mousedown', putDragged)
                .on('mousemove', moveDragged)
                .attr('fill', 'blue');
        }

        d3.select(".bt")
            .on("click", resetted);

        d3.select(".bt2")
            .on("click", addRect);

        function zoomed() {
            currentTransform = d3.event.transform;
            view.attr("transform", d3.event.transform);
            gX.call(xAxis.scale(d3.event.transform.rescaleX(xScale)));
            gY.call(yAxis.scale(d3.event.transform.rescaleY(yScale)));
            //slider.property("value", d3.event.scale);
        }

        function resetted() {
            svg.call(zoom.transform, d3.zoomIdentity);
        }

        function newItem(x:any, y:any) {
            points.push({
                x: x,
                y: y,
                res: cubeResolution
            });
            clearDrawing();
            draw();
        }

        function clearDrawing() {
            if (draggedSvg)
                draggedSvg.remove();
            draggedSvg = null;
            if (svg) {
                svg.on('mousedown', null);
                view.exit().remove();
                svg.remove();
                svg = null;
            }
        }

        function snapToGrid(p: any, r: any) {
            return Math.max(Math.floor(p)/* / r) * r*/, 0);
        }

        function coorNum(pt:any) {
            return {
                x: parseInt(pt.x, 10),
                y: parseInt(pt.y, 10)
            };
        }

        
        function findAndUpdate(oldPt: any, newPt: any) {
            for (var i = 0; i < points.length; i++) {
                if (points[i].x === oldPt.x && points[i].y === oldPt.y) {
                    points[i] = {
                        x: newPt.x,
                        y: newPt.y
                    };
                    return points[i];
                }
            }
        }
        function dragstarted(d: any) {
            var el = d3.select(this);
            savePreviousDragPoint(el);
            el.raise().classed("dragging", true);
        }

        function savePreviousDragPoint(el:any) {
            var elBox = el.nodes()[0].getBBox();
            if (!el.nodes()[0].classList.contains('dragging')) {
                previousDraggedPosition = {
                    x: elBox.x,
                    y: elBox.y
                };
            }
        }

        function dragged(d: any) {
            selected = this;
            /*var el = */d3.select(this)
                .select('.table-graphic')
                .attr("x", d.x = snapToGrid(d3.event.x, cubeResolution))
                .attr("y", d.y = snapToGrid(d3.event.y, cubeResolution));
        }

        function dragended(d: any) {
            d3.select(this).classed("dragging", false);
            var newEl = d3.select(this).select('.table-graphic');
            var newPt = {
                x: newEl.attr('x'),
                y: newEl.attr('y')
            };
            var pt = findAndUpdate(coorNum(previousDraggedPosition), coorNum(newPt));
            if (pt) {
                previousDraggedPosition = pt;
            };
        }
        
        var slided = function () {
            cubeResolution = slider.property("value");
        }

        var slider = d3.select(".button-container").append("input")
            .datum({})
            .attr("type", "range")
            .attr("value", 1)
            .attr("min", 1)
            .attr("max", Math.min(this.garden.height, this.garden.width))
            .attr("step", 1)
            .on("input", slided);

        svg.call(zoom.transform, d3.zoomIdentity.translate(0, 0).scale(scale));
    }
   
    ngAfterContentInit()
    {
        this.initSvg();
    }

    goToPresentation() {
        this.slides.lockSwipes(false);
        this.slides.slideTo(0);
        this.slides.lockSwipes(true);
    }
}
