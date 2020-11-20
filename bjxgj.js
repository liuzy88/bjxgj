const conf = require('./conf');
const http = require('./http');
const invest = require('./invest');

module.exports = async (_id, daka_day) => {
    daka_day = daka_day || today();
    http.LOG(`${_id}.${daka_day}`);
    // const update_ts = await http.GET('https://a.welife001.com/back/configuration/detail/update_ts', { imprint: conf.openId });
    // const getUser = await http.POST('https://a.welife001.com/getUser', { imprint: conf.openId });
    // const config = await http.GET('https://a.welife001.com/back/configuration/json?type=1&appkey=wx23d8d7ea22039466', { imprint: conf.openId });
    const getParent = await http.GET(`https://a.welife001.com/info/getParent?type=-1&members=${conf.memberId}&page=0&size=10&date=-1&hasMore=true`, { imprint: conf.openId });
    // const getClassByMemberId = await http.POST('https://a.welife001.com/getClassByMemberId', { imprint: conf.openId }, { "member_ids": conf.memberId });
    // const match = await http.POST('https://a.welife001.com/applet/resource/match', { imprint: conf.openId }, { "identity": [2, 3], "platform": "mp" });
    const datas = getParent.body.data;
    let cid;
    for (let i = 0; i < datas.length; ++i) {
        if (datas[i]._id === _id) {
            cid = datas[i].cls;
            break;
        }
    }
    if (!cid) {
        throw new Error(`没有找到_id=${_id}的作业！请参考：\r\n${datas.map(x => `${x._id}=${x.title}`).join('\r\n')}`);
    }
    const check2dakaNew2 = await http.POST('https://a.welife001.com/applet/notify/check2dakaNew2', {
        imprint: conf.openId
    }, {
        "_id": _id,
        "cid": cid,
        "daka_day": "",
        "click_load": false,
        "teacher_cate": "",
        "member_id": conf.memberId,
        "cls_ts": new Date(daka_day + ' 06:36:00').getTime(),
    });
    const feedbackWithOss = await http.POST('https://a.welife001.com/applet/notify/feedbackWithOss', {
        imprint: conf.openId
    }, await invest(_id, check2dakaNew2.body.data.notify.invest, daka_day));
}

function today() {
    const d = new Date();
    return [d.getFullYear(), ('0' + (d.getMonth() + 1)).slice(-2), ('0' + d.getDate()).slice(-2)].join('-');
}