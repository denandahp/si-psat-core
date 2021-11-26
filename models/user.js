const debug = require('debug')('app:model:user');
const encryptPassword = require('../libs/secret').encryptPassword;
const format_date = require('../models/param/utils');
const pool = require('../libs/db');
var format = require('pg-format');
const check_query = require('./param/utils.js');

var date = format_date.date_now();

const schema = '"pengguna"';
const db_pengguna = schema + '.' + '"pengguna"';
const db_kepemilikan = schema + '.' + '"info_kepemilikan"';
const db_sekretariat = schema + '.' + '"info_sekretariat"';
const db_list_sekretariat = schema + '.' + '"list_sekretariat"';


class UserModel {
  async login (username, password) {
    try{
      let response = {};
      let pengguna, info_kepemilikan;
      pengguna = await pool.query('SELECT * from ' + db_pengguna + ' where username = $1', [username]);  
      if (pengguna.rowCount <= 0) {
        throw new Error('User tidak ditemukan.');
      } else {
        if (await password == pengguna.rows[0].password) {
          if (pengguna.rows[0].role == 'PELAKU_USAHA'){
            info_kepemilikan = await pool.query('SELECT * from ' + db_kepemilikan + ' where id=$1', [pengguna.rows[0].info_kepemilikan]);
          }else{
            info_kepemilikan = await pool.query('SELECT * from ' + db_sekretariat + ' where id=$1', [pengguna.rows[0].info_sekretariat]);
          };
          pengguna.rows[0].password = undefined; //undefined gunanya buat ngilangin di res.rows[0]
          response.pengguna = pengguna.rows[0];
          response.detail = info_kepemilikan.rows[0];
          debug('login %o', response);
          return {status:200, data: response};
        } else {
          throw new Error('Password salah.');
        }
      }
    }catch (ex) {
      console.log('Enek seng salah iki ' + ex);
      return { status: '400', Error: ex.message };
    };
  }

