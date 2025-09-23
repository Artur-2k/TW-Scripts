// Your code here...
// todo estava a trabalhar nos butoes de start stop sell buy active inactive
// todo falta fazer a logica de comprar e vender
// todo e fazer o script correr automaticamente a cada X segundos para dar scan

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
  return new Promise(resolve => setTimeout(resolve, ms));
}

// injects empty HTML container
function loadHTML() {
  const configRatesContainer = document.createElement('div');
  configRatesContainer.id = 'scriptRatesContainer';
  configRatesContainer.classList = "vis"; // keep tribalwars styling
  configRatesContainer.innerHTML = `
    <h4 style="padding: 5px 15px">Configurations</h4>
    <hr style="margin: 0; border-color: #804000;">

    <!-- Rates + Reserve + Fort + Min PPs Table -->
    <form id="configsPPForm">
      <table style="width: 100%; padding: 15px;">
          <tr>
              <th style="padding: 5px; border: 1px solid #804000; font-weight: bold; text-align: center;">Wood</th>
              <th style="padding: 5px; border: 1px solid #804000; font-weight: bold; text-align: center;">Clay</th>
              <th style="padding: 5px; border: 1px solid #804000; font-weight: bold; text-align: center;">Iron</th>
          </tr>
          <!-- Buy Rate -->
          <tr>
              <td style="padding:5px; background:#fff5d6; border:1px solid #804000; text-align:center;">
                  <input id="buyRateWood" type="text" style="width:70px; background:#fff; text-align:center;" pattern="[0-9]*" required>
                  <div style="font-size:11px; color:#666;">Buy Rate</div>
              </td>
              <td style="padding:5px; background:#fff5d6; border:1px solid #804000; text-align:center;">
                  <input id="buyRateClay" type="text" style="width:70px; background:#fff; text-align:center;" pattern="[0-9]*" required>
                  <div style="font-size:11px; color:#666;">Buy Rate</div>
              </td>
              <td style="padding:5px; background:#fff5d6; border:1px solid #804000; text-align:center;">
                  <input id="buyRateIron" type="text" style="width:70px; background:#fff; text-align:center;" pattern="[0-9]*" required>
                  <div style="font-size:11px; color:#666;">Buy Rate</div>
              </td>
          </tr>
          <!-- Sell Rate -->
          <tr>
              <td style="padding:5px; background:#fff5d6; border:1px solid #804000; text-align:center;">
                  <input id="sellRateWood" type="text" style="width:70px; background:#fff; text-align:center;" pattern="[0-9]*" required>
                  <div style="font-size:11px; color:#666;">Sell Rate</div>
              </td>
              <td style="padding:5px; background:#fff5d6; border:1px solid #804000; text-align:center;">
                  <input id="sellRateClay" type="text" style="width:70px; background:#fff; text-align:center;" pattern="[0-9]*" required>
                  <div style="font-size:11px; color:#666;">Sell Rate</div>
              </td>
              <td style="padding:5px; background:#fff5d6; border:1px solid #804000; text-align:center;">
                  <input id="sellRateIron" type="text" style="width:70px; background:#fff; text-align:center;" pattern="[0-9]*" required>
                  <div style="font-size:11px; color:#666;">Sell Rate</div>
              </td>
          </tr>
          <!-- Reserve -->
          <tr>
              <td style="padding:5px; background:#fff5d6; border:1px solid #804000; text-align:center;">
                  <input id="reserveWood" type="text" style="width:70px; background:#fff; text-align:center;" pattern="[0-9]*" required>
                  <div style="font-size:11px; color:#666;">Reserve Wood</div>
              </td>
              <td style="padding:5px; background:#fff5d6; border:1px solid #804000; text-align:center;">
                  <input id="reserveClay" type="text" style="width:70px; background:#fff; text-align:center;" pattern="[0-9]*" required>
                  <div style="font-size:11px; color:#666;">Reserve Clay</div>
              </td>
              <td style="padding:5px; background:#fff5d6; border:1px solid #804000; text-align:center;">
                  <input id="reserveIron" type="text" style="width:70px; background:#fff; text-align:center;" pattern="[0-9]*" required>
                  <div style="font-size:11px; color:#666;">Reserve Iron</div>
              </td>
          </tr>
          <!-- Max Resources Capacity -->
          <tr>
              <td style="padding:5px; background:#fff5d6; border:1px solid #804000; text-align:center;">
                  <input id="maxAllowedWood" type="text" style="width:70px; background:#fff; text-align:center;" pattern="[0-9]*" required>
                  <div style="font-size:11px; color:#666;">Max Wood Wanted</div>
              </td>
              <td style="padding:5px; background:#fff5d6; border:1px solid #804000; text-align:center;">
                  <input id="maxAllowedClay" type="text" style="width:70px; background:#fff; text-align:center;" pattern="[0-9]*" required>
                  <div style="font-size:11px; color:#666;">Max Clay Wanted</div>
              </td>
              <td style="padding:5px; background:#fff5d6; border:1px solid #804000; text-align:center;">
                  <input id="maxAllowedIron" type="text" style="width:70px; background:#fff; text-align:center;" pattern="[0-9]*" required>
                  <div style="font-size:11px; color:#666;">Max Iron Wanted</div>
              </td>
          </tr>
          <!-- Min PPs (single input across row) -->
          </table>

      <label for="minPP" style="font-weight:bold; margin-left:15px;">Minimum PPs:</label> 
      <input id="minPP" type="text" style="width:100px; padding:5px; padding-bottom:5px; background:#fff; text-align:center; font-size:16px; font-weight:bold;" pattern="[0-9]*" required>
      
      <!-- Buttons container -->
      <div style="text-align: center; margin: 15px 0;">
          <button id="comprarAtivoBtn" class="btn" style="width:150px; font-weight:bold; text-align:center; padding:7px 0;">Buy Activated</button>
          <button id="venderAtivoBtn" class="btn" style="width:150px; font-weight:bold; text-align:center; padding:7px 0;">Sell Activated</button>
          <br><br>
          <button id="saveRatesConfigBtn" type="submit" class="btn" style="width:150px; font-weight:bold; text-align:center; padding:7px 0;">
              Save Configuration
          </button>
          <button id="scriptLigadoBtn" class="btn" style="width:150px; font-weight:bold; text-align:center; padding:7px 0;">Script Activated</button>
      </div>
    </form>
`;

  document.querySelector("#content_value > table:nth-child(3) > tbody > tr > td:nth-child(2) > h3")
    .insertAdjacentElement('afterend', configRatesContainer);

  // load values from configurations and if none is present it will alert user to fill in
  loadConfigs();

  // attach eventListeners
  // form saveConfigs
  document.getElementById("configsPPForm").addEventListener("submit", function(event) {
    event.preventDefault(); // prevent form submission
    saveConfigs();
    alert("Configurations saved!");
  });
  
  // comprar ativo / desativo

  const comprarBtn = document.getElementById("comprarAtivoBtn");
  comprarBtn.addEventListener("click", function(event) {
    event.preventDefault();
    if (comprarBtn.textContent === "Buy Activated") {
      comprarBtn.textContent = "Buy Deactivated";
      comprarBtn.style.background = "#a52b27b6";
    } else {
      comprarBtn.textContent = "Buy Activated";
      comprarBtn.style.background = "linear-gradient(to bottom, #947a62 0%,#7b5c3d 22%,#6c4824 30%,#6c4824 100%)"; // default
    }
    localStorage.setItem("comprarAtivo", comprarBtn.textContent === "Buy Activated");
  });

  // todo vender ativo / desativo
  const venderBtn = document.getElementById("venderAtivoBtn");
  venderBtn.addEventListener("click", function(event) {
    event.preventDefault();
    if (venderBtn.textContent === "Sell Activated") {
      venderBtn.textContent = "Sell Deactivated";
      venderBtn.style.background = "#a52b27b6";
    } else {
      venderBtn.textContent = "Sell Activated";
      venderBtn.style.background = "linear-gradient(to bottom, #947a62 0%,#7b5c3d 22%,#6c4824 30%,#6c4824 100%)"; // default
    }
    localStorage.setItem("venderAtivo", venderBtn.textContent === "Sell Activated");
  });
  // todo run / stop script
  const scriptBtn = document.getElementById("scriptLigadoBtn");
  scriptBtn.addEventListener("click", function(event) {
    event.preventDefault();
    if (scriptBtn.textContent === "Script Activated") {
      scriptBtn.textContent = "Script Deactivated";
      scriptBtn.style.background = "#a52b27b6";
    } else {
      scriptBtn.textContent = "Script Activated";
      scriptBtn.style.background = "linear-gradient(to bottom, #947a62 0%,#7b5c3d 22%,#6c4824 30%,#6c4824 100%)"; // default
    }
    localStorage.setItem("scriptLigado", scriptBtn.textContent === "Script Activated");
  });

}

