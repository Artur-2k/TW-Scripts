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

    /**
     * Pauses execution for a specified number of milliseconds.
     *
     * @param {number} ms - The duration to sleep in milliseconds.
     * @returns {Promise<void>} A promise that resolves after the specified time.
     *
     * @example
     * await sleep(1000); // Pauses for 1 second
     */
    function sleep(ms) {
        return new Promise (resolve => setTimeout(resolve, ms));
    }

    class FarmScript {
        static #instance = null;
        #unitsPresent = null;
        #isRunning = false;

        constructor() {
            // Singleton enforcing
            if (FarmScript.#instance) {
                throw new Error("Instance already exists. Use FarmScript.instance to access it.");
            }

            // Units on village
            this.#unitsPresent = this.getUnitsPresent();

            this.savePreferences = this.savePreferences.bind(this); // needed to bind 'this' context in event listener
            this.toggleStartStop = this.toggleStartStop.bind(this);

            // Load default configuration values
            this.loadPreferences();

            // Load Script Interface
            this.loadInterface();

            // Attach event listener to save button
            document.getElementById('saveConfigBtn').addEventListener('click', this.savePreferences);

            // Attach event listener to run script button 
            // this swaps run button to stop button and vice versa
            document.getElementById('runScriptBtn').addEventListener('click', this.toggleStartStop);

            // Start farming if it was running before page reload
            if (this.#isRunning) {
                this.startFarming();
            }
        }

        static get instance() {
            if (FarmScript.#instance === null) {
                FarmScript.#instance = new FarmScript();
            }
            return FarmScript.#instance;
        }

        // Load preferences from localStorage if they exist, otherwise use defaults
        loadPreferences() {
            this.refreshInterval = parseInt(localStorage.getItem('refreshInterval'), 10) || 60;
            this.minSendTime = parseInt(localStorage.getItem('minSendTime'), 10) || 500;
            this.maxSendTime = parseInt(localStorage.getItem('maxSendTime'), 10) || 2000;
            this.maxDistance = parseInt(localStorage.getItem('maxDistance'), 10) || 999;
            this.maxWall = parseInt(localStorage.getItem('maxWall'), 10) || 0;
            this.modelA = localStorage.getItem('modelA') === "true";
            this.modelB = localStorage.getItem('modelB') === "true";
            this.allowYellowReports = localStorage.getItem('allowYellowReports') === "true";
            this.allowBlueReports = localStorage.getItem('allowBlueReports') === "true";

            this.#isRunning = localStorage.getItem('farmScriptRunning') === "true";
        }

        // Save preferences to localStorage and update variables
        savePreferences() {
            // Get values from input fields
            this.minSendTime = parseInt(document.getElementById('minInterval').value, 10) || 500;
            this.maxSendTime = parseInt(document.getElementById('maxInterval').value, 10) || 2000;

            if (this.minSendTime >= this.maxSendTime) {
                alert("Min send interval must be less than max send interval.");
                return;
            }

            this.refreshInterval = parseInt(document.getElementById('refreshInterval').value, 10) || 60;

            if (this.refreshInterval < 5) {
                alert("Refresh interval must be at least 5 seconds.");
                return;
            }

            this.maxDistance = parseInt(document.getElementById('maxDistance').value, 10) || 999;
            this.maxWall = parseInt(document.getElementById('maxWall').value, 10) || 0;
            this.modelA = document.getElementById('modelA').checked;
            this.modelB = document.getElementById('modelB').checked;
            this.allowYellowReports = document.getElementById('allowYellowReports').checked;
            this.allowBlueReports = document.getElementById('allowBlueReports').checked;

            // Save to localStorage
            localStorage.setItem('refreshInterval', this.refreshInterval);
            localStorage.setItem('minSendTime', this.minSendTime);
            localStorage.setItem('maxSendTime', this.maxSendTime);
            localStorage.setItem('maxDistance', this.maxDistance);
            localStorage.setItem('maxWall', this.maxWall);
            localStorage.setItem('modelA', this.modelA);
            localStorage.setItem('modelB', this.modelB);
            localStorage.setItem('allowYellowReports', this.allowYellowReports);
            localStorage.setItem('allowBlueReports', this.allowBlueReports);

            alert("Configurations saved!");
        }


        // this injects the script interface into the page below the page title
        loadInterface() {
            const configContainer = document.createElement('div');
            configContainer.id = 'scriptConfigContainer';
            configContainer.classList = "vis"; // tribalwars class for styling xd
            configContainer.innerHTML = `
                <h4 style="padding: 5px 15px">Configurações</h4> 

                <!-- Time Configuration Table -->
                <table style="width: 100%; border-collapse: colapse; padding: 15px">
                    <tr>
                        <th style="padding: 5px; #f4e4bc; border: 1px solid #804000; font-weight: bold; padding: 5px 20px; text-align: center;">
                            Page refresh interval:
                        </th>
                        <th style="padding: 5px; border: 1px solid #804000; font-weight: bold; padding: 5px 20px; text-align: center;">
                            Min send interval:
                        </th>
                        <th style="padding: 5px; border: 1px solid #804000; font-weight: bold; padding: 5px 20px; text-align: center;">
                            Max send interval:
                        </th>
                    </tr>
                    <tr>
                        <td style="padding: 5px; background: #fff5d6; border: 1px solid #804000; text-align: center;">
                            <input id="refreshInterval" type="text" value="${this.refreshInterval}" 
                                style="width: 60px; background: #fff; text-align: center;" 
                                pattern="[0-9]*" title="Only numbers allowed">
                            <span style="font-size: 11px; color: #666;">(s)</span>
                        </td>
                        <td style="padding: 5px; background: #fff5d6; border: 1px solid #804000; text-align: center;">
                            <input id="minInterval" type="text" value="${this.minSendTime}" 
                                style="width: 60px; background: #fff; text-align: center;" 
                                pattern="[0-9]*" title="Only numbers allowed">
                            <span style="font-size: 11px; color: #666;">(ms)</span>
                        </td>
                        <td style="padding: 5px; background: #fff5d6; border: 1px solid #804000; text-align: center;">
                            <input id="maxInterval" type="text" value="${this.maxSendTime}" 
                                style="width: 60px; background: #fff; text-align: center;" 
                                pattern="[0-9]*" title="Only numbers allowed">
                            <span style="font-size: 11px; color: #666;">(ms)</span>
                        </td>
                    </tr>
                </table>

                <!-- Main Configuration Table -->
                <table style="width: 100%; padding: 15px;">
                    <tr>
                        <th style="padding: 5px; border: 1px solid #804000; font-weight: bold; text-align: center; width: 15%;">
                            <div style="margin-bottom: 5px;">📍</div>
                            Max Distance
                        </th>
                        <th style="padding: 5px; border: 1px solid #804000; font-weight: bold; text-align: center; width: 15%;">
                            <div style="margin-bottom: 5px;">🏰</div>
                            Max Wall
                        </th>
                        <th style="padding: 5px; border: 1px solid #804000; font-weight: bold; text-align: center; width: 15%;">
                            <div style="margin-bottom: 5px;">⚔️</div>
                            Model A
                        </th>
                        <th style="padding: 5px; border: 1px solid #804000; font-weight: bold; text-align: center; width: 15%;">
                            <div style="margin-bottom: 5px;">⚔️</div>
                            Model B
                        </th>
                        <th style="padding: 5px; border: 1px solid #060606ff; font-weight: bold; text-align: center; width: 15%;">
                            <div style="margin-bottom: 5px;">🟡</div>
                            Yellow Report
                        </th>
                        <th style="padding: 5px; border: 1px solid #804000; font-weight: bold; text-align: center; width: 15%;">
                            <div style="margin-bottom: 5px;">🔵</div>
                            Blue Report
                        </th>
                    </tr>
                    <tr>
                        <td style="padding: 5px; background: #fff5d6; border: 1px solid #804000; text-align: center;">
                            <input id="maxDistance" type="text" value="${this.maxDistance}" 
                                style="width: 50px; background: #fff; text-align: center;" 
                                pattern="[0-9]*" title="Only numbers allowed">
                            <span style="font-size: 11px; color: #666; margin-top: 2px;">(squares)</span>
                        </td>
                        <td style="padding: 5px; background: #fff5d6; border: 1px solid #804000; text-align: center;">
                            <input id="maxWall" type="text" value="${this.maxWall}" 
                                style="width: 50px; background: #fff; text-align: center;" 
                                pattern="[0-9]*" title="Only numbers allowed" min="0" max="20">
                            <span style="font-size: 11px; color: #666; margin-top: 2px;">(level)</span>
                        </td>
                        <td style="padding: 5px; background: #fff5d6; border: 1px solid #804000; text-align: center;">
                            <input id="modelA" type="checkbox" ${this.modelA ? 'checked' : ''} style="transform: scale(1.2);">
                        </td>
                        <td style="padding: 5px; background: #fff5d6; border: 1px solid #804000; text-align: center;">
                            <input id="modelB" type="checkbox" ${this.modelB ? 'checked' : ''} style="transform: scale(1.2);">
                        </td>
                        <td style="padding: 5px; background: #fff5d6; border: 1px solid #804000; text-align: center;">
                            <input id="allowYellowReports" type="checkbox" ${this.allowYellowReports ? 'checked' : ''} style="transform: scale(1.2);">
                        </td>
                        <td style="padding: 5px; background: #fff5d6; border: 1px solid #804000; text-align: center;">
                            <input id="allowBlueReports" type="checkbox" ${this.allowBlueReports ? 'checked' : ''} style="transform: scale(1.2);">
                        </td>
                    </tr>
                </table>

                <!-- Buttons container-->
                <div style="text-align: center; margin: 15px 0;">
                    <!-- Save Button -->
                    <button id="saveConfigBtn" class="btn" style="width: 150px; font-weight: bold; text-align: center; padding: 7px 0;">
                        Save Configuration
                    </button>

                    <button id="runScriptBtn" class="btn" style="width: 150px; font-weight: bold; text-align: center; padding: 7px 0;">
                       ${this.#isRunning ? "Stop Script" : "Run Script"}
                    </button>
                </div>
            `; 
            document.querySelector("#content_value > h3").insertAdjacentElement('afterend', configContainer);
        }

        // Retrieves the number of each type of unit currently present in the village
        // Returns an object with unit types as keys and their counts as values
        getUnitsPresent() {
            const units = {
                spear: parseInt(document.getElementById('spear').textContent, 10),
                sword: parseInt(document.getElementById('sword').textContent, 10),
                axe: parseInt(document.getElementById('axe').textContent, 10),   
                archer: parseInt(document.getElementById('archer').textContent, 10),
                spy: parseInt(document.getElementById('spy').textContent, 10),
                light: parseInt(document.getElementById('light').textContent, 10),
                marcher: parseInt(document.getElementById('marcher').textContent, 10),
                heavy: parseInt(document.getElementById('heavy').textContent, 10),
                knight: parseInt(document.getElementById('knight').textContent, 10)
            };
            return units;
        }

        // parameters: row - the table row element corresponding to the farm entry
        // returns the wall level of the target village as an integer
        // if wall level is unknown assumes 0
        getWallLevel(row) {
            const wallLevel = parseInt(row.querySelector("td:nth-child(7)").textContent, 10);
            return Number.isNaN(wallLevel) ? 0 : wallLevel;
        }

        // parameters: row - the table row element corresponding to the farm entry
        // returns the distance to the target village as a string with one decimal place
        // always returns a number, if distance is unknown returns Infinity
        getDistance(row) {
            const distance = parseFloat(row.querySelector("td:nth-child(8)").textContent);
            return Number.isNaN(distance) ? Infinity : parseFloat(distance.toFixed(1));
        }

        // parameters: row - the table row element corresponding to the farm entry
        // returns the report color of the target village as a string
        // possible return values: "green", "yellow", "blue", "red_yellow", "red_blue", "red", or undefined
        // if no color (error fetching color)
        getReportColor(row) {
            const reportColor = row.querySelector("td:nth-child(2) > img").getAttribute("data-title");
            // This checks for the data-title, maybe check other servers for different ways
            switch (reportColor) {
                case "Vitoria total":
                    return "green";
                case "Baixas":
                    return "yellow";
                case "Espiado":
                    return "blue";
                case "Perdeu, mas danificou edifício(s)":
                    return "red_yellow";
                case "Perdeu, mas obteve informações":
                    return "red_blue";
                case "Derrotou":
                    return "red";
                default:
                    break;
            }
            return undefined;
        }

        getModelUnits(model) {
            let units;
            if (model === 'A') {
                units = document.querySelector("#content_value > div:nth-child(4) > div > form > table > tbody > tr:nth-child(2)")
            } else if (model === 'B') {
                units = document.querySelector("#content_value > div:nth-child(4) > div > form > table > tbody > tr:nth-child(4)")
            } else {
                throw new Error("Invalid model type. Use 'A' or 'B'.");
            }
            return {
                    spear: parseInt(units.querySelector("td:nth-child(3) > input").value, 10),
                    sword: parseInt(units.querySelector("td:nth-child(4) > input").value, 10),
                    axe: parseInt(units.querySelector("td:nth-child(5) > input").value, 10),
                    archer: parseInt(units.querySelector("td:nth-child(6) > input").value, 10),
                    spy: parseInt(units.querySelector("td:nth-child(7) > input").value, 10),
                    light: parseInt(units.querySelector("td:nth-child(8) > input").value, 10),
                    marcher: parseInt(units.querySelector("td:nth-child(9) > input").value, 10),
                    heavy: parseInt(units.querySelector("td:nth-child(10) > input").value, 10),
                    knight: parseInt(units.querySelector("td:nth-child(11) > input").value, 10)
                }
        }

        async startFarming() {
            // Select all farm rows in the farm list table
            // id^=village_ selects rows with ids starting with 'village_' (ie. farm entries)
            // td:nth-child(9) > a selects the anchor tag that corresponds to the farm action a 
            // td:nth-child(10) > a selects the anchor tag that corresponds to the farm action b

            // on a while cuz of page entry size and dynamic loading of rows 
            while (this.#isRunning) {
                let attackSent = false;

                let farms = Array.from(document.querySelectorAll("#plunder_list > tbody > tr[id^=village_]")).filter(row => row.style.display !== "none");
                if (farms.length === 0) {break;} // Exit if no farms available
                for (let farm of farms) {
                    if (this.getWallLevel(farm) > this.maxWall) {
                        continue; // Skip if wall level exceeds maxWall
                    }

                    if (this.getDistance(farm) > this.maxDistance) {
                        continue; // Skip if distance exceeds maxDistance
                    }

                    const reportColor = this.getReportColor(farm);
                    if ((reportColor !== "green") && 
                    ((reportColor === "yellow" && !this.allowYellowReports) || 
                    (reportColor === "blue" && !this.allowBlueReports))) {
                        continue; // Skip if report color is not allowed ( only green, yellow and blues )
                    }

                    if (this.#isRunning === false) break; // Redundancy check

                    if (this.modelA) {
                        attackSent = await this.farmModel(farm, 'A');
                    }
                    if (!attackSent && this.modelB) {
                        attackSent = await this.farmModel(farm, 'B');
                    }
                    if (!attackSent) {
                        break; // Exit loop if no attack was sent (either out of units or both models disabled)
                    }
                }
                if (!attackSent) break;
            }
        }

        // td:nth-child(9) > a selects the anchor tag that corresponds to the farm action a
        // td:nth-child(10) > a selects the anchor tag that corresponds to the farm action b
        // clicks the farm action a button for the given farm row
        // this function assumes that the farm meets all criteria to be attacked and only checks if
        // there are enough units to send the attack
        async farmModel(farm, model) {
            const modelUnits = this.getModelUnits(model);
            
            for (let unit in modelUnits) {
                if (modelUnits[unit] > this.#unitsPresent[unit]) {
                    return false; // Not enough units
                }
            }

            // Random delay between minSendTime and maxSendTime
            let interval = Math.floor(Math.random() * (this.maxSendTime - this.minSendTime + 1)) + this.minSendTime;
            await sleep(interval);

            farm.querySelector(`td:nth-child(${model === 'A' ? 9 : 10}) > a`).click();

            // Update units present after sending the attack
            for (let unit in modelUnits) {
                this.#unitsPresent[unit] -= modelUnits[unit];
            }

            return true; // Attack sent
        }

        toggleStartStop() {
            this.#isRunning = !this.#isRunning;
            localStorage.setItem('farmScriptRunning', this.#isRunning);


            const runBtn = document.getElementById('runScriptBtn');
            if (this.#isRunning) {
                runBtn.textContent = "Stop Script";
                this.startFarming();
            } else {
                runBtn.textContent = "Run Script";
            }
        }   

    }

    (function() {
        'use strict';

        const farmScript = FarmScript.instance;
       
    })();
