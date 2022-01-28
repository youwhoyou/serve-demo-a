import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { SiteState } from "./components/context/SiteStateContext";
import "./css/App.css";
import "react-awesome-lightbox/build/style.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useMoralis } from "react-moralis";
import Home from "./components/pages/Home";
import Faucet from "./components/pages/Faucet";
import Search from "./components/pages/Search";
import NewService from "./components/pages/NewService";
import Activity from "./components/pages/Activity";
import Chat from "./components/pages/Chat";
import Wallet from "./components/pages/Wallet";
import Account from "./components/pages/Account";

export default function App() {
  const { isAuthenticated, isAuthUndefined } = useMoralis();

  return (
    <>
      <Router>
        <SiteState>
          {isAuthenticated ? (
            <Switch>
              <Route path="/search">
                <Search />
              </Route>
              <Route path="/newservice">
                <NewService />
              </Route>
              <Route path="/activity/:side?/:id?">
                <Activity />
              </Route>
              <Route path="/chat/:side?/:booking?">
                <Chat />
              </Route>
              <Route path="/wallet/:tab?">
                <Wallet />
              </Route>
              <Route path="/account/:tab?">
                <Account />
              </Route>
              <Route path="/faucet/:token?">
                <Faucet />
              </Route>
              <Route path="/">
                <Home />
              </Route>
            </Switch>
          ) : (
            <>
              {!isAuthUndefined && (
                <Switch>
                  <Route path="/search">
                    <Search />
                  </Route>
                  <Route path="/faucet/:token?">
                    <Faucet />
                  </Route>
                  <Route path="/activity">
                    <Activity />
                  </Route>
                  <Route path="/">
                    <Home />
                  </Route>
                </Switch>
              )}
            </>
          )}
        </SiteState>
      </Router>
    </>
  );
}