// fica tudo no localstorage
function loadConfigs() {
  // validation step
  let buyRateWood = parseInt(localStorage.getItem("buyRateWood"));
  let buyRateClay = parseInt(localStorage.getItem("buyRateClay"));
  let buyRateIron = parseInt(localStorage.getItem("buyRateIron"));
  let sellRateWood = parseInt(localStorage.getItem("sellRateWood"));
  let sellRateClay = parseInt(localStorage.getItem("sellRateClay"));
  let sellRateIron = parseInt(localStorage.getItem("sellRateIron"));
  let reserveWood = parseInt(localStorage.getItem("reserveWood"));
  let reserveClay = parseInt(localStorage.getItem("reserveClay"));
  let reserveIron = parseInt(localStorage.getItem("reserveIron"));
  let maxAllowedWood = parseInt(localStorage.getItem("maxAllowedWood"));
  let maxAllowedClay = parseInt(localStorage.getItem("maxAllowedClay"));
  let maxAllowedIron = parseInt(localStorage.getItem("maxAllowedIron"));
  let minPP = parseInt(localStorage.getItem("minPP"));

  if (isNaN(buyRateWood) || isNaN(buyRateClay) || isNaN(buyRateIron) || 
      isNaN(sellRateWood) || isNaN(sellRateClay) || isNaN(sellRateIron) ||
      isNaN(reserveWood) || isNaN(reserveClay) || isNaN(reserveIron) ||
      isNaN(maxAllowedWood) || isNaN(maxAllowedClay) ||
      isNaN(maxAllowedIron) || isNaN(minPP)) {
      alert("Please fill in all configuration fields with valid numbers.");
      return;
  }

  document.getElementById("buyRateWood").value = buyRateWood;
  document.getElementById("buyRateClay").value = buyRateClay;
  document.getElementById("buyRateIron").value = buyRateIron;
  document.getElementById("sellRateWood").value = sellRateWood;
  document.getElementById("sellRateClay").value = sellRateClay;
  document.getElementById("sellRateIron").value = sellRateIron;
  document.getElementById("reserveWood").value = reserveWood;
  document.getElementById("reserveClay").value = reserveClay;
  document.getElementById("reserveIron").value = reserveIron;
  document.getElementById("maxAllowedWood").value = maxAllowedWood;
  document.getElementById("maxAllowedClay").value = maxAllowedClay;
  document.getElementById("maxAllowedIron").value = maxAllowedIron;
  document.getElementById("minPP").value = minPP;

  // load button states
  function changeToInactive(element, textContent) {
    if (textContent === "Buy Activated" || textContent === "Sell Activated" || textContent === "Script Activated") { 
      element.style.background = "linear-gradient(to bottom, #947a62 0%,#7b5c3d 22%,#6c4824 30%,#6c4824 100%)"; // default
      element.textContent = textContent;
      return;
    }
    element.style.background = "#a52b27b6";
    element.textContent = textContent;
  }

  let comprarBtn = document.getElementById("comprarAtivoBtn");
  let venderBtn = document.getElementById("venderAtivoBtn");
  let scriptBtn = document.getElementById("scriptLigadoBtn");

  changeToInactive(comprarBtn, localStorage.getItem("comprarAtivo") === "true" ? "Buy Activated" : "Buy Deactivated");
  changeToInactive(venderBtn, localStorage.getItem("venderAtivo") === "true" ? "Sell Activated" : "Sell Deactivated");
  changeToInactive(scriptBtn, localStorage.getItem("scriptLigado") === "true" ? "Script Activated" : "Script Deactivated");
}

