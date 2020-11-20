// 填充作业表单
module.exports = async (_id, invest, daka_day) => {
    return require(`./${_id}`)(invest, daka_day);
}