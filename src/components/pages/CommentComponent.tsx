import * as React from "react";
import {Redirect, Route, RouteComponentProps, Switch, withRouter} from "react-router";
import * as moment from "moment";
import "moment/locale/ru";
import {BrowserStorage} from "../../helpers/BrowserStorage";

export namespace CommentComponent {
    export interface Props extends RouteComponentProps<any> {
        onRequest: (endpoint: string, data: object) => any
        selectCommentToReply?: (id: string) => any
        innerComments: CommentComponent[]
        editable: boolean
        auth: boolean
        comment: {
            id: string
            rating: number
            userRating: number // -1 / 0 / -1
            name: string
            login: string
            avatar: string
            vacancy_id: string
            vacancy_name: string
            employer_id: string
            employer_name: string
            resume_id: string
            resume_name: string
            parent_employer_comment_id: string
            owner_id: string
            text: string
            update_time: string
            create_time: string
        }
    }
}

class CommentComponent extends React.Component<CommentComponent.Props, {
    textCollapsed: boolean
    textEditing: boolean
    originalText: string
    deleteStep: boolean
    deleted: boolean
    innerCommentsExpanded: boolean
    busy: boolean
    comment: {
        id: string
        rating: number
        userRating: number // -1 / 0 / -1
        name: string
        login: string
        avatar: string
        vacancy_id: string
        vacancy_name: string
        employer_id: string
        employer_name: string
        resume_id: string
        resume_name: string
        parent_employer_comment_id: string
        owner_id: string
        text: string
        update_time: string
        create_time: string
    }
}> {

    constructor(props: any) {
        super(props);

        if (!props.comment.rating) {
            props.comment.rating = 0;
        } else {
            props.comment.rating = parseInt(props.comment.rating);
        }
        if (!props.comment.userRating) {
            props.comment.userRating = 0;
        } else {
            props.comment.userRating = parseInt(props.comment.userRating);
        }
        props.comment.rating = parseInt(props.comment.rating);

        this.state = {
            textCollapsed: true,
            textEditing: false,
            originalText: null,
            deleteStep: false,
            deleted: false,
            innerCommentsExpanded: false,
            busy: false,
            comment: props.comment
        }
    }

    componentDidMount(): void {
        console.group(`${chrome.runtime.getManifest().name}: комментарий #${this.props.comment.id} примонтирован`);
        console.groupEnd();
    }

    componentWillUnmount(): void {
        console.group(`${chrome.runtime.getManifest().name}: комментарий #${this.props.comment.id} отмонтирован`);
        console.groupEnd();
    }

    dateToText(date: string) {
        let mDate = moment(date);
        moment.locale('ru');
        return mDate.fromNow();
    }

    rateUp() {
        if (!this.state.busy && this.state.comment.userRating < 1) {
            this.setState({
                busy: true
            }, async () => {
                let response:any;
                if (this.state.comment.resume_id) {
                    response = await this.props.onRequest("resumes/rate-comment", {
                        user_id: (await BrowserStorage.load("auth")).id,
                        comment_id: this.state.comment.id,
                        rate: this.state.comment.userRating + 1
                    });
                } else {
                    response = await this.props.onRequest("employer/rate-comment", {
                        user_id: (await BrowserStorage.load("auth")).id,
                        employer_comment_id: this.state.comment.id,
                        rate: this.state.comment.userRating + 1
                    });
                }
                if (response.result === "success") {
                    this.state.comment.rating = this.state.comment.rating + 1;
                    this.state.comment.userRating = this.state.comment.userRating + 1;
                    this.setState({
                        comment: this.state.comment,
                        busy: false
                    });
                } else {
                    this.setState({
                        busy: false
                    });
                }
            });
        }
    }

    rateDown() {
        if (!this.state.busy && this.state.comment.userRating > -1) {
            this.setState({
                busy: true
            }, async () => {
                let response:any;
                if (this.state.comment.resume_id) {
                    response = await this.props.onRequest("resumes/rate-comment", {
                        user_id: (await BrowserStorage.load("auth")).id,
                        comment_id: this.state.comment.id,
                        rate: this.state.comment.userRating - 1
                    });
                } else {
                    response = await this.props.onRequest("employer/rate-comment", {
                        user_id: (await BrowserStorage.load("auth")).id,
                        employer_comment_id: this.state.comment.id,
                        rate: this.state.comment.userRating - 1
                    });
                }
                if (response.result === "success") {
                    this.state.comment.rating = this.state.comment.rating - 1;
                    this.state.comment.userRating = this.state.comment.userRating - 1;
                    this.setState({
                        comment: this.state.comment,
                        busy: false
                    });
                } else {
                    this.setState({
                        busy: false
                    });
                }
            });
        }
    }

    startEdit(e: Event) {
        e.preventDefault();
        if (!this.state.textEditing) {
            this.setState({
                textEditing: true,
                originalText: this.state.comment.text
            });
        }
    }

    saveEdit() {
        if (this.state.textEditing) {
            this.setState({
                busy: true
            }, async () => {
                let response:any;
                if (this.state.comment.resume_id) {
                    response = await this.props.onRequest("resumes/edit-comment", {
                        comment_id: this.state.comment.id,
                        text: this.state.comment.text,
                        owner_id: this.state.comment.owner_id || "",
                        resume_id: this.state.comment.resume_id || "",
                        user_id: (await BrowserStorage.load("auth")).id
                    });
                } else {
                    response = await this.props.onRequest("employer/edit-comment", {
                        comment_id: this.state.comment.id,
                        text: this.state.comment.text,
                        parent_employer_comment_id: this.state.comment.parent_employer_comment_id,
                        employer_id: this.state.comment.employer_id,
                        vacancy_id: this.state.comment.vacancy_id,
                        user_id: (await BrowserStorage.load("auth")).id
                    });
                }
                if (response.result === "success") {
                    this.setState({
                        textEditing: false,
                        busy: false
                    });
                } else {
                    this.setState({
                        busy: false
                    });
                }
            });
        }
    }

    cancelEdit() {
        if (this.state.textEditing) {
            let comment = this.state.comment;
            comment.text = this.state.originalText;
            this.setState({
                textEditing: false,
                deleteStep: false,
                comment: comment
            });
        }
    }

    expandInnerComments(e: Event) {
        e.preventDefault();
        if (!this.state.innerCommentsExpanded) {
            this.setState({
                innerCommentsExpanded: true
            });
        }
    }

    hideInnerComments(e: Event) {
        e.preventDefault();
        if (this.state.innerCommentsExpanded) {
            this.setState({
                innerCommentsExpanded: false
            });
        }
    }

    delete() {
        if (!this.state.deleteStep) {
            this.setState({
                deleteStep: true
            });
        } else {
            this.setState({
                busy: true
            }, async () => {
                let response:any;
                if (this.state.comment.resume_id) {
                    response = await this.props.onRequest("resumes/delete-comment", {
                        comment_id: this.state.comment.id,
                        text: this.state.comment.text,
                        owner_id: this.state.comment.owner_id || "",
                        resume_id: this.state.comment.resume_id || "",
                        user_id: (await BrowserStorage.load("auth")).id
                    });
                } else {
                    response = await this.props.onRequest("employer/delete-comment", {
                        comment_id: this.state.comment.id,
                        text: this.state.comment.text,
                        parent_employer_comment_id: this.state.comment.parent_employer_comment_id,
                        employer_id: this.state.comment.employer_id,
                        vacancy_id: this.state.comment.vacancy_id,
                        user_id: (await BrowserStorage.load("auth")).id
                    });
                }
                if (response.result === "success") {
                    this.setState({
                        deleted: true,
                        busy: false
                    });
                } else {
                    this.setState({
                        busy: false
                    });
                }
            });
        }
    }

    onTextChange(e: React.FormEvent<HTMLTextAreaElement>) {
        let comment = this.state.comment;
        comment.text = e.currentTarget.value;
        this.setState({
            comment: comment
        });
    }

    expandText(e: Event) {
        e.preventDefault();
        this.setState({
            textCollapsed: false
        });
    }

    render() {
        if (this.state.deleted) {
            return (
                <div></div>
            );
        }
        let rating = this.state.comment.rating.toString();
        if (this.state.comment.rating > 0) {
            rating = "+" + rating;
        }

        let text: any = this.state.comment.text;

        let textShortened = false;
        if (text.length > 140 && this.state.textCollapsed) {
            text = text.substring(0, 137) + "...";
            textShortened = true;
        }
        let name = this.state.comment.name;
        if (!name) {
            let index = this.state.comment.login.indexOf('@');
            if (index > -1) {
                name = this.state.comment.login.slice(0, index);
            }
        }
        return [
            <div key="main" className="row comment-container">
                <div className="col-md-12 comment-header">
                    <span className="rating">
                        {rating}
                    </span>
                    {
                        this.props.auth ? (
                            <span className="ratingButtons">
                                <span className={`up mr-0 ${this.state.comment.userRating > 0 ? "active" : ""}`} onClick={this.rateUp.bind(this)}>
                                    <i className={`fas fa-caret-up`}></i>
                                </span>
                                <span className={`down mr-0 ${this.state.comment.userRating < 0 ? "active" : ""}`} onClick={this.rateDown.bind(this)}>
                                    <i className={`fas fa-caret-down`}></i>
                                </span>
                            </span>
                        ) : ''
                    }
                    <span className="avatar">
                        <img src={this.state.comment.avatar || chrome.runtime.getURL("images/avatar_placeholder.png")} alt={this.state.comment.name} />
                    </span>
                    <span className="name">
                        {name}
                    </span>
                    <span className="time mr-0">
                        {this.dateToText(this.state.comment.create_time)}
                    </span>
                </div>
                <div className="col-md-12">
                    {
                        this.state.comment.resume_name ? (
                            <a href={`https://hh.ru/resume/${this.state.comment.resume_id}`} target="_blank">
                                Резюме: {this.state.comment.resume_name}
                            </a>
                        ) : (
                            this.state.comment.vacancy_name !== "company" ? (
                                <a href={`https://hh.ru/vacancy/${this.state.comment.vacancy_id}`} target="_blank">
                                    Вакансия: {this.state.comment.vacancy_name}
                                </a>
                            ) : (
                                <a href={`https://hh.ru/employer/${this.state.comment.employer_id}`} target="_blank">
                                    Компания: {this.state.comment.employer_name}
                                </a>
                            )
                        )
                    }
                </div>
                <div className="col-md-12 comment-body">
                    <div hidden={this.state.textEditing}>
                        {text}
                        <a href="#" className="ml-1" hidden={!textShortened || !this.state.textCollapsed} onClick={this.expandText.bind(this)}>читать полностью</a>
                    </div>
                    <div className="row" hidden={!this.state.textEditing}>
                        <div className="col-md-12">
                            <textarea className="form-control mb-1" value={this.state.comment.text} onChange={this.onTextChange.bind(this)} />
                        </div>
                        <div className="col-md-4">
                            <button className="btn btn-success btn-sm w-100"
                                    onClick={this.saveEdit.bind(this)}
                                    disabled={this.state.busy}
                            >
                                {
                                    !this.state.busy ? (
                                        "Сохранить"
                                    ) : (
                                        <span>
                                            <i className="fas fa-spinner fa-spin"></i>
                                        </span>
                                    )
                                }
                            </button>
                        </div>
                        <div className="col-md-4">
                            <button className="btn btn-danger btn-sm w-100"
                                    onClick={this.delete.bind(this)}
                                    disabled={this.state.busy}
                            >
                                {
                                    !this.state.busy ? (
                                        !this.state.deleteStep ? (
                                            "Удалить"
                                        ) : (
                                            "Подтвердить"
                                        )
                                    ) : (
                                        <span>
                                        <i className="fas fa-spinner fa-spin"></i>
                                    </span>
                                    )
                                }
                            </button>
                        </div>
                        <div className="col-md-4">
                            <button className="btn btn-warning btn-sm w-100" onClick={this.cancelEdit.bind(this)}>
                                Отменить
                            </button>
                        </div>
                    </div>
                </div>
                <div className="col-md-12 comment-footer" hidden={(this.props.editable && this.state.textEditing) || !this.props.auth}>
                    <a href="#"
                       className="mr-2"
                       hidden={!!this.state.comment.parent_employer_comment_id}
                       onClick={(e) => {
                           e.preventDefault();
                           this.props.selectCommentToReply(this.state.comment.id);
                       }}
                    >
                        <i className="fas fa-reply mr-1"></i>
                        ответить
                    </a>
                    <a href="#"
                       className="mr-2"
                       hidden={!this.props.innerComments || this.props.innerComments.length === 0 || this.state.innerCommentsExpanded}
                       onClick={this.expandInnerComments.bind(this)}
                    >
                        <i className="fas fa-comments mr-1"></i>
                        комментарии ({(this.props.innerComments || []).length})
                    </a>
                    <a href="#"
                       className="mr-2"
                       hidden={!this.props.innerComments || this.props.innerComments.length === 0 || !this.state.innerCommentsExpanded}
                       onClick={this.hideInnerComments.bind(this)}
                    >
                        <i className="fas fa-minus mr-1"></i>
                        свернуть комментарии
                    </a>
                    <a href="#"
                       className="mr-2"
                       hidden={!this.props.editable || this.state.textEditing}
                       onClick={this.startEdit.bind(this)}
                    >
                        <i className="fas fa-edit mr-1"></i>
                        редактировать
                    </a>
                </div>
                <div className="col-md-12 comment-footer">
                </div>
            </div>,
            <div key="innerComments" className="pl-2 inner-comments" hidden={!this.state.innerCommentsExpanded}>
                {this.props.innerComments}
            </div>
        ];
    }
}

export default withRouter(CommentComponent);