// fica tudo no localstorage
function saveConfigs() {
  // buyRateWood
  localStorage.setItem("buyRateWood", document.getElementById("buyRateWood").value);
  // buyRateClay
  localStorage.setItem("buyRateClay", document.getElementById("buyRateClay").value);
  // buyRateIron
  localStorage.setItem("buyRateIron", document.getElementById("buyRateIron").value);
  // sellRateWood
  localStorage.setItem("sellRateWood", document.getElementById("sellRateWood").value);
  // sellRateClay
  localStorage.setItem("sellRateClay", document.getElementById("sellRateClay").value);
  // sellRateIron
  localStorage.setItem("sellRateIron", document.getElementById("sellRateIron").value);
  // reserveWood
  localStorage.setItem("reserveWood", document.getElementById("reserveWood").value);
  // reserveClay
  localStorage.setItem("reserveClay", document.getElementById("reserveClay").value);
  // reserveIron
  localStorage.setItem("reserveIron", document.getElementById("reserveIron").value);
  // maxAllowedWood
  localStorage.setItem("maxAllowedWood", document.getElementById("maxAllowedWood").value);
  // maxAllowedClay
  localStorage.setItem("maxAllowedClay", document.getElementById("maxAllowedClay").value);
  // maxAllowedIron
  localStorage.setItem("maxAllowedIron", document.getElementById("maxAllowedIron").value);
  // minPP
  localStorage.setItem("minPP", document.getElementById("minPP").value);
  // comprar ativo bool localstorage
  localStorage.setItem("comprarAtivo", document.getElementById("comprarAtivoBtn").textContent === "Buy Activated");
  // vender ativo bool localstorage
  localStorage.setItem("venderAtivo", document.getElementById("venderAtivoBtn").textContent === "Sell Activated");
  // script ligado bool localstorage
  localStorage.setItem("scriptLigado", document.getElementById("scriptLigadoBtn").textContent === "Script Activated");
}


