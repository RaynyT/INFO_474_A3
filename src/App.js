import React, {useState} from "react";
import { useFetch } from "./hooks/useFetch";
import { scaleLinear } from "d3-scale";
import { scaleTime } from "d3-scale";
import { max } from "d3-array";
import * as d3 from "d3";
import { text } from "d3";


const App = () => {
    
    // loading in data
    const [data, loading] = useFetch(
        "https://raw.githubusercontent.com/RaynyT/INFO_474_A3/lineChart_akoly/data/Data.csv"
    );
    
    // defining constants like height, width, and margin 
    const margin = { top: 20, right: 20, bottom: 30, left: 50 }, //size
        width = 1000 - margin.left - margin.right,
        height = 550 - margin.top - margin.bottom;


    const svg = d3 // create the svg box for the viz and appending it to line-chart div
        .select("#line-chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const timeParse = d3.timeParse(`%b-%y`);

    // Less-than-a-high-school-diploma --> K12LESS
    // High-school-graduates-no-college --> HIGHSCHOOL
    // Some-college-or-associate-degree --> ASSOCIATE
    // Bachelor-degree-and-higher --> BACHELOR 
    let formatDate = data.map(function (d) { //parse values to int so that d3 can process them
        d.Month = timeParse(d.Month); //// When reading the csv, format variables
        d.K12LESS = +d.K12LESS;
        d.HIGHSCHOOL = +d.HIGHSCHOOL;
        d.ASSOCIATE = +d.ASSOCIATE;
        d.BACHELOR = +d.BACHELOR;
        return d
    });

    console.log(formatDate)
    if (!loading) {console.log((data[0].Month));}
    


    // When reading the csv, I must format variables:
    // data.forEach(function(d){
    //     d.Month = d3.timeParse("%b-%y")(d.Month)
    // });


    const xScale = scaleTime() //  x-axis for MONTH - YEAR
        .domain([d3.min(data, d => d.Month), d3.max(data, d => d.Month)]).nice()
        .range([0, width])
    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(xScale));

    const yScale = scaleLinear() // y axis for HIGH SCHOOL
        .domain([0, max(data, function (d) { return d.HIGHSCHOOL; })]).nice()
        .range([height, 0]);
    svg.append("g")
        .call(d3.axisLeft(yScale));

    const valueline = d3.line() //create the line
        .x(function (d) {
        return xScale(d.K12LESS);
        })
        .y(function (d) {
        return yScale(d.HIGHSCHOOL);
        });
    
    svg.append("path") // add the line to svg
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width", 1.5)
        .attr("d", valueline);


    //console.log("from hook", loading, data);

    return(
        <div className="vis">
            <p>{loading && "Loading data!"}</p>
            {/* Introduction */}
            <h3> Dataset: Unemployment rates for persons 25 years and older by educational attainment</h3>
            <p> About the dataset: place holder</p>
            <p> Analysis questions: place holder</p>

            {/* Visualization */}
            <h3>Visualization name goes here</h3>
            <div id="line-chart" ></div>

        </div>


    );

};

export default App;