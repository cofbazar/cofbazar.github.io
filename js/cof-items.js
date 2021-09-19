// default filter values
var defaultModeType = "default";
var defaultAllInputs = false;
var defaultItemType = ['Armor'];
var defaultAreaSize = "village";
var defaultScenario = { "campaign": "Toutes", "scenario": "Tous"}
var defaultArea = cofConfig['areas']['data'].find(area => area['name'] === defaultAreaSize);
var defaultAreaPriceMax = 1;
var defaultUserInputName = undefined;
var defaultUserInputDescription = undefined;
var defaultItemPriceMin = 0.0;
var defaultItemPriceMax = Number(defaultArea['cost-max']);
var defaultItemPriceStartMin = 0.0;
var defaultItemPriceStartMax = Number(defaultArea['cost-max']);
var defaultItemPriceMinRange = 0.0;
var defaultItemPriceMaxRange = Number(defaultArea['cost-max']);
var defaultSortKeys = [{key: 'cost', dir: 0},
                       {key: 'name', dir: 0},
                       {key: 'tlabel', dir: 0}];
var allTypes = cofConfig['items']['data'].filter(item => item.name != "Unique").map(item => item['name']).sort();
                       
// Item filter data
var defaultFilter = {
  "modeType": defaultModeType,
  "itemType": defaultItemType,
  "allInputs": defaultAllInputs,
  "areaSize": defaultAreaSize,
  "areaPriceMax": defaultAreaPriceMax,
  "scenario": defaultScenario,
  "price": {
    "min": defaultItemPriceMin,
    "max": defaultItemPriceMax,
    "startMin": defaultItemPriceStartMin,
    "startMax": defaultItemPriceStartMax,
    "minRange": defaultItemPriceMinRange,
    "maxRange": defaultItemPriceMaxRange
  },
  "userInput": {
    "name": defaultUserInputName,
    "description": defaultUserInputDescription
  },
  "sortKeys": defaultSortKeys,
};

//saveFilter(defaultFilter);
itemFilter = loadFilter(defaultFilter);

/*
console.log("defaultItemType :" + defaultItemType);
console.log("defaultAreaSize :" + defaultSelectedAreaSize);
console.log("defaultItemPriceMin :" + defaultItemPriceMin);
console.log("defaultItemPriceMax :" + defaultItemPriceMax);
*/

var itemData = new Vue({
  el: '#item-data',
  data: {
    cofFullData: [],
    maxCofDataPrice: 0.0,
  },
  mounted () {
    fetchData().then(arrayOfResponses => {

      console.time("COF data loaded");
      arrayOfResponses.forEach(a => {
        //Add icon type and label type to data
        //itype = cofConfig['items']['data'].find(t => t['name'] === a[0]['__type__']);
        a.map(item => {
          if (item.cost === null) {
            console.log("Item (" + JSON.stringify(item.cost) + "): " + item.oid);
          }
          itype = cofConfig['items']['data'].find(t => t['name'] === item['__type__']);
          item['ticon'] = itype['icon'];
          item['tlabel'] = itype['label'];
          item['tdescription'] = itype['description'];
          item['displayFullDescription'] = false;
          return item;
        })
        // data
        this.cofFullData = this.cofFullData.concat(a);
      });
      this.maxCofDataPrice = this.cofFullData.maxPrice();
      console.timeEnd("COF data loaded");
      console.time("Initialization");
      // set default max cost for all object in empty area
      /*maxCofDataPrice = this.cofFullData.maxPrice();
      notSelectedArea = {"name": "notSelected", "cost-max" : maxCofDataPrice};*/
      appSeparator.allItems = this.cofFullData.length;
      itemList.itemsListData = this.cofFullData.filterItemsList(itemFilter);
      appSeparator.loadedItems = itemList.itemsListData.length;
      console.timeEnd("Initialization");
    });
  }
});

