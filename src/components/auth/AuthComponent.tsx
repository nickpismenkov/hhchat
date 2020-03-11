import * as React from "react";
import {Redirect, Route, RouteComponentProps, Switch, withRouter} from "react-router";
import {Link} from "react-router-dom";
import {BrowserStorage} from "../../helpers/BrowserStorage";
import * as $ from "jquery";
import LoginViewComponent from "./LoginViewComponent";
import RegistrationViewComponent from "./RegistrationViewComponent";
import RecoveryPasswordViewComponent from "./RecoveryPasswordViewComponent";
import Settings from "../../Settings";
import TopCommentsComponent from "../pages/TopCommentsComponent";

export namespace AuthComponent {
    export interface Props extends RouteComponentProps<any> {
        showPopup: () => void,
        hidePopup: () => void,
        setTitle: (title: string, subtitle?: string) => void
    }
}

class AuthComponent extends React.Component<AuthComponent.Props, {
    errorMessage: string,
    successMessage: string,
    busy: boolean
}> {

    constructor(props: any) {
        super(props);
        this.state = {
            errorMessage: null,
            successMessage: null,
            busy: false
        };

        this.props.showPopup();
        this.props.setTitle(chrome.runtime.getManifest().name);
    }

    openChatPage() {
        this.props.history.push("/chat/");
        return false;
    }

    onRequest(endpoint: string, data: object, onSuccess: any) {
        this.setState({
            successMessage: null,
            errorMessage: null,
            busy: true
        });
        /*$.getJSON(`${Settings.BASE_URI}/${endpoint}`, data, async (data) => {
            if ("success" === data.result)
            {
                this.setState({
                    successMessage: data.message,
                    busy: false
                });
                onSuccess(data);
            }
            else if (409 === parseInt(data.error.code))
            {
                this.setState({
                    errorMessage: data.error.text,
                    busy: false
                });
            }
            else if (422 === parseInt(data.error.code))
            {
                this.setState({
                    errorMessage: data.error.text,
                    busy: false
                });
            }
        });*/
        $.ajax({
            url : `${Settings.BASE_URI}/${endpoint}`,
            type : 'GET',
            data : data,
            dataType:'json',
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            success : async (data) => {
                if ("success" === data.result)
                {
                    this.setState({
                        successMessage: data.message,
                        busy: false
                    });
                    onSuccess(data);
                }
                else if (409 === parseInt(data.error.code))
                {
                    this.setState({
                        errorMessage: data.error.text,
                        busy: false
                    });
                }
                else if (422 === parseInt(data.error.code))
                {
                    this.setState({
                        errorMessage: data.error.text,
                        busy: false
                    });
                }
            },
            error : (request,error) => {
                this.setState({
                    errorMessage: "Что-то пошло не так, попробуйте ещё раз.",
                    busy: false
                });
            }
        });
        return false;
    }

    render() {
        return (
            <div id="auth-container" className="w-100">
                <div className="col-md-12">
                    <Switch>
                        <Route path="/auth/login">
                            <h3>Вход</h3>
                        </Route>
                        <Route path="/auth/registration">
                            <h3>Регистрация</h3>
                        </Route>
                        <Route path="/auth/recovery">
                            <h3>Восстановление пароля</h3>
                        </Route>
                    </Switch>
                </div>
                <Switch>
                    <Route path="/auth/login"
                           render={(props) =>
                               <LoginViewComponent
                                   onRequest={this.onRequest.bind(this)}
                                   openChatPage={this.openChatPage.bind(this)}
                                   data={this.state}
                               />
                           }

                    />
                    <Route path="/auth/registration"
                           render={(props) =>
                               <RegistrationViewComponent
                                   onRequest={this.onRequest.bind(this)}
                                   openChatPage={this.openChatPage.bind(this)}
                                   data={this.state}
                               />
                           }

                    />
                    <Route path="/auth/recovery"
                           render={(props) =>
                               <RecoveryPasswordViewComponent
                                   onRequest={this.onRequest.bind(this)}
                                   openChatPage={this.openChatPage.bind(this)}
                                   data={this.state}
                               />
                           }

                    />
                    <Redirect from="*" to="/auth/login" />
                </Switch>
            </div>
        );
    }
}

export default withRouter(AuthComponent);