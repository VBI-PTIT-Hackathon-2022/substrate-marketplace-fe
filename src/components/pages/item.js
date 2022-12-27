import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from 'react-redux';
import Clock from "../components/Clock";
import Footer from '../components/footer';
import {createGlobalStyle} from 'styled-components';
import * as selectors from '../../store/selectors';
import {fetchNftDetail, fetchNftOffer, getUserDetail} from "../../store/actions/thunks";
import moment from "moment";
import {useNavigate, useParams} from "react-router-dom";
import {useSubstrateState} from "../../substrate-lib";
import {getListingDetail} from "../../store/actions/thunks/renting";
import {TxButton} from "../../substrate-lib/components";
import Checkout from "../components/Checkout";
import CheckoutOffer from "../components/CheckoutOffer";

const GlobalStyles = createGlobalStyle`
  header#myHeader.navbar.white {
    background: #fff;
    border-bottom: solid 1px #dddddd;
  }

  .mr40 {
    margin-right: 40px;
  }

  .mr15 {
    margin-right: 15px;
  }

  .btn2 {
    background: #f6f6f6;
    color: #8364E2 !important;
  }

  @media only screen and (max-width: 1199px) {
    .navbar {
      background: #403f83;
    }

    .navbar .menu-line, .navbar .menu-line1, .navbar .menu-line2 {
      background: #111;
    }

    .item-dropdown .dropdown a {
      color: #111 !important;
    }
  }
`;
export default function ItemDetailRedux(props) {
    const nftId = useParams().nftId;
    const [openMenu0, setOpenMenu0] = React.useState(true);
    const [openMenu, setOpenMenu] = React.useState(false);
    const [openMenu1, setOpenMenu1] = React.useState(false);
    const [custodian, setCustodian] = React.useState(null);
    const [status, setStatus] = useState('')
    const navigate = useNavigate();

    const handleBtnClick0 = () => {
        setOpenMenu0(!openMenu0);
        setOpenMenu(false);
        setOpenMenu1(false);
        document.getElementById("Mainbtn0").classList.add("active");
        document.getElementById("Mainbtn").classList.remove("active");
        document.getElementById("Mainbtn1").classList.remove("active");
    };
    const handleBtnClick = () => {
        setOpenMenu(!openMenu);
        setOpenMenu1(false);
        setOpenMenu0(false);
        document.getElementById("Mainbtn").classList.add("active");
        document.getElementById("Mainbtn1").classList.remove("active");
        document.getElementById("Mainbtn0").classList.remove("active");
    };
    const handleBtnClick1 = () => {
        setOpenMenu1(!openMenu1);
        setOpenMenu(false);
        setOpenMenu0(false);
        document.getElementById("Mainbtn1").classList.add("active");
        document.getElementById("Mainbtn").classList.remove("active");
        document.getElementById("Mainbtn0").classList.remove("active");
    };

    const dispatch = useDispatch();
    const nftDetailState = useSelector(selectors.nftDetailState);
    const offersDispatch = useSelector(selectors.nftOffer);
    const nft = nftDetailState.data ? nftDetailState.data : [];
    const offers = offersDispatch? offersDispatch:[];
    const [ownerNFT, setOwnerNFT] = useState(null);
    const [openCheckout, setOpenCheckout] = useState(false);
    const [openCheckoutbid, setOpenCheckoutbid] = useState(false);
    const [listingDetail, setListingDetail] = useState(null);
    const {currentAccount} = useSubstrateState();

    async function getName(walletAddress) {
        const data = await getUserDetail(walletAddress);
        return data.name;
    }

    async function fetchDataName(ownerAddress, custodianAddress){
        const ownerName = await getName(ownerAddress);
        setOwnerNFT(ownerName);
        const custodianName = await getName(custodianAddress);
        setCustodian(custodianName);
    }

    async function getDetailRenting(account, tokenId) {
        const data = await getListingDetail(account, tokenId);
        if (data) {
            setListingDetail(data);
        }
    }

    useEffect(() => {
        async function fetchData() {
            await dispatch(fetchNftDetail(nftId));
            await dispatch(fetchNftOffer(nftId));
        }

        fetchData();
        fetchDataName(nft.walletAddress,nft.custodian);
        getDetailRenting(nft.walletAddress, nftId);
    }, [dispatch, nftId, nft.walletAddress, nft.custodian]);


    return (<div>
        <GlobalStyles/>
        <section className='container'>
            <div className='row mt-md-5 pt-md-4'>
                <div className="col-md-6 text-center">
                    <img src={nft.image} className="img-fluid img-rounded mb-sm-30" alt=""/>
                </div>
                <div className="col-md-6">
                    <div className="item_info">
                        {listingDetail && <>
                            Listing for rent ends in
                            <div className="de_countdown">
                                <Clock deadline={listingDetail.due_date}/>
                            </div>
                        </>}
                        <h2>{nft.name}</h2>
                        <div className="item_info_counts">
                            <div className="item_info_views"><i className="fa fa-eye"></i>14</div>
                            <div className="item_info_like"><i className="fa fa-heart"></i>5</div>
                        </div>
                        <p>{nft.description}</p>

                        <div className="d-flex flex-row">
                            <div className="mr40">
                                <h6>Owner</h6>
                                <div className="item_author">
                                    <div className="author_list_pp">
                                            <span>
                                                <img className="lazy"
                                                     src={process.env.PUBLIC_URL + "/img/author/author-2.jpg"}
                                                     alt="author"/>
                                                <i className="fa fa-check"></i>
                                            </span>
                                    </div>
                                    <div className="author_list_info">
                                        <span>{ownerNFT}</span>
                                        <br/>
                                        <span>{nft.walletAddress}</span>
                                    </div>
                                </div>
                            </div>
                            {/*<div className="mr40">*/}
                            {/*    <h6>Collection</h6>*/}
                            {/*    <div className="item_author">*/}
                            {/*        <div className="author_list_pp">*/}
                            {/*            <span>*/}
                            {/*                <img className="lazy" src={nft.author && api.baseUrl + nft.author.avatar.url} alt=""/>*/}
                            {/*                <i className="fa fa-check"></i>*/}
                            {/*            </span>*/}
                            {/*        </div>*/}
                            {/*        <div className="author_list_info">*/}
                            {/*            <span>{nft.author && nft.author.username}</span>*/}
                            {/*        </div>*/}
                            {/*    </div>*/}
                            {/*</div>*/}
                        </div>

                        <div className="spacer-40"></div>

                        <div className="de_tab">

                            <ul className="de_nav">
                                <li id='Mainbtn0' className="active"><span onClick={handleBtnClick0}>Details</span>
                                </li>
                                <li id='Mainbtn'><span onClick={handleBtnClick}>Offers</span></li>
                                <li id='Mainbtn1' className=''><span onClick={handleBtnClick1}>History</span></li>
                            </ul>

                            <div className="de_tab_content">
                                {openMenu0 && (<div className="tab-1 onStep fadeIn">
                                    <div className="d-block mb-3">
                                        {nft.status === "isRenting" && <div className="mr40">
                                            <h6>Custodian</h6>
                                            <div className="item_author">
                                                <div className="author_list_pp">
                                                    <span>
                                                        <img className="lazy"
                                                             src={nft.walletAddress && process.env.PUBLIC_URL + "/img/author/author-2.jpg"}
                                                             alt=""/>
                                                        <i className="fa fa-check"></i>
                                                    </span>
                                                </div>
                                                <div className="author_list_info">
                                                    <span>{custodian}</span>
                                                    <br/>
                                                    <span>{nft.custodian}</span>

                                                </div>
                                            </div>
                                        </div>}

                                        <div className="row mt-5">
                                            {nft.attributes && nft.attributes.map((value) => {
                                                return (<div className="col-lg-4 col-md-6 col-sm-6">
                                                    <div className="nft_attr">
                                                        <h5>{value[0].trait_type}</h5>
                                                        <h4>{value[0].value}</h4>
                                                        <span>78% have this trait</span>
                                                    </div>
                                                </div>)
                                            })}

                                        </div>

                                    </div>
                                </div>)}

                                    {openMenu  && (
                                        <div className="tab-1 onStep fadeIn">
                                            {offers && offers.map((offer, index) => (
                                                <div className="p_list" key={index}>
                                                    <div className="p_list_pp">
                                                <span>
                                                    <img className="lazy"
                                                         src={process.env.PUBLIC_URL + "/img/author/author-" + index + ".jpg"}
                                                         alt=""/>
                                                    <i className="fa fa-check"></i>
                                                </span>
                                                    </div>
                                                    <div className="p_list_info">
                                                        Offer {offer.maker === nft.walletAddress && 'accepted'}
                                                        <b>{offer.fee} UNIT</b> for renting due to <b>{offer.due_date}</b>
                                                        <span>by <b>{offer.maker}</b> at {moment(offer.createdAt).format('L, LT')}</span>
                                                    </div>
                                                    <br/>
                                                    <TxButton id="mintButton" className="btn-main lead mb-5" label="Accept offer"
                                                              type="SIGNED-TX"
                                                              setStatus={setStatus}
                                                              attrs={{
                                                                  palletRpc: 'renting',
                                                                  callable: 'createRental',
                                                                  inputParams: ["0x" + Buffer.from(currentAccount.addressRaw).toString('hex'), "0x" + Buffer.from(offer.maker).toString('hex'), offer.message, "0x000", offer.message, offer.signature],
                                                                  paramFields: [true, true, true, true, true, true],
                                                              }}>
                                                    </TxButton>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                <h3>{status}</h3>

                                {/*{openMenu1 && (*/}
                                {/*    <div className="tab-2 onStep fadeIn">*/}
                                {/*        {nft.history && nft.history.map((bid, index) => (*/}
                                {/*            <div className="p_list" key={index}>*/}
                                {/*                <div className="p_list_pp">*/}
                                {/*            <span>*/}
                                {/*                <img className="lazy" src={api.baseUrl + bid.author.avatar.url} alt=""/>*/}
                                {/*                <i className="fa fa-check"></i>*/}
                                {/*            </span>*/}
                                {/*                </div>*/}
                                {/*                <div className="p_list_info">*/}
                                {/*                    Bid {bid.author.id === nft.author.id && 'accepted'} <b>{bid.value} ETH</b>*/}
                                {/*                    <span>by <b>{bid.author.username}</b> at {moment(bid.created_at).format('L, LT')}</span>*/}
                                {/*                </div>*/}
                                {/*            </div>*/}
                                {/*        ))}*/}
                                {/*    </div>*/}
                                {/*)}*/}


                                {/* button for checkout */}
                                <div className="d-flex flex-row mt-5">
                                    {currentAccount === null || openMenu || openMenu1 ? <>
                                    </> : <>
                                        {currentAccount.address === nft.walletAddress ? <>
                                            {listingDetail ? <>
                                                <TxButton id="mintButton" className="btn-main lead mb-5 mr15"
                                                          label="Cancel listing"
                                                          type="SIGNED-TX"
                                                          input={listingDetail}
                                                          setStatus={setStatus}
                                                          attrs={{
                                                              palletRpc: 'renting',
                                                              callable: 'cancelOffer',
                                                              inputParams: [listingDetail.message, true],
                                                              paramFields: [true, true],
                                                          }}>
                                                </TxButton>

                                            </> : <>
                                                <button className='btn-main lead mb-5 mr15'
                                                        onClick={() => {
                                                            const path = '/listingForRent/' + nftId;
                                                            navigate(path, {state: nft});
                                                        }}>Listing for Rent
                                                </button>
                                            </>}

                                            <button className='btn-main btn2 lead mb-5'
                                            >List for Sell
                                            </button>
                                        </> : <>
                                            {listingDetail && nft.status === "forRent" ? <>
                                                <button className='btn-main lead mb-5 mr15'
                                                        onClick={() => setOpenCheckout(true)}>Rent now
                                                </button>
                                                <button className='btn-main btn2 lead mb-5' onClick={() => setOpenCheckoutbid(true)}
                                                > Place an offer
                                                </button>
                                            </> : nft.status === "isRenting"? <>
                                                    <button className='btn-main lead mb-5 mr15'
                                                    >Rented
                                                    </button>
                                                </> :
                                                <>
                                                    <button className='btn-main btn2 lead mb-5' onClick={() => setOpenCheckoutbid(true)}
                                                    > Place an offer
                                                    </button>
                                                </>
                                            }
                                        </>}

                                    </>}

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <Footer/>
        {openCheckout && <Checkout listingDetail={listingDetail} nft={nft} ownerNFT={ownerNFT} />}
        {openCheckoutbid && <CheckoutOffer listingDetail={listingDetail} nft={nft} ownerNFT={ownerNFT} />}

    </div>);
}