import { pinJSONToIPFS } from "./pinata.js";
import {useSubstrateState} from "../../substrate-lib";
import {useState} from "react";

export const mintNFT = async (url, name, description) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { api, currentAccount } = useSubstrateState();
    // The transaction submission status
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [status, setStatus] = useState('');
    // The currently stored value
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [currentValue, setCurrentValue] = useState(0)

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [formValue, setFormValue] = useState(0)

    if (url.trim() === "" || name.trim() === "" || description.trim() === "") {
        return {
            success: false,
            status: "Please make sure all fields are completed before minting.",
        };
    }

    //make metadata
    const metadata = {};
    metadata.name = name;
    metadata.image = url;
    metadata.description = description;

    const pinataResponse = await pinJSONToIPFS(metadata);
    if (!pinataResponse.success) {
        return {
            success: false,
            status: "Something went wrong while uploading your tokenURI.",
        };
    }
    const tokenURI = pinataResponse.pinataUrl;

    // Execute extrinsic

    try {

        return {
            success: true,
            status:
                "Check out your transaction on Etherscan: https://ropsten.etherscan.io/tx/" +
                txHash,
        };
    } catch (error) {
        return {
            success: false,
            status: "Something went wrong: " + error.message,
        };
    }
};