var itemSettings = new Vue({
  el: '#item-settings',
  methods: {
    resetFilters: function() {
      saveFilter(defaultFilter);
      itemFilter = loadFilter(defaultFilter);
      itemModeType.modeType = itemFilter["modeType"];
      itemCampaign.displayFilter = itemFilter["modeType"] == 'quest';
      itemCampaign.selectedCampaign = itemFilter["scenario"]["campaign"];
      itemCampaign.selectedScenario = itemFilter["scenario"]["scenario"];
      itemType.checkedNames = itemFilter["itemType"];
      itemType.allInputs = itemFilter["allInputs"];
      areaSize.selected = itemFilter["areaSize"];
      itemPrice.min = itemFilter["price"]["min"];
      itemPrice.max = itemFilter["price"]["max"];
      itemPrice.startMin = itemFilter["price"]["startMin"];
      itemPrice.startMax = itemFilter["price"]["startMax"];
      itemPrice.minRange = itemFilter["price"]["minRange"];
      itemPrice.maxRange = itemFilter["price"]["maxRange"];
      itemList.sortKeys = itemFilter["sortKeys"];
      itemList.userInputName = itemFilter["userInput"]["name"];
      itemList.userInputDescription = itemFilter["userInput"]["description"];
      itemData.maxCofDataPrice = itemData.cofFullData.maxPrice();
      areaSize.areaPriceMax = itemFilter["areaPriceMax"];
    },
  }
});


var itemModeType = new Vue({
  el: '#item-mode-type',
  data: {
    modeType: itemFilter["modeType"],
    modes: cofConfig['modes']
  },
  watch: {
    modeType: function (v) {
      console.time("Mode type checked(" + v + ")");
      this.modeType = v;
      itemFilter["modeType"] = this.modeType;
      saveFilter(itemFilter);
      itemList.itemsListData = itemData.cofFullData.filterItemsList(itemFilter);
      appSeparator.loadedItems = itemList.itemsListData.length;
      if (areaSize.areaPriceMax < 0.0) {
        itemPrice.max = itemData.cofFullData.maxPrice(itemFilter); 
      } 
      console.timeEnd("Mode type checked(" + v + ")");
      if (this.modeType == 'quest') {
        itemCampaign.displayFilter = true;
      } else {
        itemCampaign.displayFilter = false;
      }
    }
  }
});

var itemCampaign = new Vue({
  el: '#item-campaign',
  data: {
    displayFilter: itemFilter["modeType"] == 'quest',
    selectedCampaign: itemFilter["scenario"]["campaign"],
    optionsCampaign: cofConfig['campaigns'].map(campaign => ({
      text: campaign['name'],
      value: campaign['name'],
    })),
    selectedScenario: itemFilter["scenario"]["scenario"],
    optionsScenario: cofConfig['campaigns'].find(c => c['name'] == itemFilter["scenario"]["campaign"])["scenarios"].map(scenario => ({
      text: scenario,
      value: scenario,
    })),
  },
  watch: {
    displayFilter: function (v) {
      console.time("Display filter change (" + v + ")");
      this.displayFilter = v
      console.timeEnd("Display filter change (" + v + ")");
    },
    selectedCampaign: function (v) {
      console.time("Campaign change (" + v + ")");
      this.selectedCampaign = v;
      itemFilter["scenario"]["campaign"] = this.selectedCampaign;
      saveFilter(itemFilter);
      scenarios = cofConfig['campaigns'].find(c => c['name'] == this.selectedCampaign)["scenarios"];
      this.selectedScenario = scenarios[0];      
      itemFilter["scenario"]["scenario"] = this.selectedScenario;
      saveFilter(itemFilter);
      this.optionsScenario = scenarios.map(scenario => ({
        text: scenario,
        value: scenario,
      }));
      itemList.itemsListData = itemData.cofFullData.filterItemsList(itemFilter);
      appSeparator.loadedItems = itemList.itemsListData.length;
      if (areaSize.areaPriceMax < 0.0) {
        itemPrice.max = itemData.cofFullData.maxPrice(itemFilter);
        //console.log("Set price max : " + itemPrice.max);
      }
      console.timeEnd("Campaign change (" + v + ")");
    },
    selectedScenario: function (v) {
      console.time("Scenario change (" + v + ")");
      this.selectedScenario = v;
      itemFilter["scenario"]["scenario"] = this.selectedScenario;
      saveFilter(itemFilter);
      itemList.itemsListData = itemData.cofFullData.filterItemsList(itemFilter);
      appSeparator.loadedItems = itemList.itemsListData.length;
      if (areaSize.areaPriceMax < 0.0) {
        itemPrice.max = itemData.cofFullData.maxPrice(itemFilter);
        //console.log("Set price max : " + itemPrice.max);
      }
      console.timeEnd("Scenario change (" + v + ")");
    }
  }
});

