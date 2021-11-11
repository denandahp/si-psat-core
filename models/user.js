const debug = require('debug')('app:model:user');
const encryptPassword = require('../libs/secret').encryptPassword;
const format_date = require('../models/param/utils');
const pool = require('../libs/db');


var date = format_date.date_now();

const schema = '"pengguna"';
const db_pengguna = schema + '.' + '"pengguna"';
const db_kepemilikan = schema + '.' + '"info_kepemilikan"';


class UserModel {
  async login (username, password) {
    try{
      let response = {};
      let pengguna, info_kepemilikan;
      pengguna = await pool.query('SELECT * from ' + db_pengguna + ' where username = $1 and password = $2', [username, password]);
      debug('login %o', res);
  
      if (pengguna.rowCount <= 0) {
        info_kepemilikan = await pool.query('SELECT * from ' + db_kepemilikan + ' where id=&1', [pengguna.rows[0].info_kepemilikan]);
        throw 'login fail';
      } else {
        response.pengguna = pengguna.rows[0];
        response.info_kepemilikan = info_kepemilikan.rows[0];
        return {status:200, data: response};
      }
    }catch (ex) {
      console.log('Enek seng salah iki ' + ex);
      return { status: '400', Error: ex.message };
    };
  }

  async register(data) {
    try {
        let response = {};
        let data_kepemilikan = [data.username, data.password, '01', data.nomor_identitas, data.nama, data.email, data.alamat, 
                                data.telp, 'Y', '11', data.flag_umk, data.jenis_perseroan, data.flag_migrasi, data.npwp_perseroan];
        let info_kepemilikan = await pool.query(
          'INSERT INTO ' + db_kepemilikan + '(username, password, jenis_identitas, nomor_identitas, nama, email, '+
          'alamat, telp, status, role, flag_umk, jenis_perseroan, flag_migrasi, npwp_perseroan)' +
          'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *', data_kepemilikan);
        let data_pengguna = [info_kepemilikan.rows[0].id, username, password, date, date];
        let pengguna = await pool.query(
          'INSERT INTO ' + db_pengguna + '(info_kepemilikan, username, password, created, update)' +
          'VALUES ($1, $2, $3, $4, $5) RETURNING *', data_pengguna);
        response.pengguna = pengguna.rows[0];
        response.info_kepemilikan = info_kepemilikan.rows[0];
        debug('get %o', response);
        return {status:200, data: response};
    } catch (ex) {
        console.log('Enek seng salah iki ' + ex);
        return { status: '400', Error: "" + ex };
    };
  }

  async edit (data) {
    let res, sets = [data.id, data.name];

    if (data.password !== '') {
      sets.push(encryptPassword(data.password, data.username));
    }

    if (data.password) {
      res = await pool.query('UPDATE ' + dbTable + ' SET (name, password) = ($2, $3) WHERE id = $1', sets);
    } else {
      res = await pool.query('UPDATE ' + dbTable + ' SET (name) = ($2) WHERE id = $1', sets);
    }

    debug('edit %o', res);
    
    if (res.rowCount <= 0) {
      throw 'login fail';
    } else {
      return res;
    }
  }

  async delete (data) {

    let id = data.id;
    let username = data.username;
    let column = (id === undefined) ? 'username' : 'id';

    const res = await pool.query('DELETE from ' + dbTable + ' where ' + column + ' = $1 RETURNING id, name, username', [(id || username)]);

    debug('delete %o', res);

    return res;
  }

  async get (id) {

    let res;

    if (id === undefined) {
      res = await pool.query('SELECT id, name, username from ' + dbTable + ' ORDER BY id ASC')
    } else {
      res = await pool.query('SELECT id, name, username from ' + dbTable + ' where id = $1 ORDER BY id ASC', [id]);
    }

    debug('get %o', res);

    return res;
    
  }
}

module.exports = new UserModel();