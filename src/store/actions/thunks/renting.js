import {Axios} from '../../../core/axios';
import { ApiPromise } from '@polkadot/api';
import {stringToU8a, u8aToHex} from '@polkadot/util';
import {web3Enable, web3FromSource } from '@polkadot/extension-dapp';

export const saveListingNFT = async (account,data) => {
    const extensions = await web3Enable('NFT.owl');
    if (extensions.length === 0) {
        // no extension installed, or the user did not accept the authorization
        // in this case we should inform the use and give a link to the extension
        return;
    }
    const order = await ApiPromise.create({
        types: {
            Order: {
                lender: 'AccountId',
                borrower: 'AccountId',
                fee: 'u64',
                token: 'Vec<u8>',
                due_date: 'u64',
                paid_type: 'u64'
            }        }
    });
    const due_date = new Date(data.due_date).getTime()/1000;
    const fee = Number(data.fee)*(10**12);
    const listing = order.createType('Order', {
        lender: data.nftDetail.walletAddress,
        fee: fee,
        token: data.nftDetail.tokenId,
        due_date: due_date,
        paid_type: 1
    })
    const message = u8aToHex(stringToU8a(listing));

    if (account.meta.source){
        const injector = await web3FromSource(account.meta.source);

        const signRaw = injector?.signer?.signRaw;

        if (signRaw) {
            // after making sure that signRaw is defined
            // we can use it to sign our message
            const { signature } = await signRaw({
                address: account.address,
                data: message,
                type: 'bytes'
            });
            try {
                const response = await Axios({
                    method: 'post', url: '/listings/',
                    data:{
                        lender: data.nftDetail.walletAddress,
                        tokenId: data.nftDetail.tokenId,
                        fee: data.fee,
                        due_date: data.due_date,
                        paid_type:1,
                        message: message,
                        signature: signature,
                    }
                })
                await Axios({
                    method: 'post', url: '/nfts/'+data.nftDetail.tokenId,
                    data:{
                        tokenId: data.nftDetail.tokenId,
                        custodian: data.nftDetail.custodian,
                        status: 'forRent',
                    }
                })
                return response;
            } catch (err) {
                console.log(err);
            }
        }
    }
    const signature = u8aToHex(account.sign(message));
    try {
        const response = await Axios({
            method: 'post', url: '/listings/',
            data:{
                lender: data.nftDetail.walletAddress,
                tokenId: data.nftDetail.tokenId,
                fee: data.fee,
                due_date: data.due_date,
                paid_type:1,
                message: message,
                signature: signature,
            }
        })
        await Axios({
            method: 'post', url: '/nfts/'+data.nftDetail.tokenId,
            data:{
                tokenId: data.nftDetail.tokenId,
                custodian: data.nftDetail.custodian,
                status: 'forRent',
            }
        })
        return response;
    } catch (err) {
        console.log(err);
    }
};

export const getListingDetail = async (account,tokenId) => {
    try {
        const response = await Axios({
            method: 'get', url: '/listings/'+account,
            params:{
                tokenId: tokenId,
            }
        })
        return response.data[0];
    } catch (err) {
        console.log(err);
    }
}

export const cancelListing = async (listing) => {
    try {
        const response = await Axios({
            method: 'delete', url: '/listings/'+listing.tokenId,
        })
        return response;
    } catch (err) {
        console.log(err);
    }
}

export async function getMessageRenting (orderRight){
    const order = await ApiPromise.create({
        types: {
            Order: {
                lender: 'AccountId',
                borrower: 'AccountId',
                fee: 'u64',
                token: 'Vec<u8>',
                due_date: 'u64',
                paid_type: 'u64'
            }        }
    });
    const due_date = new Date(orderRight.due_date).getTime()/1000;
    const fee = Number(orderRight.fee)*(10**12);
    const orderRental = order.createType('Order', {
        lender: orderRight.lenderAddress,
        borrower: orderRight.borrowerAddress,
        fee: fee,
        token: orderRight.tokenId,
        due_date: due_date,
        paid_type: orderRight.paid_type
    })
    const message = u8aToHex(stringToU8a(orderRental));
    console.log(orderRental, message)
    return message;
}

export const makeOffer = async (account,data) => {
    const extensions = await web3Enable('NFT.owl');
    if (extensions.length === 0) {
        // no extension installed, or the user did not accept the authorization
        // in this case we should inform the use and give a link to the extension
        return;
    }
    const order = await ApiPromise.create({
        types: {
            Order: {
                lender: 'AccountId',
                borrower: 'AccountId',
                fee: 'u64',
                token: 'Vec<u8>',
                due_date: 'u64',
                paid_type: 'u64'
            }        }
    });
    const due_date = new Date(data.due_date).getTime()/1000;
    const fee = Number(data.fee)*(10**12);
    const offer = order.createType('Order', {
        lender: data.owner,
        borrower: account.address,
        fee: fee,
        token: data.tokenId,
        due_date: due_date,
        paid_type: data.paid_type
    })
    const message = u8aToHex(stringToU8a(offer));

    if (account.meta.source){
        const injector = await web3FromSource(account.meta.source);

        const signRaw = injector?.signer?.signRaw;

        if (signRaw) {
            // after making sure that signRaw is defined
            // we can use it to sign our message
            const { signature } = await signRaw({
                address: account.address,
                data: message,
                type: 'bytes'
            });
            try {
                const response = await Axios({
                    method: 'post', url: '/offers/',
                    data:{
                        maker: account.address,
                        isLender: false,
                        tokenId: data.tokenId,
                        fee: data.fee,
                        due_date: data.due_date,
                        paid_type: data.paid_type,
                        message: message,
                        signature: signature,
                    }
                })

                console.log(response)
                return response;
            } catch (err) {
                console.log(err);
            }
        }
    }
    const signature = u8aToHex(account.sign(message));
    try {
        const response = await Axios({
            method: 'post', url: '/offers/',
            data:{
                maker: account.address,
                isLender: false,
                tokenId: data.tokenId,
                fee: data.fee,
                due_date: data.due_date,
                paid_type: data.paid_type,
                message: message,
                signature: signature,
            }
        })
        console.log(response)
        return response;
    } catch (err) {
        console.log(err);
    }
};
