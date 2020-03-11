import * as React from "react";
import {Redirect, Route, RouteComponentProps, Switch, withRouter} from "react-router";
import {Link} from "react-router-dom";
import * as moment from "moment";

export namespace TopCommentsComponent {
    export interface Props extends RouteComponentProps<any> {
        onRequest: (endpoint: string, data: object) => any
        setShowTop: (state: boolean) => void
    }
}

class TopCommentsComponent extends React.Component<TopCommentsComponent.Props, {
    errorMessage: string
    successMessage: string
    busy: boolean
    pageData: any
    topComments: any
}> {

    constructor(props: any) {
        super(props);
        this.state = {
            errorMessage: null,
            successMessage: null,
            busy: false,
            pageData: null,
            topComments: []
        };
    }

    async componentDidMount() {
        let response = await this.props.onRequest("top-comments/10", null);
        this.setState({
            topComments: response.comments
        });
    }

    render() {
        let topComments = this.state.topComments.map((topComment: any, index: number) => {
            return (
              <tr key={index}>
                  <td>
                      {index + 1}
                  </td>
                  <td className="text-center">
                      {topComment.rating > 1 ? `+${topComment.rating}` : topComment.rating}
                  </td>
                  <td className="top-comment-text">
                      {topComment.text}
                  </td>
                  <td className="min pl-0">
                      <a href={topComment.url || "#"} target="_blank">
                        читать далее
                      </a>
                  </td>
              </tr>
            );
        });
        return (
            <div id="chat-container" className="">
                <ul className="nav nav-tabs mb-3">
                    <li className="nav-item w-50 text-center">
                        <a href="#"
                           className="nav-link"
                           onClick={(e) => { e.preventDefault(); this.props.setShowTop(false); }}
                           data-toggle="tab"
                        >
                            Отзывы
                        </a>
                    </li>
                    <li className="nav-item w-50 text-center">
                        <a href="#"
                           className="nav-link active"
                           onClick={(e) => { e.preventDefault(); }}
                           data-toggle="tab"
                        >
                            Недельный ТОП-10 отзывов
                        </a>
                    </li>
                </ul>
                <table className="table table-borderless table-striped">
                    <thead>
                        <tr>
                            <th className="min">#</th>
                            <th className="min">Рейтинг</th>
                            <th>Отзыв</th>
                        </tr>
                    </thead>
                    <tbody>
                        {topComments}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default withRouter(TopCommentsComponent);