'use strict'

const App = {
    ppURL: null,

    async renderPP(disabled){
        for(const item of document.querySelectorAll('img')){
            if(/https:\/\/fotograf\.sabis\.subu\.edu\.tr\/Fotograf\/.*/gi.test(item.src)){
                if(disabled){
                    App.ppURL = item.src
                    item.src = 'REMOVED'
                }
            }else if(!disabled && /REMOVED/gi.test(item.src)){
                if(App.ppURL){
                    item.src = this.ppURL
                }
            }
        }
    },

    async scrapeLMS(){
        const query = document.querySelectorAll('div.widget-box.transparent > div.widget-body > .widget-main > table > tbody > .HTool')
        const syllabus = Array.from(query).map((tr) => {
            const course = tr.querySelector('td:first-child > a')
            const calendar = tr.querySelector('td:nth-child(3) > span')

            return {
                url: course.href,
                name: toTitleFormat(course.innerText),
                date: calendar.innerText
            }
        })

        await setOption('syllabus', syllabus)
    }
}

if(typeof module !== 'undefined'){
    module.exports = App
}
