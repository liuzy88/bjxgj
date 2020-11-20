const fs = require('fs');
const path = require('path');
const URL = require('url');
const zlib = require('zlib');
const https = require('https');

var logFile = '';
var cookieFile = 'cookie.json';

module.exports.LOG = function(filename) {
    const dir = path.join(__dirname, 'logs');
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    logFile = path.join(dir, filename + '.json');
}

module.exports.GET = async function(url, headers) {
    return REAUEST(url, headers);
}

module.exports.POST = async function(url, headers, params) {
    return REAUEST(url, headers, params);
}

module.exports.DL = async function(url, dst, headers) {
    return DOWNLOAD(url, dst, headers);
}

function REAUEST(url, headers, params) {
    headers = headers || {};
    let postData = JSON.stringify(params || {});
    let options = URL.parse(url);
    options.method = params ? 'POST' : 'GET';
    options.headers = {
        'Host': 'a.welife001.com',
        'Connection': 'keep-alive',
        'content-type': 'application/json', // 服务器要的content-length是错的
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36 MicroMessenger/7.0.9.501 NetType/WIFI MiniProgramEnv/Windows WindowsWechat',
        'Referer': 'https://servicewechat.com/wx23d8d7ea22039466/616/page-frame.html',
    };
    for (let k in headers) {
        options.headers[k] = headers[k];
    }
    // const Cookie = appendCookie(headers);
    // if (Cookie) {
    //     options.headers['Cookie'] = Cookie;
    // }
    console.log(dt(), options.method, options.href);
    fileLog(options.method, options.href);
    fileLog('请求头', JSON.stringify(options.headers, null, 2));
    return new Promise(function(resolve, reject) {
        let req = https.request(options, (res) => {
            res.setTimeout(3000);
            let data = [];
            res.on('data', (chunk) => {
                data.push(chunk);
            })
            res.on('end', async() => {
                let body = data.join('');
                if (res.headers['content-encoding'] === 'gzip') {
                    body = await unzip(data);
                }
                // saveCookie(res.headers);
                console.log(dt(), '<=', res.statusCode);
                const result = { code: res.statusCode, headers: res.headers, body: body.startsWith('{') ? JSON.parse(body) : body };
                fileLog('响应体', JSON.stringify(result, null, 2));
                resolve(result);
            })
        });
        req.setTimeout(3000);
        req.on('error', (err) => {
            reject(err);
        });
        if (params) {
            fileLog('请求体', postData);
            req.write(postData);
        }
        req.end();
    });
}

function DOWNLOAD(url, dst, headers) {
    console.log(`download start: ${url} => ${dst}`);
    const options = URL.parse(url);
    options.method = 'GET';
    options.headers = headers || {};
    return new Promise(function(resolve, reject) {
        const start = Date.now();
        const ws = fs.createWriteStream(dst);
        const req = https.request(options, (res) => {
            res.setTimeout(5000);
            res.on('data', (chunk) => {
                ws.write(chunk);
            });
            res.on('end', () => {
                ws.close();
                console.log(`download end: ${dst} cost ${Date.now() - start}ms`);
                const result = { code: res.statusCode, headers: res.headers };
                console.log('响应体', JSON.stringify(result, null, 2));
                resolve(result);
            });
        });
        req.setTimeout(5000);
        req.on('error', (err) => {
            console.log(`download error: ${err.message}`);
            reject(err);
        });
        req.end();
    });
}

async function unzip(data) {
    return new Promise((resolve, reject) => {
        zlib.gunzip(Buffer.concat(data), function(err, decoded) {
            if (err) {
                log.warn('HTTP response unzip error, return origin body.', err);
                resolve(body);
            } else {
                resolve(decoded.toString());
            }
        })
    })
}

function fileLog(b, c) {
    if (logFile) {
        fs.appendFileSync(logFile, `${dt()} ${b}\r\n${c}\r\n`, 'utf8');
    }
}

function dt() {
    const d = new Date()
    return [d.getFullYear(), '-',
        ('0' + (d.getMonth() + 1)).slice(-2), '-',
        ('0' + d.getDate()).slice(-2), ' ',
        ('0' + d.getHours()).slice(-2), ':',
        ('0' + d.getMinutes()).slice(-2), ':',
        ('0' + d.getSeconds()).slice(-2)
    ].join('');
}

// 保存响应中的cookie到文件
function saveCookie(headers) {
    const cache = getFileCookie();
    for (let k in headers) {
        if (k === 'set-cookie') {
            const v = headers[k];
            for (let i = 0; i < v.length; ++i) {
                const a = v[i].split('; ')[0].split('=');
                cache[a[0]] = a[1];
            }
        }
    }
    putFileCookie(cache);
}

// 读取文件中的cookie追加到请求
function appendCookie(headers) {
    const cache = getFileCookie();
    const arr = []
    const old = headers['Cookie'] || headers['cookie'];
    if (old) {
        old.split(';').map(s => {
            const ss = s.trim().split('=');
            if (ss[0]) {
                arr.push(`${ss[0]}=${ss[1]}`);
            }
        })
    }
    for (let k in cache) {
        arr.push(`${k}=${cache[k]}`);
    }
    return arr.join('; ')
}

function getFileCookie() {
    if (fs.existsSync(cookieFile)) {
        return JSON.parse(fs.readFileSync(cookieFile));
    }
    return {};
}

function putFileCookie(cache) {
    fs.writeFileSync(cookieFile, JSON.stringify(cache, null, 2));
}