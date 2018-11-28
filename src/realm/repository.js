/**
 * Created by yjy on 2017/12/20.
 */
import Realm from 'realm';
const repository = new Realm({
    schema: [{
        name: 'FriendReqSchema',
        primaryKey:'id',    // 官方没给出自增长的办法,而且一般不会用到主键,这也解决了重复访问的问题,而且实际开发中我们不需要主键的,让服务端管就是了
        properties: {
            id:'string',
            fromId:'string',
            status:{type:'int', default:0},
            content:{type:'string', default:''},
            imageurl:{type:'string',default:''},
            fromname:'string',
            role:'string',
            read:{type:'bool',default:false},
            date:'date',
            userId:'string'
        }
    },{
        name: 'ChatMessageSchema',
        primaryKey:'id',    // 官方没给出自增长的办法,而且一般不会用到主键,这也解决了重复访问的问题,而且实际开发中我们不需要主键的,让服务端管就是了
        properties: {
            id:'string',
            content:'string',
            msgType:'string',
            fromname:'string',
            fromId:'string',
            imageurl:'string',
            read:{type:'bool',default:false},
            time:'string',
            uniqueId:'string',
            error:{type:'bool',default:false}
        }
    },{
        name:'AllMessSchema',
        primaryKey:'uniqueId',
        properties: {
            id:'string',
            label:'string',
            lastMessage:'string',
            time:'string',
            number:{type:'int', default:0},
            imageurl:'string',
            msgType:'string',
            uniqueId:'string',
            isMe:{type:'bool',default:false},
            chatId:'string'
        }
    }]
});
export default repository