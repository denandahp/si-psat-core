const constant = require('./constant')
const dotenv = require('dotenv');
const excelJS = require("exceljs");
const format_date = require('../models/param/utils.js');
const fs = require('fs');
const path = require('path');
const pool = require('../libs/db.js');
const utils = require('../models/param/utils.js');
const core = require('./core.js')

const schema_static = 'okkp_static'
const db_komoditas = schema_static + '.komoditas'

dotenv.config();


exports.pagination = async(page_query, limit_query, filter, data, query_select, database, order_by) => {
    let page = parseInt(page_query);
    let limit = parseInt(limit_query);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    let counts, res, results = {},
        err = [], where;
    var date = utils.date_now();
    let order_by_field = 'created_at'
    let limit_data = 5000
    try {
        if([undefined, null, ' ', ''].includes(filter)){
            where = ' '
        }else{
            where = ` WHERE ${filter} `
        }

        counts = await pool.query('SELECT COUNT (*)  FROM ' + database + ` ${where} LIMIT ${limit_data}`, data);
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
        if(order_by){
            order_by_field = order_by
        }

        res = await pool.query(
            `SELECT ${query_select} FROM ${database} ${where} ORDER BY 
            ${order_by_field} DESC OFFSET ${startIndex} LIMIT ${limit};`, data);
        results.query = res.rows;
        results.date = date;
        return results;
    } catch (ex) {
        return { "error": "data" + ex, "res": err };
    };
}

exports.exports = async(data, keys, nama_prov) => {
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
    if(nama_prov){
        name_file = `${nama_prov[0]}_Export-${Object.values(data[0])[0]}-${date}.xlsx`
    }
    dir = dir + name_file

    return {workbook, dir}
}

exports.mapping_komoditas_dict = async () => {
    let komoditas_dict = {}
    let komoditas = await pool.query(`select * from ${db_komoditas}`)
    for(index in komoditas.rows){
        komoditas_dict[komoditas.rows[index].nama] = {'id' : komoditas.rows[index].id, 'Nama': komoditas.rows[index].nama}
    }

    return komoditas_dict
}

exports.filter_provinsi = async (user) => {
    let provinsi = '';
    let is_superadmin = core.is_superadmin(user);
    if(is_superadmin == false){
        provinsi = `AND ${user.provinsi_id}`
    }

    return provinsi
}