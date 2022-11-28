import React, { createRef } from 'react'
import {
  Dimmer,
  Loader,
  Grid,
  Sticky,
  Message,
} from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'

import { SubstrateContextProvider, useSubstrateState } from './substrate-lib'
import { DeveloperConsole } from './substrate-lib/components'

import Header from "./components/menu/header";
import Home from "./components/pages/home";
import { createGlobalStyle } from 'styled-components';
import {Route, Routes} from "react-router-dom";
import ScrollToTop from "./components/menu/ScrollToTop";
import Mint from "./components/pages/mint";
import ItemDetailRedux from "./components/pages/item";
import ListingForRent from "./components/pages/listingForRent";
import Collection from "./components/pages/collection";
const GlobalStyles = createGlobalStyle`
  :root {
    scroll-behavior: unset;
  }
`;

function Main() {
  const { apiState, apiError, keyringState } = useSubstrateState()

  const loader = text => (
    <Dimmer active>
      <Loader size="small">{text}</Loader>
    </Dimmer>
  )

  const message = errObj => (
    <Grid centered columns={2} padded>
      <Grid.Column>
        <Message
          negative
          compact
          floating
          header="Error Connecting to Substrate"
          content={`Connection to websocket '${errObj.target.url}' failed.`}
        />
      </Grid.Column>
    </Grid>
  )

  if (apiState === 'ERROR') return message(apiError)
  else if (apiState !== 'READY') return loader('Connecting to Substrate')

  if (keyringState !== 'READY') {
    return loader(
      "Loading accounts (please review any extension's authorization)"
    )
  }

  const contextRef = createRef()

  return (
    <div ref={contextRef}>
      <div className={"wrapper"}>
        <GlobalStyles />
        <Sticky context={contextRef}>
          <Header />
        </Sticky>
        <Routes>
          <Route path="/" element={<Home />} />   />
          <Route path={"/listingForRent/:nftId"}  element={<ListingForRent />} />
          <Route path={"/mint"} element={<Mint />} />
          <Route path={"/itemDetail/:nftId"} element={<ItemDetailRedux />} />
          <Route path={"/collection/:walletAddress"} element={<Collection />} />
        </Routes>
        <ScrollToTop />
      </div>
      <DeveloperConsole />
    </div>
  )
}

export default function App() {
  return (
    <SubstrateContextProvider>
      <Main />
    </SubstrateContextProvider>
  )
}
