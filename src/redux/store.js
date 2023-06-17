import { legacy_createStore as createStore, applyMiddleware,compose } from 'redux'
import { reducers } from './reducers/index.js'
import thunk from 'redux-thunk';
import { composeWithDevTools } from "redux-devtools-extension";
import { createWrapper } from "next-redux-wrapper";

const middleware = [thunk];
export const store = createStore(
  reducers,
  composeWithDevTools(applyMiddleware(...middleware))
)
const makeStore = () => store;

export const wrapper = createWrapper(makeStore);
