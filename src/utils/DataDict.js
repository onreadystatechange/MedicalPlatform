/**
 * Created by yjy on 2017/11/24.
 */
/**
 * 获取数据字典的名称
 *
 * @param dataDict
 * @param code
 */


export function getLabel(labels, value) {
    const list = labels.filter(ele => ele.value == value);
    return list && list.length > 0 && list[0].label || "";
}

/**
 * 拼接对象为请求字符串
 * @param {Object} obj - 待拼接的对象
 * @returns {string} - 拼接成的请求字符串
 */
export function encodeSearchParams(obj) {
    const params = []

    Object.keys(obj).forEach((key) => {
        let value = obj[key]
        // 如果值为undefined我们将其置空
        if (typeof value === 'undefined') {
            value = ''
        }
        // 对于需要编码的文本（比如说中文）我们要进行编码
        params.push([key, encodeURIComponent(value)].join('='))
    })

    return params.join('&')
}

export function parseQueryString(url){
    return url
        .substring(url.indexOf('?') + 1)
        .split('&')
        .map((query) => query.split('='))
        .reduce((params, pairs) => (params[pairs[0]] = pairs[1] || '', params), {});
}

export function getGenderType() {
    return [{value:"0",label:"男"},{value:"1",label:"女"},{value:"2",label:"中性"}]
}


export function genderTitleId() {
    return [{value:"1",label:"高级"},{value:"2",label:"中级"},{value:"3",label:"初级"}]
}