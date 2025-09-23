function buyResources(resources, wantedMarketRates) {
  console.log("Aqui");
  function buyResource(resource, ammount, wantedMarketRates) {
    resource = resource == "clay" ? "stone" : resource; // clay is stone in the HTML
/*     const inputBuy = document.querySelector(`#premium_exchange_buy_${resource} > div:nth-child(1) > input`)
    inputBuy.value = ammount; */

    //if (marketRate < parseInt(document.querySelector(`#premium_exchange_rate_${resource} > div:nth-child(1)`).textContent.split('.').join(''))) {
    if (wantedMarketRates > 240) {
      console.error(`Market rate for ${resource} has changed. Aborting buy.`);
      return;
    }

    //document.querySelector("#premium_exchange_form > input").click();
    console.log("Calculating best offer... Clicking the calculate button");

    setTimeout(() => {
      console.log("Confirming buy... Clicking the yes button");
      //document.querySelector("#premium_exchange > div > div > div.confirmation-buttons > button.btn.evt-confirm-btn.btn-confirm-yes").click()
    }, 1000);
  }

  console.log("Aqui 2");

  console.log("Resources to Buy:", resources);
  console.log("Market Rates:", wantedMarketRates);

  for (const resource in resources) {
    console.log("Resource:", resource, "Amount:", resources[resource], "Market Rate:", wantedMarketRates[resource]);
    if (resources[resource] > 0) {
      console.log(`Buying ${resources[resource]} of ${resource} at rate ${wantedMarketRates[resource]}`);
      buyResource(resource, resources[resource], wantedMarketRates[resource]);
    }
  }
}



buyResources({ wood: 1, clay: 1, iron: 1 }, { wood: 300, clay: 300, iron: 300 });
