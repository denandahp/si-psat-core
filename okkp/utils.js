const constant = require('./constant')
const dotenv = require('dotenv');
const excelJS = require("exceljs");
const format_date = require('../models/param/utils.js');
const fs = require('fs');
const path = require('path');
const pool = require('../libs/okkp_db.js');
const utils = require('../models/param/utils.js');

dotenv.config();


exports.pagination = async(page_query, limit_query, filter, data, query_select, database) => {
    let page = parseInt(page_query);
    let limit = parseInt(limit_query);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    let counts, res, results = {},
        err = [];
    var date = utils.date_now();
    try {
        console.log(filter)
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

exports.exports = async(data, keys) => {
    const workbook = new excelJS.Workbook();  // Create a new workbook
    const worksheet = workbook.addWorksheet("Sheet"); // New Worksheet

    var date = format_date.time_format(), dir;
    if(process.env.NODE_ENV == 'LOKAL'){
        dir = path.join(process.cwd(), `/media/exports/${date}/`);
    } else {
        dir = `si-psat-core/media/exports/${date}/`;
    };

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    // Column for data in excel. key must match data key
    const headers_dict = await constant.headers_dict(data[0])
    let column = [{ header: "No", key: "number", width: 10 }, ];
    for(index in keys){
        let worksheet_column = {
            header: headers_dict[keys[index]],
            key: keys[index],
            width: 10}
        column.push(worksheet_column)
    }
    worksheet.columns = column;

    // Looping through User data
    let counter = 1;
    data.forEach((registrasi) => {
        registrasi.number = counter;
        worksheet.addRow(registrasi); // Add data in worksheet
        counter++;
    });

    // Making first line in excel bold
    worksheet.getRow(1).eachCell((cell) => {cell.font = { bold: true };});
    let name_file = `Export-${Object.values(data[0])[0]}-${date}.xlsx`
    dir = dir + name_file

    return {workbook, dir}
}