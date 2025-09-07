// ==UserScript==
// @name         Test Script
// @namespace    https://github.com/Artur-2k/TW-Scripts
// @version      v1.0
// @description  Learning scripting
// @author       Mini
// @match        https://pt109.tribalwars.com.pt/game.php?village=*&screen=am_farm
// @icon         https://cdn.iconscout.com/icon/premium/png-256-thumb/farming-icon-svg-png-download-1641339.png
// @grant        none
// ==/UserScript==

function sleep(ms) {
    return new Promise (resolve => setTimeout(resolve, ms));
}

async function farmA() {
    console.log("Farming...");

// test to see if its working
    const farmsA = document.querySelectorAll("#plunder_list > tbody > tr[id^=village_] > td:nth-child(9) > a");

    for (let farm of farmsA) {

        console.log("Current farm:", farm);

        if (farm.classList.contains("farm_icon_disabled")) {
            break;
        }
        
        let min = 500; // Minimum interval in milliseconds
        let max = 2000; // Maximum interval in milliseconds
        let interval = Math.floor(Math.random() * (max - min + 1)) + min;

        console.log(`Waiting for ${interval} ms before next action...`);
        await sleep(interval);

        console.log("Clicking farm:", farm);
        farm.click();
    }
}

(async function() {
    'use strict';

    const testBtn = document.createElement('button');
    testBtn.innerHTML = "FARMAR";

    document.querySelector("#content_value > h3").insertAdjacentElement("afterend", testBtn);

    testBtn.addEventListener("click", farmA);
})();