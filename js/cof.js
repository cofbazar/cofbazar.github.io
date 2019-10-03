var defaultFantasyMode = "high";
var defaultItemType = ['Armor'];
var defaultFilterValue = undefined
var defaultSelectedAreaSize = "village";
var notSelectedArea = {"name": "notSelected", "cost-max" : 10000.0};
var areas = function() {
  return cofConfig['areas']['data'].concat([notSelectedArea])
};
var defaultItemPriceMin = 0.0;
var defaultItemPriceMax = areas().find(area => area['name'] === defaultSelectedAreaSize)['cost-max'];
var defaultSortKeys = [{key: 'cost', dir: 0},
                       {key: 'name', dir: 0},
                       {key: 'tlabel', dir: 0}];

/*
console.log("defaultItemType :" + defaultItemType);
console.log("defaultSelectedAreaSize :" + defaultSelectedAreaSize);
console.log("notSelectedArea :" + JSON.stringify(notSelectedArea));
console.log("Areas :" + JSON.stringify(areas()));
console.log("defaultItemPriceMin :" + defaultItemPriceMin);
console.log("defaultItemPriceMax :" + defaultItemPriceMax);
*/

var itemData = new Vue({
  el: '#item-data',
  data: {
    cofFullData: [],
  },
  mounted () {
    fetchData().then(arrayOfResponses => {

      console.time("COF data loaded");
      arrayOfResponses.forEach(a => {
        //Add icon type and label type to data
        itype = cofConfig['items']['data'].find(t => t['name'] === a[0]['__type__']);
        a.map(item => {
          item['ticon'] = itype['icon'];
          item['tlabel'] = itype['label'];
          item['tdescription'] = itype['description'];
          item['displayFullDescription'] = false;
          return item;
        })
        // data
        this.cofFullData = this.cofFullData.concat(a);
      });
      console.timeEnd("COF data loaded");
      console.time("Initialization");
      // set default max cost for all object in empty area
      maxCofDataPrice = this.cofFullData.maxPrice();
      notSelectedArea = {"name": "notSelected", "cost-max" : maxCofDataPrice};
      appSeparator.allItems = this.cofFullData.length;

      itemList.itemsListData = setItemsListData(
        this.cofFullData, defaultItemType, defaultItemPriceMin,
        defaultItemPriceMax, defaultSortKeys, defaultFilterValue, defaultFantasyMode);

      appSeparator.loadedItems = itemList.itemsListData.length;
    console.timeEnd("Initialization");
    });
  }
});

var itemFantasy = new Vue({
  el: '#item-fantasy',
  data: {
    fantasyMode: defaultFantasyMode,
  },
  watch: {
    fantasyMode: function (v) {
      console.time("Fantasy mode checked(" + v + ")");
      this.fantasyMode = v;
      itemList.itemsListData = setItemsListData(
        itemData.cofFullData, itemType.checkedNames, itemPrice.minRange,
        itemPrice.maxRange, itemList.sortKeys, itemList.filterValue,
        this.fantasyMode);
      appSeparator.loadedItems = itemList.itemsListData.length;
      console.timeEnd("Fantasy mode checked(" + v + ")");
    }
  }
});


var itemType = new Vue({
  el: '#item-type',
  data: {
    checkedNames: defaultItemType,
    inputs: cofConfig['items']['data'].map(item => ({
      value: item['name'],
      label: item['label'],
      icon:item['icon']
    }))
  },
  watch: {
    checkedNames: function (v) {
      console.time("Item type checked(" + v + ")");
      itemList.itemsListData = setItemsListData(
        itemData.cofFullData, this.checkedNames, itemPrice.minRange,
        itemPrice.maxRange, itemList.sortKeys, itemList.filterValue, 
        itemFantasy.fantasyMode);
      
      appSeparator.loadedItems = itemList.itemsListData.length;
      console.timeEnd("Item type checked(" + v + ")");
    }
  }
});

