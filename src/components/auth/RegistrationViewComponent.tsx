import * as React from "react";
import {RouteComponentProps, withRouter} from "react-router";
import {Notification} from "react-notification-system";
import {BrowserStorage} from "../../helpers/BrowserStorage";
import * as $ from "jquery";
import {Link} from "react-router-dom";
import {LoginViewComponent} from "./LoginViewComponent";

export namespace RegistrationViewComponent {
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

class RegistrationViewComponent extends React.Component<RegistrationViewComponent.Props, {
    email: string,
    password: string,
}> {

    constructor(props: RegistrationViewComponent.Props) {
        super(props);
        this.state = {
            email: "",
            password: ""
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

    openLoginPage() {
        this.props.history.push("/login/");
        return false;
    }

    onSubmit(e: Event) {
        e.preventDefault();
        this.props.onRequest("register", {
            login: this.state.email,
            password: this.state.password
        }, async (response: any) => {
            await BrowserStorage.save("auth", {
                login: response.login,
                hash: response.hash,
                id: response.id
            });
            setTimeout(() => {
                this.props.openChatPage();
            }, 1500);
        });
        return false;
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
                           placeholder="Придумай пароль"
                           onChange={(event: React.ChangeEvent<HTMLInputElement>) => {this.onPasswordChange(event)}}
                    />
                </div>
                <div className="form-group">
                    <small>
                        Я принимаю условия клиентского соглашения и политики конфиденициальности
                    </small>
                </div>
                <div className="form-group">
                    <button className="btn btn-lg btn-primary white-text w-100" disabled={this.props.data.busy}>
                        {
                            !this.props.data.busy ? (
                                "Зарегистрироваться"
                            ) : (
                                <span>
                                    <i className="fas fa-spinner fa-spin"></i>
                                </span>
                            )
                        }
                    </button>
                </div>
                <div className="form-group text-center mt-4">
                    <p className="mb-1">
                        <Link to="/auth/recovery">Восстанови пароль</Link>
                    </p>
                    <p className="mb-1">
                        <small>или</small>
                    </p>
                    <p className="mb-0">
                        <Link to="/auth/login">Войди</Link>,
                    </p>
                    <p>если у тебя есть аккаунт</p>
                </div>
            </form>
        );
    }
}

export default withRouter(RegistrationViewComponent);