/**
 * 
 * @param { wood: x, clay: y, iron: z } needs - This is the difference between current warehouse (including incoming) and max wanted
 * @param { wood: w, clay: c, iron: i } rates - This is the buy rates for each resource (must include the extra cost 0,5 or so)
 * @param { wood: w, clay: c, iron: i } minRates - This is the minimum acceptable buy rates for each resource ( user choice )
 * @param {number} maxCoins - this is the difference between the current PPs and the minimum PPs to keep
 * @returns {wood: w, clay: c, iron: i} - The optimal amounts of each resource to buy
 */
function getOptimalResources(needs, rates, minRates, maxCoins) {
  // Filter resources based on minimum rate requirements
  const validNeeds = {};
  const validRates = {};

  // Only include resources that meet minimum rate requirements
  if (rates.wood >= minRates.wood) {
    validNeeds.wood = needs.wood;
    validRates.wood = rates.wood;
  } else {
    validNeeds.wood = 0;
    validRates.wood = 1; // Set to 1 to avoid division issues
  }

  if (rates.clay >= minRates.clay) {
    validNeeds.clay = needs.clay;
    validRates.clay = rates.clay;
  } else {
    validNeeds.clay = 0;
    validRates.clay = 1; // Set to 1 to avoid division issues
  }

  if (rates.iron >= minRates.iron) {
    validNeeds.iron = needs.iron;
    validRates.iron = rates.iron;
  } else {
    validNeeds.iron = 0;
    validRates.iron = 1; // Set to 1 to avoid division issues
  }

  // Extract filtered needs and rates
  const { wood: needWood, clay: needClay, iron: needIron } = validNeeds;
  const { wood: rateWood, clay: rateClay, iron: rateIron } = validRates;

  let bestAllocation = null;
  let bestScore = -1;

  // Calculate maximum possible coins for each resource based on needs and budget
  const maxWoodCoins = needWood > 0 ? Math.min(Math.floor(needWood / rateWood), maxCoins) : 0;
  const maxClayCoins = needClay > 0 ? Math.min(Math.floor(needClay / rateClay), maxCoins) : 0;
  const maxIronCoins = needIron > 0 ? Math.min(Math.floor(needIron / rateIron), maxCoins) : 0;

  // Try all combinations of coins
  for (let woodCoins = 0; woodCoins <= maxWoodCoins; woodCoins++) {
    for (let clayCoins = 0; clayCoins <= maxClayCoins; clayCoins++) {
      for (let ironCoins = 0; ironCoins <= maxIronCoins; ironCoins++) {

        // Calculate total coins needed
        const totalCoins = woodCoins + clayCoins + ironCoins;

        // Skip if exceeds budget
        if (totalCoins > maxCoins) continue;

        // Calculate resources from coins
        const woodAmount = woodCoins * rateWood;
        const clayAmount = clayCoins * rateClay;
        const ironAmount = ironCoins * rateIron;

        // Double-check we don't exceed needs
        if (woodAmount > needWood || clayAmount > needClay || ironAmount > needIron) {
          continue;
        }

        // Calculate satisfaction score (how well we meet our needs)
        const woodSatisfaction = needWood > 0 ? woodAmount / needWood : 1;
        const claySatisfaction = needClay > 0 ? clayAmount / needClay : 1;
        const ironSatisfaction = needIron > 0 ? ironAmount / needIron : 1;

        // Total resources obtained
        const totalResources = woodAmount + clayAmount + ironAmount;
        const totalNeeds = needWood + needClay + needIron;

        // Score based on:
        // 1. How much of our total needs we satisfy
        // 2. How balanced the satisfaction is across all resources
        const totalSatisfaction = totalNeeds > 0 ? totalResources / totalNeeds : 1;
        const balanceScore = Math.min(woodSatisfaction, claySatisfaction, ironSatisfaction);

        // Combined score: prioritize total satisfaction but with balance consideration
        let score = totalSatisfaction * 0.7 + balanceScore * 0.3;

        // Bonus for efficient use (getting more resources per coin)
        if (totalCoins > 0) {
          const resourcesPerCoin = totalResources / totalCoins;
          score += resourcesPerCoin * 0.001; // Small bonus for efficiency
        }

        // Update best allocation
        if (score > bestScore) {
          bestScore = score;
          bestAllocation = {
            wood: woodAmount,
            clay: clayAmount,
            iron: ironAmount
          };
        }
      }
    }
  }

  return bestAllocation;
}

