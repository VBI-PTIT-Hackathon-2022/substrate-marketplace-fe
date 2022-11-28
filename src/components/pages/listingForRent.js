import React, { Component } from "react";
import Clock from "../components/Clock";
import Footer from '../components/footer';
import { createGlobalStyle } from 'styled-components';
import {useLocation, useNavigate} from "react-router-dom";
import {saveListingNFT} from "../../store/actions/thunks/renting";
import {useSubstrateState} from "../../substrate-lib";

const GlobalStyles = createGlobalStyle`
  header#myHeader.navbar.sticky.white {
    background: #ffffff;
    border-bottom: solid 1px #000000;
  }

  header#myHeader.navbar .search #quick_search {
    color: #000000;
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
function ListingForRent(Component) {
    return function WrappedComponent(props) {
        const currentAccount =useSubstrateState().currentAccount;
        const navigate = useNavigate();
        const myHookValue = useLocation();
        return <Component {...props} nft={myHookValue} currentAccount={currentAccount}  navigate={navigate}/>;
    }
}
class Listing extends Component {
    state = {
        currentAccount:null,
        due_date: null,
        fee:null,
        nftDetail:null,
        navigate:null
    }

    constructor(props) {
        super(props);
        this.state = {
            nftDetail: props.nft.state,
            currentAccount: props.currentAccount,
            navigate:props.navigate,
        };
    }

    updateInputValue(evt,type) {
        const value = evt.target.value;
        if(type === "fee"){
            this.setState({
                fee: value
            });
        }
        if(type === "due_date"){
            // console.log((new Date(value)).getTime());
            // const timestamp = new Date(value).getTime();
            this.setState({
                due_date: value
            });
        }
    }
    render() {
        return (
            <div>
                <GlobalStyles/>

                <section className='jumbotron breadcumb no-bg' style={{backgroundImage: `url(${process.env.PUBLIC_URL + '/img/background/12.jpg'})`}}>
                    <div className='mainbreadcumb'>
                        <div className='container'>
                            <div className='row m-10-hor'>
                                <div className='col-12'>
                                    <h1 className='text-center' style={{color: "black"}}>Listing NFT for Rent</h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className='container'>

                    <div className="row">
                        <div className="col-lg-7 offset-lg-1 mb-5">
                            <form id="form-create-item" className="form-border" action="#">
                                <div className="field-set">
                                    <h5>Title</h5>
                                    <h4>{this.state.nftDetail.name}</h4>

                                    <div className="spacer-10"></div>

                                    <h5>Token Id</h5>
                                    <h4>{this.state.nftDetail.tokenId}</h4>

                                    <div className="spacer-10"></div>

                                    <div className="de_tab tab_methods">

                                        <div className="de_tab_content pt-3">

                                            <div id="tab_opt_2" >
                                                <h5>Fee per day</h5>
                                                <input type="text" name="fee" id="item_price_bid" className="form-control" onChange={evt => this.updateInputValue(evt,"fee")} placeholder="enter fee per day renting" />

                                                <div className="spacer-20"></div>

                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <h5>Expiration date</h5>
                                                        <input type="date" name="due_date" id="due_date" onChange={evt => this.updateInputValue(evt,"due_date")} className="form-control" />
                                                    </div>
                                                </div>
                                            </div>

                                        </div>

                                    </div>

                                    <div className="spacer-20"></div>

                                    <div className="spacer-10"></div>

                                    <input type="button" id="submit" className="btn-main" onClick={async () => {
                                        const response = await saveListingNFT(this.state.currentAccount, this.state);
                                        console.log(response)
                                        if (response===201) {
                                            const path = "/itemDetail/" + this.state.nftDetail.tokenId;
                                            this.state.navigate(path);
                                        }
                                    }} value="Listing"/>
                                </div>
                            </form>
                        </div>

                        <div className="col-lg-3 col-sm-6 col-xs-12">
                            <h5>Preview item</h5>
                            <div className="nft__item m-0">
                                <div className="de_countdown">
                                    <Clock deadline={this.state.due_date} />
                                </div>
                                <div className="author_list_pp">
                          <span>
                              <img className="lazy" src={process.env.PUBLIC_URL+'/img/author/author-2.jpg'} alt=""/>
                              <i className="fa fa-check"></i>
                          </span>
                                </div>
                                <div className="nft__item_wrap">
                          <span>
                              <img src={this.state.nftDetail.image} id="get_file_2" className="lazy nft__item_preview" alt=""/>
                          </span>
                                </div>
                                <div className="nft__item_info">
                          <span >
                              <h4>{this.state.nftDetail.name}</h4>
                          </span>
                                    <div className="nft__item_price">
                                        {this.state.fee} UNIT
                                    </div>
                                    <div className="nft__item_action">
                                        <span>Rent NFT</span>
                                    </div>
                                    <div className="nft__item_like">
                                        <i className="fa fa-heart"></i><span>50</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </section>

                <Footer />
            </div>
        );
    }
}

export default ListingForRent(Listing);