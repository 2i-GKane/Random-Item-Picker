import { useState, useEffect } from "react";
import React from "react";

import "./styling.css"

import FormBody from "./components/FormBody";
import { ResultBox, updateResultBox } from "./components/ResultBox";
import { CandidateInput, getValidItems, setCandidates } from "./components/CandidateInput";

const displayButton = (shouldDisplay) => {
  const button = document.getElementById("btn-draw");

  if(!shouldDisplay){
    button.style.display = "none";
  } else{
    button.style.display = "block";
  }
}

const displaySingleRemoveBtn = (shouldDisplay) => {
  const button = document.getElementById("btn-single-remove");

  if(!shouldDisplay){
    button.style.display = "none"
  } else {
    button.style.display = "block"
  }
}

const displayLoader = (shouldDisplay) => {
  const loader1 = document.getElementById("loader-1");
  const loader2 = document.getElementById("loader-2");
  const loader3 = document.getElementById("loader-3");
  const loader4 = document.getElementById("loader-4");

  if(!shouldDisplay){
    loader1.style.display = "none";
    loader2.style.display = "none";
    loader3.style.display = "none";
    loader4.style.display = "none";

  } else{
    loader1.style.display = "block";
    loader2.style.display = "block";
    loader3.style.display = "block";
    loader4.style.display = "block";

  }
}

function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

String.prototype.replaceAt = function(index, replacement) {
  if (index >= this.length) {
      return this.valueOf();
  }

  var chars = this.split('');
  chars[index] = replacement;
  return chars.join('');
}

function App() {
  const [drawing, setDrawing] = useState(false);
  const [autoRemoving, setAutoRemoving] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");

  useEffect(() => {
    updateResultBox("N/A");

    displaySingleRemoveBtn(false);
  }, [])

  const chooseRandom = (items) => {
    let chosen = "N/A";

    if(items.length >= 1){
      chosen = items[Math.floor(Math.random()*items.length)];
    }

    return chosen;
  }

  async function runAnimation(item, nextCharDelay, displayDelay) {
    let validChars = String.fromCharCode(...Array(123).keys()).slice(97);
    validChars += validChars.toUpperCase();
    validChars += "123456789_ '";

    let currentReveal = "";
    let currentSearchCharIndex = 0;

    for(var i = 0; i < item.length; i++){
      let currentItemChar = item.charAt(currentSearchCharIndex);

      await delay(nextCharDelay);
      for (var j = 0; j < validChars.length; j++) {

        await delay(displayDelay);
        let currentSearchChar = validChars.charAt(j);
        
        if(currentReveal.length < currentSearchCharIndex + 1) currentReveal += currentSearchChar;
        else currentReveal = currentReveal.replaceAt(currentSearchCharIndex, currentSearchChar);
        updateResultBox(currentReveal);
        
        if(currentItemChar === currentSearchChar){
          currentReveal += currentSearchChar;
          currentSearchCharIndex++;
          break;
        } else {
          currentReveal = currentReveal.replaceAt(currentSearchCharIndex, currentSearchChar);
        }

      }
    }

  }
  
  const drawItem = () => {
    if(!drawing){
      let items = getValidItems();
      if(items.length >= 1){
        displayButton(false)
        displaySingleRemoveBtn(false);
      displayLoader(true)
      setDrawing((isDrawing) => !isDrawing);

      console.log("Now drawing!");

      let chosen = chooseRandom(items);
      let revTxt = chosen;

      let nextCharDelay = 60;
      let displayDelay = 15;

      let containsRick = false;
      if(revTxt.toLowerCase().includes("rick")){
          nextCharDelay = 30;
          displayDelay = 7;

          revTxt = "Never gon' give you up";
          containsRick = true;
      }
      
      runAnimation(revTxt, nextCharDelay, displayDelay).then(async () => {
        displayLoader(false);
        displayButton(true);

        if(containsRick) await delay(250);
        else await delay(50);

        updateResultBox(chosen);
        setSelectedItem(chosen);
        setDrawing((isDrawing) => !isDrawing);

        if(autoRemoving){
          const itemIndex = items.indexOf(chosen);

          items.splice(itemIndex, 1);
          setCandidates(items);
        } else displaySingleRemoveBtn(true);
       })
      } else {
        alert("You must provide some items into the input box!")
        updateResultBox("N/A");
      }
      
    }
    
  }

  const toggleAutoRemove = () => {
    const btn = document.getElementById("btn-autoremove");
    let btnText = "";

    if(!autoRemoving){
      btnText = "Enabled"
    } else {
      btnText = "Disabled"
    }

    btn.innerText = btnText;
    setAutoRemoving((currentAutoRemoving) => !currentAutoRemoving);
  }

  const removeItem = (item) => {
    let items = getValidItems();
    const itemIndex = items.indexOf(item);

    if(itemIndex !== -1){
      items.splice(itemIndex, 1);
      setCandidates(items);
    }
    
  }

  return (
    <div className="container">
        <div className="form-body">
            <FormBody />
            <ResultBox button={<button onClick={() => drawItem()} id="btn-draw">Draw</button>} 
            singleRemoveBtn={<button onClick={() => {removeItem(selectedItem); displaySingleRemoveBtn(false)}} id="btn-single-remove">Remove</button>}/>
            <CandidateInput button={<button onClick={() => toggleAutoRemove()} id="btn-autoremove">Disabled</button>}/>
        </div>
    </div>
  );
}

export default App;
