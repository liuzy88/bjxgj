const img = require('./img');
const aliyun = require('./aliyun');
const guanjia = require('./guanjia');

(async () => {
    const args = process.argv.slice(2);
    const _id = args[0];
    if (_id) {
        await guanjia(_id); // 提交指定作业
    } else {
        await img.fetch('baba'); // 测试获取当前健康码
        // await aliyun.upload('D:/baba.jpg'); // 测试上传图片
        // await guanjia('5f392c37cb045224a3cc492b'); // 测试提交作业
    }
})().catch(err => console.log(err))
