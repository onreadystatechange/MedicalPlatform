/**
 * Created by yjy on 2017/11/16.
 */
// import Routers from '../Stack';
// const navReducer = (state,action) => {
//     const newState = Routers.router.getStateForAction(action, state);
//     return newState || state;
// };
//
// export default navReducer;






// /* @flow */
//
// import { NavigationActions } from 'react-navigation';
//
// import Navigator from '../Stack';
//
//
// // Prevent screen called multitple times by quickly tap
// const navigateOnce = getStateForAction => (action, state) => {
//     const { type, routeName } = action;
//     return state &&
//     type === NavigationActions.NAVIGATE &&
//     routeName === state.routes[state.routes.length - 1].routeName
//         ? null
//         : getStateForAction(action, state);
// };
//
//
// import { NavigationActions } from 'react-navigation';
// import Navigator from '../Stack';
//
//
// Navigator.router.getStateForAction = navigateOnce(Navigator.router.getStateForAction);
//
// export default (state,action)=>{
//     const nextState = Navigator.router.getStateForAction(action, state);
//     return nextState || state;
// };

// import AppNavigator from '../Stack';
// import { NavigationActions } from 'react-navigation';
// export default (state, action) => {
//     let nextState;
//     console.log(action);
//     switch (action.type) {
//         case "Navigation/BACK":
//             // we don't prevent back so we don't need any wire thing here
//             nextState = AppNavigator.router.getStateForAction(NavigationActions.back(), state);
//             break;
//         case "Navigation/NAVIGATE":
//             nextState = AppNavigator.router.getStateForAction(NavigationActions.navigate({
//                 routeName: action.routeName,
//                 params:{
//                     ...action.params,
//                     navigateAt:new Date().getTime()
//                 }
//             }), state);
//             break;
//         default:
//             nextState = AppNavigator.router.getStateForAction(action, state)
//             break
//     }
//     return nextState || state
// }


import AppNavigator from '../Stack';

const getCurrentRouteName = (state) => {
    const route = state.routes[state.index];
    return typeof route.index === 'undefined' ? route.routeName : getCurrentRouteName(route);
}

export default (state, action) => {
    const nextState = AppNavigator.router.getStateForAction(action, state);

    // prevents navigating twice to the same route
    if (state && nextState) {
        const stateRouteName = getCurrentRouteName(state);
        const nextStateRouteName = getCurrentRouteName(nextState);
        return stateRouteName === nextStateRouteName ? state : nextState;
    }

    // Simply return the original `state` if `nextState` is null or undefined.
    return nextState || state;
};