/**
 * Created by yjy on 2017/11/28.
 */
// import { StatusBar } from 'react-native';
// import Routers from '../Stack';
//
// const statusBarReducer = (state, action) => {
//     switch (action.type) {
//         default:
//             const next = Routers.router.getStateForAction(action, state);
//             const activeRouteName = getActiveRouteName(next);
//             switch (activeRouteName) {
//                 case 'LoginScreen':
//                     StatusBar.setHidden(false);
//                     break;
//                 case 'Images':
//                     StatusBar.setTranslucent(true);
//                     break;
//                 default:
//                     StatusBar.setHidden(false);
//                     StatusBar.setTranslucent(false);
//                     StatusBar.setBackgroundColor('#3399ff');
//                     break;
//             }
//             return next;
//     }
// };
//
// const getActiveRouteName = (state) => {
//     const index = !!state.routes && state.index != null && state.index;
//     if (Number.isInteger(index)) {
//         return getActiveRouteName(state.routes[index]);
//     }
//     return state.routeName;
// };
//
//
// export default statusBarReducer;