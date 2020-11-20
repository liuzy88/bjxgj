const fs = require('fs');
const path = require('path');
const img = require('../img');
const conf = require('../conf');
const aliyun = require('../aliyun');
const _id = path.basename(__filename, '.js');
const data = conf.invests[_id];
module.exports = async function(invest, daka_day) {
    const childTmp = `wxfile://temp/WechatIMG${Date.now().toString().slice(-3)}.jpg`;
    const childFile = await img.fetch('child');
    if (!fs.existsSync(childFile)) {
        throw new Error('获取child健康码失败！');
    }
    const childOss = await aliyun.upload(childFile);
    if (!childOss) {
        throw new Error('上传child健康码失败！');
    }

    const babaTmp = `wxfile://temp/WechatIMG${Date.now().toString().slice(-3)}.jpg`;
    const babaFile = await img.fetch('baba');
    if (!fs.existsSync(babaFile)) {
        throw new Error('获取baba健康码失败！');
    }
    const babaOss = await aliyun.upload(babaFile);
    if (!babaOss) {
        throw new Error('上传baba健康码失败！');
    }

    if (invest.subject[0].title === '幼儿姓名、目前所在地') {
        invest.subject[0].valid = true;
        invest.subject[0].input = { "content": data[0] };
    }
    if (invest.subject[1].title === '幼儿健康码') {
        invest.subject[1].item_details[0].checked = true;
        invest.subject[1].item_details[1].checked = false;
        invest.subject[1].item_details[2].checked = false;
        invest.subject[1].valid = true;
    }
    if (invest.subject[2].title === '幼儿当日健康码截图') {
        invest.subject[2].input = {
            "file": [{
                "file": childTmp,
                "id": childOss
            }]
        };
        invest.subject[2].valid = true;
    }
    if (invest.subject[3].title === '幼儿昨晚体温：     ；幼儿今晨体温：     ') {
        invest.subject[3].input = { "content": data[3] };
        invest.subject[3].valid = true;
    }
    if (invest.subject[4].title === '幼儿有无下列症状') {
        invest.subject[4].item_details[0].checked = false;
        invest.subject[4].item_details[1].checked = false;
        invest.subject[4].item_details[2].checked = false;
        invest.subject[4].item_details[3].checked = false;
        invest.subject[4].item_details[4].checked = false;
        invest.subject[4].item_details[5].checked = false;
        invest.subject[4].item_details[6].checked = false;
        invest.subject[4].item_details[7].checked = false;
        invest.subject[4].item_details[8].checked = false;
        invest.subject[4].item_details[9].checked = false;
        invest.subject[4].item_details[10].checked = true;
        invest.subject[4].valid = true;
    }
    if (invest.subject[5].title === '所有同住人') {
        invest.subject[5].item_details[0].checked = true;
        invest.subject[5].item_details[1].checked = false;
        invest.subject[5].item_details[2].checked = false;
        invest.subject[5].item_details[3].checked = false;
        invest.subject[5].item_details[4].checked = false;
        invest.subject[5].item_details[5].checked = false;
        invest.subject[5].item_details[6].checked = false;
        invest.subject[5].valid = true;
    }
    if (invest.subject[6].title === '所有同住人健康码情况') {
        invest.subject[6].item_details[0].checked = true;
        invest.subject[6].item_details[1].checked = false;
        invest.subject[6].valid = true;
    }
    if (invest.subject[7].title === '所有同住人当日健康码截图') {
        invest.subject[7].input = {
            "file": [{
                "file": babaTmp,
                "id": babaOss
            }]
        };
        invest.subject[7].valid = true;
    }
    if (invest.subject[8].title === '所有同住人体温（如父亲37；母亲37；等其余同住人体温）') {
        invest.subject[8].valid = true;
        invest.subject[8].input = { "content": data[8] };
    }
    if (invest.subject[9].title === '本文承诺以上提供的资料真实准确，如有不实，本人愿意承担由此引起的一切后果及法律责任。承诺人签字：') {
        invest.subject[9].valid = true;
        invest.subject[9].input = { "content": data[9] };
    }
    const params = {
        feedback_text: "",
        id: _id,
        daka_day: daka_day,
        files: [{
                "file": babaTmp,
                "cate": "img",
                "new_name": babaOss
            },
            {
                "file": childTmp,
                "cate": "img",
                "new_name": childOss
            }
        ],
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