var itemPrice = new Vue({
  el: '#item-price',
  data: {
    minRange: Number(defaultItemPriceMin),
    maxRange: Number(defaultItemPriceMax),
    startMin: Number(defaultItemPriceMin),
    startMax: Number(defaultItemPriceMax),
    min: Number(defaultItemPriceMin),
    max: Number(defaultItemPriceMax),
    slider: {
      start: 0,
      step: 1
    },
    vslider: null
  },
  watch: {
    min: function (v) {
      console.time("Min range(" + v + ")");
      this.minRange = v;
      this.vslider.updateOptions({'range': {'min': v, 'max': this.max},
                                  'start': [v, this.max]});
      itemList.itemsListData = setItemsListData(
        itemData.cofFullData, itemType.checkedNames, this.minRange,
        this.maxRange, itemList.sortKeys, itemList.filterValue,
        itemFantasy.fantasyMode);
      console.timeEnd("Min range(" + v + ")");
    },
    max: function (v) {
      console.time("Max range(" + v + ")");
      this.maxRange = v;
      this.vslider.updateOptions({'range': {'min': this.min, 'max': v},
                                  'start': [this.min, v]});
      itemList.itemsListData = setItemsListData(
        itemData.cofFullData, itemType.checkedNames, this.minRange,
        this.maxRange, itemList.sortKeys, itemList.filterValue,
        itemFantasy.fantasyMode);

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
        itemList.itemsListData = setItemsListData(
        itemData.cofFullData, itemType.checkedNames, this.minRange,
        this.maxRange, itemList.sortKeys, itemList.filterValue,
        itemFantasy.fantasyMode);

      appSeparator.loadedItems = itemList.itemsListData.length;
      console.timeEnd("Update slider (" + handle + ", " + values[handle] + ")")
    });
  }
});

var areaSize = new Vue({
  el: '#area-size',
  data: {
    label: cofConfig['areas']['label'],
    selected: defaultSelectedAreaSize,
    options: areas().map(area => ({
      text: areaText(area),
      value: area['name'],
    }))
  },
  watch: {
    selected: function (v) {
      console.time("Selected Area(" + v + ")");
      selectedArea = areas().find(area => area['name'] === v);
    //  console.log("selectedArea : " + JSON.stringify(selectedArea));
      itemPrice.startMin  = Number(defaultItemPriceMin);
      itemPrice.startMax = Number(selectedArea['cost-max']);
      itemPrice.min = Number(defaultItemPriceMin);
      itemPrice.max = Number(selectedArea['cost-max']);
      itemPrice.minRange = Number(defaultItemPriceMin);
      itemPrice.maxRange = Number(selectedArea['cost-max']);
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
    },
    subTotal: function(item) {
      return(Number(item['cost']['value']) * Number(item['count']));
    },
    cartTotal: function(cart) {
      return(cart.reduce((accumulator, currentValue) => accumulator + this.subTotal(currentValue), 0.0));
    }
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
    cofFullData: [],
    itemsListData: [],
    sortKeys: defaultSortKeys,
    filterValue: undefined,
  },
  methods: {
    filter: function(v) {
      if (!(/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent))) {
        console.time("Filter data on '" + v + "'");
        this.filterValue = v;
        this.itemsListData = setItemsListData(
          this.cofFullData, itemType.checkedNames, itemPrice.minRange,
          itemPrice.maxRange, this.sortKeys, this.filterValue,
          itemFantasy.fantasyMode);

        appSeparator.loadedItems = this.itemsListData.length;
        console.timeEnd("Filter data on '" + v + "'");
      }
    },
    filterm: function(v) {
      if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
        console.time("Filter data on '" + v + "' for mobile");
        this.filterValue = v;
        this.itemsListData = setItemsListData(
          this.cofFullData, itemType.checkedNames, itemPrice.minRange,
          itemPrice.maxRange, this.sortKeys, this.filterValue,
          itemFantasy.fantasyMode);
          
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

      this.itemsListData = setItemsListData(
          this.cofFullData, itemType.checkedNames, itemPrice.minRange,
          itemPrice.maxRange, this.sortKeys, this.filterValue,
          itemFantasy.fantasyMode);

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

var footerBlock = new Vue({
  el: '#app-footer',
  computed: {
    blockList: function() {
      return cofConfig['footers']['data'];
    }
  }
});
