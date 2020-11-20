const fs = require('fs');
const URL = require('url');
const path = require('path');
const https = require('https');
const FormData = require('form-data');

const conf = require('../conf');

module.exports.upload = async (src) => {
    const radom = Date.now() + Date.now().toString().substr(5);
    const key = `${conf.openId}_image/${radom}.jpg`;

    const form = new FormData();
    form.append('OSSAccessKeyId', conf.OSSAccessKeyId);
    form.append('Signature', 'B2gKMnFFjDQryE0Hz3AfBUXTVU8=');
    form.append('key', key);
    form.append('policy', 'eyJleHBpcmF0aW9uIjoiMjAzNy0xMi0yOVQxNjoxMTo1My44ODZaIiwiY29uZGl0aW9ucyI6W1siY29udGVudC1sZW5ndGgtcmFuZ2UiLDAsMTA0ODU3NjAwXV19');
    form.append('success_action_status', '200');
    form.append('file', fs.createReadStream(src));

    const res = await upload(form);
    console.log('https://img.welife001.com/' + key);
    return res.code === 200 ? key : null;
}

function upload(form) {
    return new Promise((resolve, reject) => {
        const options = URL.parse('https://campus002.welife001.com/');
        options.method = 'POST';
        options.headers = form.getHeaders(); //这个不能少
        options.headers['User-Agent'] = 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36 MicroMessenger/7.0.9.501 NetType/WIFI MiniProgramEnv/Windows WindowsWechat';
        options.headers['Referer'] = 'https://servicewechat.com/wx23d8d7ea22039466/616/page-frame.html';
        console.log(dt(), options.method, options.href);
        const req = https.request(options, function(res) {
            res.setTimeout(3000);
            const data = [];
            res.on('data', function(chunk) {
                data.push(chunk);
            });
            res.on('end', async () => {
                console.log(dt(), '<=', res.statusCode);
                let body = data.join('');
                const result = { code: res.statusCode, headers: res.headers, body: body.startsWith('{') ? JSON.parse(body) : body };
                console.log(dt(), '响应体', JSON.stringify(result, null, 2));
                resolve(result);
            });
        });
        form.pipe(req);
        req.setTimeout(3000);
        req.on('error', (err) => {
            console.log(dt(), err)
        });
    });
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