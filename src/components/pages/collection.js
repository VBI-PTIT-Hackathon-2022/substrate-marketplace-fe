import React, {memo, useEffect} from "react";
import Footer from '../components/footer';
import { createGlobalStyle } from 'styled-components';
import ColumnNewRedux from "../components/ColumnNewRedux";
import {useDispatch, useSelector} from "react-redux";
import * as selectors from "../../store/selectors";
import {fetchUserDetail} from "../../store/actions/thunks";

const GlobalStyles = createGlobalStyle`
  header#myHeader.navbar.white {
    background: #fff;
  }
  @media only screen and (max-width: 1199px) {
    .navbar{
      background: #403f83;
    }
    .navbar .menu-line, .navbar .menu-line1, .navbar .menu-line2{
      background: #111;
    }
    .item-dropdown .dropdown a{
      color: #111 !important;
    }
  }
`;

const Collection = function({walletAddress})  {
    const [openMenu, setOpenMenu] = React.useState(true);
    const [openMenu1, setOpenMenu1] = React.useState(false);
    const handleBtnClick = () => {
        setOpenMenu(!openMenu);
        setOpenMenu1(false);
        document.getElementById("Mainbtn").classList.add("active");
        document.getElementById("Mainbtn1").classList.remove("active");
    };
    const handleBtnClick1 = () => {
        setOpenMenu1(!openMenu1);
        setOpenMenu(false);
        document.getElementById("Mainbtn1").classList.add("active");
        document.getElementById("Mainbtn").classList.remove("active");
    };

    const dispatch = useDispatch();
    const hotCollectionsState = useSelector(selectors.hotCollectionsState);
    const userDetail = hotCollectionsState.data ? hotCollectionsState.data[0] : {};

    useEffect(() => {
        console.log(walletAddress)
        dispatch(fetchUserDetail("",walletAddress));
    }, [dispatch, walletAddress]);


    return (
        <div>
            <GlobalStyles/>
            {
                <section id='profile_banner' className='jumbotron breadcumb no-bg' style={{backgroundImage: `url(${process.env.PUBLIC_URL + '/img/background/4.jpg'})`}}>
                    <div className='mainbreadcumb'>
                    </div>
                </section>
            }

            <section className='container d_coll no-top no-bottom'>
                <div className='row'>
                    <div className="col-md-12">
                        <div className="d_profile">
                            <div className="profile_avatar">

                                    <div className="d_profile_img">
                                        <img src={process.env.PUBLIC_URL + "/img/author/author-2.jpg"} alt=""/>
                                        <i className="fa fa-check"></i>
                                    </div>

                                <div className="profile_name">
                                    <h4>
                                        { userDetail?
                                            <>
                                                {userDetail.name}
                                                <div className="clearfix"></div>
                                                <span id="wallet" className="profile_wallet">{walletAddress}</span>
                                                <button id="btn_copy" title="Copy Text">Copy</button>
                                            </>
                                            : <></> }

                                    </h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className='container no-top'>
                <div className='row'>
                    <div className='col-lg-12'>
                        <div className="items_filter">
                            <ul className="de_nav">
                                <li id='Mainbtn' className="active"><span onClick={handleBtnClick}>Listing</span></li>
                                <li id='Mainbtn1' className=""><span onClick={handleBtnClick1}>Owned</span></li>
                            </ul>
                        </div>
                    </div>
                </div>
                {openMenu && (
                    <div id='zero1' className='onStep fadeIn'>
                        {userDetail?
                        <>
                            <ColumnNewRedux shuffle showLoadMore={false} user={userDetail} />
                        </>
                            :
                            <>
                            </>
                        }

                    </div>
                )}
                {openMenu1 && (
                    <div id='zero2' className='onStep fadeIn'>
                        {userDetail?
                            <>
                                <ColumnNewRedux shuffle showLoadMore={false} />
                            </>
                            :
                            <>
                            </>
                        }

                    </div>
                )}
            </section>
            <Footer />
        </div>
    );
}
export default memo(Collection);