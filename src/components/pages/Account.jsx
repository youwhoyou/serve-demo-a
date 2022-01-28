import React from 'react';
import { Switch, Route } from "react-router-dom";
import Profile from "../account/Profile";
import Events from "../account/Events";


export default function Account() {
    return (
        <Switch>
            <Route path="/account/events" >
                <Events />
            </Route>
            <Route path="/account" >
                <Profile />
            </Route>
        </Switch>
    )
}
