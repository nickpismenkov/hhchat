import * as React from "react";
import {Redirect, Route, RouteComponentProps, Switch, withRouter} from "react-router";
import {Link} from "react-router-dom";
import {BrowserStorage} from "../../helpers/BrowserStorage";
import * as $ from "jquery";
import CompanyReviewsComponent from "./CompanyReviewsComponent";
import Settings from "../../Settings";
import EmployeeReviewsComponent from "./EmployeeReviewsComponent";

export namespace ChatComponent {
    export interface Props extends RouteComponentProps<any> {
        showPopup: () => void,
        hidePopup: () => void,
        setTitle: (title: string, subtitle?: string) => void
    }
}

class ChatComponent extends React.Component<ChatComponent.Props, {
    errorMessage: string
    successMessage: string
    busy: boolean
    pageData: any
    comments: any
}> {

    constructor(props: any) {
        super(props);
        this.state = {
            errorMessage: null,
            successMessage: null,
            busy: false,
            pageData: null,
            comments: []
        };

        this.init();
    }

    init() {
        if (/(\/vacancy\/|\/employer\/|\/catalog\/|\/search\/vacancy)/.test(location.href)) {
            this.props.history.push("/chat/company-reviews");
            return;
        }
        if (/(\/search\/resume|\/resume\/)/.test(location.href)) {
            this.props.history.push("/chat/employee-reviews");
            return;
        }
    }

    onRequest(endpoint: string, data: object):any {
        return new Promise((resolve) => {
            this.setState({
                successMessage: null,
                errorMessage: null,
                busy: true
            });
            $.ajax({
                url : `${Settings.BASE_URI}/${endpoint}`,
                type : 'POST',
                data : data,
                dataType:'json',
                success : async (data) => {
                    if ("success" === data.result)
                    {
                        this.setState({
                            successMessage: data.message,
                            busy: false
                        });
                    }
                    else {
                        this.setState({
                            errorMessage: data.error ? (data.error.text ? data.error.text : data.error) : "Что-то пошло не так",
                            busy: false
                        });
                    }
                    resolve(data);
                },
                error : (request,error) => {
                    this.setState({
                        errorMessage: "Что-то пошло не так, попробуйте ещё раз.",
                        busy: false
                    });
                    resolve(data);
                }
            });
        });
    }

    render() {
        return (
            <div id="chat-container" className="">
                <Switch>
                    <Route path="/chat/company-reviews"
                           render={(props) =>
                               <CompanyReviewsComponent
                                   showPopup={this.props.showPopup}
                                   hidePopup={this.props.hidePopup}
                                   setTitle={this.props.setTitle}
                                   successMessage={this.state.successMessage}
                                   errorMessage={this.state.errorMessage}
                                   onRequest={this.onRequest.bind(this)}
                                   data={this.state}
                               />
                           }
                    />
                    <Route path="/chat/employee-reviews"
                           render={(props) =>
                               <EmployeeReviewsComponent
                                   showPopup={this.props.showPopup}
                                   hidePopup={this.props.hidePopup}
                                   setTitle={this.props.setTitle}
                                   successMessage={this.state.successMessage}
                                   errorMessage={this.state.errorMessage}
                                   onRequest={this.onRequest.bind(this)}
                                   data={this.state}
                               />
                           }
                    />
                    {/*<Redirect from="*" to="/chat/" />*/}
                </Switch>
            </div>
        );
    }
}

export default withRouter(ChatComponent);