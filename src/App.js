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
            <p><b>Jisu commentary on the development process:</b> When our group decided to create a data visualization for A3, we referred to Rayna’s dataset which is the unemployment data by degree level. And, we wanted to connect the data with the Covid-19 period, for example, how Covid-19 impacts the unemployment rate. For the data visualization with this topic, we came up with an idea for the functionalities such as checkbox, line chart, hover, zoom, and slider. Because the data’s values are changing depending on the time and there are four different degree levels. Therefore, we decided to create the line chart as a base of data visualization. And, checkbox, hover, and zoom are similar together, so we have unified our views with checkbox functionality to see the specific degree level of the unemployment rate. Also, to check the unemployment rate at pandemic, we discussed creating the slider.  To create the lines with four different degree levels, it took 3-4 hours to filter the data. However, after Akoly created the x-axis and y-axis, It was much easier to render the line on the webpage. I think I spent less than 2 hours creating the lines. Also, I edited the y-axis to match our dataset. After creating the lines, I tried to implement a checkbox, so in order to find the way to create the checkbox, I spent over 2 hours researching and testing the code with ours. However,  I was not able to connect lines with the checkbox. So, I asked Kayla for help to connect the checkbox with lines.</p>
        </div>
    );
};

export default App;