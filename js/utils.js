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

Array.prototype.minPrice = function() {
  return this.reduce((min, o) =>
    o.cost.value < min ? o.cost.value : min, this[0].cost.value);
};

Array.prototype.maxPrice = function() {
  return this.reduce((max, o) =>
    o.cost.value > max ? o.cost.value : max, this[0].cost.value);
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
  //            ", " + filterValue + ", " + fantasyMode + ")")
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
