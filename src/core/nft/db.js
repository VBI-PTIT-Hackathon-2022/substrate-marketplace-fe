//import {Axios} from "../axios";

export const userSaveDb = async (api, name,walletAddress) => {
    const url = "http://localhost:3001/users/" + walletAddress ;
    return fetch(url, {
        method: "POST", // POST, PUT, DELETE, etc.
        headers: {
            "accept": "schema",
            "Accept":"*/*",
            "Access-Control-Allow-Origin":"*",
            "Connection":"kepp-alive",
            "Content-Type": "application/json;charset=UTF-8"
        }, body: JSON.stringify({"name": name}),
    })
        .then(response => response.json())
        .then(data => {
            console.log(data.json())
            return data.json()
        });
    // if (api.query && api.query.system && api.query.system.events) {
    //     await api.query.system.events(events => {
    //         // loop through the Vec<EventRecord>
    //         events.forEach(record => {
    //             // extract the phase, event and the event types
    //             const {event} = record
    //             // show what we are busy with
    //             const evHuman = event.toHuman()
    //             const evName = evHuman.method;
    //             const walletAddress = evHuman.data[0];
    //             if (evName === "Mint") {
    //
    //                 // Axios({
    //                 //     method: 'post',
    //                 //     headers: {"Content-Type":"application/json"},
    //                 //     url:
    //                 // '/users/' + walletAddress + "?tokenId=" + token_id,
    //                 //     data:
    //                 // {
    //                 //     name:name
    //                 // }
    //             }
    //         })
    //
    //     })
    // }
}

