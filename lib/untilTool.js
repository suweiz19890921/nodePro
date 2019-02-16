function handleDBFunData(result) {
	// body...
	//由于db中调用函数返回的数据都会被DB强制包一层以函数名为KEY的value为你所需要的数据
	 result = JSON.stringify(result);
     result = JSON.parse(result);//把results字符串转为json对象
        var lastKey= '';
        for (var i = 0; i < result.length; i++) {
        	var temp = result[i];
        	 for (var key in temp){
              lastKey = key;
        }
    }
        console.log(lastKey);
        console.log(result[0][lastKey])
        return result[0][lastKey];
}


function changeJson(json) {
    if (Array.isArray(json) && json.length > 0) {
        json.forEach(function (data, i) {
            if (typeof data == 'object'&&!!data) {
                changeJson(data);
            }
        });
    } else {
        try {
            Object.keys(json).forEach(function (key, i) {
                if (/time$/i.test(key) && json[key] instanceof Date) {
                    try {
                        json[key] = json[key].getTime();
                    } catch (e) {
                    }
                }else if(/pos/i.test(key)&&Array.isArray(json[key])&&json[key].length==2){
                    json[key]=ngeohash.encode(json[key][1],json[key][0])
                }else if (typeof json[key] == 'object'&&!!json[key]) {
                    changeJson(json[key]);
                } else if (/time$/i.test(key) && typeof json[key] == 'string') {
                    try {
                        var tempTime = new Date(Date.parse(json[key]));
                        if(!!tempTime.getTime()){
                            json[key] = tempTime.getTime();
                        }
                    } catch (e) {
                        logger.error(e)
                    }
                }
                if (/_/.test(key) && key != 'zh_Hans' && key != 'zh_Hant') {
                    var newKey = upperUnderlineNextLetter(key);
                    json[newKey] = json[key];
                    delete json[key];
                }
                if(/(iszan)/.test(key)){
                    json["isZan"] = json[key];
                }
                if(!!json.storiesPoster && typeof json.storiesPoster === "object"){
                    json.nickname = json.storiesPoster.nickname;
                    json.avatar = json.storiesPoster.avatar;
                }
            });
        } catch (e) {
        }
    }
    return json;
}

//去掉下划线并将下划线后面一位字母大写
function upperUnderlineNextLetter(str){
    var ret = "";
    if(str.match(/_/)){
        str = str.split("_");
        for(var i = 0;i < str.length;i++){
            if(i > 0){
                str[i] = str[i].substr(0,1).toUpperCase() + str[i].substr(1);
            }
            ret += str[i];
        }
    }
    return ret;
}

module.exports.changeJson = changeJson;
module.exports.upperUnderlineNextLetter = upperUnderlineNextLetter;
module.exports.handleDBFunData = handleDBFunData;