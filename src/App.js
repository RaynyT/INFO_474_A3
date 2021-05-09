import React, {useState} from "react";
import { useFetch } from "./hooks/useFetch";



const App = () => {
    const [data, loading] = useFetch(
        "https://raw.githubusercontent.com/RaynyT/INFO_474_A3/main/data/Data.csv"
    );
    
    console.log(data)
    return(
        <h1>hello world!</h1>
    );

};

export default App;