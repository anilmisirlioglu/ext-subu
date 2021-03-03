'use strict'

const {
    open,
    getOption,
    setOption,
    promisify,
    sendMessage,
} = Utils

const initHeader = async () => {
    setExtensionStatus(await getOption('disabled', false))

    document
        .querySelector('.header-switch--disabled')
        .addEventListener('click', async() => {
            await setOption('disabled', false)

            setExtensionStatus(false)
        })

    document
        .querySelector('.header-switch--enabled')
        .addEventListener('click', async() => {
            await setOption('disabled', true)

            setExtensionStatus(true)
        })

    document
        .querySelector('.header-settings')
        .addEventListener('click', () => open('chrome://extensions/?id=' + chrome.runtime.id))
}

const setExtensionStatus = enabled => {
    if(enabled){
        document
            .querySelector('.header-switch--enabled')
            .classList.add('switch-hidden')
        document
            .querySelector('.header-switch--disabled')
            .classList.remove('switch-hidden')
    }else{
        document
            .querySelector('.header-switch--enabled')
            .classList.remove('switch-hidden')
        document
            .querySelector('.header-switch--disabled')
            .classList.add('switch-hidden')
    }
}

const initOptions = async () => {
    renderPPUI(await getOption('pp', false))

    document
        .getElementById('pp-disabled')
        .addEventListener('click', async() => {
            await setOption('pp', true)

            renderPPUI(true)
        })

    document
        .getElementById('pp-enabled')
        .addEventListener('click', async() => {
            await setOption('pp', false)

            renderPPUI(false)
        })
}

const renderPPUI = status => {
    Popup.renderHTML(status)

    if(status){
        document
            .getElementById('pp-enabled')
            .classList.remove('switch-hidden')
        document
            .getElementById('pp-disabled')
            .classList.add('switch-hidden')
    }else{
        document
            .getElementById('pp-enabled')
            .classList.add('switch-hidden')
        document
            .getElementById('pp-disabled')
            .classList.remove('switch-hidden')
    }
}

const Popup = {
    async init(){
        await Promise.all([
            initHeader(),
            initOptions()
        ])

        Array.from(document.querySelectorAll('a')).forEach((a) =>
            a.addEventListener('click', (event) => {
                event.preventDefault()

                open(a.href)

                return false
            })
        )
    },

    // TODO(anilmisirlioglu)::Direct run code block, dont give of payload parameter
    renderHTML: payload => {
        chrome.windows.getCurrent({ populate: true }, currentWindow => {
            chrome.tabs.query({
                currentWindow: true,
                active: true,
                url: [
                    'http://*.subu.edu.tr/*',
                    'https://*.subu.edu.tr/*'
                ]
            }, tabs => {
                for(const tab of tabs){
                    chrome.tabs.executeScript(tab.id, {
                        code: `App.renderPP(${payload})`
                    })
                }
            })
        })
    },

    driver(func, args){
        return sendMessage('popup.js', func, args)
    },

    /**
     * Log debug messages to the console
     * @param {String} message
     */
    log(message){
        Popup.driver('log', message).then(void 0)
    }
}

// Init Popup
if(/complete|interactive|loaded/.test(document.readyState)){
    Popup.init().then(void 0)
}else{
    document.addEventListener('DOMContentLoaded', Popup.init)
}
