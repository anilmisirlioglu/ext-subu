const {
    getOption,
    setOption,
    toTitleFormat
} = Utils

const Content = {
    async init(){
        const appStatus = await getOption('disabled', false)
        if(!appStatus){
            await App.renderPP(await getOption('pp', true))

            Content.fixUI()

            await getOption('syllabus', null) || await App.scrapeLMS()
        }
    },

    fixUI(){
        if(/lms/gi.test(window.location.href)){
            // LMS Options Menu UI Fixer
            Array.from(document.querySelectorAll('.profile-contact-links')).forEach((box) => {
                box.style['margin-right'] = '10px'
                box.style['margin-left'] = '10px'
            })
        }else if(/sabis/gi.test(window.location.href)){
            // SABIS Lessons Page UI Fixer
            document
                .querySelector('#wrap > div.container > div.row')
                .style['margin-left'] = '10px'
        }
    },

    driver(func, args){
        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage(
                {
                    source: 'content.js',
                    func,
                    args: args ? (Array.isArray(args) ? args : [args]) : [],
                },
                (response) => {
                    chrome.runtime.lastError
                        ? reject(new Error(chrome.runtime.lastError.message))
                        : resolve(response)
                }
            )
        })
    }
}

if(/complete|interactive|loaded/.test(document.readyState)){
    Content.init().then(void 0)
}else{
    document.addEventListener('DOMContentLoaded', Content.init)
}
