// import {Axios} from "../axios";


export const nftSaveDb = async (api) => {

    if (api.query && api.query.system && api.query.system.events) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        //const [eventFeed, setEventFeed] = useState([])
        let unsub = null

        unsub = await api.query.system.events(events => {
            // loop through the Vec<EventRecord>
            events.forEach(record => {
                // extract the phase, event and the event types
                const {event} = record
                // show what we are busy with
                const evHuman = event.toHuman()
                const evName = evHuman.method;
                const walletAddress = evHuman.data;

                console.log(evName, walletAddress);
                // if(evName == "nftCurrency:Mint") {
                //     co
                //     Axios({
                //       method: 'post',
                //       url: '/user',
                //       data: {
                //         walletAddress: ev,
                //         tokenId:
                //       }
                //     });
                // }

            })
        })
        return () => unsub && unsub()
    }

}