import * as React from "react";
import {RouteComponentProps, withRouter} from "react-router";
import {Link} from "react-router-dom";
import {Notification} from "react-notification-system";
import {BrowserStorage} from "../../helpers/BrowserStorage";
import * as $ from "jquery";
import {RegistrationViewComponent} from "./RegistrationViewComponent";

export namespace RecoveryPasswordViewComponent {
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

class RecoveryPasswordViewComponent extends React.Component<RecoveryPasswordViewComponent.Props, {
    email: string
    password: string
    code: string
    secondStep: boolean
}> {

    constructor(props: RecoveryPasswordViewComponent.Props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            code: "",
            secondStep: false,
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

    onCodeChange(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({
            code: event.target.value
        });
    }

    onSubmit(e: Event) {
        e.preventDefault();
        if (!this.state.secondStep) {
            this.props.onRequest("recovery", {
                login: this.state.email,
            }, async (response: any) => {
                this.setState({
                    secondStep: true
                });
            });
        } else {
            this.props.onRequest("recover-password", {
                login: this.state.email,
                password: this.state.password,
                recovery: this.state.code
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
        }
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
                <div className="form-group" hidden={this.state.secondStep}>
                    <input type="email"
                           className="form-control form-control-lg"
                           name="email"
                           value={this.state.email}
                           placeholder="Введи свой email"
                           onChange={(event: React.ChangeEvent<HTMLInputElement>) => {this.onEmailChange(event)}}
                    />
                </div>
                <div className="form-group" hidden={!this.state.secondStep}>
                    <input type="password"
                           className="form-control form-control-lg"
                           name="password"
                           value={this.state.password}
                           placeholder="Придумайте новый пароль"
                           onChange={(event: React.ChangeEvent<HTMLInputElement>) => {this.onPasswordChange(event)}}
                    />
                </div>
                <div className="form-group" hidden={!this.state.secondStep}>
                    <input type="text"
                           className="form-control form-control-lg"
                           name="code"
                           value={this.state.code}
                           placeholder="Код восстановления"
                           onChange={(event: React.ChangeEvent<HTMLInputElement>) => {this.onCodeChange(event)}}
                    />
                </div>
                <div className="form-group">
                    <button className="btn btn-lg btn-primary white-text w-100" disabled={this.props.data.busy}>
                        {
                            !this.props.data.busy ? (
                                "Отправить письмо на email"
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
                        <Link to="/auth/login">Войди</Link>
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

export default withRouter(RecoveryPasswordViewComponent);