const pool = require('../libs/okkp_db.js');
const utils = require('../models/param/utils.js');


exports.pagination = async(page_query, limit_query, filter, data, query_select, database) => {
    let page = parseInt(page_query);
    let limit = parseInt(limit_query);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    let counts, res, results = {},
        err = [];
    var date = utils.date_now();
    try {
        counts = await pool.query('SELECT COUNT (*)  FROM ' + database + ` WHERE ${filter} `, data);
        if (endIndex <= counts.rows[0].count) {
            results.next = {
                page: page + 1,
                limit: limit
            }
        } else if (endIndex >= counts.rows[0].count) {
            results.next = {
                page: page + 1,
                limit: 0
            }
        } else { throw new Error('data kosong'); };

        if (startIndex > 0) {
            results.previous = {
                page: page - 1,
                limit: limit
            }
        } else { results.previous = { page: 0, limit: limit } };
        results.total_query = counts.rows[0].count;
        results.max_page = Math.ceil(counts.rows[0].count / limit);
        res = await pool.query(`SELECT ${query_select} FROM ${database} WHERE ${filter} ORDER BY created_at DESC OFFSET ${startIndex} LIMIT ${limit};`, data);
        results.query = res.rows;
        results.date = date;
        return results;
    } catch (ex) {
        console.log('Enek seng salah iki ' + ex);
        return { "error": "data" + ex, "res": err };
    };
}