var itemType = new Vue({
  el: '#item-type',
  data: {
    allInputs: itemFilter["allInputs"],
    checkedNames: itemFilter["itemType"],
    inputs: cofConfig['items']['data'].filter(item => item.name != "Unique").map(item => ({
      value: item['name'],
      label: item['label'],
      icon:item['icon']
    })).sort(function(a,b){
      var x = a.label.toLowerCase();
      var y = b.label.toLowerCase();
      if (x < y) {return -1;}
      if (x > y) {return 1;}
      return 0;
    })
      
  },
  watch: {
    allInputs: function (v) {
      console.time("All items type checked(" + v + ")");
      if (v) {
        if (!(this.checkedNames.equals(allTypes))) {
          this.checkedNames = allTypes;
          itemFilter["allInputs"] = true;
          saveFilter(itemFilter);
        }    
      } else {
        if (this.checkedNames.equals(allTypes)) {
          this.checkedNames = defaultItemType;
          itemFilter["allInputs"] = false;
          saveFilter(itemFilter);
        }
      } 
      console.timeEnd("All items type checked(" + v + ")");
    },
    checkedNames: function (v) {
      console.time("Item type checked(" + v + ")");
      sortedv = [...v].sort();
      itemFilter["itemType"] = sortedv;
      saveFilter(itemFilter);
    // Comparer les 2 tableaux https://masteringjs.io/tutorials/fundamentals/compare-arrays
      if ((sortedv.equals(allTypes)) && (!(this.allInputs)) ) {
        console.log("All inputs checked");
        this.allInputs = true;
        itemFilter["allInputs"] = true;
        saveFilter(itemFilter);
      } 
      if ((!(sortedv.equals(allTypes))) && (this.allInputs)) {
        this.allInputs = false;
        itemFilter["allInputs"] = false;
        saveFilter(itemFilter);
      }
      itemList.itemsListData = itemData.cofFullData.filterItemsList(itemFilter);
      appSeparator.loadedItems = itemList.itemsListData.length;
      if (areaSize.areaPriceMax < 0.0) {
        itemPrice.max = itemData.cofFullData.maxPrice(itemFilter);
        //console.log("Set price max : " + itemPrice.max);
      } 
      console.timeEnd("Item type checked(" + v + ")");
    }
  }
});

var itemPrice = new Vue({
  el: '#item-price',
  data: {
    minRange: Number(itemFilter["price"]["minRange"]),
    maxRange: Number(itemFilter["price"]["maxRange"]),
    startMin: Number(itemFilter["price"]["startMin"]),
    startMax: Number(itemFilter["price"]["startMax"]),
    min: Number(itemFilter["price"]["min"]),
    max: Number(itemFilter["price"]["max"]),
    slider: {
      start: 0,
      step: 1
    },
    vslider: null
  },
  watch: {
    max: function (v) {
      console.time("Max range(" + v + ")");
      this.maxRange = v;
      this.vslider.updateOptions({'range': {'min': this.min, 'max': this.max},
                                  'start': [this.min, v]});
      itemFilter["price"]["maxRange"] = this.max;
      itemFilter["price"]["startMax"] = this.max;
      itemFilter["price"]["max"] = this.max;
      itemFilter["price"]["minRange"] = this.min;
      itemFilter["price"]["startMin"] = this.min;
      itemFilter["price"]["min"] = this.min;
      saveFilter(itemFilter);
      itemList.itemsListData = itemData.cofFullData.filterItemsList(itemFilter);
      appSeparator.loadedItems = itemList.itemsListData.length;
      console.timeEnd("Max range(" + v + ")");
    }
  },
  methods: {
    updateSlider: function updateSlider() {
      this.$refs.slider.noUiSlider.set([this.minRange, this.maxRange]);
    }
  },
  mounted: function() {
    this.vslider = noUiSlider.create(this.$refs.slider, {
      start: [this.startMin, this.startMax],
      step: this.slider.step,
      tooltips: [wNumb({decimals: 0}), wNumb({decimals: 0})],
      connect: true,
      range: {
        'min': this.min,
        'max': this.max
      },
      pips: {
        mode: 'count',
        density: 6,
        values: 3
      }
    });
    this.$refs.slider.noUiSlider.on('change',(values, handle) => {
      this[handle ? 'maxRange' : 'minRange'] = parseInt(values[handle]);
      console.time("Update slider (" + handle + ", " + values[handle] + ")")
      itemFilter["price"]["minRange"] = this.minRange;
      itemFilter["price"]["maxRange"] = this.maxRange;
      itemFilter["price"]["startMin"] = this.minRange;
      itemFilter["price"]["startMax"] = this.maxRange;
      saveFilter(itemFilter);
      itemList.itemsListData = itemData.cofFullData.filterItemsList(itemFilter);
      appSeparator.loadedItems = itemList.itemsListData.length;
      console.timeEnd("Update slider (" + handle + ", " + values[handle] + ")")
    });
  }
});

