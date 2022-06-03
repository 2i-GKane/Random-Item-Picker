import "../loader.css";
import React from "react"

function updateResultBox(value){
    document.getElementById("result-box").value = "Result: " + value;
}

const ResultBox = (props) => {

    return(
        <div className="result-box">
            <input disabled size="50" id="result-box"/>
            
            <div id="parent-loader" className="lds-ellipsis"><div id="loader-1" hidden={true}></div><div id="loader-2" hidden={true}></div><div id="loader-3" hidden={true}></div><div id="loader-4" hidden={true}></div></div>
            {props.button}
            
            
        </div>
    )
}

export {ResultBox, updateResultBox};