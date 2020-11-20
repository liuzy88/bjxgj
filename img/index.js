const fs = require('fs');
const os = require('os');
const path = require('path');
const exec = require('child_process').exec

const conf = require('../conf');
const http = require('../http');

// 获取当前健康码图片
module.exports.fetch = async(name, daka_day) => {
    daka_day = daka_day || today();
    const dst = path.join(__dirname, `history/${daka_day}_${name}.jpg`);
    // const flag = await download(dst);
    const flag = await paint(name, dst);
    return flag ? dst : null;
}

// 用JAVA画一个
async function paint(name, dst) {
    const src = radomFile(name);
    console.log(`java Main "${src}" "${dst}"`);
    return new Promise((resolve, reject) => {
        const java = path.join(__dirname, '../java');
        if (os.platform() === 'win32') {
            const iconv = require('iconv-lite')
            exec(`cd ${java} && javac Main.java && java Main "${src}" "${dst}"`, { encoding: 'gbk' }, function(err, stdout, stderr) {
                if (err) {
                    console.log(iconv.decode(stderr, 'gbk').trim());
                    resolve(false);
                } else {
                    console.log(iconv.decode(stdout, 'gbk').trim());
                    resolve(true);
                }
            });
        } else {
            exec(`cd ${java} && javac Main.java && java Main "${src}" "${dst}"`, { encoding: 'utf8' }, function(err, stdout, stderr) {
                if (err) {
                    console.log(stderr.toString().trim());
                    resolve(false);
                } else {
                    console.log(stdout.toString().trim());
                    resolve(true);
                }
            });
        }
    });
}

// 从目录中随机选取一张图片
function radomFile(name) {
    const dir = path.join(__dirname, name);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
        return 'dir_empty';
    }
    const arr = fs.readdirSync(dir);
    arr.sort(function() { return Math.random() - 0.5 });
    const tmp = arr[Math.floor((Math.random() * arr.length))];
    return path.join(dir, tmp);
}

// 去下载一个
async function download(dst) {
    const url = 'https://img.welife001.com/oWRkU0RrV6iIpQ088lkwk8JQgz9M_image/160575587875255878752.jpg';
    const res = await http.DL(url, dst);
    return res.code == 200;
}

function today() {
    const d = new Date();
    return [d.getFullYear(), ('0' + (d.getMonth() + 1)).slice(-2), ('0' + d.getDate()).slice(-2)].join('-');
}