// Helper class to get and validate user configurations from localStorage
// has extra validation to ensure numbers are valid and catch erros early 
class Getter {
  // throws error for easy error catching
  static validateNumber(value) {
    if (!Number.isInteger(value) && value >= 0) {
      console.error("Invalid number:", value);
      throw new Error("Invalid number");
    }
    return value;
  }
  
  // Gets user configured Max Wanted amounts based on prefix
  // param {string} prefix - The prefix for the localStorage keys (e.g., "maxAllowed")
  // returns { wood: x, clay: y, iron: z }
  static getResourcesFromPrefix(prefix) {
    let wood = this.validateNumber(parseInt(localStorage.getItem(`${prefix}Wood`)));
    let clay = this.validateNumber(parseInt(localStorage.getItem(`${prefix}Clay`)));
    let iron = this.validateNumber(parseInt(localStorage.getItem(`${prefix}Iron`)));
    
    return { wood, clay, iron };
  }

  // Gets user configured Buy Rates
  // returns { wood: x, clay: y, iron: z }
  static getUserBuyRates() {
    return this.getResourcesFromPrefix("buyRate");
  }

  // Gets user configured Sell Rates
  // returns { wood: x, clay: y, iron: z }
  static getUserSellRates() {
    return this.getResourcesFromPrefix("sellRate");
  }

  // Gets user configured Reserve amounts
  // returns { wood: x, clay: y, iron: z }
  static getUserReserves() {
    return this.getResourcesFromPrefix("reserve");
  }

  // Gets user configured max allowed amounts
  // returns { wood: x, clay: y, iron: z }
  static getUserMaxAllowed() {
    return this.getResourcesFromPrefix("maxAllowed");
  }