var areaSize = new Vue({
  el: '#area-size',
  data: {
    label: cofConfig['areas']['label'],
    selected: itemFilter["areaSize"],
    options: cofConfig['areas']['data'].map(area => ({
      text: areaText(area),
      value: area['name'],
    })),
    areaPriceMax: itemFilter["areaPriceMax"],
  },
  watch: {
    selected: function (v) {
      console.time("Selected Area(" + v + ")");
      this.selected = v;
      selectedArea = cofConfig['areas']['data'].find(area => area['name'] === v);
      itemFilter["areaSize"] = this.selected;
      saveFilter(itemFilter);
      //console.log("selectedArea : " + JSON.stringify(selectedArea));
      this.areaPriceMax = Number(selectedArea['cost-max']);
      itemFilter["areaPriceMax"] = areaSize.areaPriceMax;
      saveFilter(itemFilter);
      if (this.areaPriceMax < 0.0) {
        itemPrice.max = itemData.cofFullData.maxPrice(itemFilter);
      } else {
        itemPrice.max = this.areaPriceMax;
      }
      console.timeEnd("Selected Area(" + v + ")");
    }
  },
});
var itemCart = new Vue({
  el: '#item-cart',
  data: {
    cartData: [],
  },
  methods: {
    resetCart: function() {
      saveCart([]);
      itemCart.cartData = loadCart();
    },
    delFromCart: function(item) {
      console.time("Del item from cart");
      //console.log("Del item from cart ... (" + JSON.stringify(item) + ")");
      itemIndex = itemCart.cartData.findIndex(citem => citem['oid'] === item['oid']);
      if (itemIndex < 0) {
        console.warn("Object with oid '" + item['oid']+ "' not found in cart")
      } else {
        if (this.cartData[itemIndex]['count'] > 1) {
          this.cartData[itemIndex]['count'] = this.cartData[itemIndex]['count'] - 1;
        } else {
          this.cartData.splice(itemIndex, 1);
        }
      }
      console.timeEnd("Del item from cart");
      console.time("Make session persistent cart");
      saveCart(this.cartData);
      console.timeEnd("Make session persistent cart");
    },
    subTotal: function(item) {
      return(Number(item['cost']['value']) * Number(item['count']));
    },
    cartTotal: function(cart) {
      return(cart.reduce((accumulator, currentValue) => accumulator + this.subTotal(currentValue), 0.0));
    }
  },
  mounted () {
    this.cartData = loadCart();
  }
});

var appSeparator = new Vue({
  el: '#app-separator',
  data: {
    loadedItems: 0,
    allItems: 0,
  }
});

