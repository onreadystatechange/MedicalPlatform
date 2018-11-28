/**
 * Created by yjy on 2018/1/11.
 */
/**
 * Created by yjy on 2017/12/20.
 */

export default class SingleMessageModal {
    constructor({id, content,msgType,fromname,fromId,imageurl,read,time,uniqueId,error}) {
        this.id = id;
        this.content = content;
        this.msgType = msgType;
        this.fromname = fromname;
        this.fromId = fromId;
        this.imageurl = imageurl;
        this.read = read;
        this.time = time;
        this.uniqueId = uniqueId;
        this.error = error;

    }
}
