import * as React from "react";
import {Redirect, Route, RouteComponentProps, Switch, withRouter} from "react-router";
import * as $ from "jquery";
import CommentComponent from "./CommentComponent";
import {BrowserStorage} from "../../helpers/BrowserStorage";
import * as ReactDOM from "react-dom";
import TopCommentsComponent from "./TopCommentsComponent";

export namespace EmployeeReviewsComponent {
    export interface Props extends RouteComponentProps<any> {
        showPopup: () => void,
        hidePopup: () => void,
        setTitle: (title: string, subtitle?: string) => void
        onRequest: (endpoint: string, data: object) => any
        errorMessage: string
        successMessage: string
    }
}

class EmployeeReviewsComponent extends React.Component<EmployeeReviewsComponent.Props, {
    comments: any[]
    auth: {
        login: string
        hash: string
        id: string
    }
    ownerId: string
    mainResumeId: string
    newComment: string
    length: any
    classLength: string
    commentToReply: number
    busy: boolean
    showTop: boolean
}> {

    constructor(props: any) {
        super(props);
        this.state = {
            comments: [],
            auth: null,
            ownerId: null,
            mainResumeId: null,
            newComment: "",
            length: 0,
            classLength: 'text-len',
            commentToReply: null,
            busy: false,
            showTop: false
        };
    }

    componentDidMount() {
        this.init();
    }

    async init() {
        let auth = await BrowserStorage.load("auth");
        if (!auth) {
            let pageData = await this.getPageData();
            let response = await this.props.onRequest("resumes", {
                user_id: null,
                result: pageData
            });

            let comments:any[] = [];
            $.each(response.comments, (index: number, item) => {
                let fio:any, $resumeDiv:any, mainResumeId: string;
                if (/search\/resume/.test(location.href)) {
                    $resumeDiv = $("div[data-resume-id]").eq(index);
                    fio = $resumeDiv.find("div.resume-search-item__fullname").text().split(",");
                    fio = ((fio.length >= 1) ? (isNaN(parseInt(fio[0].trim())) ? fio[0].trim() : "") : "").replace(/\s+/g,' ');
                    mainResumeId = $resumeDiv.data("hh-resume-hash");
                }
                else if(/resume/.test(location.href)) {
                    $resumeDiv = $(".bloko-button-group.bloko-button-group_stretched");
                    fio = ($("div.resume-header-name").text().trim()|| "").replace(/\s+/g,' ');
                    mainResumeId = location.pathname.replace('/resume/', '');
                    this.setState({
                        mainResumeId: mainResumeId
                    })
                }
                this.props.setTitle("Отзывы о сотруднике", fio);

                $.each(item, (owner: string, chunkComments) => {
                    comments = $.merge(comments, chunkComments);
                    if (/search\/resume/.test(location.href)) {
                        this.updateCounter($resumeDiv.find(".resume-search-item__content-wrapper"), owner, mainResumeId, fio, chunkComments.length);
                    } else {
                        this.setState({
                            ownerId: owner
                        });
                    }
                });
            });
            $.each(comments, (index, comment) => {
                if (comment.parent_comment_id === "0") {
                    comment.parent_comment_id = null;
                }
            });
            this.setState({
                comments: comments
            }, () => {
                if (!/search\/resume/.test(location.href)) {
                    // this.props.showPopup();
                } else {
                    this.props.hidePopup();
                }
            });
        } else {
            let pageData = await this.getPageData();
            let response = await this.props.onRequest("resumes", {
                user_id: auth.id,
                result: pageData
            });

            let comments:any[] = [];
            $.each(response.comments, (index: number, item) => {
                let fio:any, $resumeDiv:any, mainResumeId: string;
                if (/search\/resume/.test(location.href)) {
                    $resumeDiv = $("div[data-resume-id]").eq(index);
                    fio = $resumeDiv.find("div.resume-search-item__fullname").text().split(",");
                    fio = ((fio.length >= 1) ? (isNaN(parseInt(fio[0].trim())) ? fio[0].trim() : "") : "").replace(/\s+/g,' ');
                    mainResumeId = $resumeDiv.data("hh-resume-hash");
                }
                else if(/resume/.test(location.href)) {
                    $resumeDiv = $(".bloko-button-group.bloko-button-group_stretched");
                    fio = ($("div.resume-header-name").text().trim()|| "").replace(/\s+/g,' ');
                    mainResumeId = location.pathname.replace('/resume/', '');
                    this.setState({
                        mainResumeId: mainResumeId
                    })
                }
                this.props.setTitle("Отзывы о сотруднике", fio);

                $.each(item, (owner: string, chunkComments) => {
                    comments = $.merge(comments, chunkComments);
                    if (/search\/resume/.test(location.href)) {
                        this.updateCounter($resumeDiv.find(".resume-search-item__content-wrapper"), owner, mainResumeId, fio, chunkComments.length);
                    } else {
                        this.setState({
                            ownerId: owner
                        });
                    }
                });
            });
            $.each(comments, (index, comment) => {
                if (comment.parent_comment_id === "0") {
                    comment.parent_comment_id = null;
                }
            });
            this.setState({
                auth: auth,
                comments: comments
            }, () => {
                if (!/search\/resume/.test(location.href)) {
                    // this.props.showPopup();
                } else {
                    this.props.hidePopup();
                }
            });
        }
    }

    async getPageData() {
        let conditions:any = {
            sendResumes: {
                regExp: /\/search\/resume/,
                getPageData: () => {
                    let pageData:any[] = [];
                    $.each($("div[data-resume-id]"), (index, item) =>
                    {
                        let $item = $(item);
                        let id = $item.attr("data-hh-resume-hash");
                        let name = $item.find("a.resume-search-item__name").text().trim();
                        let resumes:any[] = [];

                        resumes.push({
                            id: id,
                            name: name,
                        });

                        $.each($item.find("ul.output__stackedresumes li a"), (index, item: HTMLLinkElement) =>
                        {
                            let pathname = item.href;
                            resumes.push( {
                                id: pathname.replace("/resume/", "").split("?")[0],
                                name: $(item).text(),
                            });
                        });
                        pageData.push(resumes);
                    });
                    return pageData;
                }
            },
            sendResume: {
                regExp: /\/resume\//,
                getPageData: () => {
                    let pageData:any[] = [];
                    pageData.push([{
                        id: location.pathname.replace('/resume/', ''),
                        name: $("span.resume-block__title-text span").text().trim(),
                    }]);
                    return pageData;
                }
            }
        };

        for (let type in conditions) {
            if (conditions[type].regExp.test(location.href))
            {
                return conditions[type].getPageData();
            }
        }
        return null;
    }

    updateCounter(parentElem: HTMLElement, ownerId: any, resumeId: any, employerName: any, number: number) {
        let container = $(parentElem).find(".hahachat-comment-counter");
        if (container.length === 0) {
            $(parentElem).append("<div class='hahachat-comment-counter' style='float: right;'></div>");
            container = $(parentElem).find(".hahachat-comment-counter");
        }
        if (number > 0) {
            ReactDOM.render(
                <a href="#"
                   onClick={(e: any) => { this.onCommentCounterClick(e, ownerId, resumeId, employerName); }}
                >
                    Комментариев: {number}
                </a>
            , container[0]);
        } else {
            ReactDOM.render(
                <a href="#"
                   onClick={(e: any) => { this.onCommentCounterClick(e, ownerId, resumeId, employerName); }}
                   style={{color: '#aaa'}}
                >
                    Комментариев: {number}
                </a>
            , container[0]);
        }
    }

    onCommentCounterClick(e: Event, ownerId: any, resumeId: any, employerName: any) {
        e.preventDefault();
        this.props.showPopup();
        this.props.setTitle("Отзывы о сотруднике", employerName);
        this.setState({
            ownerId: ownerId,
            mainResumeId: resumeId
        });
    }

    onTextChange(e: React.FormEvent<HTMLTextAreaElement>) {
        let newComment = this.state.newComment;
        newComment = e.currentTarget.value;
        let length = newComment.length;
        let classLength = 'text-len';
        
        if(length == 3000) {
            classLength = 'text-len-red';
        }

        this.setState({
            newComment,
            length,
            classLength
        });
    }

    emptyCommentToReply(e: Event) {
        e.preventDefault();
        this.setState({
            commentToReply: null
        });
    }

    selectCommentToReply(id: number) {
        this.setState({
            commentToReply: id
        });
    }

    setShowTop(state: boolean) {
        this.setState({
            showTop: state
        })
    }

    sendComment() {
        if (this.state.newComment.length > 0) {
            this.setState({
                busy: true
            }, async () => {
                let response = await this.props.onRequest("comment", {
                    parent_comment_id: this.state.commentToReply,
                    owner_id: this.state.ownerId,
                    resume_id: this.state.mainResumeId,
                    user_id: (await BrowserStorage.load("auth")).id,
                    text: this.state.newComment
                });
                if (response.result === "success") {
                    response.comment.resume_name = response.comment.name;
                    response.comment.name = response.comment.author_name;
                    this.state.comments.push(response.comment);
                    this.setState({
                        commentToReply: null,
                        newComment: "",
                        comments: this.state.comments,
                        busy: false
                    });
                } else {
                    this.setState({
                        commentToReply: null,
                        newComment: "",
                        busy: false
                    });
                }
            });
        }
    }

    render() {
        if (location.href.indexOf('search') == -1) {
            $("<div id='btn-popup'></div>").appendTo('.resume-header-main');

            if (this.state.comments.length > 0) {
                var btn = <button className="btn-o" onClick={() => {this.props.showPopup()}}>Отзывы: {this.state.comments.length}</button>
            } else {
                var btn = <button className="btn-o" onClick={() => {this.props.showPopup()}}>Оставить отзыв</button>
            }

            ReactDOM.render(btn, document.getElementById('btn-popup'));
        }

        if (this.state.showTop) {
            return (
                <TopCommentsComponent
                    onRequest={this.props.onRequest}
                    setShowTop={this.setShowTop.bind(this)}
                />
            );
        }
        let commentElems:any[] = [];
        for (let i = 0; i < this.state.comments.length; i++) {
            let comment = this.state.comments[i];
            if (comment.parent_comment_id || comment.resume_id !== this.state.mainResumeId) {
                continue;
            }
            if (!this.state.auth) {
                commentElems.push(
                    <CommentComponent
                        key={i}
                        editable={false}
                        auth={this.state.auth != null ? true : false}
                        comment={comment}
                        onRequest={this.props.onRequest}
                        selectCommentToReply={this.selectCommentToReply.bind(this)}
                        innerComments={this.state.comments
                            .filter((x: any) => x.parent_comment_id === comment.id)
                            .map((x: any) =>
                                <CommentComponent
                                    key={x.id}
                                    editable={false}
                                    comment={x}
                                    onRequest={this.props.onRequest}
                                />)
                        }
                    />
                );
            } else {
                commentElems.push(
                    <CommentComponent
                        key={i}
                        editable={comment.user_id === this.state.auth.id}
                        auth={this.state.auth != null ? true : false}
                        comment={comment}
                        onRequest={this.props.onRequest}
                        selectCommentToReply={this.selectCommentToReply.bind(this)}
                        innerComments={this.state.comments
                            .filter((x: any) => x.parent_comment_id === comment.id)
                            .map((x: any) =>
                                <CommentComponent
                                    key={x.id}
                                    editable={x.user_id === this.state.auth.id}
                                    comment={x}
                                    onRequest={this.props.onRequest}
                                />)
                        }
                    />
                );
            }
        }
        let selectedCommentToReplyName = "";
        let selectedCommentToReply = this.state.comments.filter((x: any) => x.id === this.state.commentToReply);
        if (selectedCommentToReply.length > 0) {
            let name = selectedCommentToReply[0].name;
            if (!name) {
                let index = selectedCommentToReply[0].login.indexOf('@');
                if (index > -1) {
                    name = selectedCommentToReply[0].login.slice(0, index);
                }
            }
            selectedCommentToReplyName = name;
        }
        return [
                <ul key="nav" className="nav nav-tabs mb-3">
                    <li className="nav-item w-50 text-center">
                        <a href="#"
                           className="nav-link active"
                           onClick={(e) => { e.preventDefault(); }}
                           data-toggle="tab"
                        >
                            Отзывы
                        </a>
                    </li>
                    <li className="nav-item w-50 text-center">
                        <a href="#"
                           className="nav-link"
                           onClick={(e) => { e.preventDefault(); this.setShowTop(true); }}
                           data-toggle="tab"
                        >
                            Недельный ТОП-10 отзывов
                        </a>
                    </li>
                </ul>,
                <div key="alertList" className="w-100">
                    <div className="form-group" hidden={!this.props.errorMessage}>
                        <div className="alert alert-danger">
                            {this.props.errorMessage}
                        </div>
                    </div>
                    <div className="form-group" hidden={!this.props.successMessage}>
                        <div className="alert alert-success">
                            {this.props.successMessage}
                        </div>
                    </div>
                </div>,
                <div key="commentList" className="comment-list row mb-3 pt-0">
                    {
                        commentElems.length > 0 ? commentElems : (
                            <div>Отзывов еще нет. Будьте первым!</div>
                        )
                    }
                </div>,
                <div>
                    {
                        this.state.auth ? (
                            <div key="writeComment" className="w-100">
                                <span hidden={!this.state.commentToReply}>
                                    <a href="#" className="mr-1" onClick={this.emptyCommentToReply.bind(this)}>
                                        <i className="fas fa-times-circle"></i>
                                    </a>
                                    Ответ на комментарий {selectedCommentToReplyName}:
                                </span>
                                <textarea
                                    className="form-control col-md-12 mb-1"
                                    maxLength={3000}
                                    placeholder="Текст отзыва"
                                    value={this.state.newComment}
                                    onChange={this.onTextChange.bind(this)}
                                />
                                <span className={this.state.classLength}>{this.state.length} из 3000</span>
                                <button className="form-control col-md-12 btn btn-success btn-sm" onClick={this.sendComment.bind(this)}>Оставить отзыв</button>
                            </div>
                        ) : ''
                    }
                </div>
        ];
    }
}

export default withRouter(EmployeeReviewsComponent);