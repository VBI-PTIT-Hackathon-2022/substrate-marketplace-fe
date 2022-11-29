import {Axios, Canceler} from '../../../core/axios';
import * as actions from '../../actions';
import api from '../../../core/api';

export const fetchNftsBreakdown = (user) => async (dispatch, getState) => {

    //access the state
    const state = getState();
    console.log(state);

    dispatch(actions.getNftBreakdown.request(Canceler.cancel));

    try {

        const {data} = await Axios.post(`/users/`+user.walletAddress, {
            cancelToken: Canceler.token,
            body: {name:user.name}
        });
        console.log(data)
        dispatch(actions.getNftBreakdown.success(data.nfts));
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
            method: 'get', url: '/nfts/' + nftId
        })
        console.log(response)
        dispatch(actions.getNftDetail.success(response.data));
    } catch (err) {
        dispatch(actions.getNftDetail.failure(err));
    }
};