  static getMinPP() {
    let minPP = this.validateNumber(parseInt(localStorage.getItem("minPP")));
    return minPP;
  }

  static isBuyActive() {
    return localStorage.getItem("comprarAtivo") === "true";
  }
  
  static isSellActive() {
    return localStorage.getItem("venderAtivo") === "true";
  }
  
  static isScriptActive() {
    return localStorage.getItem("scriptLigado") === "true";
  }

  static getAvailablePPs() {
    return (this.validateNumber(parseInt(document.querySelector("#premium_points").textContent)) - this.getMinPP() >= 0 ? 
           this.validateNumber(parseInt(document.querySelector("#premium_points").textContent)) - this.getMinPP() : 0);
  }

  /**
   * @returns {number} The maximum transport capacity of the merchant
   */
  static getMerchantCapacity() {
    return parseInt(document.getElementById('market_merchant_max_transport').textContent) || 0;
  }

  // returns { wood: x, clay: y, iron: z } which are the current buy rates including the extra cost
  // reads directly from the page
  // throws error if something is wrong for easy error catching
  static getCurrentRates() {
      return {
        wood: this.validateNumber(parseInt(document.querySelector("#premium_exchange_rate_wood > div:nth-child(1)").textContent.split('.').join(''))),
        clay: this.validateNumber(parseInt(document.querySelector("#premium_exchange_rate_stone > div:nth-child(1)").textContent.split('.').join(''))),
        iron: this.validateNumber(parseInt(document.querySelector("#premium_exchange_rate_iron > div:nth-child(1)").textContent.split('.').join('')))
      }
  }


  /** 
    * Get current resources and max warehouse capacity
    * @returns {Object} An object containing current resources and max warehouse capacity as numbers
    * @example
    * const resources = getResources();
    * console.log(resources);
    * { currentWood: '1000', currentClay: '800', currentIron: '600', maxWarehouse: '2000' }
    */
  static getCurrentResources() {
    return {
      currentWood: parseInt(document.getElementById('wood').textContent) || 0,
      currentClay: parseInt(document.getElementById('stone').textContent) || 0,
      currentIron: parseInt(document.getElementById('iron').textContent) || 0,
      maxWarehouse: parseInt(document.getElementById('storage').textContent) || 0
    }
  }

  // direction "in" or "out"
  // returns { wood: x, clay: y, iron: z } which are the resources in transit depending on direction
  static getResourcesInTransit(direction) {
      let incommings = {wood: 0, clay: 0, iron: 0};
      const row = document.querySelector("#market_status_bar > table:nth-child(2)");
      if (!row) return incommings;

      const text = direction == "in" ? "A chegar" : "De saída";
      const incommingRow = Array.from(row.querySelectorAll("th")).find(th => th.textContent.includes(text));
      if (!incommingRow) return incommings;

      const spans = incommingRow.querySelectorAll("span.nowrap");
      spans.forEach(span => {
        if (span.innerHTML.includes('icon header wood')) {
          incommings.wood = this.validateNumber(parseInt(span.textContent.split('.').join('')));
        } else if (span.innerHTML.includes('icon header stone')) {
          incommings.clay = this.validateNumber(parseInt(span.textContent.split('.').join('')));
        } else if (span.innerHTML.includes('icon header iron')) {
          incommings.iron = this.validateNumber(parseInt(span.textContent.split('.').join('')));
        }
      });

      return incommings;
    }

    // calculates how much more resources are needed to reach max wanted without going over the max for each resource
    // takes into account current resources + incoming resources
    // returns { wood: x, clay: y, iron: z }
    static getResourcesNeeded() {
      const current = this.getCurrentResources();
      const incoming = this.getResourcesInTransit("in");
      const maxAllowed = this.getUserMaxAllowed();
      
      return {
        wood: (current.currentWood + incoming.wood) >= maxAllowed.wood ? 0 : (maxAllowed.wood - (current.currentWood + incoming.wood)),
        clay: (current.currentClay + incoming.clay) >= maxAllowed.clay ? 0 : (maxAllowed.clay - (current.currentClay + incoming.clay)),
        iron: (current.currentIron + incoming.iron) >= maxAllowed.iron ? 0 : (maxAllowed.iron - (current.currentIron + incoming.iron))
      };
    }
}


