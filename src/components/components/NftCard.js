import React, {memo, useEffect, useState} from 'react';
import styled from "styled-components";
import Clock from "./Clock";
import {useNavigate} from 'react-router-dom';
import {getNFT, getUserDetail} from "../../store/actions/thunks";

const Outer = styled.div`
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  overflow: hidden;
  border-radius: 8px;
`;

//react functional component
const NftCard = ({
                     listing,
                     className = 'd-item col-lg-3 col-md-6 col-sm-6 col-xs-12 mb-4',
                     clockTop = true,
                     height,
                     onImgLoad
                 }) => {
    const navigate = useNavigate();
    const [nft,setNft] = useState(null);
    const [ownerName,setOwnerName] = useState(null);
    // const dispatch = useDispatch();
    // const nftDetailState = useSelector(selectors.nftDetailState);
    // const nft = nftDetailState.data ? nftDetailState.data : [];
    const navigateTo = (link) => {
        navigate(link);
    }
    const isLoading = true;

    useEffect(() => {
        async function fetchData() {
            const nftDetail = await getNFT(listing.tokenId);
            setNft(nftDetail)
            if (listing.lender){
                const owner = await getUserDetail(listing.lender);
                setOwnerName(owner.name);
            } else {
                const owner = await getUserDetail(listing.walletAddress);
                setOwnerName(owner.name);
            }

        }
        fetchData()
    }, [listing]);

    return (
        <div className={className}>
            <div className="nft__item m-0">
                <div className='icontype'><i className="fa fa-bookmark"></i></div>
                <div className='icontype'><i className="fa fa-shopping-basket"></i></div>

                {listing.due_date && clockTop &&
                    <div className="de_countdown">
                        <Clock deadline={listing.due_date}/>
                    </div>
                }
                <div className="author_list_pp">
                    {
                        nft &&isLoading &&
                        <span onClick={() => navigateTo("/collection/" + nft.walletAddress)}>
                        <img className="lazy" src={process.env.PUBLIC_URL + "/img/author/author-2.jpg"} alt=""/>
                        <i className="fa fa-check"></i>
                    </span>
                    }
                </div>
                <div className="nft__item_wrap" style={{height: `${height}px`}}>
                    <Outer>
                        {
                            isLoading && nft &&
                            <span>
                        <img onLoad={onImgLoad} src={nft.image} className="lazy nft__item_preview" alt=""/>
                    </span>

                        }
                    </Outer>
                </div>
                {listing.due_date && !clockTop &&
                    <div className="de_countdown">
                        <Clock deadline={listing.due_date}/>
                    </div>
                }
                <div className="nft__item_info">
                    {
                        isLoading && nft &&
                        <span onClick={() => navigateTo("/itemDetail/" + nft.tokenId)}>
                            <h4>{nft.name}</h4>
                            <h4>{ownerName}</h4>
                    </span>
                    }
                    <div className="nft__item_price">
                        {nft&& (nft.status === "forRent" || nft.status==="isRenting") ?
                            <>
                                {listing.fee} UNIT
                            </>
                            :
                            <>
                            </>
                        }
                    </div>


                    <div className="nft__item_action">
                        {listing && nft && nft.status !=="isRenting" ?
                            <>
                                <span
                                    onClick={() => navigateTo("/itemDetail/" + nft.tokenId)}>
                                    Detail
                                </span>
                            </>
                            :
                            <>
                                <span onClick={() => navigateTo("/itemDetail/" + nft.tokenId)}>Rented</span>
                            </>
                        }

                    </div>
                    <div className="nft__item_like">
                        <i className="fa fa-heart"></i><span>14</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default memo(NftCard);