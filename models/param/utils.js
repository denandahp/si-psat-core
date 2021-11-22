
exports.limit_time = (limit)=> {
    var d = new Date(Date.now());
    d.toLocaleString('en-GB', { timeZone: 'Asia/Jakarta' });
    d.setSeconds(d.getSeconds() + limit);
    var dd = d.getDate();var mm = d.getMonth() + 1;var y = d.getFullYear();var hour = d.getHours();var minute = d.getMinutes();var second = d.getSeconds();
    var FormattedDate = y + '-'+ mm + '-'+ dd + ' ' + hour+':'+minute+':'+second;
    return FormattedDate;
}

exports.date_now = ()=> {
    var date = new Date(Date.now());
    date.toLocaleString('en-GB', { timeZone: 'Asia/Jakarta' });
    return date;
}

exports.time_format = ()=> {
    var d = new Date(Date.now());
    d.toLocaleString('en-GB', { timeZone: 'Asia/Jakarta' });
    var dd = d.getDate();var mm = d.getMonth() + 1;var y = d.getFullYear();var hour = d.getHours();var minute = d.getMinutes();var second = d.getSeconds();
    var FormattedDate = y + '-'+ mm + '-'+ dd;
    return String(FormattedDate);
}

exports.check_queryset = (queryset)=> {
    if (queryset.rowCount <= 0){
        throw  new Error('Invalid id/data is empty. Check again your data query');
    }
}