const { renderPP } = App

const { getOption } = Utils

const Content = {
    async init(){
        const appStatus = await getOption('disabled', false)
        if(!appStatus){
            await renderPP(await getOption('pp', true))
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
