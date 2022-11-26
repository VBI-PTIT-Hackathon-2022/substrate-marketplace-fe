import {pinJSONToIPFS} from "./pinata";

export const metadata = async (url, name, description) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks

    if (url.trim() === "" || name.trim() === "" || description.trim() === "") {
        return {
            success: false, status: "Please make sure all fields are completed before minting.",
        };
    }

    //make metadata
    const metadata = {};
    metadata.name = name;
    metadata.image = url;
    metadata.description = description;


    const pinataResponse = await pinJSONToIPFS(metadata);
    console.log(pinataResponse.pinataUrl)
    const tokenURI = pinataResponse.pinataUrl;
    try {
        return {
            uri: tokenURI, status:"Your metadata is here"
        };
    } catch (error) {
        return {
            success: false, status: "Something went wrong: " + error.message,
        };
    }
};
