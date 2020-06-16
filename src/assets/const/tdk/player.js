let url = require('url'),
    moment = require('moment');
export default (lang) => {
    let callFunction = {
        en: function () {
            return {
                title: ``,
                meta: [{
                    hid: 'description', name: "description",
                    content: ``
                }]
            }
        }
    };
    return callFunction[lang] || callFunction['en'];
}
