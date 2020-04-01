Vue.component('cofbazar-card-iconified-special-property', {
  props: ['isproperties'],
  methods: {
    hasISProperty(p) {
      return(p.length > 0);
    },
  },
  template:
    `<div class="isproperties-container">
      <div class="isproperty-container" v-for="isp in isproperties ">
        <img v-if="isp.icon" class="isproperty-icon"
             v-bind:src="'images/card/icon-special-property-' + isp.name + '.png'">
        <label v-else class="isproperty-text">[{{ isp.name }}]</label>
        <label class="isproperty-text">: {{ isp.value }}</label>
      </div>
    </div>`
});

Vue.component('cofbazar-card-damage-category', {
  props: ['attack'],
  methods: {
    hasAttack(a) {
      return((a != null) && (a.damages != null) && (a.damages.base.length > 0));
    },
    hasDamageCategory(d) {
      return((d.target != null) && (d.target != 'magical'));
    }
  },
  template: 
    `<div v-if="hasAttack(attack)" class="damage-categories-container">
      <div class="damage-category-container" v-for="dm in attack.damages.base">
        <img v-if="hasDamageCategory(dm)"
             class="damage-category-icon" v-for="t in dm.target"
             v-bind:src="'images/card/damage-' + t + '.png'"/>
      </div>
    </div>`
});

Vue.component('cofbazar-card-flavor', {
  props: ['flavors'],
  methods: {
    hasFlavor(a) {
      return(a.length > 0);
    },
  },
  template: 
    `<div v-if="hasFlavor(flavors)" class="flavors-container">
      <div class="flavor-container" v-for="flavor in flavors">
        <img class="flavor-icon" v-for="index in flavor.count"
             v-bind:src="'images/card/flavor-' + flavor.ftype + '.png'"/>
      </div>
    </div>
    <div v-else class="flavors-container">
    </div>`
});

Vue.component('cofbazar-card-big-slot', {
  props: ['use'],
  methods: {
    isBigSlot(u) {
      return((u != null) && ((u == 0) || (u > 5)));
    },
    hasBigSlotLabel(u) {
      return((u != null) && (u > 5));
    },
  },
  template: 
    `<div v-if="isBigSlot(use)" class="big-slot-container">
      <label v-if="hasBigSlotLabel(use)" class="big-slot-container">{{ use }}</label>
    </div>`
});

Vue.component('cofbazar-card-attack', {
    props: ['attack'],
    methods: {
      hasAttack(a) {
        return(a != null);
      },
      attackModToStr: function(a) {
        if (a != null) {
          if (a.mod > 0) {
              return("+" + a.mod + ":");
          } else {
              if (a.mod < 0) {
                  return(a.mod + ":");
              }
          }
        }
        return(":");
      },
      isDamageMagical(d) {
          return((d != null) && (d.target == "magical"));
      },
      hasDamageLimitation(d) {
          return(d.limitation != null);
      },
      hasDamageImage(d) {
          return(
            (d.target != null) && 
            (getNames(cofConfig["damages"]['data'].filter(d => d.iconify)).includes(d.target))
          );
      },
      hasDamageText(d) {
          return((d.target != null) && 
          (getNames(cofConfig["abilities"]['data']).includes(d.target)));
      },
      damageToStr: function(d) {
          dmStr = ""
          if (d.mtype != null) {
              dmStr = dmStr + d.mtype;
          }
          if (d.count != null) {
              dmStr = dmStr + d.count;
          }
          if (d.die != null) {
              dmStr = dmStr + "d" + d.die;
          }
          return(dmStr);
      },
      getDamageLimitations: function(dms) {
        return(dms.filter(dm => this.hasDamageLimitation(dm)));
      } 
    },
    template: 
      `<div v-if="hasAttack(attack)" class="section-container">
        <label class="section-title">Attaque</label>           
        <div class="attack-container">
          <img class="section-bullet" src="images/card/attack-bullet.png"/>
          <img class="attack-icon" v-bind:src="'images/card/attack-' + attack.atype + '.png'"/>
          <label class="attack-modifier">{{ attackModToStr(attack) }}</label>
          <div class="damage-container" v-for="dm in attack.damages.base">
            <label class="damage-modifier">{{ damageToStr(dm) }}</label>
          </div>
          <div class="damage-container" v-for="dm in attack.damages.other">
            <label v-if="isDamageMagical(dm)" class="damage-separator">,</label>
            <label v-if="hasDamageLimitation(dm)" class="damage-limitation">(</label>
            <label v-if="isDamageMagical(dm)" class="damage-magical-modifier">{{ damageToStr(dm) }}</label>
            <label v-else class="damage-modifier">{{ damageToStr(dm) }}</label>
            <img v-if="hasDamageImage(dm)" class="damage-icon" 
                v-bind:src="'images/card/damage-' + dm.target + '.png'"/>
            <label v-if="hasDamageText(dm)" class="damage-text-modifier">[{{ dm.target }}]</label>
            <label class="damage-limitation" v-if="hasDamageLimitation(dm)">)*</label>      
          </div>
        </div>
        <div class="damage-limitation-container" 
             v-for="dm in getDamageLimitations(attack.damages.other)">
          <label v-if="hasDamageLimitation(dm)" 
                class="damage-limitation">(*) {{ dm.limitation }}</label>
        </div>      
      </div>`
});

