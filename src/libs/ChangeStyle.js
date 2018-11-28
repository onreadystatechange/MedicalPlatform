/**
 * Created by yjy on 2017/11/30.
 */
import { StyleSheet} from 'react-native';
export default function changeStyle (newObj,style, data) {
    for (const key in style) {
        if (Object.prototype.hasOwnProperty.call(style, key)) {
            newObj[key] = { ...StyleSheet.flatten(style[key]) };
            if (data.length > 0){
                data.map((item,index) => {
                    if( key === item.cssType ) {
                        item.val.map((items,indexs) => {
                            newObj[key][items.key] = items.value;
                        })
                    }
                })
            }
        }
    }
}
