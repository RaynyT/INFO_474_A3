import React, {useState} from "react";
import { useFetch } from "./hooks/useFetch";
import { text } from "d3";
import * as d3 from "d3";
import { max, min } from "d3-array"
import { scaleLinear, scaleTime } from "d3-scale"
import ReactSlider from 'react-slider'
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';




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


    // Create Min Slider State
    const [minYear, setMinYear] = useState(2001);

    // Create Max Slider State
    const [maxYear, setMaxYear] = useState(2021);


    const useStyles = makeStyles({
        root: {
            width: 300,
        }});

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
          
    function valuetext(value) {
        return `${value}`;
    }

    const classes = useStyles();
    const [value, setValue] = useState([minYear, maxYear]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    }


    if (loading === true) { // Prevents extra appending

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

    svg.select("#BACHELOR-text").on("click", function(e, d) {
        // is the element currently visible ?
        currentOpacity = d3.select("#BACHELOR").style("opacity")
        // Change the opacity: from 0 to 1 or from 1 to 0
        d3.select("#BACHELOR").transition().style("opacity", currentOpacity == 1 ? 0:1)
    });
};

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

            

            <div className={classes.root}>
                <Typography id="range-slider" gutterBottom>
                    Year Range
                </Typography>
                <Slider
                    value={value}
                    onChange={handleChange}
                    valueLabelDisplay="auto"
                    aria-labelledby="range-slider"
                    getAriaValueText={valuetext}
                />
            </div>


            <br></br>
            <div id="line-chart" ></div>
            <br></br>
            <h3>Final write-up</h3>
            <p><b>Rationale for our design decisions:</b> Since we were interested in seeing the unemployment 
            rate before the pandemic compared to 1 year after the start of the pandemic, we thought that a line 
            graph would nicely represent/display the comparison. This is because it enables us to see the progression 
            of unemployment from year to year. Beyond that, the line chart allows us to see different high and low 
            points of unemployment rates. </p>
            <p><b>Overview of work distribution:</b> It was really difficult to split the work among group members 
            since we are all working on the same visualization/chart. Though, we found a way to collaborate in that we had 
            one person lay down the groundwork in creating the original chart/axis and parsing through the data. Then we assigned 
            different features like displaying the line chart, filtering checkbox, and slider year to different individuals. 
            Below is how we split up the work. Individuals with higher level difficulty features were able to focus on just that feature. 
            </p>
            <p><b>Akoly's to-do list:</b></p>
            <ul>
                <li>Create chart and axes </li>
                <li>Break down year by year</li>
                <li>Set Axis Labels</li>
                <li>Parse data with date time</li>
                <li>Create Basic Structure for Web App, Html, CSS, JS folders and files</li>
            </ul>
            <p><b>Jisue's to-do list:</b></p>
            <ul>
                <li>Display line chart </li>
            </ul>
            <p><b>Kayla's to-do list:</b></p>
            <ul>
                <li>Checkboxes - Filter based on degree level feature</li>
            </ul>
            <p><b>Alex's to-do list:</b></p>
            <ul>
                <li>Zooming/slider feature</li>
                <li>Data write up</li>
            </ul>
            <p><b>Rayna's to-do list:</b></p>
            <ul>
                <li>Publish to GitHub Pages</li>
                <li>Data write up</li>
                <li>Create Basic Structure for Web App, Html, CSS, JS folders and files</li>
            </ul>
            <p><b>Overview of the development process:</b></p>
            <p><b>Alex commentary on the development process:</b> When we first met as a group, our first order of business was to figure out which dataset we were going to use. From the 3 different datasets we used, we decided to focus our efforts on the field of Unemployment in America. Unfortunately, the dataset one of our group members originally used was flawed. This required us to go find another dataset that we could visualize with relative ease. The dataset we landed on was still in the realm of Unemployment, but it was more specific (Unemployment across degrees for the past 20 years). From there, we decided on the question we wanted to ask about our data and listed some of the features that would be necessary to answer said question. From the list of 4 features, we ranked them in terms of importance and separated the top and bottom half into two groups (Must have and Nice to have) We assigned ourselves to our desired tasks and set out to work. For me specifically, I chose to work on a slider that would allow us to filter the data based on year. While I was able to get a basic slider in at first, I became stuck when I tried to incorporate our own data into the slider. This was a result of the date data in our data set being in an unusual format, and not wanting to separate month from year. I worked with Akoly and Rayna on how we could potentially solve this issue. While we were trying out different ideas to make the slider work, Akoly found that just using a regular slider seemed to work better and take in our values easier than a React Slider.</p>
            <p><b>Akoly commentary on the development process:</b> we ensured that everyone was working on their own feature branch and enforced pull requests to ensure main code quality which is nice because all features in the main branch works and nothing is broken. From layouting the groundwork for the project, I found that there was an issue with the way our data was formatted specifically with the month and year data, so I had to parse through that using the d3 time parse function. From a lot of googling and with the help of Kevin, it probably took me around 2 hours to parse and  display the data on the x  and y axis. Beyond this, I also helped with deploying the app and creating the extra slider feature with two other group members. Working together on the same feature proved to be a little bit difficult in that we had a lot of merging conflicts and trying to resolve that took almost as long as developing the feature itself. </p>
        </div>


    );

};


export default App;