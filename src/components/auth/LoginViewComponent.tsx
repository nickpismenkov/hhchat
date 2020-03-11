import * as React from "react";
import {RouteComponentProps, withRouter} from "react-router";
import {Notification} from "react-notification-system";
import {BrowserStorage} from "../../helpers/BrowserStorage";
import * as $ from "jquery";
import {Link} from "react-router-dom";
import Settings from "../../Settings";
import BackgroundController from "../../background";
import {FacebookOAuthMessage, GoogleOAuthMessage, VkOAuthMessage} from "../../helpers/ExtensionMessage";

export namespace LoginViewComponent {
    export interface Props extends RouteComponentProps<any> {
        onRequest: (endpoint: string, data: object, onSuccess: (response: any) => void) => void
        openChatPage: () => void
        data: {
            busy: boolean
            successMessage: string
            errorMessage: string
        }
    }
}

class LoginViewComponent extends React.Component<LoginViewComponent.Props, {
    email: string
    password: string
    googleAuthBusy: boolean
    vkAuthBusy: boolean
    facebookAuthBusy: boolean
}> {

    constructor(props: LoginViewComponent.Props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            googleAuthBusy: false,
            vkAuthBusy: false,
            facebookAuthBusy: false,
        };
    }

    onEmailChange(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({
            email: event.target.value
        });
    }

    onPasswordChange(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({
            password: event.target.value
        });
    }

    onSubmit(e: Event) {
        e.preventDefault();
        this.props.onRequest("login", {
            login: this.state.email,
            password: this.state.password,
            recovery: ""
        }, async (response: any) => {
            await BrowserStorage.save("auth", {
                login: response.login,
                hash: response.hash,
                id: response.id
            });
            setTimeout(() => {
                this.props.openChatPage();
            }, 500);
        });
        return false;
    }

    googleOAuth(e: Event) {
        e.preventDefault();
        if (this.state.googleAuthBusy) {
            return;
        }
        this.setState({
            googleAuthBusy: true
        }, () => {
            new GoogleOAuthMessage().sendToBackend(async (result: any) => {
                if (result.error) {
                    this.props.data.errorMessage = result.error;
                    this.setState({
                        googleAuthBusy: false
                    });
                    return;
                }
                this.props.data.successMessage = result.message;
                await BrowserStorage.save("auth", {
                    id: result.id,
                    login: result.login,
                    name: result.name,
                    avatar: result.avatar,
                    hash: result.hash,
                });
                this.setState({
                    googleAuthBusy: false
                });
                setTimeout(() => {
                    this.props.openChatPage();
                }, 500);
            });
        });
    }

    vkOAuth(e: Event) {
        e.preventDefault();
        if (this.state.vkAuthBusy) {
            return;
        }
        this.setState({
            vkAuthBusy: true
        }, () => {
            new VkOAuthMessage().sendToBackend(async (result: any) => {
                if (result.error) {
                    this.props.data.errorMessage = result.error;
                    this.setState({
                        vkAuthBusy: false
                    });
                    return;
                }
                this.props.data.successMessage = result.message;
                await BrowserStorage.save("auth", {
                    id: result.id,
                    login: result.login,
                    name: result.name,
                    avatar: result.avatar,
                    hash: result.hash,
                });
                this.setState({
                    vkAuthBusy: false
                });
                setTimeout(() => {
                    this.props.openChatPage();
                }, 500);
            });
        });
    }

    facebookOAuth(e: Event) {
        e.preventDefault();
        if (this.state.facebookAuthBusy) {
            return;
        }
        this.setState({
            facebookAuthBusy: true
        }, () => {
            new FacebookOAuthMessage().sendToBackend(async (result: any) => {
                if (result.error) {
                    this.props.data.errorMessage = result.error;
                    this.setState({
                        facebookAuthBusy: false
                    });
                    return;
                }
                this.props.data.successMessage = result.message;
                await BrowserStorage.save("auth", {
                    id: result.id,
                    login: result.login,
                    name: result.name,
                    avatar: result.avatar,
                    hash: result.hash,
                });
                this.setState({
                    facebookAuthBusy: false
                });
                setTimeout(() => {
                    this.props.openChatPage();
                }, 500);
            });
        });
    }

    render() {
        return (
            <form className="col-md-12" onSubmit={this.onSubmit.bind(this)}>
                <div className="form-group" hidden={!this.props.data.errorMessage}>
                    <div className="alert alert-danger">
                        {this.props.data.errorMessage}
                    </div>
                </div>
                <div className="form-group" hidden={!this.props.data.successMessage}>
                    <div className="alert alert-success">
                        {this.props.data.successMessage}
                    </div>
                </div>
                <div className="form-group">
                    <input type="email"
                           className="form-control form-control-lg"
                           name="email"
                           value={this.state.email}
                           placeholder="Введи свой email"
                           onChange={(event: React.ChangeEvent<HTMLInputElement>) => {this.onEmailChange(event)}}
                    />
                </div>
                <div className="form-group">
                    <input type="password"
                           className="form-control form-control-lg"
                           name="password"
                           value={this.state.password}
                           placeholder="Введи свой пароль"
                           onChange={(event: React.ChangeEvent<HTMLInputElement>) => {this.onPasswordChange(event)}}
                    />
                </div>
                <div className="form-group">
                    <button type="submit" className="btn btn-lg btn-primary white-text w-100" disabled={this.props.data.busy}>
                        {
                            !this.props.data.busy ? (
                                "Войти"
                            ) : (
                                <span>
                                    <i className="fas fa-spinner fa-spin"></i>
                                </span>
                            )
                        }
                    </button>
                </div>
                <div className="form-group text-center">
                    <p>или авторизуйся через соцсети</p>
                    <span className="social-btn mr-3" hidden={this.state.googleAuthBusy} onClick={this.googleOAuth.bind(this)}>
                        <i className="fab fa-google-plus-g cursor-pointer"></i>
                    </span>
                    <span className="social-btn mr-3" hidden={!this.state.googleAuthBusy}>
                        <i className="fas fa-spinner fa-spin cursor-pointer"></i>
                    </span>
                    <span className="social-btn mr-3" hidden={this.state.vkAuthBusy} onClick={this.vkOAuth.bind(this)}>
                        <i className="fab fa-vk cursor-pointer"></i>
                    </span>
                    <span className="social-btn mr-3" hidden={!this.state.vkAuthBusy}>
                        <i className="fas fa-spinner fa-spin cursor-pointer"></i>
                    </span>
                    <span className="social-btn mr-3" hidden={this.state.facebookAuthBusy} onClick={this.facebookOAuth.bind(this)}>
                        <i className="fab fa-facebook-f cursor-pointer"></i>
                    </span>
                    <span className="social-btn mr-3" hidden={!this.state.facebookAuthBusy}>
                        <i className="fas fa-spinner fa-spin cursor-pointer"></i>
                    </span>
                </div>
                <div className="form-group text-center mt-4">
                    <p className="mb-1">
                        <Link to="/auth/recovery">Восстанови пароль</Link>
                    </p>
                    <p className="mb-1">
                        <small>или</small>
                    </p>
                    <p className="mb-0">
                        <Link to="/auth/registration">Зарегистрируйся</Link>,
                    </p>
                    <p>если у тебя нет аккаунта</p>
                </div>
            </form>
        );
    }
}

export default withRouter(LoginViewComponent);