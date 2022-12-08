const utils = require('../../models/param/utils.js');
const pool = require('../../libs/db.js');

var date = utils.date_now();

const schema_regis = 'okkp';


class SerializeUjiLab{

    constructor(data, user, process){
        this.data = data;
        this.user = user;
        this.process = process
        
    }

    create() {
        let value = this.data.multiple_parameter.map((val) => {
            let lembaga = (this.data.lembaga) ? this.data.lembaga : this.user.duduk_lembaga
            let value_list = [
                this.data.jenis_uji_lab_id, this.user.id, lembaga, this.data.tanggal, this.data.lokasi_sampel, this.data.komoditas_id, this.data.komoditas_tambahan,
                val.parameter, val.hasil_uji, val.standar, this.data.status_id, this.data.referensi_bmr, this.data.metode_uji, this.data.note, date,
                this.user.email, this.data.provinsi_id, date, this.user.email
            ]

            return value_list
        });
    
        return value
    }

    update() {
        let serialize = {
            "jenis_uji_lab_id": this.data.jenis_uji_lab_id, 
            "user_id": this.user.id, 
            "lembaga": (this.data.lembaga) ? this.data.lembaga : this.user.duduk_lembaga, 
            "tanggal": utils.date_format(this.data.tanggal), 
            "lokasi_sampel": this.data.lokasi_sampel, 
            "komoditas_id": this.data.komoditas_id, 
            "komoditas_tambahan": this.data.komoditas_tambahan,
            "parameter": this.data.parameter, 
            "hasil_uji": this.data.hasil_uji, 
            "standar": this.data.standar, 
            "status_id": this.data.status_id, 
            "referensi_bmr": this.data.referensi_bmr, 
            "metode_uji": this.data.metode_uji, 
            "note": this.data.note, 
            "updated_at": date, 
            "modified_by": this.user.email, 
            "provinsi_id": this.data.provinsi_id
        }
        let value = Object.values(serialize)
        return value
    }

    save(){
        let value;
        let field_db = [
            "jenis_uji_lab_id", "user_id", "lembaga", "tanggal", "lokasi_sampel", "komoditas_id", "komoditas_tambahan",
            "parameter", "hasil_uji", "standar", "status_id", "referensi_bmr", "metode_uji", "note", "updated_at", 
            "modified_by", "provinsi_id"
        ]
    
        if(this.process == 'created'){
            field_db.push("created_at", "created_by")
            value = this.create()
        }else{
            value = this.update()
        }

        let key = field_db.toString()
        return {key, value}
    }

}

module.exports = {SerializeUjiLab}