var itemList = new Vue({
  el: '#item-list',
  data: {
    itemsListData: [],
    sortKeys: itemFilter["sortKeys"],
    userInputName: itemFilter["userInput"]["name"],
    userInputDescription: itemFilter["userInput"]["description"],
  },
  methods: {
    filterUserInputDescription: function(v) {
      if (!(/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent))) {
        console.time("Filter data on '" + v + "'");
        this.userInputDescription = v;
        itemFilter["userInput"]["description"] = this.userInputDescription;
        saveFilter(itemFilter);
        this.itemsListData = itemData.cofFullData.filterItemsList(itemFilter);
        appSeparator.loadedItems = this.itemsListData.length;
        console.timeEnd("Filter data on '" + v + "'");
      }
    },
    mFilterUserInputDescription: function(v) {
      if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
        console.time("Filter data on '" + v + "' for mobile");
        this.userInputDescription = v;
        itemFilter["userInput"]["description"] = this.userInputDescription;
        saveFilter(itemFilter);
        this.itemsListData = itemData.cofFullData.filterItemsList(itemFilter);
        appSeparator.loadedItems = this.itemsListData.length;
        console.timeEnd("Filter data on '" + v + "' for mobile");
      }
    },
    filterUserInputName: function(v) {
      if (!(/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent))) {
        console.time("Filter data on '" + v + "'");
        this.userInputName = v;
        itemFilter["userInput"]["name"] = this.userInputName;
        saveFilter(itemFilter);
        this.itemsListData = itemData.cofFullData.filterItemsList(itemFilter);
        appSeparator.loadedItems = this.itemsListData.length;
        console.timeEnd("Filter data on '" + v + "'");
      }
    },
    mFilterUserInputName: function(v) {
      if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
        console.time("Filter data on '" + v + "' for mobile");
        this.userInputName = v;
        itemFilter["userInput"]["name"] = this.userInputName;
        saveFilter(itemFilter);
        this.itemsListData = itemData.cofFullData.filterItemsList(itemFilter);
        appSeparator.loadedItems = this.itemsListData.length;
        console.timeEnd("Filter data on '" + v + "' for mobile");
      }
    },
    addToCart: function(item) {
      console.time("Add item to cart");
      //console.log("Add item to cart ... (" + JSON.stringify(item) + ")");
      fitem = itemCart.cartData.find(citem => citem['oid'] === item['oid']);
      if (fitem === undefined) {
        nitem = Object.assign({}, item);
        itemCart.cartData.push(nitem);
      } else {
        fitem['count'] = fitem['count'] + 1;
      }
      console.timeEnd("Add item to cart");
      console.time("Make session persistent cart");
      saveCart(itemCart.cartData);
      console.timeEnd("Make session persistent cart");
    },
    addAllVisibleToCart: function() {
      this.itemsListData.forEach(i => this.addToCart(i));
    },
    displayFullDescription: function(item) {
      console.time("Display full description");
      //console.log("Display full description ... (" + JSON.stringify(item) + ")");
      item['displayFullDescription'] = true;
      console.timeEnd("Display full description");
    },
    hideFullDescription: function(item) {
      console.time("Hide full description");
      //console.log("Hide full description ... (" + JSON.stringify(item) + ")");
      item['displayFullDescription'] = false;
      console.timeEnd("Hide full description");
    },
    sort: function(key) {
      console.time("Sorting (" + key + ")");
      keyIndex = this.sortKeys.findIndex(k => k['key'] === key);
      nKey = Object.assign({}, this.sortKeys[keyIndex]);
      this.sortKeys.splice(keyIndex, 1);
      nKey.dir = nKey.dir + 1;
      if ((nKey.dir > 1) || (nKey === NaN)) {
        nKey.dir = -1;
      }
      //console.log('Direction : "' + nKey.dir + '" : nKey : ' + JSON.stringify(nKey));
      this.sortKeys.unshift(nKey);

      itemList["sortKeys"] = this.sortKeys;
      saveFilter(itemFilter);
      this.itemsListData = itemData.cofFullData.filterItemsList(itemFilter);
      appSeparator.loadedItems = this.itemsListData.length;
      console.timeEnd("Sorting (" + key + ")");
    },
    descSort: function(key) {
      return (this.sortKeys.find(k => k['key'] === key)['dir'] >= 0);
    },
    ascSort: function(key) {
      return (this.sortKeys.find(k => k['key'] === key)['dir'] <= 0);
    },
  },
});