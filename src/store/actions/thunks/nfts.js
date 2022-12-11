import {Axios, Canceler} from '../../../core/axios';
import * as actions from '../../actions';

export const fetchNftsBreakdown = (user) => async (dispatch, getState) => {

    //access the state
    const state = getState();
    console.log(state);

    dispatch(actions.getNftBreakdown.request(Canceler.cancel));

    try {
        if(user){
            const {data} = await Axios.get(`/listings/`+ user.walletAddress, {
                cancelToken: Canceler.token,
            });
            console.log(data)
            dispatch(actions.getNftBreakdown.success(data));
        } else {
            const {data} = await Axios.get(`/listings`, {
                cancelToken: Canceler.token,
            });
            console.log(data)
            dispatch(actions.getNftBreakdown.success(data));
        }
    } catch (err) {
        dispatch(actions.getNftBreakdown.failure(err));
    }
};

export const fetchNftOwned = (user) => async (dispatch,getState) => {

    const state = getState();
    console.log(state);
    dispatch(actions.getNftBreakdown.request(Canceler.cancel));

    try {
        const {data} = await Axios.get("/nfts/owned/"+user.walletAddress, {
            cancelToken: Canceler.token,
            params: {}
        });
        dispatch(actions.getNftBreakdown.success(data));
    } catch (err) {
        dispatch(actions.getNftBreakdown.failure(err));
    }
};

export const fetchNftDetail = (nftId) => async (dispatch) => {
    dispatch(actions.getNftDetail.request(Canceler.cancel));

    try {
        const response = await Axios({
            method: 'get', url: '/nfts/' + nftId
        })

        dispatch(actions.getNftDetail.success(response.data));
    } catch (err) {
        dispatch(actions.getNftDetail.failure(err));
    }
};

export const getUserRentedNFT = async (walletAddress) => {
    const response = await Axios({
        method: 'GET', url: '/users/rent/' + walletAddress,
    })
    const data = response.data;
    return data;

}

export const getNFT = async (nftId) => {
    const response = await Axios({
        method: 'GET', url: '/nfts/' + nftId
    })
    const data = response.data;
    return data;
}


