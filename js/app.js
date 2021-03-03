'use strict'

const App = {
    ppURL: null,

    renderPP: async disabled => {
        for(const item of document.querySelectorAll('img')){
            if(/https:\/\/fotograf\.sabis\.subu\.edu\.tr\/Fotograf\/.*/gi.test(item.src)){
                if(disabled){
                    this.ppURL = item.src
                    item.src = 'REMOVED'
                }
            }else if(!disabled && /REMOVED/gi.test(item.src)){
                if(this.ppURL){
                    item.src = this.ppURL
                }
            }
        }
    }
}

if(typeof module !== 'undefined'){
    module.exports = App
}
