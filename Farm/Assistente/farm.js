    // ==UserScript==
    // @name         Test Script
    // @namespace    https://gub.com/Artur-2k/TW-Scripts
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
        static #instance;

        constructor() {
            // Singleton enforcing
            if (FarmScript.#instance) {
                throw new Error("Instance already exists. Use FarmScript.instance to access it.");
            }

            // Default configuration values
            this.loadPreferences();

            // Load Script Interface
            this.loadInterface();

            document.getElementById('saveConfigBtn').addEventListener('click', this.savePreferences);
            
        }

        get instance() {
            if (FarmScript.#instance === null) {
                FarmScript.#instance = new FarmScript();
            }
            return FarmScript.#instance;
        }

        // Load preferences from localStorage
        loadPreferences() {
            this.refreshInterval = localStorage.getItem('refreshInterval') || 60;
            this.minSendTime = localStorage.getItem('minSendTime') || 500;
            this.maxSendTime = localStorage.getItem('maxSendTime') || 2000;
            this.maxDistance = localStorage.getItem('maxDistance') || 0;
            this.maxWall = localStorage.getItem('maxWall') || 0;
            this.modelA = localStorage.getItem('modelA') || true;
            this.modelB = localStorage.getItem('modelB') || true;
            this.yellowReportsOption = localStorage.getItem('yellowReportsOption') || false;
            this.blueReportsOption = localStorage.getItem('blueReportsOption') || false;

            console.debug("Preferences loaded");
        }

        savePreferences() {
            // Get values from input fields
            this.refreshInterval = document.getElementById('refreshInterval').value;
            this.minSendTime = document.getElementById('minInterval').value;    
            this.maxSendTime = document.getElementById('maxInterval').value;
            this.maxDistance = document.getElementById('maxDistance').value;
            this.maxWall = document.getElementById('maxWall').value;
            this.modelA = document.getElementById('modelA').checked;
            this.modelB = document.getElementById('modelB').checked;
            this.yellowReportsOption = document.getElementById('yellowReportsOption').checked;
            this.blueReportsOption = document.getElementById('blueReportsOption').checked;

            // Save to localStorage
            localStorage.setItem('refreshInterval', this.refreshInterval);
            localStorage.setItem('minSendTime', this.minSendTime);
            localStorage.setItem('maxSendTime', this.maxSendTime);
            localStorage.setItem('maxDistance', this.maxDistance);
            localStorage.setItem('maxWall', this.maxWall);
            localStorage.setItem('modelA', this.modelA);
            localStorage.setItem('modelB', this.modelB);
            localStorage.setItem('yellowReportsOption', this.yellowReportsOption);
            localStorage.setItem('blueReportsOption', this.blueReportsOption);

            alert("Configurations saved!");

            console.debug("Preferences saved");
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
                            <input id="yellowReportsOption" type="checkbox" ${this.yellowReportsOption ? 'checked' : ''} style="transform: scale(1.2);">
                        </td>
                        <td style="padding: 5px; background: #fff5d6; border: 1px solid #804000; text-align: center;">
                            <input id="blueReportsOption" type="checkbox" ${this.blueReportsOption ? 'checked' : ''} style="transform: scale(1.2);">
                        </td>
                    </tr>
                </table>

                <!-- Save Button -->
                <div style="text-align: center; margin: 15px 0;">
                    <button id="saveConfigBtn" class="btn" style="width: 150px; font-weight: bold; text-align: center; padding: 7px 0;">
                        Save Configuration
                    </button>

                    <button id="runScriptBtn" class="btn" style="width: 150px; font-weight: bold; text-align: center; padding: 7px 0;">
                        Run Script
                    </button>
                </div>
            `; 
            document.querySelector("#content_value > h3").insertAdjacentElement('afterend', configContainer);

            console.debug("Script loaded");
        }

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

    (function() {
        'use strict';

        const farmScript = new FarmScript();

    })();