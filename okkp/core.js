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