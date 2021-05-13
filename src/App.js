import React, {useState} from "react";
import { useFetch } from "./hooks/useFetch";
import { text } from "d3";
import * as d3 from "d3";
import { max, min } from "d3-array"
import { scaleLinear, scaleTime } from "d3-scale"
import ReactSlider from 'react-slider'
import Slider from '@material-ui/core'



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


    // Create Min Slider State
    const [minYear, setMinYear] = useState(2002);

    // Create Max Slider State
    const [maxYear, setMaxYear] = useState(2021);


    if (loading === true) { 
        
    const svg = d3 // create the svg box for the viz and appending it to line-chart div
    .select("#line-chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const xScale = scaleTime() //  x-axis for MONTH - YEAR
        .domain([d3.min(data, d => d.Month), d3.max(data, d => d.Month)]).nice()
        .range([0, width])
    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(xScale)); 

    const yScale = scaleLinear() // y axis for HIGH SCHOOL
        .domain([0, 25])
        .range([height, 0]);
    svg.append("g")
        .call(d3.axisLeft(yScale));



    /* Create 4 lines */

    const k12lessLine = d3.line() //create the line
        .x(function (d) {
        return xScale(d.Month);
        })
        .y(function (d) {
        return yScale(d.K12LESS);
        });       

    const highschoolLine = d3.line() 
        .x(function (d) {
        return xScale(d.Month);
        })
        .y(function (d) {
        return yScale(d.HIGHSCHOOL);
        }); 

    const associateLine = d3.line() 
        .x(function (d) {
        return xScale(d.Month);
        })
        .y(function (d) {
        return yScale(d.ASSOCIATE);
        });     

    const bachelorLine = d3.line() 
        .x(function (d) {
        return xScale(d.Month);
        })
        .y(function (d) {
        return yScale(d.BACHELOR);
        });            
    /* rendering the lines on the graph */    
    
    svg.append("path") // add the line to svg
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width", 1.5)
        .attr("d", k12lessLine);

    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-width", 1.5)
        .attr("d", highschoolLine); 

    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "blue")
        .attr("stroke-width", 1.5)
        .attr("d", associateLine);         

    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "green")
        .attr("stroke-width", 1.5)
        .attr("d", bachelorLine);
};

    console.log("from hook", loading, data);

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

            

            <div>
            <ReactSlider
                className="horizontal-slider"
                thumbClassName="thumb-1"
                thumbActiveClassName="thumb-1"
                trackClassName="example-track"
                defaultValue={[minYear,maxYear]} // Have this be the min and max
                min={minYear} // Min time that shows up
                max={maxYear} // Max Time that shows up
                ariaLabel={['Lower thumb', 'Upper thumb']}
                ariaValuetext={state => `Thumb value ${state.valueNow}`}
                renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
                pearling
                minDistance={1}
                withTracks
            />
            </div>


        </div>


    );

};


export default App;