import { combineReducers } from 'redux';
import nftReducer from './nfts';
import hotCollectionsReducer from './hotCollections';
import authorListReducer from './authorList';
import filterReducer  from "./filters";
export const rootReducer = combineReducers({
    NFT: nftReducer,
    hotCollections: hotCollectionsReducer,
    authors: authorListReducer,
    filters: filterReducer,
});

const reducers = (state, action) => rootReducer(state, action);

export default reducers;