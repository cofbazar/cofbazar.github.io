var itemList = new Vue({
    el: '#card-help',
    data: {
        helpCategories: [
            "flavors", "flavors-material", "attacks", "damages",
            "defenses", "rds", "skills", "special-properties", 
            "guis", "character-sheet"
        ],
        cf: cofConfig
    },
    method:{
        getCategoryData: function(c) {
            return cofConfig[c]["data"];
        },
        getCategoryLabel: function(c) {
            return cofConfig[c]["label"];
        },
    }
});