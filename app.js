const img = require('./img');
const conf = require('./conf');
const bjxgj = require('./bjxgj');
const aliyun = require('./aliyun');

(async () => {
    const args = process.argv.slice(2);
    if (args[0] > 0) {
        const _id = Object.keys(conf.invests)[args[0] - 1];
        await bjxgj(_id); // 按序号提交作业
    } else if (args[0]) {
        await bjxgj(args[0]); // 按编号提交作业
    } else {
        await img.fetch('baba'); // 测试获取当前健康码
        // await aliyun.upload('D:/baba.jpg'); // 测试上传图片
        // await bjxgj('5f392c37cb045224a3cc492b'); // 测试提交作业
    }
})().catch(err => console.log(err))
