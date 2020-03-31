function genURLArray(config) {
  urlArray = [];
  cofConfig['items']['data'].forEach(
    function(item) {
      urlArray.push(cofConfig['dataUrl'] + item['file']);
    });
  return urlArray;
}

fetchData = () => {
  const urls = genURLArray(cofConfig);
  const allRequests = urls.map(url =>
    fetch(url).then(response => response.json())
  );
  return Promise.all(allRequests);
};

Array.prototype.minPrice = function(filters) {
  if (filters === undefined) {
    return this.reduce((min, o) =>
      o.cost.value < min ? o.cost.value : min, this[0].cost.value);
  } else {
    return this.filters(item =>
        filters['type'].includes(item['__type__']) && 
        isMagicalItem(filters['fantasyMode'], item)
      ).reduce((min, o) =>
        o.cost.value < min ? o.cost.value : min, this[0].cost.value
      );
    }
};

Array.prototype.maxPrice = function(filters) {
  console.log("maxPrice("+ JSON.stringify(filters) + ")");
  if (filters === undefined) {
    return this.reduce((max, o) =>
      o.cost.value > max ? o.cost.value : max, this[0].cost.value);
  } else {
    return this.filter(item =>
        filters['type'].includes(item['__type__']) && 
        isMagicalItem(filters['fantasyMode'], item)
      ).reduce((max, o) =>
        o.cost.value > max ? o.cost.value : max, this[0].cost.value
      );
  }
};

function areaText(area) {
  if (area['name'] === 'notSelected') {
    //console.log("areaText(" + JSON.stringify(area) + ") = ''");
    return 'Tous les objets';
  } else {
    text = area['label'] + " ( " + area['people'] + " " + cofConfig['units']['people']+ " )";
    //console.log("areaText(" + JSON.stringify(area) + ") = '" + text + "'");
    return text;
  }
};

Array.prototype.multiSort = function(keys) {
  return this.sort(function(a,b){
    let i = 0, result = 0;
    while(i < keys.length && result === 0) {
      var direction = keys[i].dir;
      if (direction != 0) {
        if (keys[i].key === 'cost') {
          aValue = Number(a['cost']['value']);
          bValue = Number(b['cost']['value']);
          result =
            direction*(aValue < bValue ? -1 : (aValue > bValue ? 1 : 0));
        } else {
          aValue = a[ keys[i].key ].toString();
          bValue = b[ keys[i].key ].toString();
          result =
            direction*(aValue < bValue ? -1 : (aValue > bValue ? 1 : 0));
        }
      }
      i++;
    }
    return result;
  })
};

function isMagicalItem(fantasyMode, item) {
  //console.log('isMagicalItem(' + fantasyMode + ')')
  if (fantasyMode === "high") {
    return true;
  } else {
    //console.log('Magical level : ' + item['magical_level'])
    if ((item['magical_level'] > 0) ||
      ['Potion', 'MagicalWand', 'Spell'].includes(item['__type__'])) {
      return false;
    } else {
      return true;
    }
  }
};

setItemsListData = function(dataList, itemTypeList, minCostValue, maxCostValue, 
                            sortKeys, filterValue, fantasyMode) {
  //console.log("setItemsListData(<fullData>, "+ itemTypeList + ", " +
  //            minCostValue + ", " + maxCostValue + ", " + JSON.stringify(sortKeys) + 
  //            ", " + filterValue + ", " + fantasyMode + ")");
  if ((filterValue === undefined) || (filterValue === '')) {
    return dataList.filter(item =>
      itemTypeList.includes(item['__type__']) && isMagicalItem(fantasyMode, item) &&
      item['cost']['value'] >= minCostValue &&
      item['cost']['value'] <= maxCostValue).multiSort(sortKeys);
  } else {
    return dataList.filter(item =>
      itemTypeList.includes(item['__type__']) && isMagicalItem(fantasyMode, item) &&
      item['cost']['value'] >= minCostValue && 
      item['cost']['value'] <= maxCostValue).multiSort(sortKeys).filter(item =>
        (item['short_description'] + item['name'] + item['full_description']).noAccents().toLowerCase().includes(
          filterValue.noAccents().toLowerCase()));
  }
};

Array.prototype.nameFilter = function(name) {
  
  if ((name === undefined) || (name === '')) {
    return(this);
  } else {
    console.log(name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase());
    return(this.filter(item => 
      item['name'].normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().search(
      ".*" + name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase() + ".*") == 0));
  }
};

Array.prototype.descriptionFilter = function(description) {
  console.log(description);
  if ((description === undefined) || (description === '')) {
    return(this);
  } else {
    return(this.filter(item => (
      item['short_description'] + item['name'] + item['full_description']
    ).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().search(
      ".*" + description.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase() + ".*") == 0));
  }
};


filterItemsList = function(itemsList, filters) {
  console.log("filterItemsList(<itemsList>, " + JSON.stringify(filters))
  return itemsList.filter(item =>
    filters['type'].includes(item['__type__']) && 
    isMagicalItem(filters['fantasyMode'], item) &&
    item['cost']['value'] >= filters['price']['minRange'] &&
    item['cost']['value'] <= filters['price']['maxRange']
  ).nameFilter(filters['userInput']['name']
  ).descriptionFilter(filters['userInput']['description']
  ).multiSort(filters['sortKeys']);
};

function getTitles(item) {
  titleArray = item['name'].split(/, | - /)

  if (titleArray.length > 1) {
    return [titleArray[0], titleArray[1]];
  } else {
    return [titleArray[0], '']
  }
};

function saveCart(cart) {
  sessionStorage.setItem("COF-Cart", JSON.stringify(cart));
};

function loadCart() {
  sessionData = sessionStorage.getItem("COF-Cart");
  console.log("Load cart from session");
  if (sessionData == null) {
    return([])
  } else {
    return(JSON.parse(sessionData));
  }
};

function saveFilter(filter) {
  console.log("Save filter to session : " + JSON.stringify(filter));
  sessionStorage.setItem("COF-Filter", JSON.stringify(filter));
};

function loadFilter(defaultFilter) {
  sessionData = sessionStorage.getItem("COF-Filter");
  if (sessionData == null) {
    return(defaultFilter)
  } else {
    console.log("Load filter from session : " + sessionData);
    return(JSON.parse(sessionData));
  }
};

function sortType(ta, tb){
  var x = ta.type.toLowerCase();
  var y = tb.type.toLowerCase();
  if (x < y) {return -1;}
  if (x > y) {return 1;}
  return 0;
};

function getNames(a) {
  return(a.map(i => {return(i.name);}));
}