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
    const due_date = new Date(data.due_date).getTime();
    const listing = order.createType('Order', {
        lender: data.nftDetail.walletAddress,
        fee: data.fee,
        token: data.nftDetail.tokenId,
        due_date: due_date,
        paid_type: 1
    })
    console.log(listing)
    const message = u8aToHex(stringToU8a(listing));
    console.log("message left: ",message)

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
                        fee: Number(data.fee),
                        due_date: data.due_date,
                        paid_type:1,
                        message: message,
                        signature: signature,
                    }
                })
                console.log(response);
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
                fee: Number(data.fee),
                due_date: data.due_date,
                paid_type:1,
                message: message,
                signature: signature,
            }
        })
        console.log(response);
        return response.status;
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
        console.log(response);
        return response.data[0];
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
    const due_date = new Date(orderRight.due_date).getTime();
    const orderRental = order.createType('Order', {
        lender: orderRight.lenderAddress,
        borrower: orderRight.borrowerAddress,
        fee: orderRight.fee,
        token: orderRight.tokenId,
        due_date: due_date,
        paid_type: 1
    })
    console.log(orderRental)
    const message = u8aToHex(stringToU8a(orderRental));

    return message;
}