import { pinJSONToIPFS } from "./pinata.js";

export const metadata = async (url, name, description) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks

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
    console.log(tokenURI)
    try {

        return {
            uri:tokenURI,
            success: true
        };
    } catch (error) {
        return {
            success: false,
            status: "Something went wrong: " + error.message,
        };
    }
};
