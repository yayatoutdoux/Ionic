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
        
        var width = containerStyle.width;
        var height = containerStyle.height;
        this.garden.height = 60;
        this.garden.width = 60;

        //w > h !!!!!!!!
        var xScale = d3.scaleLinear()
            .domain([0, (width) / (height) * this.garden.height])
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
            .translateExtent([[0, 0], [xScale(this.garden.width), yScale(this.garden.height)]])
            .extent([[0, 0], [this.garden.width, this.garden.height]])
            .on("zoom", zoomed);
        var aaa = () => {
            alert(1);
        }

        var draw = () => {
            svg = d3.select("#chart-container").append('svg');
            svg.attr("width", width);
            svg.attr("height", height);

            
            view = svg.append("g")
                .attr("class", "view");

            if (currentTransform) view.attr('transform', currentTransform);


            itemContainer = view.append("rect")
                .attr("class", "view")
                .attr("x", 0)
                .attr("y", 0)
                .attr("width", this.garden.width * xScale(1))
                .attr("height", this.garden.height * yScale(1));


            /*itemContainer = view.selectAll("g").attr("class", "itemContainer")
                .data(points).enter().append('g')
                .attr("transform", () => 'translate(' + xScale(0) + ',' + yScale(0) + ')')
                .append('g')
                .call(d3.drag()
                    .on("start", dragstarted)
                    .on("drag", dragged)
                    .on("end", dragended));*/
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
                .attr('fill', "black")
                .attr('opacity', '0');

            backdrop.on('mousedown', function () {
                alert();
                var mouse = d3.mouse(this);
                /*if (draggedSvg && svg) {
                    newItem(snapToGrid(mouse[0] - cubeResolution - 10, cubeResolution), snapToGrid(mouse[1] - cubeResolution - 10, cubeResolution));
                }*/
            }).on('mousemove', function () {
                alert();
                /*var mouse = d3.mouse(this);
                if (draggedSvg) {
                    var x = mouse[0] - cubeResolution - 10;
                    var y = mouse[1] - cubeResolution - 10;
                    draggedSvg.attr('x', x);
                    draggedSvg.attr('y', y);
                }*/
            });
            /*
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

            svg.call(zoom)
                .on("wheel.zoom", null)
                .on('dblclick.zoom', null);*/
            gX = svg.append("g")
                .attr("class", "axis axis--x")
                .call(xAxis);

            gY = svg.append("g")
                .attr("class", "axis axis--y")
                .call(yAxis);

            svg.call(zoom);

        }
        draw();

        d3.select(".bt")
            .on("click", resetted);
        

        function zoomed() {
            //currentTransform = d3.event.transform;
            view.attr("transform", d3.event.transform);
            gX.call(xAxis.scale(d3.event.transform.rescaleX(xScale)));
            gY.call(yAxis.scale(d3.event.transform.rescaleY(yScale)));
            //slider.property("value", d3.event.scale);
        }

        function resetted() {
            svg.call(zoom.transform, d3.zoomIdentity);
        }

        function stopped() {
            if (d3.event.defaultPrevented) d3.event.stopPropagation();
        }
    }
   
    ngAfterContentInit()
    {
        this.initSvg();
    }
}
