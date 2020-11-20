const fs = require('fs');
const path = require('path');

const conf = require('../conf');
const http = require('../http');

// 下载已打卡的健康码原图
(async () => {
    const daka_day = '2020-11-20'; // 目标日期
    const check2dakaNew2 = await http.POST('https://a.welife001.com/applet/notify/check2dakaNew2', {
        imprint: conf.openId
    }, {
        "_id": '5f893f6827344f56aecfd817',
        "cid": '5ec61a18902cc93eade35e73',
        "daka_day": daka_day,
        "click_load": false,
        "teacher_cate": "",
        "member_id": conf.memberId,
        "cls_ts": new Date().getTime(),
    });
    await fetch(daka_day, 'child', check2dakaNew2, 2, 0);
    await fetch(daka_day, 'baba', check2dakaNew2, 7, 0);
    await fetch(daka_day, 'mama', check2dakaNew2, 7, 1);
})().catch(err => console.log(err));

async function fetch(daka_day, name, check2dakaNew2, x, y) {
    const file = check2dakaNew2.body.data.accepts[0].answer.subject[x].input.file[y];
    if (file) {
        const dir =  path.join(__dirname, 'history');
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        await http.DL(`https://img.welife001.com/${file.id}`, path.join(dir, `${daka_day}_${name}${path.extname(file.id)}`));
    }
}