Vue.component('cofbazar-card-defense', {
  props: ['defense'],
  methods: {
    hasDefense(d) {
      return((d != null) && (d.filter(m => m.label=="DEF").map(m => {return(m.count);}).sum() != 0));
    },
    hasDefenseLimitation(d) {
      return(d.limitation != null);
    },
    defenseToStr: function(d) {
        var defStr = ""
        if (d.mtype != null) {
            defStr = defStr + d.mtype;
        }
        if (d.count != null) {
            defStr = defStr + d.count;
        }
        if (d.die != null) {
            defStr = defStr + "d" + d.die;
        }
        return(defStr);
    },
    getDefense: function(d) {
      return(d.filter(m => m.label == "DEF"));

    },
  },
  template: 
    `<div v-if="hasDefense(defense)" class="section-container">
      <label class="section-title">Défense</label>           
      <div class="defense-container">
        <img class="section-bullet" src="images/card/defense-bullet.png"/>
        <img class="defense-icon" v-bind:src="'images/card/defense.png'"/>
        <label class="defense-modifier">: </label>
        <div class="defense-mod-container" v-for="def in getDefense(defense)">
          <label v-if="hasDefenseLimitation(def)" class="defense-limitation">(</label>
          <label v-if="def.count != 0 " class="defense-modifier">{{ defenseToStr(def) }}</label>
          <label v-if="hasDefenseLimitation(def)" class="defense-limitation">)*</label>
        </div>
      </div>
      <div class="defense-limitation-container" v-for="def in defense">
        <label v-if="hasDefenseLimitation(def)" 
              class="defense-limitation">(*) {{ def.limitation }}</label>
      </div>      
    </div>`
});

Vue.component('cofbazar-card-special-property', {
  props: ['sproperties'],
  methods: {
    hasSProperty(p) {
      return(p.length > 0);
    },
  },
  template: 
    `<div v-if="hasSProperty(sproperties)" class="section-container">
      <label class="section-title">Propriété spéciale</label>
      <div class="sproperty" v-for="sp in sproperties">
        <img class="section-bullet-sp" src="images/card/special-property.png"/>
        <label class="sproperty">{{ sp }}</label>
      </div>
    </div>`
});

Vue.component('cofbazar-card-small-slots', {
  props: ['use'],
  methods: {
    hasSmallSlots(u) {
      return((u != null) && (u > 0) && (u <= 5));
    },
  },
  template: 
    `<div v-if="hasSmallSlots(use)" class="section-container">
      <label class="section-title">Utilisations :</label>
      <div class="small-slots-container">
        <div class="small-slot-container" v-for="u in use"></div>
      </div>
    </div>`
});

Vue.component('cofbazar-card-footer', {
    props: ['item'],
    methods: {
      hands(i) {
          if (i.hasOwnProperty('hands')) 
            return(i.hands);
      },
      hasWeight(i) {
          return(i.weight != null);
      },
      hasCost(i) {
          return(i.cost != null);
      }
    },
    template:
      `<div class="card-footer">
        <div class="footer-group-start">
          <img v-if="hands(item) > 0" class="hands-icon" 
              src="images/card/left-hand.png"/>
          <label v-if="hands(item) > 2" 
                class="hands-separator">/</label>
          <img v-if="hands(item) > 2" class="hands-icon" 
              src="images/card/left-hand.png"/>
          <img v-if="hands(item) > 1" class="hands-icon" 
              src="images/card/right-hand.png"/>
        </div>
        <div v-if="hasWeight(item)" class="footer-group-center">
          <p class="weight-text">{{item.weight.value}}</p>
          <img class="weight-icon" src="images/card/weight.png"/>
        </div>
        <div v-if="hasCost(item)" class="footer-group-end">
          <p class="cost-text">{{item.cost.value}}</p>
          <img class="cost-icon" src="images/card/coins.png"/>
        </div>
      </div>`
});