/**
 * Created by yjy on 2017/12/20.
 */
import repository from '../repository'
import FriendRequestModel from '../model/FriendRequestModel';

const FriendRequestService = {
    findAll: function(sortBy,id) {
        if (!sortBy) sortBy = [['date', true]];
        return repository.objects('FriendReqSchema').sorted(sortBy);
    },

    save: function({id, content,imageurl,fromId,fromname,role,read,date,userId}) {
        return  repository.write(() => {
            repository.create('FriendReqSchema', {id, content,imageurl,fromId,fromname,role,read,date,userId});
        })
    },
    delete: function(item) {
        repository.write(() => {
            repository.delete(item)
        })
    },
    deleteFriends:function(fromId){
        const item = repository.objects('FriendReqSchema').filtered("fromId = '" + fromId+ "'");
        this.delete(item);
    },
    update:function(item = {}){
        repository.write(() => {
            // 方式一
            repository.create('FriendReqSchema', {...item,status:1}, true);
        });
    },
    filter:function(userId){
        let sortBy = [['date', true]];
        return repository.objects('FriendReqSchema').filtered("userId = '" + userId+ "'").sorted(sortBy);
    },
    changeAll:function(userId){
        repository.write(() => {
            // 方式一
           this.filter(userId).map((item)=>item.read = true)
        });
    },
    findUnread:function(userId){
        let sortBy = [['date', true]];
        return repository.objects('FriendReqSchema').filtered("userId = '" + userId+ "'").filtered("read =false").sorted(sortBy);
    },
    deleteAll:function(){
        repository.write(() => {
            repository.delete(repository.objects('FriendReqSchema'))
        })
    }
};
export default FriendRequestService;