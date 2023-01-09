import React, {memo, useEffect, useState} from "react";
import {TxButton} from "../../substrate-lib/components";
import {useSubstrateState} from "../../substrate-lib";
import {getMessageRenting} from "../../store/actions/thunks/renting";

const Checkout = ({nft, ownerNFT,listingDetail,setOpenCheckout}) => {
    const [status, setStatus] = useState('')
    const {api,currentAccount,keyring} = useSubstrateState();
    const [accountBalance, setAccountBalance] = useState(0);
    const [feePaid, setFeePaid] = useState(0);
    const [type, setPaidType] = useState(0);
    const [dueDate, setDueDate] = useState('2022-1-1')
    const [orderRight, setOrderRight] = useState(null);

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

    async function updateInputValue(evt,isDate) {
        let order = {
            lenderAddress: listingDetail.maker,
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

    return (
        <div className='checkout'>
            <div className='maincheckout'>
                <button className='btn-close' onClick={() => setOpenCheckout(false)}>x</button>
                <div className='heading'>
                    <h3>Checkout </h3>
                </div>
                <p>You are about to rent a <span className="bold">{nft.name}</span>
                    from <span className="bold">  {ownerNFT}</span></p>
                <div className='detailcheckout mt-4'>
                    <div className='listcheckout'>
                        <h6>
                            Enter expiration date.
                            <span className="color"> Before the listing stops on {listingDetail.due_date} </span>
                        </h6>
                        <input type="date" name="due_date" id="due_date" onChange={evt => updateInputValue(evt, true)}
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
                                       onChange={evt => updateInputValue(evt, false)}
                                /> &nbsp;&nbsp;
                                <label for={"type0"}>Pay at once</label>

                            </div>
                            <div className="col-sm-4">
                                <input type="radio" name="type" value="1" id="type1"
                                       onChange={evt => updateInputValue(evt, false)}
                                /> &nbsp;&nbsp;
                                <label htmlFor={"type"}>Pay per day</label>
                            </div>
                            <div className="col-sm-4">
                                <input type="radio" name="type" value="2" id="type1"
                                       onChange={evt => updateInputValue(evt, false)}
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
                                        {Number(listingDetail.fee).toFixed(5) * 7} UNIT / week
                                    </> :
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
                              inputParams: ["0x" + Buffer.from(keyring.decodeAddress(listingDetail.maker)).toString('hex'), "0x" + Buffer.from(currentAccount.addressRaw).toString('hex'), listingDetail.message, listingDetail.signature, orderRight, "0x0000"],
                              paramFields: [true, true, true, true, true, true],
                          }}>
                </TxButton>
                <p id="status">
                    {status}
                </p>
            </div>
        </div>

    );
};

export default memo(Checkout);