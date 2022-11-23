const dotenv = require('dotenv');
const redis = require("redis");

dotenv.config();


function default_dict(value, default_value){
    if(value === undefined || value === null ){
        return default_value;
    } else{
        return value;
    }
}

function check_value(value, column, not_operator){
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

function response(res, response){
    if (response.status == '400') {
        res.status(400).json({ response });
    }else {
        res.status(200).json({ response });
    }
}

function array_query_format(arr){
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


class RedisGetSet {
    constructor(key, value){
        this.key = key;
        this.value = value;
    }

    async redis_conn (){
        let redisClient;
        redisClient = redis.createClient(
            {
                host:process.env.REDIS_HOST,
                port:process.env.REDIS_PORT
            }
        );
        redisClient.on("error", (error) => console.error(`Error : ${error}`));
        await redisClient.connect();
    
        return redisClient;
    }

    async del_cache (){
        let redis_client = await this.redis_conn()
        redis_client.del(this.key)
    }

    async get_cache (){
        let cache_json;
        let redis_client = await this.redis_conn()
        const redis_cache = await redis_client.get(this.key);
        if(redis_cache){
            cache_json = JSON.parse(redis_cache);
        }
        return cache_json
    }

    async set_cache (){
        let redis_client = await this.redis_conn()
        redis_client.set(this.key, JSON.stringify(this.value));
    }
}
module.exports = {
    RedisGetSet, array_query_format, default_dict, check_value, response
}

