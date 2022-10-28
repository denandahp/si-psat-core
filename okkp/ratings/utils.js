const utils = require('../../models/param/utils.js');

var date = utils.date_now();


exports.serialize_ratings = (data, process) => {
    let serialize = {
        "nama" : data.nama,
        "ratings" : data.ratings,
        "no_hp" : data.no_hp,
        "note" : data.note,
        "title" : data.title,
        "type" : data.type,
        "link" : data.link,
        "updated_at" : date,
    }

    if(process == 'created'){
        serialize.created_at = date
    }

    let key = Object.keys(serialize).toString()
    let value = Object.values(serialize)
    return {key, value}
}