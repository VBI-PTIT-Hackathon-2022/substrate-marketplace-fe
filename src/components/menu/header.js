import React, {useEffect, useState} from 'react'
import {CopyToClipboard} from 'react-copy-to-clipboard'

import {Button, Dropdown, Icon, Label,} from 'semantic-ui-react'

import {useSubstrate, useSubstrateState} from '../../substrate-lib'
import {Link, useMatch, useResolvedPath} from "react-router-dom";

const CHROME_EXT_URL = 'https://chrome.google.com/webstore/detail/polkadot%7Bjs%7D-extension/mopnmbcafieddcagagdcbnhejhlodfdd'
const FIREFOX_ADDON_URL = 'https://addons.mozilla.org/en-US/firefox/addon/polkadot-js-extension/'

const acctAddr = acct => (acct ? acct.address : '')

const NavLink = (props) => {
    let resolved = useResolvedPath(props.to);
    let match = useMatch({path: resolved.pathname, end: true});

    return (
        <Link
            {...props}
            className={match ? 'active' : 'non-active'}
        />
    )
};

function Main(props) {
    const {
        setCurrentAccount, state: {keyring, currentAccount},
    } = useSubstrate()

    // Get the list of accounts we possess the private key for
    const keyringOptions = keyring.getPairs().map(account => ({
        key: account.address, value: account.address, text: account.meta.name.toUpperCase(), icon: 'user',
    }))

    const initialAddress = keyringOptions.length > 0 ? keyringOptions[0].value : ''

    // Set the initial address
    useEffect(() => {
        // `setCurrentAccount()` is called only when currentAccount is null (uninitialized)
        !currentAccount && initialAddress.length > 0 && setCurrentAccount(keyring.getPair(initialAddress))
    }, [currentAccount, setCurrentAccount, keyring, initialAddress])

    const onChange = addr => {
        setCurrentAccount(keyring.getPair(addr))
    }
    useEffect(() => {
        const header = document.getElementById("myHeader");
        const totop = document.getElementById("scroll-to-top");
        const sticky = header.offsetTop;
        const scrollCallBack = window.addEventListener("scroll", () => {
            if (window.pageYOffset > sticky) {
                header.classList.add("sticky");
                totop.classList.add("show");

            } else {
                header.classList.remove("sticky");
                totop.classList.remove("show");
            }
        });
        return () => {
            window.removeEventListener("scroll", scrollCallBack);
        };
    }, []);

    return (
        <header className={`navbar white active`} id="myHeader">
            <div className="container">

                <div className='logo px-0'>
                    <div className="navbar-title navbar-item">
                        <NavLink to={"/"}>
                            <img alt="" className="logo-2" sizes={"small"}
                                 src={process.env.PUBLIC_URL + "/assets/logo.png"}/>
                        </NavLink>
                    </div>
                </div>
                <div className='search'>
                    <input id="quick_search" className="xs-hide" name="quick_search" placeholder="search item here..."
                           type="text"/>
                </div>
                <div className="navbar-item">
                    <NavLink to="/explorer">
                        Explorer
                    </NavLink>
                </div>
                <div className="navbar-item">
                    <NavLink to="/collection">
                        Collection
                    </NavLink>
                </div>
                <div className="navbar-item">
                    <NavLink to="/mint">
                        Mint your NFT
                    </NavLink>
                </div>
                <div className='mainside'>
                    <div className="navbar-item">
                        {!currentAccount ? (<span>
              Create an account with Polkadot-JS Extension (
              <a target="_blank" rel="noreferrer" href={CHROME_EXT_URL}>
                Chrome
              </a>
              ,&nbsp;
                            <a target="_blank" rel="noreferrer" href={FIREFOX_ADDON_URL}>
                Firefox
              </a>
              )&nbsp;
            </span>) : null}
                        <CopyToClipboard text={acctAddr(currentAccount)}>
                            <Button
                                basic
                                circular
                                size={"large"}
                                icon="user"
                                color={currentAccount ? 'purple' : 'grey'}
                                margin={"3px"}
                            />
                        </CopyToClipboard>
                        <Dropdown
                            search
                            selection
                            clearable
                            placeholder="Select an account"
                            options={keyringOptions}
                            onChange={(_, dropdown) => {
                                onChange(dropdown.value)
                            }}
                            value={acctAddr(currentAccount)}
                        />
                        <BalanceAnnotation/>
                    </div>
                </div>
            </div>
        </header>)
}

function BalanceAnnotation(props) {
    const {api, currentAccount} = useSubstrateState()
    const [accountBalance, setAccountBalance] = useState(0)

    // When account address changes, update subscriptions
    useEffect(() => {
        let unsubscribe

        // If the user has selected an address, create a new subscription
        currentAccount && api.query.system
            .account(acctAddr(currentAccount), balance => setAccountBalance(balance.data.free.toHuman()))
            .then(unsub => (unsubscribe = unsub))
            .catch(console.error)

        return () => unsubscribe && unsubscribe()
    }, [api, currentAccount])

    return currentAccount ? (<Label pointing="left">
        <Icon name="money" color="purple" size={"large"}/>
        {accountBalance}
    </Label>) : null
}

export default function Header(props) {
    const {api, keyring} = useSubstrateState()
    return keyring.getPairs && api.query ? <Main {...props} /> : null
}
