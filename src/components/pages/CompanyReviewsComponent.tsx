import * as React from "react";
import {Redirect, Route, RouteComponentProps, Switch, withRouter} from "react-router";
import * as $ from "jquery";
import CommentComponent from "./CommentComponent";
import {BrowserStorage} from "../../helpers/BrowserStorage";
import * as ReactDOM from "react-dom";
import TopCommentsComponent from "./TopCommentsComponent";
import Helpers from "../../helpers/Helpers";

export namespace CompanyReviewsComponent {
    export interface Props extends RouteComponentProps<any> {
        showPopup: () => void,
        hidePopup: () => void,
        setTitle: (title: string, subtitle?: string) => void
        onRequest: (endpoint: string, data: object) => any
        errorMessage: string
        successMessage: string
    }
}

class CompanyReviewsComponent extends React.Component<CompanyReviewsComponent.Props, {
    comments: any[]
    employerId: string
    vacancyId: string
    auth: {
        login: string
        hash: string
        id: string
    }
    newComment: string
    length: any
    commentToReply: number
    busy: boolean
    showTop: boolean
    classLength: string
}> {

    constructor(props: any) {
        super(props);
        this.state = {
            comments: [],
            auth: null,
            employerId: null,
            vacancyId: null,
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
        var auth = await BrowserStorage.load("auth");

        if (!auth) {
            let pageData = await this.getPageData();
            let response = await this.props.onRequest("vacancies-employers", {
                user_id: null,
                result: pageData
            });
            pageData = await this.getPageData(true);
            let comments:any[] = [];
            $.each(response.comments, (index, item) => {
                $.each(item, (employer, empComments) => {
                    empComments.forEach((comment: any) => {
                        comment.employerId = pageData[index].employer_id;
                        comment.vacancyId = pageData[index].vacancy_id;
                    });
                    comments = $.merge(comments, empComments);
                    if (pageData[index].vacancyElem) {
                        this.updateCounter(pageData[index].vacancyElem, pageData[index].employer_id, pageData[index].employer_name, pageData[index].vacancy_id, pageData[index].vacancy_name, empComments.length);
                    }
                });
            });
            $.each(comments, (index, comment) => {
                if (comment.parent_employer_comment_id === "0") {
                    comment.parent_employer_comment_id = null;
                }
            });
            comments = Helpers.uniqueBy(comments, (o1, o2) => o1.id === o2.id);
            this.setState({
                comments: comments
            });
        } else {
            let pageData = await this.getPageData();
            let response = await this.props.onRequest("vacancies-employers", {
                user_id: auth.id,
                result: pageData
            });
            pageData = await this.getPageData(true);
            let comments:any[] = [];
            $.each(response.comments, (index, item) => {
                $.each(item, (employer, empComments) => {
                    empComments.forEach((comment: any) => {
                        comment.employerId = pageData[index].employer_id;
                        comment.vacancyId = pageData[index].vacancy_id;
                    });
                    comments = $.merge(comments, empComments);
                    if (pageData[index].vacancyElem) {
                        this.updateCounter(pageData[index].vacancyElem, pageData[index].employer_id, pageData[index].employer_name, pageData[index].vacancy_id, pageData[index].vacancy_name, empComments.length);
                    }
                });
            });
            $.each(comments, (index, comment) => {
                if (comment.parent_employer_comment_id === "0") {
                    comment.parent_employer_comment_id = null;
                }
            });
            comments = Helpers.uniqueBy(comments, (o1, o2) => o1.id === o2.id);
            this.setState({
                auth: auth,
                comments: comments
            });
        }
    }

    async getPageData(includeElem: boolean = false) {
        const vacancies = {
            $all: $("div.vacancy-serp-item"),
            getVacancy: (item: any) => {
                let $item = $(item);
                let $vacancyLink = $item.find("[data-qa='vacancy-serp__vacancy-title']");
                let $employerLink = $item.find("[data-qa='vacancy-serp__vacancy-employer']");
                if ($vacancyLink.length === 0) {
                    console.error("$vacancyLink not found",
                        $item.find("a")[0] || null,
                        $item.find("a")[1] || null,
                        $item.find("a")[2] || null,
                        $item.find("a")[3] || null,
                        $item.find("a")[4] || null,
                    );
                }
                if ($employerLink.length === 0) {
                    console.error("$employerLink not found", $item.find("a"),
                        $item.find("a")[0] || null,
                        $item.find("a")[1] || null,
                        $item.find("a")[2] || null,
                        $item.find("a")[3] || null,
                        $item.find("a")[4] || null,
                        );
                }
                return {
                    vacancyElem: includeElem ? item : null,
                    employer_name: $employerLink.text().trim(),
                    employer_id: $employerLink.attr("href").match(/[(\d)]+/)[0],
                    vacancy_id: $vacancyLink.attr("href").match(/[(\d)]+/)[0],
                    vacancy_name: $vacancyLink.text().trim()
                }
            }
        };
        let conditions:any = {
            sendVacancies: {
                regExp: /\/search\/vacancy/,
                getPageData: () => {
                    let pageData:any[] = [];
                    $.each(vacancies.$all, (index, item) => {
                        try {
                            pageData.push(vacancies.getVacancy(item));
                        } catch (e) {
                            console.error(e);
                        }
                    });
                    if (!this.state.employerId) {
                        this.props.hidePopup();
                    }
                    return pageData;
                }
            },
            sendCatalog: {
                regExp: /\/catalog\//,
                getPageData: () => {
                    let pageData:any[] = [];
                    $.each(vacancies.$all, (index, item) => {
                        try {
                            pageData.push(vacancies.getVacancy(item));
                        } catch (e) {
                            console.error(e);
                        }
                    });
                    if (!this.state.employerId) {
                        this.props.hidePopup();
                    }
                    return pageData;
                }
            },
            sendVacancy: {
                regExp: /\/vacancy\//,
                getPageData: () => {
                    let vacancy = {
                        $company: $("div.vacancy-company a"),
                        $vacancy: $("div.vacancy-title h1"),
                    };
                    let pageData = {
                        employer_name: vacancy.$company.text().trim(),
                        employer_id: vacancy.$company.attr("href").replace("/employer/", ""),
                        vacancy_name: vacancy.$vacancy.text().trim(),
                        vacancy_id: location.href.match(/[(\d)]+/)[0]
                    };
                    this.setState({
                        employerId: pageData.employer_id,
                        vacancyId: pageData.vacancy_id,
                    });
                    // this.props.showPopup();
                    this.props.setTitle("Отзывы о компании", pageData.employer_name);
                    return [pageData];
                }
            },
            sendEmployer: {
                regExp: /\/employer\//,
                getPageData: () => {
                    let employerId = location.href.match(/[(\d)]+/)[0];
                    let pageData = {
                        employer_name: $(".employer-page-header .employer-header-title-name").text().trim(),
                        employer_id: employerId,
                        vacancy_name: "company",
                        vacancy_id: employerId
                    };
                    this.setState({
                        employerId: pageData.employer_id,
                        vacancyId: pageData.vacancy_id
                    });
                    // this.props.showPopup();
                    this.props.setTitle("Отзывы о компании ", pageData.employer_name);
                    return [pageData];
                }
            }
        };

        for (let type in conditions) {
            if (conditions[type].regExp.test(location.href))
            {
                return conditions[type].getPageData();
            }
        }
        return {
            employer_name: "",
            employer_id: "",
            vacancy_id: "",
            vacancy_name: ""
        }
    }

    updateCounter(parentElem: HTMLElement, employerId: any, employerName: any, vacancyId: any, vacancyName: any, number: number) {
        console.group(`${chrome.runtime.getManifest().name}: обновление счётчика`);
        if (!parentElem) {
            let elem = $(`.hahachat-comment-counter[data-employerId=${employerId}][data-vacancyId=${vacancyId}]`).closest(".vacancy-serp-item");
            if (elem.length > 0) {
                parentElem = elem[0];
            } else {
                console.error("родительский элемент не найден");
                console.groupEnd();
                return;
            }
        }
        console.log(`компания "${employerName}"`);
        console.log(`вакансия "${vacancyName}"`);
        console.log(`родительский элемент`, parentElem);
        let container = $(parentElem).find(".hahachat-comment-counter");
        if (container.length === 0) {
            console.log(`счётчик не найден, встраиваем блок...`);
            $(parentElem).append(`<div class='hahachat-comment-counter' data-employerId='${employerId}' data-vacancyId='${vacancyId}' style='float: right;'></div>`);
            container = $(parentElem).find(".hahachat-comment-counter");
            console.log(`блок встроен.`);
        } else {
            console.log(`счётчик найден.`);
        }
        if (number > 0) {
            ReactDOM.render(
                <a href="#"
                   onClick={(e: any) => { this.onCommentCounterClick(e, employerId, employerName, vacancyId, vacancyName); }}
                >
                    Комментариев: {number}
                </a>
            , container[0]);
        } else {
            ReactDOM.render(
                <a href="#"
                    onClick={(e: any) => { this.onCommentCounterClick(e, employerId, employerName, vacancyId, vacancyName); }}
                    style={{color: '#aaa'}}
                >
                    Комментариев: {number}
                </a>
            , container[0]);
        }
        console.log(`рендер компонента закончен.`, container[0]);
        console.groupEnd();
    }

    componentWillUnmount(): void {
        $(".hahachat-comment-counter").remove();
    }

    onCommentCounterClick(e: Event, employerId: any, employerName: any, vacancyId: any, vacancyName: any) {
        e.preventDefault();
        this.props.showPopup();
        this.props.setTitle("Отзывы о компании", employerName);
        this.setState({
            employerId: employerId,
            vacancyId: vacancyId,
            commentToReply: null
        });
        console.group(`${chrome.runtime.getManifest().name}: выбран элемент`);
        console.log(`компания "${employerName}"`);
        console.log(`вакансия "${vacancyName}"`);
        let comments = this.state.comments.filter((comment) => {
            return comment.employerId === employerId;
        });
        console.log(`комментарии (${comments.length})`, comments);
        console.groupEnd();
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
                if (this.state.auth != null) {
                    var response = await this.props.onRequest("employer/comment", {
                        parent_employer_comment_id: this.state.commentToReply,
                        vacancy_id: this.state.vacancyId,
                        employer_id: this.state.employerId,
                        user_id: (await BrowserStorage.load("auth")).id,
                        text: this.state.newComment
                    });
                } else {
                    var response = await this.props.onRequest("employer/comment", {
                        parent_employer_comment_id: this.state.commentToReply,
                        vacancy_id: this.state.vacancyId,
                        employer_id: this.state.employerId,
                        text: this.state.newComment
                    });
                }
                if (response.result === "success") {
                    response.comment.employerId = this.state.employerId;
                    this.state.comments.push(response.comment);
                    this.setState({
                        commentToReply: null,
                        newComment: "",
                        comments: this.state.comments,
                        busy: false
                    });
                    let newCounter = this.state.comments.filter((comment) => {
                        return comment.employerId === this.state.employerId;
                    }).length;
                    this.updateCounter(null, this.state.employerId, response.comment.employer_name, this.state.vacancyId, response.comment.vacancy_name, newCounter);
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
            if (location.href.indexOf('employer')) {
                $("<div id='btn-popup' class='employer-sidebar-button'></div>").appendTo('.employer-sidebar__footer');

                if (this.state.comments.length > 0) {
                    var btn = <button className="btn-o" onClick={() => {this.props.showPopup()}}>Отзывы: {this.state.comments.length}</button>
                } else {
                    var btn = <button className="btn-o" onClick={() => {this.props.showPopup()}}>Оставить отзыв</button>
                }

                ReactDOM.render(btn, document.getElementById('btn-popup'));
            } else if (location.href.indexOf('vacancy')) {
                $("<div id='btn-popup' class='vacancy-action vacancy-action_stretched'></div>").appendTo('.vacancy-actions_applicant');

                if (this.state.comments.length > 0) {
                    var btn = <button className="btn-o" onClick={() => {this.props.showPopup()}}>Отзывы: {this.state.comments.length}</button>
                } else {
                    var btn = <button className="btn-o" onClick={() => {this.props.showPopup()}}>Оставить отзыв</button>
                }

                ReactDOM.render(btn, document.getElementById('btn-popup'));
            }
        }

        if (this.state.showTop) {
            return (
                <TopCommentsComponent
                    onRequest={this.props.onRequest}
                    setShowTop={this.setShowTop.bind(this)}
                />
            );
        }
        let comments = this.state.comments.filter((comment) => {
            return comment.employerId === this.state.employerId;
        });
        let commentElems:any[] = [];
        for (let i = 0; i < comments.length; i++) {
            let comment = comments[i];
            if (comment.parent_employer_comment_id) {
                continue;
            }
            if (this.state.auth != null) {
                commentElems.push(
                    <CommentComponent
                        key={comment.id}
                        editable={comment.user_id === this.state.auth.id}
                        auth={this.state.auth != null ? true : false}
                        comment={comment}
                        onRequest={this.props.onRequest}
                        selectCommentToReply={this.selectCommentToReply.bind(this)}
                        innerComments={this.state.comments
                            .filter((x: any) => x.parent_employer_comment_id === comment.id)
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
            } else {
                commentElems.push(
                    <CommentComponent
                        key={comment.id}
                        editable={false}
                        auth={this.state.auth != null ? true : false}
                        comment={comment}
                        onRequest={this.props.onRequest}
                        selectCommentToReply={this.selectCommentToReply.bind(this)}
                        innerComments={this.state.comments
                            .filter((x: any) => x.parent_employer_comment_id === comment.id)
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
            }
        }
        let selectedCommentToReplyName = "";
        let selectedCommentToReply = comments.filter((x: any) => x.id === this.state.commentToReply);
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
                                Ответ на комментарий пользователя <span className="font-weight-bolder">{selectedCommentToReplyName}</span>:
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

export default withRouter(CompanyReviewsComponent);