/**
 * Buys the specified resources at the current market rates.
 * @param {Object} resources - An object containing the amounts of each resource to buy (e.g., { wood: x, clay: y, iron: z }).
 * @param {Object} currentRates - An object containing the current market rates for each resource (e.g., { wood: x, clay: y, iron: z }).
 * Needed for redundancy check
 */
async function buyResources(resources, currentRates) {
  function buyResource(resource, ammount, currentRate) {
    resource = resource == "clay" ? "stone" : resource; // clay is stone in the HTML
        const inputBuy = document.querySelector(`#premium_exchange_buy_${resource} > div:nth-child(1) > input`)
        inputBuy.value = ammount;


    // calcular best option button
    document.querySelector("#premium_exchange_form > input").click();

    setTimeout(async () => {
      // extra confirmation step for rate
      if (currentRate < parseInt(document.querySelector(`#premium_exchange_rate_${resource} > div:nth-child(1)`).textContent.split('.').join(''))) {
        console.error(`Market rate for ${resource} has changed. Aborting buy.`);
        document.querySelector("#premium_exchange > div > div > div.confirmation-buttons > button.btn.evt-cancel-btn.btn-confirm-no").click();
        inputBuy.value = '';
        return;
      }

      console.log(`Attempting to buy ${ammount} of ${resource}`);
      document.querySelector("#premium_exchange > div > div > div.confirmation-buttons > button.btn.evt-confirm-btn.btn-confirm-yes").click()
      
      // if resources have changed mid buying loop it will appear a new message to confirm with the different rate
      // wait a bit to see if the confirmation box appears
      await sleep(250);
      if (document.querySelector("#premium_exchange.confirmation-box")) {
        console.log("Confirmation box detected, verifying rate again...");
        if (currentRate < parseInt(document.querySelector(`#premium_exchange_rate_${resource} > div:nth-child(1)`).textContent.split('.').join(''))) {
          console.error(`Market rate for ${resource} has changed. Aborting buy.`);
          document.querySelector("#premium_exchange > div > div > div.confirmation-buttons > button.btn.evt-cancel-btn.btn-confirm-no").click();
        } else {
          console.log(`Bought ${ammount} of ${resource}`);
          //document.querySelector("#premium_exchange > div > div > div.confirmation-buttons > button.btn.evt-confirm-btn.btn-confirm-yes").click();
          inputBuy.value = '';
        }
      }
      
      inputBuy.value = '';

    }, 1000);
  }


  for (const resource in resources) {
    if (resources[resource] > 0) {
      buyResource(resource, resources[resource], currentRates[resource]);
      await sleep(5500); // wait for the buy to complete before next buy
    }
  }
}


function traddingLoop() {
  // if script is not activated return
  if (!Getter.isScriptActive()) return;

  if (Getter.isBuyActive()) {
    // buy logic
    const resourcesNeeded = Getter.getResourcesNeeded();
    const currentRates = Getter.getCurrentRates();
    const userBuyRates = Getter.getUserBuyRates();
    const availablePPs = Getter.getAvailablePPs();

    console.log("Resources Needed:", resourcesNeeded);
    console.log("Current Rates:", currentRates);
    console.log("User Buy Rates:", userBuyRates);
    console.log("Available PPs:", availablePPs);
    let resourcesToBuy = getOptimalResources(
      Getter.getResourcesNeeded(), 
      Getter.getCurrentRates(), 
      Getter.getUserBuyRates(), 
      Getter.getAvailablePPs()
    );
    console.log("Resources to Buy:", resourcesToBuy);

    //buyResources(resourcesToBuy, currentRates);
    buyResources({wood: 1, clay:1, iron: 1}, currentRates);
  }

  // todo vender ativo
  setTimeout(traddingLoop, 15000); // runs every 5 seconds
}

loadHTML();

console.log("Script Loaded!");
console.log("Starting trading loop in 5 seconds...");
setTimeout(traddingLoop, 5000);