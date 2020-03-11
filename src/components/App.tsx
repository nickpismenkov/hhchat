import * as React from "react";
import {match, Redirect, Route, RouteComponentProps, RouteProps, Switch, withRouter} from "react-router";
import {History} from "history";
import {Notification} from "react-notification-system";
import * as NotificationSystem from "react-notification-system";
import ExtensionMessage, {ExtensionMessageAction, NotificationMessage} from "../helpers/ExtensionMessage";
import {BrowserStorage} from "../helpers/BrowserStorage";
import * as $ from "jquery";
import Settings from "../Settings";
import AuthComponent from "./auth/AuthComponent";
import ChatComponent from "./pages/ChatComponent";
import CompanyReviewsComponent from "./pages/CompanyReviewsComponent";
import TopCommentsComponent from "./pages/TopCommentsComponent";

export namespace App {
    export interface Props extends RouteComponentProps {
        history: History;
    }
}

class App extends React.Component<App.Props, {
    title: string
    subtitle: string
    show: boolean
    removed: boolean
    auth: {
        login: string
        hash: string
        id: string
    }
}> {

    constructor(props: any) {
        super(props);

        this.state = {
            title: chrome.runtime.getManifest().name,
            subtitle: null,
            show: false,
            removed: true,
            auth: null
        }
    }

    notificationSystem: any = null;

    componentDidMount() {
        this.notificationSystem = this.refs.notificationSystem;
        chrome.runtime.onMessage.addListener(async (message: ExtensionMessage, sender, sendResponse) => {
            switch (message.action) {
                case ExtensionMessageAction.Notification:
                    this.addNotification((message as NotificationMessage).data.notification);
                    break;
                case ExtensionMessageAction.ShowPopup:
                    this.show();
                    break;
                case ExtensionMessageAction.HidePopup:
                    this.hide();
                    break;
            }
        });

        BrowserStorage.observe("auth", (auth: any) => {
            this.checkLogin();

            if (!auth || !auth.hash) {
                this.logout();
                //this.show();
                return;
            } else {
                this.setState({
                    auth: auth
                });
            }
        });
    }

    async checkLogin() {
        let auth = await BrowserStorage.load("auth");
        if (!auth || !auth.hash) {
            this.logout();
            //this.show();
            return;
        }
        $.ajax({
            url : `${Settings.BASE_URI}/check`,
            type : 'POST',
            data : {
                uniq_hash: auth.hash
            },
            dataType:'json',
            success : async (response) => {
                this.setState({
                    auth: {
                        login: response.login,
                        hash: response.hash,
                        id: response.id
                    }
                }, () => {
                    BrowserStorage.save("auth", this.state.auth);
                });
                //this.show();
            },
            error : async (request,error) => {
                this.logout();
                //this.show();
            }
        });
    }

    addNotification(notification: Notification) {
        this.notificationSystem.addNotification(notification);
    }

    setTitle(title: string, subtitle?: string) {
        this.setState({
            title: title,
            subtitle: subtitle
        });
    }

    show() {
        this.setState({
            removed: false,
            show: true
        });
    }

    hide() {
        this.setState({
            show: false
        }, () => {
            setTimeout(() => {
                this.setState({
                    removed: true
                });
            }, 1000);
        });
    }

    async logout() {
        this.setState({
            auth: null
        }, async () => {
            await BrowserStorage.save("auth", this.state.auth);
            this.props.history.push("/auth/login");
        });
    }

    async goComments() {
        this.setState({
            auth: null
        }, () => {
            this.props.history.push("/chat");
        });
    }

    render() {
        return (
            <div id="main-container" className={`fade ${this.state.show ? "show" : ""}`}/* hidden={this.state.removed}*/>
                <div className="card mb-3">
                    <div className="card-header d-flex justify-content-between align-items-center text-white bg-primary">
                        <h3 className="d-inline-block mb-0">
                            {this.state.title}
                            <small className="d-block mt-1" hidden={!this.state.subtitle}>
                                {this.state.subtitle}
                            </small>
                        </h3>
                        <div className="d-inline-block float-right">
                            <span className="cursor-pointer mr-3" onClick={this.logout.bind(this)} hidden={this.state.auth != null || this.props.location.pathname == '/auth/login'}>
                                <i className="fas fa-sign-in-alt"></i>
                            </span>
                            <span className="cursor-pointer mr-3" onClick={this.goComments.bind(this)} hidden={this.props.location.pathname != '/auth/login'}>
                                <i className="fas fa-long-arrow-alt-left"></i>
                            </span>
                            <span className="cursor-pointer mr-3" onClick={this.logout.bind(this)} hidden={!this.state.auth}>
                                <i className="fas fa-sign-out-alt"></i>
                            </span>
                            <span className="cursor-pointer" onClick={this.hide.bind(this)}>
                                <i className="fas fa-times-circle"></i>
                            </span>
                        </div>
                    </div>
                    <div className="card-body">
                        <Switch>
                            <Redirect exact from="/" to="/chat/" />
                            <Route path="/auth/"
                                   render={(props) =>
                                       <AuthComponent
                                           showPopup={this.show.bind(this)}
                                           hidePopup={this.hide.bind(this)}
                                           setTitle={(title: string, subtitle?: string) => { this.setTitle(title, subtitle)}}
                                       />
                                   }
                            />
                            <Route path="/chat/"
                                   render={(props) =>
                                       <ChatComponent
                                           showPopup={this.show.bind(this)}
                                           hidePopup={this.hide.bind(this)}
                                           setTitle={(title: string, subtitle?: string) => { this.setTitle(title, subtitle)}}
                                       />
                                   }
                            />
                            <Redirect from="*" to="/chat/" />
                        </Switch>
                    </div>
                    <div className="card-footer text-muted d-none">
                        <a href="https://vk.com/hahachat_ru" target="_blank">
                            <svg enable-background="new 0 0 24 24" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                                <path d="m19.915 13.028c-.388-.49-.277-.708 0-1.146.005-.005 3.208-4.431 3.538-5.932l.002-.001c.164-.547 0-.949-.793-.949h-2.624c-.668 0-.976.345-1.141.731 0 0-1.336 3.198-3.226 5.271-.61.599-.892.791-1.225.791-.164 0-.419-.192-.419-.739v-5.105c0-.656-.187-.949-.74-.949h-4.126c-.419 0-.668.306-.668.591 0 .622.945.765 1.043 2.515v3.797c0 .832-.151.985-.486.985-.892 0-3.057-3.211-4.34-6.886-.259-.713-.512-1.001-1.185-1.001h-2.625c-.749 0-.9.345-.9.731 0 .682.892 4.073 4.148 8.553 2.17 3.058 5.226 4.715 8.006 4.715 1.671 0 1.875-.368 1.875-1.001 0-2.922-.151-3.198.686-3.198.388 0 1.056.192 2.616 1.667 1.783 1.749 2.076 2.532 3.074 2.532h2.624c.748 0 1.127-.368.909-1.094-.499-1.527-3.871-4.668-4.023-4.878z" fill="#4b729f"/>
                            </svg>
                        </a>
                        <a href="https://www.instagram.com/hahachat_ru/" target="_blank">
                            <svg height="24" viewBox="0 0 512 512" width="24" xmlns="http://www.w3.org/2000/svg"><linearGradient id="a" gradientUnits="userSpaceOnUse" x1="42.966156268" x2="469.0337477" y1="469.0296477168" y2="42.9620562848"><stop offset="0" stop-color="#ffd600"/><stop offset=".5" stop-color="#ff0100"/><stop offset="1" stop-color="#d800b9"/></linearGradient><linearGradient id="b" gradientUnits="userSpaceOnUse" x1="163.0429956456" x2="348.9539083464" y1="348.9538083312" y2="163.0428956304"><stop offset="0" stop-color="#ff6400"/><stop offset=".5" stop-color="#ff0100"/><stop offset="1" stop-color="#fd0056"/></linearGradient><linearGradient id="c" gradientUnits="userSpaceOnUse" x1="370.9291325432" x2="414.3727849912" y1="141.0676714336" y2="97.6240189856"><stop offset="0" stop-color="#f30072"/><stop offset="1" stop-color="#e50097"/></linearGradient><path d="m510.460938 150.453125c-1.246094-27.25-5.574219-45.859375-11.902344-62.140625-6.425782-17.082031-16.503906-32.554688-29.527344-45.34375-12.785156-13.023438-28.261719-23.105469-45.34375-29.535156-16.285156-6.324219-34.890625-10.648438-62.140625-11.886719-27.300781-1.25-36.023437-1.546875-105.546875-1.546875s-78.246094.296875-105.546875 1.539062c-27.25 1.246094-45.855469 5.574219-62.140625 11.902344-17.082031 6.425782-32.554688 16.503906-45.34375 29.527344-13.023438 12.785156-23.105469 28.257812-29.535156 45.339844-6.324219 16.285156-10.648438 34.894531-11.886719 62.140625-1.25 27.304687-1.546875 36.023437-1.546875 105.546875 0 69.527344.296875 78.25 1.546875 105.550781 1.242187 27.246094 5.570313 45.855469 11.898437 62.140625 6.425782 17.078125 16.503907 32.554688 29.527344 45.339844 12.785156 13.023437 28.261719 23.101562 45.34375 29.527344 16.28125 6.332031 34.890625 10.65625 62.140625 11.902343 27.304688 1.246094 36.023438 1.539063 105.546875 1.539063 69.523438 0 78.246094-.292969 105.546875-1.539063 27.25-1.246093 45.855469-5.570312 62.140625-11.902343 34.386719-13.296876 61.570313-40.480469 74.867188-74.867188 6.332031-16.285156 10.65625-34.894531 11.902344-62.140625 1.242187-27.304687 1.539062-36.023437 1.539062-105.546875 0-69.527344-.296875-78.246094-1.539062-105.546875zm-46.082032 208.996094c-1.136718 24.960937-5.308594 38.515625-8.8125 47.535156-8.613281 22.328125-26.257812 39.972656-48.585937 48.585937-9.019531 3.503907-22.574219 7.675782-47.535157 8.8125-26.988281 1.234376-35.085937 1.492188-103.445312 1.492188-68.363281 0-76.457031-.257812-103.449219-1.492188-24.957031-1.136718-38.511719-5.308593-47.535156-8.8125-11.117187-4.105468-21.175781-10.648437-29.433594-19.152343-8.503906-8.257813-15.046875-18.3125-19.152343-29.433594-3.503907-9.019531-7.675782-22.574219-8.8125-47.535156-1.230469-26.992188-1.492188-35.089844-1.492188-103.445313 0-68.359375.261719-76.453125 1.492188-103.449218 1.140624-24.960938 5.308593-38.515626 8.8125-47.535157 4.105468-11.121093 10.652343-21.179687 19.152343-29.4375 8.257813-8.503906 18.316407-15.046875 29.4375-19.148437 9.019531-3.507813 22.574219-7.675782 47.535157-8.816406 26.992187-1.230469 35.089843-1.492188 103.445312-1.492188h-.003906c68.355468 0 76.453125.261719 103.449218 1.496094 24.960938 1.136718 38.511719 5.308594 47.535157 8.8125 11.117187 4.105468 21.175781 10.648437 29.433593 19.148437 8.503907 8.257813 15.046876 18.316407 19.148438 29.4375 3.507812 9.019531 7.679688 22.574219 8.816406 47.535157 1.230469 26.992187 1.492188 35.089843 1.492188 103.445312 0 68.359375-.257813 76.453125-1.492188 103.449219zm0 0" fill="url(#a)"/><path d="m255.996094 124.539062c-72.601563 0-131.457032 58.859376-131.457032 131.460938s58.855469 131.457031 131.457032 131.457031c72.605468 0 131.460937-58.855469 131.460937-131.457031s-58.855469-131.460938-131.460937-131.460938zm0 216.792969c-47.125-.003906-85.332032-38.207031-85.328125-85.335937 0-47.125 38.203125-85.332032 85.332031-85.332032 47.128906.003907 85.332031 38.207032 85.332031 85.332032 0 47.128906-38.207031 85.335937-85.335937 85.335937zm0 0" fill="url(#b)"/>
                                <path d="m423.371094 119.347656c0 16.964844-13.753906 30.71875-30.71875 30.71875-16.96875 0-30.722656-13.753906-30.722656-30.71875 0-16.96875 13.753906-30.722656 30.722656-30.722656 16.964844 0 30.71875 13.753906 30.71875 30.722656zm0 0" fill="url(#c)"/>
                            </svg>
                        </a>
                        <a href="mailto:info@hahachat.ru" target="_blank">
                            <svg version="1.1" id="Capa_1" height="24" width="24" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                                viewBox="0 0 512 512">
                                <g>
                                    <g>
                                        <path d="M467,61H45C20.218,61,0,81.196,0,106v300c0,24.72,20.128,45,45,45h422c24.72,0,45-20.128,45-45V106
                                            C512,81.28,491.872,61,467,61z M460.786,91L256.954,294.833L51.359,91H460.786z M30,399.788V112.069l144.479,143.24L30,399.788z
                                            M51.213,421l144.57-144.57l50.657,50.222c5.864,5.814,15.327,5.795,21.167-0.046L317,277.213L460.787,421H51.213z M482,399.787
                                            L338.213,256L482,112.212V399.787z"/>
                                    </g>
                                </g>
                                <g>
                                </g>
                                <g>
                                </g>
                                <g>
                                </g>
                                <g>
                                </g>
                                <g>
                                </g>
                                <g>
                                </g>
                                <g>
                                </g>
                                <g>
                                </g>
                                <g>
                                </g>
                                <g>
                                </g>
                                <g>
                                </g>
                                <g>
                                </g>
                                <g>
                                </g>
                                <g>
                                </g>
                                <g>
                                </g>
                            </svg>
                        </a>
                    </div>
                </div>
                <NotificationSystem ref="notificationSystem" />
            </div>
        );
    }
}

export default withRouter(App);