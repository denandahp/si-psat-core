exports.default_dict = (value, default_value) => {
    if(value === undefined || value === null ){
        return default_value;
    } else{
        return value;
    }
}

exports.check_value = (value, column) => {
    if(value === undefined || value === null ){
        return '';
    } else{
        return `${column}=${value} AND `;
    }
}