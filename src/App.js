import React, {useState} from "react";
import { useFetch } from "./hooks/useFetch";
import { text } from "d3";
import * as d3 from "d3";
import { max } from "d3-array"
import { scaleLinear, scaleTime } from "d3-scale"

//References:
//https://www.d3-graph-gallery.com/graph/interactivity_button.html
//Interactive legend: https://www.d3-graph-gallery.com/graph/connectedscatter_legend.html
//Checkboxes: https://www.d3-graph-gallery.com/graph/bubblemap_buttonControl.html

const App = () => {
    const [data, loading] = useFetch(
        "https://raw.githubusercontent.com/RaynyT/INFO_474_A3/main/data/Data.csv"
    );
    
    const timeParse = d3.timeParse(`%b-%y`);

    let formatData = data.map(function (d) { //parse values to int so that d3 can process them
        d.Month = timeParse(d.Month);
        d.K12LESS = +d.K12LESS;
        d.HIGHSCHOOL = +d.HIGHSCHOOL;
        d.ASSOCIATE = +d.ASSOCIATE;
        d.BACHELOR = +d.BACHELOR;

        return d;
    });

    // defining constants like height, width, and margin 
    const margin = { top: 20, right: 20, bottom: 30, left: 50 }, //size
        width = 1000 - margin.left - margin.right,
        height = 550 - margin.top - margin.bottom;

if (loading === true) { // Prevents extra appending

    const svg = d3 // create the svg box for the viz and appending it to line-chart div
        .select("#line-chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // List of groups (here I have one group per column)
    var allGroup = ["K12LESS", "HIGHSCHOOL", "ASSOCIATE", "BACHELOR"];

    // Reformat the data: we need an array of arrays of {x, y} tuples
    var dataReady = allGroup.map( function(grpName) { // .map allows to do something for each element of the list
      return {
        name: grpName,
        values: data.map(function(d) {
          return {time: d.Month, value: +d[grpName]};
        })
      };
    });

    var myColor = d3.scaleOrdinal()
      .domain(allGroup)
      .range(d3.schemeSet2);

    const xScale = scaleTime() //  x-axis for MONTH - YEAR
        .domain([d3.min(formatData, d => d.Month), d3.max(formatData, d => d.Month)]).nice()
        .range([0, width])
    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(xScale)); 

    const yScale = scaleLinear() // y axis for HIGH SCHOOL
        .domain([0, 25])
        .range([height, 0]);
    svg.append("g")
        .call(d3.axisLeft(yScale));

    // Add the lines
    var line = d3.line()
      .x(function(d) { return xScale(+d.time) })
      .y(function(d) { return yScale(+d.value) })
    svg.selectAll("myLines")
      .data(dataReady)
      .enter()
      .append("path")
        .attr("id", function(d){ return d.name })
        .attr("d", function(d){ return line(d.values) } )
        .attr("stroke", function(d){ return myColor(d.name) })
        .style("stroke-width", 4)
        .style("fill", "none");

    // Add a legend (interactive)
    svg.selectAll("myLegend")
      .data(dataReady)
      .enter()
        .append('g')
        .append("text")
          .attr("x", function(d,i){ return 50 + i*120})
          .attr("y", 30)
          .attr("id", function(d){ return d.name + "-text" })
          .text(function(d) { return d.name; })
          .style("fill", function(d){ return myColor(d.name) })
          .style("font-size", 15);
        // .on("click", function(e, d) {
        //     console.log(d)
        //     // is the element currently visible ?
        //     currentOpacity = d3.selectAll("#" + d.name).style("opacity")
        //     // Change the opacity: from 0 to 1 or from 1 to 0
        //     d3.selectAll("#" + d.name).transition().style("opacity", currentOpacity == 1 ? 0:1)
        // });

    // manually add add in event listener bc its not working on the legend for some reason
    svg.select("#K12LESS-text").on("click", function(e, d) {
        // is the element currently visible ?
        currentOpacity = d3.select("#K12LESS").style("opacity")
        // Change the opacity: from 0 to 1 or from 1 to 0
        d3.select("#K12LESS").transition().style("opacity", currentOpacity == 1 ? 0:1)
    });

    svg.select("#HIGHSCHOOL-text").on("click", function(e, d) {
        // is the element currently visible ?
        currentOpacity = d3.select("#HIGHSCHOOL").style("opacity")
        // Change the opacity: from 0 to 1 or from 1 to 0
        d3.select("#HIGHSCHOOL").transition().style("opacity", currentOpacity == 1 ? 0:1)
    });

    svg.select("#ASSOCIATE-text").on("click", function(e, d) {
        // is the element currently visible ?
        currentOpacity = d3.select("#ASSOCIATE").style("opacity")
        // Change the opacity: from 0 to 1 or from 1 to 0
        d3.select("#ASSOCIATE").transition().style("opacity", currentOpacity == 1 ? 0:1)
    });

    svg.select("#BACHELOR-text").on("click", function(e, d) {
        // is the element currently visible ?
        currentOpacity = d3.select("#BACHELOR").style("opacity")
        // Change the opacity: from 0 to 1 or from 1 to 0
        d3.select("#BACHELOR").transition().style("opacity", currentOpacity == 1 ? 0:1)
    });

        /* Create 4 lines */
    // const k12lessLine = d3.line() //create the line
    //     .x(function (d) {
    //     return xScale(d.Month);
    //     })
    //     .y(function (d) {
    //     return yScale(d.K12LESS);
    //     });       

    // const highschoolLine = d3.line() 
    //     .x(function (d) {
    //     return xScale(d.Month);
    //     })
    //     .y(function (d) {
    //     return yScale(d.HIGHSCHOOL);
    //     }); 

    // const associateLine = d3.line() 
    //     .x(function (d) {
    //     return xScale(d.Month);
    //     })
    //     .y(function (d) {
    //     return yScale(d.ASSOCIATE);
    //     });     

    // const bachelorLine = d3.line() 
    //     .x(function (d) {
    //     return xScale(d.Month);
    //     })
    //     .y(function (d) {
    //     return yScale(d.BACHELOR);
    //     });            
    /* rendering the lines on the graph */    

    // svg.append("path") // add the line to svg
    //     .datum(formatData)
    //     .attr("fill", "none")
    //     .attr("stroke", "black")
    //     .attr("stroke-width", 1.5)
    //     .attr("d", k12lessLine)
    //     .attr("className", "K12LESS");

    // svg.append("path")
    //     .datum(formatData)
    //     .attr("fill", "none")
    //     .attr("stroke", "red")
    //     .attr("stroke-width", 1.5)
    //     .attr("d", highschoolLine)
    //     .attr("className", "HIGHSCHOOL");

    // svg.append("path")
    //     .datum(formatData)
    //     .attr("fill", "none")
    //     .attr("stroke", "blue")
    //     .attr("stroke-width", 1.5)
    //     .attr("d", associateLine)
    //     .attr("className", "ASSOCIATE");    

    // svg.append("path")
    //     .datum(formatData)
    //     .attr("fill", "none")
    //     .attr("stroke", "green")
    //     .attr("stroke-width", 1.5)
    //     .attr("d", bachelorLine)
    //     .attr("className", "BACHELOR");    

    // console.log("from hook", loading, formatData);

    /* Checkboxes */
    // const update = () => {
    //     console.log("im here")
    //     // For each check box:
    //     d3.selectAll(".checkbox").each(function(d) {
    //         cb = d3.select(this);
    //         grp = cb.property("value");

    //         if (cb.property("checked")) { // If the box is check, I show the group
    //             svg.select("." + grp)
    //                 .transition()
    //                 .duration(1000)
    //                 .style("opacity", 1);
    //         } else { // Otherwise I hide it
    //             svg.select("." + grp)
    //                 .transition()
    //                 .duration(1000)
    //                 .style("opacity", 0);
    //         }
    //     });
    // }
    // d3.selectAll(".checkbox").attr("checked", "checked"); //initialize checkboxes as checked
};
    return(
        <div className="vis">
            <p>{loading && "Loading data!"}</p>
            {/* Introduction */}
            <h3> Dataset: Unemployment rates for persons 25 years and older by educational attainment</h3>
            <p> About the dataset: place holder</p>
            <p> Analysis questions: place holder</p>
            <br></br>

            {/* Visualization */}
            <h3>Visualization name goes here</h3>
            <br></br>
            {/* <div className="line-graph-checkboxes">
                <input type="checkbox" className="checkbox" name="K12LESS" value="K12LESS" onChange={update} />
                <label for="K12LESS">{"K12 & Less"}</label>

                <input type="checkbox" className="checkbox" name="HIGHSCHOOL" value="HIGHSCHOOL" onChange={update} />
                <label for="HIGHSCHOOL">Highschool Diploma</label>

                <input type="checkbox" className="checkbox" name="ASSOCIATE" value="ASSOCIATE" onChange={update} />
                <label for="ASSOCIATE">Associate's Degree</label>

                <input type="checkbox" className="checkbox" name="BACHELOR" value="BACHELOR" onChange={update} />
                <label for="BACHELOR">Bachelor's Degree</label>
            </div> */}
            <div id="line-chart" ></div>
        </div>
    );
};

export default App;