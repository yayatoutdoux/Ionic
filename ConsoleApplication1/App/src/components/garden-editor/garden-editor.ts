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
        var svg = d3.select("svg");
        var width = +svg.attr("width");
        var height = +svg.attr("height");
        this.garden.height = 60;
        this.garden.width = 60;



        var y = d3Scale.scaleLinear()
            .domain([0, this.garden.height])
            .range([0, height]);


        var x = d3Scale.scaleLinear()
            .domain([0, (width) / (height) * this.garden.height])
            .range([0, width]);

        










        var xAxis = d3Axis.axisBottom(x)
            .ticks((width) / (height) * 10)
            .tickSize(height)
            .tickPadding(8 - height);

        var yAxis = d3Axis.axisRight(y)
            .ticks(10)
            .tickSize(width)
            .tickPadding(8 - width);

        var view = svg.append("rect")
            .attr("class", "view")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", this.garden.width * x(1))
            .attr("height", this.garden.height * y(1));

        var gX = svg.append("g")
            .attr("class", "axis axis--x")
            .call(xAxis);

        var gY = svg.append("g")
            .attr("class", "axis axis--y")
            .call(yAxis);

        
        var zoom = d3Zoom.zoom()
            .scaleExtent([1, 40])
            .translateExtent([[0, 0], [x(this.garden.width), y(this.garden.height)]])
            .extent([[0, 0], [x(this.garden.width), y(this.garden.height)]])
            .on("zoom", zoomed);



        d3.select(".bt")
            .on("click", resetted);
        
        svg.call(zoom);

        function zoomed() {
            view.attr("transform", d3.event.transform);
            gX.call(xAxis.scale(d3.event.transform.rescaleX(x)));
            gY.call(yAxis.scale(d3.event.transform.rescaleY(y)));
        }

        function resetted() {
            svg.transition()
                .duration(750)
                .call(zoom.transform, d3Zoom.zoomIdentity);
        }
    }
   
    ngAfterContentInit()
    {
        this.initSvg();
        
    }
}
