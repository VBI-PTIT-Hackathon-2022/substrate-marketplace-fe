import React, {useCallback, useState} from "react";
import {createGlobalStyle} from 'styled-components';
import Footer from '../components/footer';
import {TxButton} from "../../substrate-lib/components";
import {useSubstrateState} from "../../substrate-lib";
import {metadata} from "../../core/nft/interact";
import Clock from "../components/Clock";

const GlobalStyles = createGlobalStyle`
  header#myHeader.navbar.sticky.white {
    background: #ffffff;
    border-bottom: solid 1px #000000;
  }

  header#myHeader.navbar .search #quick_search {
    color: rgb(0, 0, 0);
    background: rgba(47, 29, 29, 0.1);
  }

  header#myHeader.navbar.white .btn, .navbar.white a, .navbar.sticky.white a {
    color: #000000;
  }

  header#myHeader .dropdown-toggle::after {
    color: rgba(255, 255, 255, .5);
  }

  header#myHeader .logo .d-block {
    display: none !important;
  }

  header#myHeader .logo .d-none {
    display: block !important;
  }

  .mainside {
    .connect-wal {
      display: none;
    }

    .logout {
      display: flex;
      align-items: center;
    }
  }

  @media only screen and (max-width: 1199px) {
    .navbar {
      background: #403f83;
    }

    .navbar .menu-line, .navbar .menu-line1, .navbar .menu-line2 {
      background: #fff;
    }

    .item-dropdown .dropdown a {
      color: #fff !important;
    }
  }
`;

export default function Minter(props) {
    const [status, setStatus] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [url, setURL] = useState("");
    const [tokenURI, setTokenURI] = useState("");
    const {currentAccount} = useSubstrateState()

    const onMintPressed = async () => {
        const {uri} = await metadata(url, name, description);
        setStatus(status);
        setTokenURI(uri);
    }


    // const onSelectNft = (nft) => {
    //     setName(nft.title);
    //     setDescription(nft.description);
    //     setURL(api.baseUrl + nft.preview_image.url);
    // }

    const isEmpty = useCallback(() => {
        return url.trim() === '' || name.trim() === '' || description.trim() === '';
    }, [url, name, description]);

    return (
        <div>
            <GlobalStyles/>
            <section className='jumbotron breadcumb no-bg'
                     style={{backgroundImage: `url(${process.env.PUBLIC_URL + '/img/background/16.jpg'})`}}>
                <div className='mainbreadcumb'>
                    <div className='container'>
                        <div className='row m-10-hor'>
                            <div className='col-12'>
                                <h1 className='text-center' style={{color: "black"}}>NFT Minting</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className='container'>
                <div className="Minter">
                    <h1>Mint your NFT</h1>
                    <br/><br/>
                    {
                        currentAccount.addressRaw != null &&
                        <div className={"row"}>
                            <div className="col-lg-7 offset-lg-1 mb-5">
                                <form id="form-create-item" className="form-border" action="#">
                                    <div className="field-set">
                                        <h2>Link to image asset: </h2>
                                        <input
                                            className="form-control"
                                            type="text"
                                            placeholder="e.g. https://gateway.pinata.cloud/ipfs/<hash>"
                                            onChange={(event) => setURL(event.target.value)}
                                        />
                                        <h2>Name: </h2>
                                        <input
                                            className="form-control"
                                            type="text"
                                            placeholder="e.g. My first NFT!"
                                            onChange={(event) => setName(event.target.value)}
                                        />
                                        <h2>Description: </h2>
                                        <input
                                            className="form-control"
                                            type="text"
                                            placeholder="e.g. My Cool NFT!"
                                            onChange={(event) => setDescription(event.target.value)}
                                        />
                                    </div>
                                </form>
                                {!isEmpty() &&
                                    <>
                                        <span>NFT Name: {name}</span>
                                        <br/>
                                        <br/>
                                        <div  className="d-flex align-items-start" >
                                            <button id="mintButton" className="btn-main" onClick={onMintPressed}>
                                                Get Metadata
                                            </button>
                                            &nbsp;&nbsp;&nbsp;&nbsp;
                                            {tokenURI!=="" &&
                                                <TxButton id="mintButton" className="btn-main" label="Mint NFT"
                                                          type="SIGNED-TX"
                                                          setStatus={setStatus}
                                                          attrs={{
                                                              palletRpc: 'nftCurrency',
                                                              callable: 'mintTo',
                                                              inputParams: ["0x"+Buffer.from(currentAccount.addressRaw).toString('hex'), tokenURI],
                                                              paramFields: [true,true],
                                                          }}>
                                                    Proceed to Mint
                                                </TxButton>}

                                        </div>
                                        <br/>
                                    </>
                                }
                                {tokenURI!=="" &&
                                    <p id="token_uri">
                                        Your token metadata is online now on {tokenURI}
                                    </p>}

                                <p id="status">
                                    {status}
                                </p>
                            </div>
                            <div className="col-lg-3 col-sm-6 col-xs-12">
                                <h5>Preview item</h5>
                                <div className="nft__item m-0">
                                    <div className="de_countdown">
                                        <Clock deadline="December, 22, 2023" />
                                    </div>
                                    <div className="author_list_pp">
                          <span>
                              <img className="lazy" src="./img/author/author-2.jpg" alt=""/>
                              <i className="fa fa-check"></i>
                          </span>
                                    </div>
                                    <div className="nft__item_wrap">
                          <span>
                              <img src={url} id="get_file_2" className="lazy nft__item_preview" alt=""/>
                          </span>
                                    </div>
                                    <div className="nft__item_info">
                          <span >
                              <h4>{name}</h4>
                          </span>
                                        <div className="nft__item_like">
                                            <i className="fa fa-heart"></i><span>50</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }

                </div>
            </section>
            <Footer/>
        </div>
    );
};
