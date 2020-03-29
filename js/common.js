Vue.component('cofbazar-header', {
    computed: {
        menuList: function() {
          return cofConfig['headers']['data'];
        }
    },
    template: `<div>  
                 <div class="app-header">
                   <img class="header" src="images/common/header.png"/>
                   <a class="header" 
                      href="https://github.com/cofbazar/cofbazar.github.io/blob/master/README.md">
                     Mentions légales
                   </a>
                 </div>
                 <div class="app-menu">
                   <a v-for="menu in menuList" 
                      v-bind:href="menu.url" 
                      class="app-menu">{{menu.label}}</a>
                 </div>
               </div>`
});

new Vue({ el: '#app-header' });

Vue.component('cofbazar-footer', {
    computed: {
        blockList: function() {
          return cofConfig['footers']['data'];
        }
    },
    template: `<div class="app-footer">
                 <label class="footer">Powered by</label>
                 <div v-for="block in blockList">
                   <a v-bind:href="block.url">
                     <img class="footer" 
                          v-bind:src="'images/common/' + block.image"
                          v-bind:title="block.title"/>
                   </a>
                 </div>
               </div>`

});

new Vue({ el: '#app-footer' });