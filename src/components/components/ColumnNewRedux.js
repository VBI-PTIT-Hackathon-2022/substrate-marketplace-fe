import React, { memo, useEffect, useState } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import * as actions from '../../store/actions/thunks';
import * as selectors from '../../store/selectors';
import { clearNfts, clearFilter } from '../../store/actions';
import NftCard from './NftCard';
import { shuffleArray } from '../../store/utils';
//react functional component
const ColumnNewRedux = ({ showLoadMore = true, shuffle = false, collectionOwned= false, user }) => {
    const dispatch = useDispatch();
    const nftItems = useSelector(selectors.nftItems);
    const nfts = nftItems ? shuffle ? shuffleArray(nftItems) : nftItems : [];
    const [height, setHeight] = useState(0);

    const onImgLoad = ({target:img}) => {
        let currentHeight = height;
        if(currentHeight < img.offsetHeight) {
            setHeight(img.offsetHeight);
        }
    }

    useEffect(() => {
        async function fetchData(){
            if(!collectionOwned){
                await dispatch(actions.fetchNftsBreakdown(user));
            } else {
                await dispatch(actions.fetchNftOwned(user));
            }
        }
        fetchData();
    }, [dispatch, collectionOwned,user]);

    //will run when component unmounted
    useEffect(() => {
        return () => {
            dispatch(clearFilter());
            dispatch(clearNfts());
        }
    },[dispatch]);

    const loadMore = () => {
        if (!collectionOwned){
            dispatch(actions.fetchNftsBreakdown(user));
        } else {
            dispatch(actions.fetchNftOwned(user));
        }

    }

    return (
        <div className='row'>
            {nfts && nfts.map( (nft, index) => {
                return (<NftCard listing={nft} key={index} onImgLoad={onImgLoad} height={height}/>)
            })}
            { showLoadMore && nfts.length >= 20 &&
                <div className='col-lg-12'>
                    <div className="spacer-single"></div>
                    <span onClick={loadMore} className="btn-main lead m-auto">Load More</span>
                </div>
            }
        </div>
    );
};

export default memo(ColumnNewRedux);