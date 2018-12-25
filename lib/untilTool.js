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

module.exports.handleDBFunData = handleDBFunData;