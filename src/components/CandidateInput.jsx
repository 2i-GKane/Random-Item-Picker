import React from "react";

const getValidItems = () => {
    const inputElement = document.getElementById("item-input");
    const stringValue = inputElement.innerText;

    let items = stringValue.split("\n");
    let regex = new RegExp("^[a-zA-Z0-9_ ]*$")

    let validItems = [];

    for(var i = 0; i < items.length; i++){
        let currentItem = items[i];

        let valid = regex.test(currentItem);
        console.log(valid);

        if(valid && currentItem !== "") validItems.push(currentItem);
    }

    return validItems;
}

const CandidateInput = () => {
    return (
        <div className="candidate-input">
            <h4>Item Input</h4>
            <div className="candidate-input--restrictor">
                <div className="candidate-input--restrictedfield" id="item-input" role="textbox" contentEditable={true} suppressContentEditableWarning={true}>Item 1<br/>Item 2<br/>Item 3<br/>Item 4<br/>Item 5<br/>Item 6<br/></div>
            </div>
        </div>
    )
}

export { CandidateInput, getValidItems };