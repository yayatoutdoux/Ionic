import { Component, ViewChild, Input } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser';

import * as d3 from 'd3';
import { ActionSheet, ActionSheetController, Config, AlertController, App, FabContainer, ItemSliding, List, ModalController, NavController, ToastController, LoadingController, Refresher } from 'ionic-angular';

/*
  To learn how to use third party libs in an
  Ionic app check out our docs here: http://ionicframework.com/docs/v2/resources/third-party-libs/
*/
// import moment from 'moment';

import { ConferenceData } from '../../providers/conference-data';
import { UserData } from '../../providers/user-data';

import { SessionDetailPage } from '../session-detail/session-detail';
import { GardenDetailPage } from '../garden-detail/garden-detail';


@Component({
  selector: 'garden-editor',
  templateUrl: 'garden-editor.html'
})
export class GardenEditor {
    @Input() garden : any;

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
        
        var cubeResolution = 50;

        
        var width = containerStyle.width;
        var height = containerStyle.height;
        var points: any = [];
        this.garden.height = 60;
        this.garden.width = 60;

        //w > h !!!!!!!!
        var xScale = d3.scaleLinear()
            .domain([0, (width) / (height) * this.garden.width])
            .range([0, width]);

        var yScale = d3.scaleLinear()
            .domain([0, this.garden.height])
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
                newItem(snapToGrid(mouse[0] - cubeResolution - 10, cubeResolution), snapToGrid(mouse[1] - cubeResolution - 10, cubeResolution));
            }
        };

        var moveDragged = function () {
            var mouse = d3.mouse(this);
            if (draggedSvg) {
                var x = mouse[0] - cubeResolution - 10;
                var y = mouse[1] - cubeResolution - 10;
                draggedSvg.attr('x', x);
                draggedSvg.attr('y', y);
            }
        };


        var draw = () => {
            svg = d3.select("#chart-container").append('svg');
            svg.attr("width", width);
            svg.attr("height", height);

            view = svg.append("g")
                .attr("class", "view");

            if (currentTransform)
                view.attr('transform', currentTransform);

            itemContainer = view.append("rect")
                .attr("class", "view")
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

            backdrop.on('mousedown', putDragged).on('mousemove', moveDragged);

            item = itemContainer.append('rect').attr('class', 'table-graphic')
                .attr('x', (d: any) => d.x)
                .attr('y', (d: any) => d.y)
                .attr('data-rotation', 0)
                .attr('width', cubeResolution)
                .attr('height', cubeResolution)
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

            svg.call(zoom);

        };
        draw();

        d3.select(".bt")
            .on("click", resetted);
        
        function addRect() {
            draggedSvg = backdropContainer.append('rect').attr('width', cubeResolution).attr('height', cubeResolution);
        }

        d3.select(".bt2")
            .on("click", addRect);

        function zoomed() {
            currentTransform = d3.event.transform;
            view.attr("transform", d3.event.transform);
            gX.call(xAxis.scale(d3.event.transform.rescaleX(xScale)));
            gY.call(yAxis.scale(d3.event.transform.rescaleY(yScale)));

            //cubeResolution = 50/xScale(1);
            //slider.property("value", d3.event.scale);
        }

        function resetted() {
            svg.call(zoom.transform, d3.zoomIdentity);
        }


        function newItem(x:any, y:any) {
            points.push({
                x: x,
                y: y
            });
            clearDrawing();
            draw();
        }

        function clearDrawing() {
            if (draggedSvg) draggedSvg.remove();
            draggedSvg = null;
            //newElementData = null;
            if (svg) {
                svg.on('mousedown', null);
                view.exit().remove();
                svg.remove();
                svg = null;
            }
        }

        function stopped() {
            if (d3.event.defaultPrevented) d3.event.stopPropagation();
        }

        function snapToGrid(p: any, r: any) {
            return Math.max(Math.round(p / r) * r, 0);
        }

        function coorNum(pt:any) {
            return {
                x: parseInt(pt.x, 10),
                y: parseInt(pt.y, 10)
            };
        }

        /*function getCenter(x: any, y: any, w: any, h: any) {
            return {
                x: parseInt(x, 10) + parseInt(w, 10) / 2,
                y: parseInt(y, 10) + parseInt(h) / 2
            }
        };*/
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
            console.log(d3.event.x);
            var el = d3.select(this)
                .select('.table-graphic')
                .attr("x", d.x = snapToGrid(d3.event.x, cubeResolution))
                .attr("y", d.y = snapToGrid(d3.event.y, cubeResolution));
            //var center = getCenter(el.attr('x'), el.attr('y'), cubeResolution, cubeResolution);
            /*el.attr('transform', () => {
                return "rotate(" + el.attr('data-rotation') + "," + center.x + ',' + center.y + ")";
            })*/
            //el.call(collide, el);
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
            console.log(previousDraggedPosition);
        }
    }
   
    ngAfterContentInit()
    {
        this.initSvg();
    }
}
