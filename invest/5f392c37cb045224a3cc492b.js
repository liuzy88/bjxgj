const path = require('path');
const conf = require('../conf');
const _id = path.basename(__filename, '.js');
const data = conf.invests[_id];
module.exports = async function(invest, daka_day) {
    if (invest.subject[0].title === '幼儿姓名') {
        invest.subject[0].valid = true;
        invest.subject[0].input = { "content": data[0] };
    }
    if (invest.subject[1].title === '健康情况') {
        invest.subject[1].valid = true;
        invest.subject[1].input = { "content": data[1] };
    }
    if (invest.subject[2].title === '目前所在地') {
        invest.subject[2].valid = true;
        invest.subject[2].input = { "content": data[2] };
    }
    if (invest.subject[3].title === '昨晚体温') {
        invest.subject[3].valid = true;
        invest.subject[3].input = { "content": data[3] };
    }
    if (invest.subject[4].title === '备注') {
        invest.subject[4].valid = true;
        invest.subject[4].input = { "content": data[4] };
    }
    const params = {
        feedback_text: "",
        id: _id,
        daka_day: daka_day,
        files: [],
        file_type: "",
        form_id: "",
        submit_type: "submit",
        networkType: "wifi",
        member_id: conf.memberId,
        examdetail: "",
        invest: invest,
        op: "add",
        sub_info: []
    };
    return params;
}