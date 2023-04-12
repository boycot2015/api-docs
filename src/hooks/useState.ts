import { ref } from 'vue';

// states 存储 initialState 状态
// stateSetters 存储 dispatch 函数
// stateIndex 默认从0开始
let [states, stateSetters, stateIndex] = [[], [], 0] as any

/**
 * 创建 createState
 * */
function createState(initialState:any, stateIndex:number) {
    // 响应式数据包装
    const state = ref(initialState);
    // 如果states中存在则直接返回 否则返回包装的ref数据
    return states[stateIndex] !== undefined ? states[stateIndex] : state;
}

/**
 * 创建 createSetter
 */
function createSetter(stateIndex:number) {
    // 返回一个函数  这里其实玩了一手 闭包的概念 《stateIndex》被返回的函数引用了
    return function (newState:any) {
        if (typeof newState === "function") {
            // 如果为函数则手动调用 并且更新states对应值
            states[stateIndex].value = newState(states[stateIndex].value);
        } else {
            // 直接更新states对应值
            states[stateIndex].value = newState;
        }
    };
}

// 业务中 useState 可以多次  所以就需要使用队列
function useState(initialState:any) {
    // 创建 state
    states[stateIndex] = createState(initialState, stateIndex);
    // 如果没有则直接进行添加
    if (!stateSetters[stateIndex]) {
        stateSetters.push(createSetter(stateIndex));
    }
    
    const _state = states[stateIndex];
    const _setState = stateSetters[stateIndex];
    
    // 每次调用 useState 则会++1 
    stateIndex++;

    return [_state, _setState];
}

export default useState;