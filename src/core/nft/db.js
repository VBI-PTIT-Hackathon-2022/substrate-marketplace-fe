import {Axios} from "../axios";

export const userGetInfoNFT = async (name, walletAddress) => {
    const response = await Axios({
        method: 'post', headers: {"Content-Type": "application/json"}, url: '/users/' + walletAddress, data: {
            name: name
        }
    })
    const data = response.data.nfts[response.data.nfts.length-1];
    return data;

}



