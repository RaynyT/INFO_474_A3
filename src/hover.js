import React from 'react';
import { extent } from 'd3-array';
import { scaleLinear, scaleTime } from 'd3-scale';
import { Axis, Orient } from 'd3-axis-for-react';
import { useFetch } from './hooks/useFetch';

export default function Tooltip() {
    // copy the link to see data in browser!
    const [data, loading] = useFetch(
        "https://raw.githubusercontent.com/RaynyT/INFO_474_A3/main/data/Data.csv"
    );
    // the dimensions of our svg
    const width = 600;
    const height = 600;
    const margin = 50;

    const timeParse = d3.timeParse(`%b-%y`);

    let formatData = data.map(function (d) { //parse values to int so that d3 can process them
        d.Month = timeParse(d.Month);
        d.K12LESS = +d.K12LESS;
        d.HIGHSCHOOL = +d.HIGHSCHOOL;
        d.ASSOCIATE = +d.ASSOCIATE;
        d.BACHELOR = +d.BACHELOR;

        return d;
    });
    
    // if loading, just return some text
    if (loading) {
        return <h2>Loading ...</h2>
    // only work with all data if data is loaded
    } else {
        // We'll make a scatter plot of uneployment rate (y)
        // vs year (x)

        // first, we need scales
        // define x scale
        const yearExtent = extent(formatData, d => +d.Month);
        const xScale = scaleTime()
            .domain(yearExtent)
            .range([margin, width - margin]);
        //     = scaleTime() //  x-axis for MONTH - YEAR
        // .domain([d3.min(formatData, d => d.Month), d3.max(formatData, d => d.Month)]).nice()
        // .range([0, width])
        
        // define y scale
        const yScale = scaleLinear() // y axis for percent
            .domain([0, 25])
            .range([height, 0]);

        // now, we need to create the circles for HIGHSCHOOL
        const circles = formatData.map((d) => {
            // arbitrary radius for our circles
            const radius = 3;
            const x = xScale(+d.Month);
            const y = yScale(+d.HIGHSCHOOL);
            // cx and cy define the CENTER of the circle
            return <circle cx={x} cy={y} r={radius} />
        });

        return (
            <div style={{
                marginLeft: "auto",
                marginRight: "auto"
            }}> 
        
                {/* add styling to center svg */}
                <svg style={{
                    display: "block",
                    margin: "auto"
                }} width={width} height={height}>
                    {/* define title and axes labels here */}
                    <text className="title" style={{
                        textAnchor: "middle"
                    }} x={width/2} y={margin - 20}>Unemployment rate per year</text>
                    <text style={{
                        textAnchor: "middle"
                    }} className="x-label" x={width/2} y={height - margin + 35}>
                        Year
                    </text>
                    {/* easiest way to rotate text and position it correctly is to ue both translate to position x,y and 
                    rotate to make the text vertical */}
                    <text className="y-label" 
                        transform={`translate(${margin - 30}, ${height/2})rotate(-90)`} >
                        Unemployment Rate (percent)
                    </text>

                    {/* render our circles here */}
                    {circles}

                    {/* define our axes here. First, we need to position them with <g> elements */}
                    <g transform={`translate(${margin}, 0)`} className="axisLeft">
                        {/* define our axis here */}
                        <Axis
                            orient={Orient.left}
                            scale={yScale}
                        />
                    </g>
                    <g transform={`translate(0, ${height - margin})`} className="axisBottom">
                        <Axis
                            orient={Orient.bottom}
                            scale={xScale}
                        />
                    </g>
                </svg>
            </div>
        )
    }

}