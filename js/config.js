var cofConfig = {
  "headers": {
    "data": [
      {"name": "items", "label": "Objets", "url": "index.html"},
      {"name": "cards", "label": "Cartes", "url": "cards.html"},
      {"name": "resources", "label": "Ressources", "url": "resources.html"},
    ]
  },
  "dataUrl": 'data/',
  "items": {
    "data" : [
      {"name": "Armor", "label": "Armures", "description": "Armure", "file": "armors.json", "icon": "armors.png"},
      {"name": "Bracer", "label": "Bracelets", "description": "Bracelet de défense", "file": "bracers.json", "icon": "bracers.png"},
      {"name": "Char", "label": "Chariots", "description": "Chariot", "file": "chars.json", "icon": "chars.png"},
      {"name": "Cloak", "label": "Capes", "description": "Cape de protection", "file": "cloaks.json", "icon": "cloaks.png"},
      {"name": "Helmet", "label": "Casques", "description": "Casque", "file": "helmets.json", "icon": "helmets.png"},
      {"name": "Inn", "label": "Auberge", "description": "Consommation d'auberge", "file": "inns.json", "icon": "inns.png"},
      {"name": "MagicalWand", "label": "Baguettes", "description": "Baguette magique", "file": "magicalwands.json", "icon": "magicalwands.png"},
      {"name": "Material", "label": "Matériels", "description": "Matériel", "file": "materials.json", "icon": "materials.png"},
      {"name": "Mount", "label": "Montures", "description": "Monture", "file": "mounts.json", "icon": "mounts.png"},
      {"name": "Potion", "label": "Potions", "description": "Potion", "file": "potions.json", "icon": "potions.png"},
      {"name": "RealEstate", "label": "Biens", "description": "Bien immobilier", "file": "realestates.json", "icon": "realestates.png"},
      {"name": "Ring", "label": "Anneaux", "description": "Anneau de protection", "file": "rings.json", "icon": "rings.png"},
      {"name": "Robe", "label": "Robes", "description": "Robe de mage", "file": "robes.json", "icon": "robes.png"},
      {"name": "Shield", "label": "Boucliers", "description": "Bouclier", "file": "shields.json", "icon": "shields.png"},
      {"name": "Spell", "label": "Parchemins", "description": "Parchemin", "file": "spells.json", "icon": "spells.png"},
      {"name": "Weapon", "label": "Armes", "description": "Armes", "file": "weapons.json", "icon": "weapons.png"},
    ]
  },
  "units": {
    "cost": "pa",
    "people": "h"
  },
  "areas": {
    "label": "Agglomérations",
    "data": [
      {"name": "village", "label": 'Village', "people": 500, "cost-max" : "200"},
      {"name": "borough", "label": 'Bourg', "people": 2000, "cost-max" : "2000"},
      {"name": "town", "label": 'Ville', "people": 8000, "cost-max" : "10000"},
      {"name": "city", "label": 'Cité', "people": 30000,"cost-max" : "30000"},
      {"name": "megalopolis", "label": 'Mégapole', "people": 100000, "cost-max" : "50000"},
      {"name": "notSelected", "cost-max" : -1.0}
    ]
  },
  "abilities": {
    "data": [
      {"name": "DEX", "label": "Dextérité"},
      {"name": "FOR", "label": "Force"},
      {"name": "CON", "label": "Constitution"},
      {"name": "INT", "label": "Intelligence"},
      {"name": "SAG", "label": "Sagesse"},
      {"name": "CHA", "label": "Charisme"}
    ],
    "label": "Caractéristiques"
  },
  "attacks": {
    "data": [
      {"name": "melee", "label": "Attaque au contact"},
      {"name": "ranged", "label": "Attaque à distance"},
      {"name": "magical", "label": "Attaque magique"},
    ],
    "prefix": "attack-",
    "label": "Attaques"
  },
  "damages": {
    "data": [
      {"name": "acid", "label": "Dégât d'acide", "iconify": true},
      {"name": "blunt", "label": "Dégât contondant", "iconify": false},
      {"name": "coldness", "label": "Dégât de froid", "iconify": true},
      {"name": "fire", "label": "Dégât de feu", "iconify": true},
      {"name": "lightning", "label": "Dégât de foudre", "iconify": true},
      {"name": "punctured", "label": "Dégât perforant", "iconify": false},
      {"name": "sharp", "label": "Dégât tranchant", "iconify": false},
    ],
    "prefix": "damage-",
    "label": "Dégats"
  },
  "defenses" : {
    "data": [
      {"name": "defense", "label": "Défense"}
    ],
    "prefix": "",
    "label": "Défenses"
  },
  "character-sheet" : {
    "data": [
      {"name": "pv", "label": "Points de vie (PV)"},
      {"name": "life-die", "label": "Dé de vie"},
      {"name": "level", "label": "Niveau"},
      {"name": "initiative", "label": "Initiative"}
    ],
    "prefix": "",
    "label": "Feuille de personnage"
  },
  "guis" : {
    "data": [
      {"name": "add", "label": "Ajouter l'objet au panier"},
      {"name": "del", "label": "Supprimer l'objet du panier"},
      {"name": "reset-filter", "label": "Réinitialiser tous les filtres"},
      {"name": "reset-cart", "label": "Vider tout le panier"},
      {"name": "add-all-visible", "label": "Ajouter tous les objets visibles au panier"}
    ],
    "prefix": "../gui/",
    "label": "Interface"
  },
  "flavors": {
    "data": [
      {"name": "acid", "label": "Objet élémentaire d'acide"},
      {"name": "coldness", "label": "Objet élémentaire de froid"},
      {"name": "fire", "label": "Objet élémentaire de feu"},
      {"name": "lightning", "label": "Objet élémentaire de foudre"},
      {"name": "daemon-scourge", "label": "Objet magique fléau des démons"},
      {"name": "dead-scourge", "label": "Objet fléau des morts-vivants"},
      {"name": "dragon-scourge", "label": "Objet fléau des dragons"},
      {"name": "goblin-scourge", "label": "Objet fléau des gobelins"},
      {"name": "quality", "label": "Objet de qualité"},
      {"name": "magical", "label": "Objet magique"},
      {"name": "free-action", "label": "Objet de libre action"},
      {"name": "defense", "label": "Objet de défense"},
      {"name": "magical-resistance", "label": "Objet de résistance à la magie"},
      {"name": "protective", "label": "Objet de protection"},
      {"name": "shadow", "label": "Objet de l'ombre"},
      {"name": "sharp", "label": "Objet affuté"},
      {"name": "swimming", "label": "Objet de natation"},
    ],
    "prefix": "flavor-",
    "label": "Variante d'objet"
  },
  "flavors-material": {
    "data": [
      {"name": "adamantium", "label": "Objet en adamantium"},
      {"name": "cold-iron", "label": "Objet en fer froid"},
      {"name": "dalberath", "label": "Objet en dalberath"},
      {"name": "durium", "label": "Objet en durium"},
      {"name": "hybberium", "label": "Objet en hybberium"},
      {"name": "laenk", "label": "Objet en laënk"},
      {"name": "lothar", "label": "Objet en lothar"},
      {"name": "mythral", "label": "Objet en mythral"},
      {"name": "phospharium", "label": "Objet en phospharium"},
      {"name": "silver", "label": "Objet en argent"},
      {"name": "sombracier", "label": "Objet en sombracier"},
      {"name": "xylene", "label": "Objet en xylène"},
    ],
    "prefix": "flavor-",
    "label": "Variante de matériaux"
  },
  "skills": {
    "data": [
      {"name": "paralysed-resistance", "label": "Résistance à la paralysie", "iconify": true, "textify": true},
      {"name": "slowdown-resistance", "label": "Résistance au ralentissement", "iconify": true, "textify": true},
      {"name": "immobilized-resistance", "label": "Résistance à l'immobilisation", "iconify": true, "textify": true},
      {"name": "swimming", "label": "Test de natation", "iconify": true, "textify": true},
      {"name": "shadow", "label": "Test de discrétion", "iconify": true, "textify": true},
      {"name": "magical-resistance", "label": "Résistance à la magie", "iconify": true, "textify": true},
    ],
    "prefix": "icon-special-property-",
    "label": "Compétences"
  },
  "special-properties": {
    "data": [
      {"name": "area", "label": "Zone d'effet"},
      {"name": "range", "label": "Distance"},
      {"name": "critical", "label": "Plage de critique"},
      {"name": "duration", "label": "Durée de l'effet"},
    ],
    "prefix": "icon-special-property-",
    "label": "Propriétés spéciales"
  },
  "rds": {
    "data": [
      {"name": "", "label": "Réduction des dégâts"},
      {"name": "acid", "label": "Réduction des dégâts d'acide"},
      {"name": "coldness", "label": "Réduction des dégâts de froid"},
      {"name": "fire", "label": "Réduction des dégâts de feu"},
      {"name": "lightning", "label": "Réduction des dégâts de foudre"},
      {"name": "natural", "label": "Réduction des dégâts naturels"},
      {"name": "poison", "label": "Réduction des dégâts de poison"},
    ],
    "prefix": "icon-special-property-rd-",
    "label": "Résistances aux dégats"
  },
  "footers": {
    "data": [
      {"name": "drs", "title": "Document de Référence Système", "image": "drs.png", "url": "http://co-drs.org/"},
      {"name": "noob", "title": "NoobliéesChroniques", "image": "noob.png", "url" : "https://nooblieeschroniques.fr"},
      {"name": "gameicons", "title": "Game-icons.net", "image": "gameicons.png", "url": "https://game-icons.net/"},
      {"name": "ogl", "title": "Open Game Licence", "image": "ogl.png", "url": "http://www.opengamingfoundation.org/ogl.html"},
      {"name": "bbe", "title": "Black Book Edition", "image": "bbe.png", "url": "https://www.black-book-editions.fr"},
    ]
  }
};
