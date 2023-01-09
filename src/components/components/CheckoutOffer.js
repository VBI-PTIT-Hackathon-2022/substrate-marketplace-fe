import React, {memo, useEffect, useState} from "react";
import {useSubstrateState} from "../../substrate-lib";
import {makeOffer} from "../../store/actions/thunks/renting";

const CheckoutOffer = ({nft, ownerNFT,listingDetail,setOpenCheckoutbid}) => {
    const {api,currentAccount} = useSubstrateState();

    const [accountBalance, setAccountBalance] = useState(0);
    const [feePaid, setFeePaid] = useState(0);
    const [fee, setFee] = useState(0);
    const [type, setPaidType] = useState(0);
    const [dueDate, setDueDate] = useState('2022-1-1')
    const [offer, setOffer] = useState(null);
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

    async function createOffer() {
        if (offer) {
            const response = await makeOffer(currentAccount, offer);
            if (response.statusText === "Created") {
                setOpenCheckoutbid(false)
            }
        } else {
            alert("Fill all fields needed before checkout ");
        }

    }
    async function updateInputValueOffer(evt,typeInp) {
        let offer = {
            maker: currentAccount.address,
            owner: nft.walletAddress,
            fee: fee,
            tokenId: nft.tokenId,
            due_date: dueDate,
            paid_type: type,
        };
        if (typeInp==="date") {
            const now = new Date().getTime();
            const due_date = new Date(evt.target.value).getTime();
            console.log(now, due_date);
            const days = ((due_date - now) / 1000) / 86400;
            if (parseInt(days) < 1) return;
            setFeePaid(parseInt(days) * fee);
            setDueDate(evt.target.value);
            offer.due_date = evt.target.value;
        } else if (typeInp==="type"){
            offer.paid_type = parseInt(evt.target.value);
            setPaidType(evt.target.value)
        } else if (typeInp === "fee"){
            offer.fee = evt.target.value;
            const now = new Date().getTime();
            const due_date = new Date(offer.due_date).getTime();
            const days = ((due_date - now) / 1000) / 86400;
            setFeePaid(parseInt(days) * Number(offer.fee))
            setFee(evt.target.value)
        }

        console.log(offer);
        if (offer.fee!== 0 && offer.due_date!=='2022-1-1') {
            setOffer(offer)
        }

    }

    return (
        <div>
         <div className='checkout'>
            <div className='maincheckout'>
                <button className='btn-close' onClick={() => setOpenCheckoutbid(false)}>x</button>
                <div className='heading'>
                    <h3>Make an offer</h3>
                </div>
                <p>You are about to make an offer for <span className="bold">{nft.name}</span>
                    <span className="bold"> from {ownerNFT}</span></p>
                <div className='detailcheckout mt-4'>
                    <div className='listcheckout'>
                        <h6>
                            Fee rent per day (UNIT)
                        </h6>
                        <input type="text" className="form-control" onChange={evt => updateInputValueOffer(evt,"fee") }/>
                    </div>
                </div>
                <div className='detailcheckout mt-3'>
                    <div className='listcheckout'>
                        <h6>
                            Enter expiration date.
                            {listingDetail?
                                <>
                                    <span className="color"> Before the listing stops on {listingDetail.due_date} </span>
                                </>
                                :
                                <></>
                            }
                        </h6>
                        <input type="date" name="due_date" id="due_date" onChange={evt => updateInputValueOffer(evt,"date")}
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
                                       onChange={evt => updateInputValueOffer(evt, "type")}
                                /> &nbsp;&nbsp;
                                <label htmlFor={"type0"}>Pay at once</label>

                            </div>
                            <div className="col-sm-4">
                                <input type="radio" name="type" value="1" id="type1"
                                       onChange={evt => updateInputValueOffer(evt, "type")}
                                /> &nbsp;&nbsp;
                                <label htmlFor={"type"}>Pay per day</label>
                            </div>
                            <div className="col-sm-4">
                                <input type="radio" name="type" value="2" id="type1"
                                       onChange={evt => updateInputValueOffer(evt, "type")}
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
                    <p>You will pay</p>
                    <div className='subtotal'>
                        {type === "0" ?
                            <>
                                {feePaid} UNIT
                            </> : type === "1" ?
                                <>
                                    {Number(offer.fee).toFixed(5)} UNIT / day
                                </> : type === "2" ?
                                    <>
                                        {(Number(offer.fee).toFixed(5) * 7 ).toFixed(5)} UNIT / week
                                    </>:
                                    <>{type}</>
                        }
                    </div>
                </div>
                <button className='btn-main lead mb-5' onClick={createOffer}>Checkout</button>
            </div>
        </div>}
        </div>
    );
};

export default memo(CheckoutOffer);