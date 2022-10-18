const schema = 'static';
const db_jenis_rapid_test = schema + '.jenis_rapid_test';
const db_jenis_uji_lab = schema + '.jenis_uji_lab';
const db_rt_aflatoksin = schema + '.rt_aflatoksin';
const db_rt_logam_berat = schema + '.rt_logam_berat';
const db_rt_mikroba = schema + '.rt_mikroba';
const db_rt_pestisida = schema + '.rt_pestisida';


exports.database_parameter = async (param) => {
    if(param == 'aflatoksin'){
        return db_rt_aflatoksin;
    }else if(param == 'logam_berat'){
        return db_rt_logam_berat;
    }else if(param == 'mikroba'){
        return db_rt_mikroba;
    }else if(param == 'pestisida'){
        return db_rt_pestisida;
    }else if(param == 'uji_lab'){
        return db_jenis_uji_lab;
    }else if(param == 'rapid_test'){
        return db_jenis_rapid_test;
    }
}