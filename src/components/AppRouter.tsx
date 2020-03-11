import App from "./App";
import {Redirect, Route, RouteComponentProps, Router, Switch, withRouter} from "react-router";
import * as React from "react";
import { createHashHistory, createMemoryHistory } from 'history';

//const history = createHashHistory();
const history = createMemoryHistory();

class AppRouter extends React.Component<{}, {
}> {
    render() {
        return (
            <Router history={history}>
                <Route path="/*" component={App} history={history} />
            </Router>
        );
    }
}

export default AppRouter;