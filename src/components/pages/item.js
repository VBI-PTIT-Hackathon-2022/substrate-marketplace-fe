import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from 'react-redux';
import Clock from "../components/Clock";
import Footer from '../components/footer';
import {createGlobalStyle} from 'styled-components';
import * as selectors from '../../store/selectors';
import {fetchNftDetail, getUserDetail} from "../../store/actions/thunks";
/*import Checkout from "../components/Checkout";
import Checkoutbid from "../components/Checkoutbid";*/
// import api from "../../core/api";
// import moment from "moment";
import {useNavigate, useParams} from "react-router-dom";
import {useSubstrateState} from "../../substrate-lib";
import {getListingDetail, getMessageRenting} from "../../store/actions/thunks/renting";
import {TxButton} from "../../substrate-lib/components";

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
    const nft = nftDetailState.data ? nftDetailState.data : [];
    const {keyring} = useSubstrateState();
    const [ownerNFT, setOwnerNFT] = useState(null);
    const [openCheckout, setOpenCheckout] = useState(false);
    const [openCheckoutbid, setOpenCheckoutbid] = useState(false);
    const [listingDetail, setListingDetail] = useState(null);
    const {api, currentAccount} = useSubstrateState();
    const [accountBalance, setAccountBalance] = useState(0);
    const [feePaid, setFeePaid] = useState(0);
    const [type, setPaidType] = useState(0);
    const [dueDate, setDueDate] = useState('2022-1-1')
    const [status, setStatus] = useState('')
    const [orderRight, setOrderRight] = useState(null);

    async function getName(owner, custodian) {
        const ownerData = await getUserDetail(owner);
        setOwnerNFT(ownerData.name);
        const custodianData = await getUserDetail(custodian);
        setCustodian(custodianData.name);
    }

    useEffect(() => {
        let unsubscribe
        // If the user has selected an address, create a new subscription
        currentAccount && api.query.system
            .account(currentAccount.address, balance => {
                const value = balance.data.free.toHuman().replace(/,/g, '');
                console.log(value);
                setAccountBalance(value / (10 ** 12));
            })
            .then(unsub => (unsubscribe = unsub))
            .catch(console.error)

        return () => unsubscribe && unsubscribe()
    }, [api, currentAccount])

    async function getDetailRenting(account, tokenId) {
        const data = await getListingDetail(account, tokenId);
        console.log(data);
        if (data) {
            setListingDetail(data);
        }

    }

    useEffect(() => {
        async function fetchData() {
            await dispatch(fetchNftDetail(nftId));
        }

        fetchData();
        getName(nft.walletAddress, nft.custodian);
        getDetailRenting(nft.walletAddress, nftId);
    }, [dispatch, nftId, nft.walletAddress, nft.custodian]);


    async function updateInputValue(evt,isDate) {
        let order = {
            lenderAddress: listingDetail.lender,
            borrowerAddress: currentAccount.address,
            fee: listingDetail.fee,
            tokenId: listingDetail.tokenId,
            due_date: dueDate,
            paid_type: type,
        };
        if (isDate) {
            const now = new Date().getTime();
            const due_date = new Date(evt.target.value).getTime();
            console.log(now, due_date);
            const days = ((due_date - now) / 1000) / 86400;
            if (parseInt(days) < 1) return;
            setFeePaid(parseInt(days) * listingDetail.fee);
            setDueDate(evt.target.value);
            order.due_date = evt.target.value;
        } else {
            order.paid_type = parseInt(evt.target.value);
            setPaidType(order.paid_type)
        }

        console.log(order);
        const messageRight = await getMessageRenting(order);
        setOrderRight(messageRight);
    }


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

                                    {/*{openMenu  && (*/}
                                    {/*    <div className="tab-1 onStep fadeIn">*/}
                                    {/*        {nft.bids && nft.bids.map((bid, index) => (*/}
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
                                        {currentAccount === null ? <>
                                            <span>Waiting for connecting ....</span>

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
                                                    <button className='btn-main btn2 lead mb-5'
                                                    > Place an offer
                                                    </button>
                                                </> : nft.status === "isRenting"? <>
                                                    <button className='btn-main lead mb-5 mr15'
                                                            >Rented
                                                    </button>
                                                </> :
                                                    <>
                                                        <button className='btn-main btn2 lead mb-5'
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
            {openCheckout && <div className='checkout'>
                <div className='maincheckout'>
                    <button className='btn-close' onClick={() => setOpenCheckout(false)}>x</button>
                    <div className='heading'>
                        <h3>Checkout </h3>
                    </div>
                    <p>You are about to rent a <span className="bold">{nft.name} </span>
                        from <span className="bold">  {nft.walletAddress}</span></p>
                    <div className='detailcheckout mt-4'>
                        <div className='listcheckout'>
                            <h6>
                                Enter expiration date.
                                <span className="color"> Before the listing stops on {listingDetail.due_date} </span>
                            </h6>
                            <input type="date" name="due_date" id="due_date" onChange={evt => updateInputValue(evt,true)}
                                   className="form-control"/>
                        </div>

                    </div>
                    <div className='detailcheckout mt-4'>
                        <div className='listcheckout'>
                            <h6>
                                Enter type payment.
                                <span className="color"> Choose the best option for you</span>
                            </h6>
                            <div className="row">
                                <div className="col-sm-4">
                                    <input type="radio" name="type" value="0" id="type0"
                                           onChange={evt => updateInputValue(evt,false)}
                                    /> &nbsp;&nbsp;
                                    <label for={"type0"}>Pay at once</label>

                                </div>
                                <div className="col-sm-4">
                                    <input type="radio" name="type" value="1" id="type1"
                                           onChange={evt => updateInputValue(evt,false)}
                                    /> &nbsp;&nbsp;
                                    <label htmlFor={"type"}>Pay per day</label>
                                </div>
                                <div className="col-sm-4">
                                    <input type="radio" name="type" value="2" id="type1"
                                           onChange={evt => updateInputValue(evt,false)}
                                    /> &nbsp;&nbsp;
                                    <label htmlFor={"type"}>Pay per week</label>
                                </div>
                            </div>

                        </div>


                    </div>

                    <div className='heading mt-3'>
                        <p>Your balance</p>
                        <div className='subtotal'>
                            {accountBalance} UNIT
                        </div>
                    </div>

                    <div className='heading'>
                        <p>Fee rent per day</p>
                        <div className='subtotal'>
                            {Number(listingDetail.fee).toFixed(5)} UNIT
                        </div>
                    </div>

                    <div className='heading'>
                        <p>You will pay</p>
                        <div className='subtotal'>
                            {type === 0 ?
                                <>
                                    {feePaid} UNIT
                                </> : type === 1 ?
                                    <>
                                        {Number(listingDetail.fee).toFixed(5)} UNIT / day
                                    </> : type === 2 ?
                                        <>
                                            {Number(listingDetail.fee).toFixed(5) * 7 } UNIT / week
                                        </>:
                                        <></>
                            }

                        </div>
                    </div>
                    <TxButton id="mintButton" className="btn-main lead mb-5" label="Rent now"
                              type="SIGNED-TX"
                              setStatus={setStatus}
                              attrs={{
                                  palletRpc: 'renting',
                                  callable: 'createRental',
                                  inputParams: ["0x" + Buffer.from(keyring.decodeAddress(listingDetail.lender)).toString('hex'), "0x" + Buffer.from(currentAccount.addressRaw).toString('hex'), listingDetail.message, listingDetail.signature, orderRight, "0x0000"],
                                  paramFields: [true, true, true, true, true, true],
                              }}>
                        Rent now
                    </TxButton>
                    <p id="status">
                        {status}
                    </p>
                </div>
            </div>}
            {openCheckoutbid && <div className='checkout'>
                <div className='maincheckout'>
                    <button className='btn-close' onClick={() => setOpenCheckoutbid(false)}>x</button>
                    <div className='heading'>
                        <h3>Place a Bid</h3>
                    </div>
                    <p>You are about to purchase a <span className="bold">AnimeSailorClub #304</span>
                        <span className="bold">from Monica Lucas</span></p>
                    <div className='detailcheckout mt-4'>
                        <div className='listcheckout'>
                            <h6>
                                Your bid (ETH)
                            </h6>
                            <input type="text" className="form-control"/>
                        </div>
                    </div>
                    <div className='detailcheckout mt-3'>
                        <div className='listcheckout'>
                            <h6>
                                Enter quantity.
                                <span className="color">10 available</span>
                            </h6>
                            <input type="text" name="buy_now_qty" id="buy_now_qty" className="form-control"/>
                        </div>
                    </div>
                    <div className='heading mt-3'>
                        <p>Your balance</p>
                        <div className='subtotal'>
                            10.67856 ETH
                        </div>
                    </div>
                    <div className='heading'>
                        <p>Service fee 2.5%</p>
                        <div className='subtotal'>
                            0.00325 ETH
                        </div>
                    </div>
                    <div className='heading'>
                        <p>You will pay</p>
                        <div className='subtotal'>
                            0.013325 ETH
                        </div>
                    </div>
                    <button className='btn-main lead mb-5'>Checkout</button>
                </div>
            </div>}

        </div>);
}
