'use strict'

const Utils = {
    agent: chrome.extension.getURL('/').startsWith('moz-')
        ? 'firefox'
        : chrome.extension.getURL('/').startsWith('safari-')
            ? 'safari'
            : 'chrome',

    /**
     * Use promises instead of callbacks
     * @param {Object} context
     * @param {String} method
     * @param  {...any} args
     */
    promisify(context, method, ...args){
        return new Promise((resolve, reject) => {
            context[method](...args, (...args) => {
                if(chrome.runtime.lastError){
                    return reject(chrome.runtime.lastError)
                }

                resolve(...args)
            })
        })
    },

    /**
     * Open a browser tab
     * @param {String} url
     * @param {Boolean} active
     */
    open(url, active = true){
        chrome.tabs.create({ url, active })
    },

    /**
     * Get value from local storage
     * @param {String} name
     * @param {string|boolean|null|Array} defaultValue
     */
    async getOption(name, defaultValue = null){
        try{
            const option = await Utils.promisify(chrome.storage.local, 'get', name)

            if(option[name] !== undefined){
                return option[name]
            }
        }catch(error){
            console.error('SUBÜ | utils |', error)
        }

        return defaultValue
    },

    /**
     * Set value in local storage
     * @param {string} name
     * @param {string|boolean|Array} value
     */
    async setOption(name, value){
        try{
            await Utils.promisify(chrome.storage.local, 'set', {
                [name]: value
            })
        }catch(error){
            console.error('SUBÜ | utils |', error)
        }
    },

    /**
     * String convert to title format
     * @param {string} str
     * @return string
     */
    toTitleFormat(str){
        return str.replace(/İ*\w\S*/g, text => {
            return text.charAt(0).toLocaleUpperCase('tr-TR') + text.substr(1).toLocaleLowerCase('tr-TR')
        })
    },

    sendMessage(source, func, args){
        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage(
                {
                    source,
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
    },

    globEscape(string){
        return string.replace(/\*/g, '\\*')
    }
}
