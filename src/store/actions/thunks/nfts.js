import {Axios, Canceler} from '../../../core/axios';
import * as actions from '../../actions';
import api from '../../../core/api';

export const fetchNftsBreakdown = (authorId, isMusic = false) => async (dispatch, getState) => {

    //access the state
    const state = getState();
    console.log(state);

    dispatch(actions.getNftBreakdown.request(Canceler.cancel));

    try {
        let filter = authorId ? 'author=' + authorId : '';
        let music = isMusic ? 'category=music' : '';

        const {data} = await Axios.get(`'/nfts_music.json' : api.nfts}?${filter}&${music}`, {
            cancelToken: Canceler.token,
            params: {}
        });

        dispatch(actions.getNftBreakdown.success(data));
    } catch (err) {
        dispatch(actions.getNftBreakdown.failure(err));
    }
};

export const fetchNftShowcase = () => async (dispatch) => {

    dispatch(actions.getNftShowcase.request(Canceler.cancel));

    try {
        const {data} = await Axios.get(`${api.baseUrl}${api.nftShowcases}`, {
            cancelToken: Canceler.token,
            params: {}
        });

        dispatch(actions.getNftShowcase.success(data));
    } catch (err) {
        dispatch(actions.getNftShowcase.failure(err));
    }
};

export const fetchNftDetail = (nftId) => async (dispatch) => {
    dispatch(actions.getNftDetail.request(Canceler.cancel));

    try {
        const response = await Axios({
            method: 'get', headers: {"accept": "schema"}, url: '/nfts/' + nftId, data: {}
        })
        console.log(response)
        dispatch(actions.getNftDetail.success(response));
    } catch (err) {
        dispatch(actions.getNftDetail.failure(err));
    }
};
