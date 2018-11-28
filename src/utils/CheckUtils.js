/**
 * Created by yjy on 2017/11/23.
 */
export default class CheckUtils {
    static checkMobile(mobile) {
        return /^1[3|4|5|7|8]\d{9}$/.test(mobile)
    }

    static checkEmail(email) {
        return /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/.test(email)
    }

    static checkQQ(qq) {
        return /^\d{5,}$/.test(qq) || CheckUtils.checkEmail(qq)
    }

    static checkWechat(wx) {
        return CheckUtils.checkMobile(wx) || CheckUtils.checkEmail(wx) || CheckUtils.checkQQ(wx) || /^[a-zA-Z\d_]{5,}$/.test(wx)
    }

    static checkSmsCode(smsCode) {
        return /\d{4}/.test(smsCode);
    }

    static checkIdentityCode(identityCode) {
        return /^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/.test(identityCode);
    }

    static checkName(name) {
        return /^[\u0391-\uFFE5A-Za-z]+$/.test(name);
    }

    static checkNumber(number) {
        return /^[1-9][\d]*$/.test(number);
    }

    static checkCompanyRegistrationId(id) {
        return /\d{6}[123]\d{7}[1-9]/.test(id);
    }

    static checkURL(url) {
        return /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/.test(url);
    }

    static checkPsd(psd){
        return /^[a-zA-Z]\w{5,17}$/.test(psd)
    }
}
