const redis = require("redis");


exports.default_dict = (value, default_value) => {
    if(value === undefined || value === null ){
        return default_value;
    } else{
        return value;
    }
}

exports.check_value = (value, column, not_operator) => {
    if(value === undefined || value === null ){
        return '';
    } else{
        if(not_operator){
            return `${column}=${value}`;
        }else{
            return `${column}=${value} AND `;
        }
        
    }
}

exports.response = (res, response) => {
    if (response.status == '400') {
        res.status(400).json({ response });
    }else {
        res.status(200).json({ response });
    }
}

exports.array_query_format = (arr) => {
    let arr_query = '';
    let len_arr =arr.length
    arr.forEach((kompetensi, index) => {
        arr_query += `"${kompetensi}"`
        if(index != len_arr-1){
            arr_query += ',' 
        }
    });
    return `{${arr_query}}`
}


exports.redis_conn = async (arr) => {
    let redisClient;
    redisClient = redis.createClient(
        {
            host:'127.0.0.1',
            port:6379
        }
    );
    redisClient.on("error", (error) => console.error(`Error : ${error}`));
    await redisClient.connect();

    return redisClient;
}

