/**
 * Created by yjy on 2018/1/13.
 */
/**
 * Created by yjy on 2017/12/20.
 */
import repository from '../repository'
import AllUserMesModel from '../model/AllUserMesModel';

const AllUserMesService = {
    findAll: function(sortBy,id) {
        if (!sortBy) sortBy = [['time', true]];
        return repository.objects('AllMessSchema').sorted(sortBy);
    },

    save: function({id, label,lastMessage,time,number,imageurl,msgType,uniqueId,isMe,chatId}) {
        if (repository.objects('AllMessSchema').filtered("uniqueId = '" + uniqueId+ "'").length > 0){
            console.log('return');
            return this.update({id, label,lastMessage,time,number,imageurl,msgType,uniqueId,isMe,chatId});
        } else{
            console.log('create');
            return repository.write(() => {
                repository.create('AllMessSchema', {id, label,lastMessage,time,number,imageurl,msgType,uniqueId,isMe,chatId});
            });
        }
    },

    delete: function(item) {
        repository.write(() => {
            repository.delete(item)
        })
    },
    update:function(item = {}){
        repository.write(() => {
            // 方式一
            repository.create('AllMessSchema', {...item}, true);
        });
    },
    filter:function(id){
        return repository.objects('AllMessSchema').filtered("id = '" + id+ "'").sorted('time',{type:true});

    },
    changeAll:function(uniqueId){
        repository.write(() => {
            // 方式一
            console.log(repository.objects('AllMessSchema').filtered("uniqueId = '" + uniqueId+ "'"));
             repository.objects('AllMessSchema').filtered("uniqueId = '" + uniqueId+ "'").map((item)=>{
                 console.log(item);
                 item.number = 0
             })
        });
    },
    getNum:function(uniqueId){
        // 方式一
        const obj = repository.objects('AllMessSchema').filtered("uniqueId = '" + uniqueId+ "'");
        if(obj.length > 0){
            console.log('good');
            return obj[0]['number']
        }else{
            console.log('hey');
            return 0;
        }
    },
    getAllNum:function(id){
        const obj = repository.objects('AllMessSchema').filtered("id = '" + id+ "'").sorted('time',{type:true});
        if(obj.length > 0  ){
            let num = 0;
           obj.map((item,index)=>{
               console.log(item);
               num += item.number;
           })
            return num;
        }else{
            return 0;
        }
    },
    getLastMsg:function(uniqueId){
        const obj = repository.objects('AllMessSchema').filtered("uniqueId = '" + uniqueId+ "'");
        if(obj.length > 0){
            return obj[obj.length -1]
        }else{
            return {};
        }
    }
};
export default AllUserMesService;