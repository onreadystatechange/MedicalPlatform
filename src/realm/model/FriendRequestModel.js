/**
 * Created by yjy on 2017/12/20.
 */

export default class FriendRequestModel {
    constructor({id, content,imageurl,fromId,fromname,role,read,date,userId}) {
        this.id = id;
        this.content = content;
        this.imageurl = imageurl;
        this.fromId = fromId;
        this.fromname = fromname;
        this.role = role;
        this.read = read;
        this.date = date;
        this.userId = userId;
    }
}
