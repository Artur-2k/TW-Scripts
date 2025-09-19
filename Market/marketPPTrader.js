// Your code here...
// todo estava a trabalhar nos butoes de start stop sell buy active inactive
// todo e a guardar as configs no localstorage
// todo falta fazer a logica de comprar e vender
// todo e fazer o script correr automaticamente a cada X segundos para dar scan


/** 
  * Get current resources and max warehouse capacity
  * @returns {Object} An object containing current resources and max warehouse capacity as numbers
  * @example
  * const resources = getResources();
  * console.log(resources);
  * { currentWood: '1000', currentClay: '800', currentIron: '600', maxWarehouse: '2000' }
  */
function getCurrentResources() {
  return {
    currentWood: parseInt(document.getElementById('wood').textContent) || 0,
    currentClay: parseInt(document.getElementById('stone').textContent) || 0,
    currentIron: parseInt(document.getElementById('iron').textContent) || 0,
    maxWarehouse: parseInt(document.getElementById('storage').textContent) || 0
  }
}

/**
 * @returns {number} The maximum transport capacity of the merchant
 */
function getMerchantCapacity() {
  return parseInt(document.getElementById('market_merchant_max_transport').textContent) || 0;
}

/** 
 * Get incoming resources from trades
 * @returns {Object} An object containing incoming resources as numbers
 * @example
 * const incoming = getIncomingResources();
 * console.log(incoming);
 * { incomingWood: '200', incomingClay: '150', incomingIron: '100' }
 */
function getIncomingResources() {
  // this cuz they use dots as thousand separators
  function getNumber(selector) {
    const el = document.querySelector(selector);
    if (!el) return 0;
    return Number(el.textContent.split('.').join('')) || 0;
  }

  return {
    incomingWood: getNumber('#market_status_bar > table:nth-child(2) > tbody > tr > th:nth-child(1) span.icon.header.wood'),
    incomingClay: getNumber('#market_status_bar > table:nth-child(2) > tbody > tr > th:nth-child(2) span.icon.header.stone'),
    incomingIron: getNumber('#market_status_bar > table:nth-child(2) > tbody > tr > th:nth-child(3) span.icon.header.iron')
  };
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
                  <input id="maxWoodAllowed" type="text" style="width:70px; background:#fff; text-align:center;" pattern="[0-9]*" required>
                  <div style="font-size:11px; color:#666;">Max Wood Wanted</div>
              </td>
              <td style="padding:5px; background:#fff5d6; border:1px solid #804000; text-align:center;">
                  <input id="maxClayAllowed" type="text" style="width:70px; background:#fff; text-align:center;" pattern="[0-9]*" required>
                  <div style="font-size:11px; color:#666;">Max Clay Wanted</div>
              </td>
              <td style="padding:5px; background:#fff5d6; border:1px solid #804000; text-align:center;">
                  <input id="maxIronAllowed" type="text" style="width:70px; background:#fff; text-align:center;" pattern="[0-9]*" required>
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
    console.log("click vender");
    console.log("content", venderBtn.textContent);
    if (venderBtn.textContent === "Sell Activated") {
      venderBtn.textContent = "Sell Deactivated";
      venderBtn.style.background = "#a52b27b6";
    } else {
      venderBtn.textContent = "Sell Activated";
      venderBtn.style.background = "linear-gradient(to bottom, #947a62 0%,#7b5c3d 22%,#6c4824 30%,#6c4824 100%)"; // default
    }
    console.log("content after", venderBtn.textContent);
    console.log("vender ativo", venderBtn.textContent === "Sell Activated");
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
  let maxWoodAllowed = parseInt(localStorage.getItem("maxWoodAllowed"));
  let maxClayAllowed = parseInt(localStorage.getItem("maxClayAllowed"));
  let maxIronAllowed = parseInt(localStorage.getItem("maxIronAllowed"));
  let minPP = parseInt(localStorage.getItem("minPP"));

  if (isNaN(buyRateWood) || isNaN(buyRateClay) || isNaN(buyRateIron) || 
      isNaN(sellRateWood) || isNaN(sellRateClay) || isNaN(sellRateIron) ||
      isNaN(reserveWood) || isNaN(reserveClay) || isNaN(reserveIron) ||
      isNaN(maxWoodAllowed) || isNaN(maxClayAllowed) ||
      isNaN(maxIronAllowed) || isNaN(minPP)) {
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
  document.getElementById("maxWoodAllowed").value = maxWoodAllowed;
  document.getElementById("maxClayAllowed").value = maxClayAllowed;
  document.getElementById("maxIronAllowed").value = maxIronAllowed;
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
  // maxWoodAllowed
  localStorage.setItem("maxWoodAllowed", document.getElementById("maxWoodAllowed").value);
  // maxClayAllowed
  localStorage.setItem("maxClayAllowed", document.getElementById("maxClayAllowed").value);
  // maxIronAllowed
  localStorage.setItem("maxIronAllowed", document.getElementById("maxIronAllowed").value);
  // minPP
  localStorage.setItem("minPP", document.getElementById("minPP").value);
  // comprar ativo bool localstorage
  localStorage.setItem("comprarAtivo", document.getElementById("comprarAtivoBtn").textContent === "Buy Activated");
  // vender ativo bool localstorage
  localStorage.setItem("venderAtivo", document.getElementById("venderAtivoBtn").textContent === "Sell Activated");
  // script ligado bool localstorage
  localStorage.setItem("scriptLigado", document.getElementById("scriptLigadoBtn").textContent === "Script Activated");
}



loadHTML();

