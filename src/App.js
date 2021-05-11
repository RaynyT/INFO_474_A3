import React, {useState} from "react";
import { useFetch } from "./hooks/useFetch";



const App = () => {
    let [data, loading] = useFetch(
        "https://raw.githubusercontent.com/RaynyT/INFO_474_A3/main/data/Data.csv"
    );

    data = data.map(function (d) { //parse values to int so that d3 can process them
        d.MONTH = +d.MONTH;
        d.K12LESS = +d.K12LESS;
        d.HIGHSCHOOL = +d.HIGHSCHOOL;
        d.ASSOCIATE = +d.ASSOCIATE;
        d.BACHELOR = +d.BACHELOR;

        return d;
    });

    console.log(data);

    // defining constants 
    const chartSize = 500;
    const margin = 20;

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
            <svg width={chartSize + 500} height={chartSize} style={{border : "1px solid black"}}> 


            </svg>


        </div>


    );

};

export default App;