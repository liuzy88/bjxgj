function wd() {
    const arr = [36.6, 36.7, 36.8, 36.9, 37];
    return arr[Math.floor((Math.random() * arr.length))];
}
module.exports.wd = wd;
module.exports = {
    openId: '<使用Fiddler得到>',
    memberId: '<使用Fiddler得到>',
    appkey: 'wx23d8d7ea22039466',
    OSSAccessKeyId: 'LTAI9YvufwSWF9Bl',
    invests: {
        // 每日健康晨报
        '5f392c37cb045224a3cc492b': ['小宝儿', '健康', '上海', wd(), '无'],
    }
}