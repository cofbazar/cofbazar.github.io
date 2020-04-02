var itemList = new Vue({
    el: '#app',
    data: {
      pageIndex: 0,
      items: [],
      itemCount: 0
    },
    methods: {
      getISProperties: function(item) {
        var isproperties = []
        if (item.attack != null) {
          if (item.attack.critical != "20") {
            isproperties.push(
              {"name": "critical", "value": "[" + item.attack.critical + "]", "icon": true}
            );
          }
          if (item.attack.range != null) {
            isproperties.push(
              {"name": "range", "value": item.attack.range.value + item.attack.range.unit, "icon": true}
            );
          }
          if (item.attack.area != null) {
            isproperties.push(
              {"name": "area", "value": item.attack.area.value + item.attack.area.unit, "icon": true}
            );
          }
        }
        if (item.defense != null) {
          item.defense.filter(m => (m.label == "RD") && (m.limitation == null) ).forEach(
            rd => isproperties.push(
              {"name": "rd-" + rd.target, "value": rd.count, "icon": true}
            )
          )
        }
        if (item.skill != null) {
          item.skill.filter(m => 
              (m.label == "Test") && 
              (getNames(cofConfig['skills']['data'].filter(s => s.iconify)).includes(m.target))
            ).forEach(skill => {
              isproperties.push({"name": skill.target, "value": skill.mtype + skill.count, "icon": true});
            }
          )
        }
        if (item.range != null) {
          isproperties.push(
            {"name": "range", "value": item.range.value + item.range.unit, "icon": true}
          );
        }
        if (item.area != null) {
          isproperties.push(
            {"name": "area", "value": item.area.value + item.area.unit, "icon": true}
          );
        }
        if (item.duration != null) {
          isproperties.push(
            {"name": "duration", "value": item.duration.value + item.duration.unit, "icon": true}
          );
        }
        if (item.skill != null) {
          item.skill.filter(m => 
              (m.label == "Test") && 
              (getNames(cofConfig['abilities']['data']).includes(m.target))
            ).forEach(skill => {
              isproperties.push({"name": skill.target, "value": skill.mtype + skill.count, "icon": false});
            }
          )
        }
        return(isproperties);
      },
    },
    mounted () {
      console.time("COF cart loaded");
      cart = loadCart();
      this.items.push([]);
      count = 0;
      cart.forEach(item => {
        itype = cofConfig['items']['data'].find(t => t['name'] === item['__type__']);
        item['ticon'] = itype['icon'];
        item['tlabel'] = itype['label'];
        item['tdescription'] = itype['description'];
        item['displayFullDescription'] = false;
        [item['title'], item['subtitle']] = getTitles(item);

        if ((item.hasOwnProperty("skill")) && (item.skill != null)) {
          item.skill.filter(s => 
            !(s.label === "Test" && 
              getNames(cofConfig['skills']['data'].filter(sk => sk.iconify)).includes(s.target)) &&
            !(s.label === "Test" &&
              getNames(cofConfig['abilities']['data']).includes(s.target)
          )).forEach(skill => 
            item.special_property.push(
              skill.label + " " + skill.target + " : " + skill.mtype + skill.count + (skill.die == null? "" : "d" + skill.die)
            )
          );
        }

        for (i=0; i<item['count']; i++) {
          if (count > 35) {
            this.items.push([]);
            this.pageIndex++;
            count = 0;
          }
          count++;
          this.items[this.pageIndex].push(item);
          this.itemCount++;
        }
      });
      //console.log("Items ( "+ this.itemCount + " ): " + JSON.stringify(this.items));
      console.timeEnd("COF cart loaded");
    }
  });