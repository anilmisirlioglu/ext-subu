'use strict'

const {
    open,
    getOption,
    setOption,
    promisify,
    sendMessage,
} = Utils

const initHeader = async () => {
    setExtensionStatus(await getOption('disabled'))

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
        .addEventListener('click', () => chrome.tabs.create({
            url: 'chrome://extensions/?id=' + chrome.runtime.id
        }))
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
    setPPStatus(await getOption('pp-disabled'))

    document
        .getElementById('pp-disabled')
        .addEventListener('click', async() => {
            await setOption('pp-disabled', false)

            setPPStatus(false)
        })

    document
        .getElementById('pp-enabled')
        .addEventListener('click', async() => {
            await setOption('pp-disabled', true)

            setPPStatus(true)
        })
}

const setPPStatus = status => {
    if(status){
        document
            .getElementById('pp-enabled')
            .classList.add('switch-hidden')
        document
            .getElementById('pp-disabled')
            .classList.remove('switch-hidden')
    }else{
        document
            .getElementById('pp-enabled')
            .classList.remove('switch-hidden')
        document
            .getElementById('pp-disabled')
            .classList.add('switch-hidden')
    }
}

const Popup = {
    async init(){
        // Templates
        Popup.templates = Array.from(
            document.querySelectorAll('[data-template]')
        ).reduce((templates, template) => {
            templates[template.dataset.template] = template.cloneNode(true)

            template.remove()

            return templates
        }, {})

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
