/**
 * Created by yjy on 2018/1/11.
 */
/**
 * Created by yjy on 2017/12/20.
 */
import repository from '../repository'
import SingleMessageModal from '../model/SingleMessageModal';

const SingleMessageService = {
    findAll: function(sortBy,id) {
        if (!sortBy) sortBy = [['time', true]];
        return repository.objects('ChatMessageSchema').sorted(sortBy);
    },

    save: function({id, content,msgType,fromname,fromId,imageurl,read,time,uniqueId,error}) {
        if (repository.objects('ChatMessageSchema').filtered("id = '" + id+ "'").length > 0) return;
        repository.write(() => {
            repository.create('ChatMessageSchema', {id, content,msgType,fromname,fromId,imageurl,read,time,uniqueId,error});
        })
    },
    delete: function(item,others) {
        repository.write(() => {
            repository.delete(item);
        });
        this.save(others)
    },
    deletes:function (item) {
        repository.write(() => {
            repository.delete(item);
        });
    },
    update:function(item = {}){
        repository.write(() => {
            // 方式一
            repository.create('ChatMessageSchema', {...item,status:1}, true);
        });
    },
    filter:function(uniqueId){
        return repository.objects('ChatMessageSchema').filtered("uniqueId = '" + uniqueId+ "'").sorted('time');
    },
    changeAll:function(uniqueId){
        repository.write(() => {
            // 方式一
            this.filter(uniqueId).map((item)=>item.read = true)
        });
    },
    findUnread:function(uniqueId){
        let str = '我';
        return repository.objects('ChatMessageSchema').filtered("uniqueId = '" + uniqueId+ "'").filtered("read =false").filtered("fromname != '" + str+ "'").sorted('time').length;
    },
    deleteAll:function(uniqueId){
        return this.deletes(repository.objects('ChatMessageSchema').filtered("uniqueId = '" + uniqueId+ "'"));
    },
    filterId:function(id){
        return repository.objects('ChatMessageSchema').filtered("id = '" + id+ "'").sorted('time');
    }

};
export default SingleMessageService;