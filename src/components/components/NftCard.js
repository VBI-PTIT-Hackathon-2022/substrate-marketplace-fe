import React, { memo } from 'react';
import styled from "styled-components";
import Clock from "./Clock";
import { useNavigate } from 'react-router-dom';

const Outer = styled.div`
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  overflow: hidden;
  border-radius: 8px;
`;

//react functional component
const NftCard = ({ nft, className = 'd-item col-lg-3 col-md-6 col-sm-6 col-xs-12 mb-4', clockTop = true, height, onImgLoad }) => {
    const navigate = useNavigate();
    const navigateTo = (link) => {
        navigate(link);
    }

    return (
        <div className={className}>
            <div className="nft__item m-0">
                { nft.type === 'single_items' ? (
                    <div className='icontype'><i className="fa fa-bookmark"></i></div>
                ) : (
                    <div className='icontype'><i className="fa fa-shopping-basket"></i></div>
                )
                }
                { nft.deadline && clockTop &&
                    <div className="de_countdown">
                        <Clock deadline={nft.due_date} />
                    </div>
                }
                <div className="author_list_pp">
                    <span onClick={()=> navigateTo(nft.author_link)}>
                        <img className="lazy" src={process.env.PUBLIC_URL + "/img/author/author-2.jpg"} alt=""/>
                        <i className="fa fa-check"></i>
                    </span>
                </div>
                <div className="nft__item_wrap" style={{height: `${height}px`}}>
                    <Outer>
                    <span>
                        <img onLoad={onImgLoad} src={nft.image} className="lazy nft__item_preview" alt=""/>
                    </span>
                    </Outer>
                </div>
                { nft.due_date && !clockTop &&
                    <div className="de_countdown">
                        <Clock deadline={nft.due_date} />
                    </div>
                }
                <div className="nft__item_info">
                    <span onClick={() => navigateTo("/itemDetail/"+nft.tokenId)}>
                        <h4>{nft.name}</h4>
                    </span>

                        <div className="nft__item_price">
                            {nft.fee} UNIT
                        </div>


                    <div className="nft__item_action">
                        <span onClick={() => navigateTo("/itemDetail/"+nft.tokenId)}>{ nft.status === 'on_auction' ? 'Place a bid' : 'Buy Now' }</span>
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