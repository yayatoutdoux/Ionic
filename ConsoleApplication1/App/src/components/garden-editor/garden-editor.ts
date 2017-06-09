import { Component, ViewChild, Input } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser';

import * as d3 from 'd3-selection';
import * as d3Scale from "d3-scale";
import * as d3Shape from "d3-shape";
import * as d3Array from "d3-array";
import * as d3Axis from "d3-axis";
import * as d3Zoom from "d3-zoom";
import * as d3Random from "d3-random";
import * as d3Drag from "d3-drag";
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
        // select chart div and get the width and height of it.
        var containerStyle = document.querySelector('#chart-container').getBoundingClientRect();
        var svg:any = null,
            width = containerStyle.width,
            height = containerStyle.height,
            gX: any = null,
            gY: any = null,
            currentTransform = null,
            svg = d3.select("#chart-container").append('svg'),
            view = svg.append("g")
                .attr("class", "view");
        if (currentTransform) view.attr('transform', currentTransform);
        var xScale = d3Scale.scaleLinear()
            .domain([-width / 2, width / 2])
            .range([0, width]);

        var yScale = d3Scale.scaleLinear()
            .domain([-height / 2, height / 2])
            .range([height, 0]);
        var xAxis = d3Axis.axisBottom(xScale)
            .ticks((width + 2) / (height + 2) * 10)
            .tickSize(height)
            .tickPadding(8 - height);
        var yAxis = d3Axis.axisRight(yScale)
            .ticks(10)
            .tickSize(width)
            .tickPadding(8 - width);
        gX = svg.append("g")
            .attr("class", "axis axis--x")
            .call(xAxis);
        gY = svg.append("g")
            .attr("class", "axis axis--y")
            .call(yAxis);
        var zoom = d3Zoom.zoom()
            .scaleExtent([0.5, 5])
            .translateExtent([
                [-width * 2, -height * 2],
                [width * 2, height * 2]
            ])
            .on("zoom", zoomed);

        function zoomed() {
            currentTransform = d3.event.transform;
            view.attr("transform", currentTransform);
            gX.call(xAxis.scale(d3.event.transform.rescaleX(xScale)));
            gY.call(yAxis.scale(d3.event.transform.rescaleY(yScale)));
            slider.property("value", d3.event.scale);
        }

        var previousDraggedPosition: any = null,
            selected = null;
        // snap to grid is simply rounding to the nearest resolution of the square
        function snapToGrid(p: any, r: any) {
            return Math.round(p / r) * r;
        }
        // we'll use a resolution of 50 here
        var cubeResolution = 50;
        // randomly generate points, but make sure they snap to grid
        var points = d3Array.range(10).map(() => {
            return {
                x: snapToGrid(Math.random() * 500, cubeResolution),
                y: snapToGrid(Math.random() * 500, cubeResolution)
            };
        });
        var itemContainer = view.selectAll("g").attr("class", "itemContainer")
            // add group to view
            .data(points).enter().append('g')
            // and center the group in the middle
            .attr("transform", () => 'translate(' + xScale(0) + ',' + yScale(0) + ')')
            .append('g')
            // make this entire group draggable - this is useful for adding text elements later
            .call(d3Drag.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));
        // add the square to each group
        var item = itemContainer.append('rect').attr('class', 'table-graphic')
            .attr('x', (d:any) => d.x)
            .attr('y', (d:any) => d.y)
            .attr('data-rotation', 0)
            .attr('width', cubeResolution)
            .attr('height', cubeResolution)
            .attr('fill', 'blue')
            .on('click', function () {
                selected = this.parentNode;
            });

        function dragged(d: any) {
            selected = this;
            // update the position of the rect (square) and snap to grid
            var el = d3.select(this).select('.table-graphic').attr("x", (d: any) => snapToGrid(d3.event.x, cubeResolution)).attr("y", () => snapToGrid(d3.event.y, cubeResolution))
            // get center point and make sure rotation is correct on drag.
            var center = getCenter(el.attr('x'), el.attr('y'), cubeResolution, cubeResolution);
            el.attr('transform', () => {
                return "rotate(" + el.attr('data-rotation') + "," + center.x + ',' + center.y + ")";
            });
        }
        function dragended(d: any) {
            d3.select(this).classed("dragging", false);
            var newEl = d3.select(this).select('.table-graphic');
            var newPt = {
                x: newEl.attr('x'),
                y: newEl.attr('y')
            };
            // save and update position for redraw
            /*var pt = findAndUpdate(coorNum(previousDraggedPosition), coorNum(newPt));
            if (pt) {
                previousDraggedPosition = pt
            };*/
        }
        function dragstarted(d: any) {
            var el = d3.select(this);
            // save previous drag point for collisions and redraws
            savePreviousDragPoint(el);
            // raise the z-index to the top and set class to dragging
            el.raise().classed("dragging", true);
        }
        // helper to convert strings to integers
        function coorNum(pt: any) {
            return {
                x: parseInt(pt.x, 10),
                y: parseInt(pt.y, 10)
            };
        }
        function savePreviousDragPoint(el: any) {
            var elBox = el.nodes()[0].getBBox();
            if (!el.nodes()[0].classList.contains('dragging')) {
                previousDraggedPosition = {
                    x: elBox.x,
                    y: elBox.y
                };
            }
        }
        // helper for drag recentering
        function getCenter(x: any, y: any, w: any, h: any) {
            return {
                x: parseInt(x, 10) + parseInt(w, 10) / 2,
                y: parseInt(y, 10) + parseInt(h) / 2
            }
        };
        // add slider instead of mousewheel zoom to improve user experience
        // have it start at min 50% and max out at 5x the amount.
        var slider = d3.select(".editor").append("input")
            .datum({})
            .attr("type", "range")
            .attr("value", 1)
            .attr("min", zoom.scaleExtent()[0])
            .attr("max", zoom.scaleExtent()[1])
            .attr("step", (zoom.scaleExtent()[1] - zoom.scaleExtent()[0]) / 100)
            .on("input", slided);
        function slided(d: any) {
            zoom.scaleTo(svg, d3.select(this).property("value"));
        }
        // disable zoom on mousewheel and double click
        svg.call(zoom).on("wheel.zoom", null)
            .on('dblclick.zoom', null);
    }


    ngAfterContentInit()
    {
        this.initSvg();
        /*var svgContainer = d3.select(".editor").append("svg")
            .attr("width", 2000)
            .attr("height", 1000);

        var zoomed = function () {
            svgContainer.attr("transform", d3.event.transform);
            //svgContainer.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
        };

        var zoom = d3.zoom()
            .scaleExtent([1, 40])
            .on("zoom", zoomed);

        svgContainer
        .append("g")
            .call(d3.behavior.zoom().scaleExtent([1, 8]).on("zoom", function () { }))
        .append("g");
        
        //Draw the Rectangle
        var rectangle = svgContainer.append("rect")
        .attr("x", 10)
        .attr("y", 10)
        .attr("width", 50)
            .attr("height", 100);

        svgContainer.call(zoom);*/
    }
}
