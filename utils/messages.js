const moment = require("moment")
moment.locale("ru")

function formatMessage(name, text) {
    return {
        name,
        text,
        time: moment().format("LT")
    }
}

module.exports = formatMessage