  async register_pelaku_usaha(data) {
    try {
        let response = {};
        let data_kepemilikan = [data.username, data.password, '01', data.nomor_identitas, data.nama, data.email, data.alamat, 
                                data.telp, 'Y', '11', data.flag_umk, data.jenis_perseroan, data.flag_migrasi, data.npwp_perseroan];
        let info_kepemilikan = await pool.query(
          'INSERT INTO ' + db_kepemilikan + '(username, password, jenis_identitas, nomor_identitas, nama, email, '+
          'alamat, telp, status, role, flag_umk, jenis_perseroan, flag_migrasi, npwp_perseroan)' +
          'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *', data_kepemilikan);
        let data_pengguna = [info_kepemilikan.rows[0].id, data.username, data.password, date, date];
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

  async register_auditor(data) {
    try {
        let response = {};
        let data_auditor = [
          data.nama, data.photo, data.email, data.no_telp, data.duduk_lembaga,
          data.alamat, true, date ,date];
        let info_auditor = await pool.query(format(
          'INSERT INTO ' + db_sekretariat + '(nama, photo, email, no_telp, duduk_lembaga, alamat, '+
          'status, created, update) VALUES (%L) RETURNING *', data_auditor)
        );
        let data_pengguna = [info_auditor.rows[0].id, data.username, data.password, 'AUDITOR', date, date];
        let pengguna = await pool.query(format(
          'INSERT INTO ' + db_pengguna + '(info_sekretariat, username, password, role, created, update)' +
          'VALUES (%L) RETURNING *', data_pengguna)
        );
        response.pengguna = pengguna.rows[0];
        response.detail = info_auditor.rows[0];
        debug('get %o', response);
        return {status:200, keterangan: `Register tim auditor ${info_auditor.rows[0].nama}`, data: response};
    } catch (ex) {
        console.log('Enek seng salah iki ' + ex);
        return { status: '400', Error: "" + ex };
    };
  }

  async register_tim_komtek(data) {
    try {
        let response = {};
        let data_tim_komtek = [
          data.nama, data.photo, data.email, data.no_telp, data.duduk_lembaga,
          data.alamat, true, date ,date];
        let info_tim_komtek = await pool.query(format(
          'INSERT INTO ' + db_sekretariat + '(nama, photo, email, no_telp, duduk_lembaga, alamat, '+
          'status, created, update) VALUES (%L) RETURNING *', data_tim_komtek)
        );
        let data_pengguna = [info_tim_komtek.rows[0].id, data.username, data.password, 'TIM_KOMTEK', date, date];
        let pengguna = await pool.query(format(
          'INSERT INTO ' + db_pengguna + '(info_sekretariat, username, password, role, created, update)' +
          'VALUES (%L) RETURNING *', data_pengguna));
        response.pengguna = pengguna.rows[0];
        response.detail = info_tim_komtek.rows[0];
        debug('get %o', response);
        return {status:200, keterangan: `Register tim komtek ${info_tim_komtek.rows[0].nama}`, data: response};
    } catch (ex) {
        console.log('Enek seng salah iki ' + ex);
        return { status: '400', Error: "" + ex };
    };
  }

  async register_superadmin(data) {
    try {
        let response = {};
        let data_superadmin = [
          data.nama, data.photo, data.email, data.no_telp, data.duduk_lembaga,
          data.alamat, true, date ,date];
        let info_superadmin = await pool.query(format(
          'INSERT INTO ' + db_sekretariat + '(nama, photo, email, no_telp, duduk_lembaga, alamat, '+
          'status, created, update) VALUES (%L) RETURNING *', data_superadmin)
        );
        let data_pengguna = [info_superadmin.rows[0].id, data.username, data.password, 'SUPERADMIN', date, date];
        let pengguna = await pool.query(format(
          'INSERT INTO ' + db_pengguna + '(info_sekretariat, username, password, role, created, update)' +
          'VALUES (%L) RETURNING *', data_pengguna));
        response.pengguna = pengguna.rows[0];
        response.detail = info_superadmin.rows[0];
        debug('get %o', response);
        return {status:200, keterangan: `Register superamin ${info_superadmin.rows[0].nama}`, data: response};
    } catch (ex) {
        console.log('Enek seng salah iki ' + ex);
        return { status: '400', Error: "" + ex };
    };
  }

  async update_auditor(data) {
    try {
        let response = {};
        let data_pengguna = [data.username, data.password, date];
        let pengguna = await pool.query(format(
          'UPDATE ' + db_pengguna + ' SET (username, password, update)' +
          `= (%L) WHERE id=${data.id_user} AND role='AUDITOR' RETURNING *`, data_pengguna));
        check_query.check_queryset(pengguna);
        let data_auditor = [
          data.nama, data.photo, data.email, data.no_telp, data.duduk_lembaga,
          data.alamat, data.status ,date];
        let info_auditor = await pool.query(format(
          'UPDATE ' + db_sekretariat + ' SET (nama, photo, email, no_telp, duduk_lembaga, alamat, '+
          `status, update) = (%L) WHERE id=${pengguna.rows[0].info_sekretariat} RETURNING *`, data_auditor)
        );
        check_query.check_queryset(info_auditor);
        response.pengguna = pengguna.rows[0];
        response.detail = info_auditor.rows[0];
        debug('get %o', response);
        return {status:200, keterangan: `Update data auditor ${info_auditor.rows[0].nama}`, data: response};
    } catch (ex) {
        console.log('Enek seng salah iki ' + ex);
        return { status: '400', Error: "" + ex };
    };
  }

  async update_tim_komtek(data) {
    try {
      let response = {};
      let data_pengguna = [data.username, data.password, date];
      let pengguna = await pool.query(format(
        'UPDATE ' + db_pengguna + ' SET (username, password, update)' +
        `= (%L) WHERE id=${data.id_user} AND role='TIM_KOMTEK' RETURNING *`, data_pengguna));
      check_query.check_queryset(pengguna);
      let data_tim_komtek = [
        data.nama, data.photo, data.email, data.no_telp, data.duduk_lembaga,
        data.alamat, data.status ,date];
      let info_tim_komtek = await pool.query(format(
        'UPDATE ' + db_sekretariat + ' SET (nama, photo, email, no_telp, duduk_lembaga, alamat, '+
        `status, update) = (%L) WHERE id=${pengguna.rows[0].info_sekretariat} RETURNING *`, data_tim_komtek)
      );
      check_query.check_queryset(info_tim_komtek);
      response.pengguna = pengguna.rows[0];
      response.detail = info_tim_komtek.rows[0];
      debug('get %o', response);
      return {status:200, keterangan: `Update data tim komtek ${info_tim_komtek.rows[0].nama}`, data: response};
    } catch (ex) {
        console.log('Enek seng salah iki ' + ex);
        return { status: '400', Error: "" + ex };
    };
  }

  async update_superadmin(data) {
    try {
      let response = {};
      let data_pengguna = [data.username, data.password, date];
      let pengguna = await pool.query(format(
        'UPDATE ' + db_pengguna + ' SET (username, password, update)' +
        `= (%L) WHERE id=${data.id_user} AND role='SUPERADMIN' RETURNING *`, data_pengguna));
      check_query.check_queryset(pengguna);
      let data_superadmin = [
        data.nama, data.photo, data.email, data.no_telp, data.duduk_lembaga,
        data.alamat, data.status ,date];
      let info_superadmin = await pool.query(format(
        'UPDATE ' + db_sekretariat + ' SET (nama, photo, email, no_telp, duduk_lembaga, alamat, '+
        `status, update) = (%L) WHERE id=${pengguna.rows[0].info_sekretariat} RETURNING *`, data_superadmin)
      );
      check_query.check_queryset(info_superadmin);
      response.pengguna = pengguna.rows[0];
      response.detail = info_superadmin.rows[0];
      debug('get %o', response);
      return {status:200, keterangan: `Update data superadmin ${info_superadmin.rows[0].nama}`, data: response};
    } catch (ex) {
        console.log('Enek seng salah iki ' + ex);
        return { status: '400', Error: "" + ex };
    };
  }

  async index_sekretariat(id, role) {
      try {
        let user;
        if(id == 'all'){
          if(role == 'SUPERADMIN'){
            user = await pool.query('SELECT * FROM ' + db_list_sekretariat + ` WHERE role IN ('AUDITOR','TIM_KOMTEK', 'SUPERADMIN')`)
          }else{
            user = await pool.query('SELECT * FROM ' + db_list_sekretariat + ` WHERE role IN ('AUDITOR','TIM_KOMTEK')`)
          };
        } else{
          if(role == 'SUPERADMIN'){
            user = await pool.query('SELECT * FROM ' + db_list_sekretariat + ` WHERE id = ${id} AND role IN ('AUDITOR','TIM_KOMTEK', 'SUPERADMIN')`)
          }else{
            user = await pool.query('SELECT * FROM ' + db_list_sekretariat + ` WHERE id = ${id} AND role IN ('AUDITOR','TIM_KOMTEK')`)
          }
        }
        check_query.check_queryset(user);
        debug('get %o', user);
        return { status: '200', keterangan: `Detail User id ${user.rows[0].id} ${user.rows[0].nama}`, data: user.rows };
    } catch (ex) {
        console.log('Enek seng salah iki ' + ex);
        return { status: '400', Error: "" + ex };
    };
  }

  async delete_sekretariat(id, role) {
    try {
      let response = {};
      let user = await pool.query(
        'UPDATE ' + db_pengguna + ' SET (is_deleted, update) = ($3, $4) WHERE id=$1 and role=$2 RETURNING *', [id, role, false, date]);
      check_query.check_queryset(user);
      let info_sekretariat = await pool.query(format(
        'UPDATE ' + db_sekretariat + ' SET (status, update) = ($2, $3) WHERE id=$1 RETURNING *', [pengguna.rows[0].info_sekretariat, false, date])
      );
      check_query.check_queryset(info_sekretariat);
      response.pengguna = pengguna.rows[0];
      response.info_sekretariat = info_sekretariat.rows[0];
      debug('get %o', response);
      return {status:200, keterangan: `Delete pengguna id ${user.rows[0].id} ${user.rows[0].nama}`, data: response};
    } catch (ex) {
        console.log('Enek seng salah iki ' + ex);
        return { status: '400', Error: "" + ex };
    };
  }
}

module.exports = new UserModel();