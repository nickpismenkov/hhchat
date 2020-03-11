$(function ()
{
    //const domain = "https://hahachat.chrgbck.ru/";
    const domain = "http://hh-server.localhost/";
    let userId;
    let login;
    let hash;
    let iziModal;
    let modalHtml = (message) => `<div class="modal"><h3>${message}</h3><a class="modalOk">OK</a></div>`;
    let blackoutHtml = '<div class="blackout"></div>';
    let dbData;

    const auth =
    {
        fields: () =>
        ({
            $form: $("#hhAuthForm"),
            $login: $("#hhLogin"),
            $password: $("#hhPassword"),
            $action: $("#hhAction"),
            $submit: $("#hhAuthSubmit"),
            $recover: $("#hhRecover"),
            $login_a: $(".hhLogin"),
            $logout_a: $(".hhLogout"),
            $register_a: $(".hhRegister"),
            $recovery_a: $(".hhRecovery"),
            $labels: $("div.js-float-label-wrapper label")
        }),
        form:
        {
            toRegister: () =>
            {
                /*contentHahaChat.hhForm().$form.hide();
                auth.fields().$form.show();
                auth.fields().$labels.show();
                auth.fields().$login.attr({required:true}).val("").show();
                auth.fields().$password.attr({required:true, placeholder: "Придумайте пароль *"}).val("").show();
                auth.fields().$recover.show().hide().val("").attr({required:false});
                auth.fields().$action.text("Регистрация");
                auth.fields().$submit.val("Зарегистрироваться").data("action", "register").show();
                auth.fields().$login_a.show();
                auth.fields().$logout_a.hide();
                auth.fields().$register_a.hide();
                auth.fields().$recovery_a.hide();*/
            },
            toLogin: () =>
            {
                /*auth.fields().$form.show();
                contentHahaChat.hhForm().$form.hide();
                auth.fields().$labels.show();
                auth.fields().$login.attr({required:true}).val("").show();
                auth.fields().$password.attr({required:true, placeholder: "Введите Ваш пароль *"}).val("").show();
                auth.fields().$recover.hide();
                auth.fields().$action.text("Вход");
                auth.fields().$submit.val("Войти").data("action", "login");
                auth.fields().$login_a.hide();
                auth.fields().$logout_a.hide();
                auth.fields().$register_a.show();
                auth.fields().$recovery_a.show();*/
            },
            toAccount: () =>
            {
                /*auth.fields().$form.hide();
                contentHahaChat.hhForm().$form.show();
                auth.fields().$logout_a.show().find("span").text(login);
                auth.fields().$recover.hide();
                auth.fields().$login_a.hide();
                auth.fields().$register_a.hide();
                auth.fields().$recovery_a.hide();*/
            },
            toRecovery: () =>
            {
                /*auth.fields().$form.show();
                contentHahaChat.hhForm().$form.hide();
                auth.fields().$labels.show();
                auth.fields().$login.attr({required:true}).val("").show();
                auth.fields().$password.attr({required:false}).hide().val("");
                auth.fields().$recover.hide().val("");
                auth.fields().$action.text('Восстановление пароля');
                auth.fields().$submit.val("Отправить письмо на e-mail").data("action", "recovery").show();
                auth.fields().$login_a.show();
                auth.fields().$logout_a.hide();
                auth.fields().$register_a.show();
                auth.fields().$recovery_a.hide();*/
            },
            toRecoverPassword: () =>
            {
                /*auth.fields().$form.show();
                contentHahaChat.hhForm().$form.hide();
                auth.fields().$labels.show();
                auth.fields().$login.attr({required:true}).hide();
                auth.fields().$password.attr({required:true, placeholder: "Придумайте новый пароль *"}).val("").show();
                auth.fields().$recover.show().val("");
                auth.fields().$submit.val("Сохранить новый пароль").data("action", "recover-password").show();
                auth.fields().$login_a.show();
                auth.fields().$logout_a.hide();
                auth.fields().$register_a.show();
                auth.fields().$recovery_a.hide();*/
            }
        },
        auth:
        {
            checkHash: () =>
            {
                /*chrome.storage.sync.get(["hash"], data =>
                {
                    let hash = data.hash || "";
                    if (hash.length )
                    {
                        $.getJSON(`${domain}check`, {uniq_hash: hash}).done(result =>
                        {
                            auth.auth.login(result);
                        });
                    }
                    else
                    {
                        auth.form.toRegister();
                    }
                });*/
            },
            login: (result) =>
            {
                /*login = result.login;
                hash = result.hash;
                userId = result.id;
                chrome.storage.sync.set(
                {
                    login: result.login,
                    hash: result.hash,
                    id: result.id
                },
                auth.form.toAccount());*/
            }
        },
        setOnEvents: () =>
        {
            /*auth.fields().$login_a.on("click", auth.form.toLogin);*/
            /*auth.fields().$logout_a.on("click", function ()
            {
                login = userId = hash = "";
                chrome.storage.sync.set({login: "", hash: "", id: ""}, auth.form.toLogin);
            });*/
            //auth.fields().$register_a.on("click", auth.form.toRegister);
            //auth.fields().$recovery_a.on("click", auth.form.toRecovery);

            /*auth.fields().$form.on('submit',function( event )
            {
                event.preventDefault();
                $.getJSON(`${domain}${auth.fields().$submit.data("action")}`, $(this).serialize()).done(result =>
                {
                    let message = "Что-то пошло не так, попробуйте ещё раз.";
                    if ("success" === result.result)
                    {
                        message = result.message;
                        if (auth.fields().$submit.data("action") === "recovery")
                        {
                            auth.form.toRecoverPassword();
                        }
                        else
                        {
                            auth.auth.login(result);
                            location.reload();
                        }
                    }
                    else if (409 === parseInt(result.error.code))
                    {
                        message = result.error.text;
                    }
                    else if (422 === parseInt(result.error.code))
                    {
                        message = result.error.text;
                    }

                    contentHahaChat.hhForm().$wrapper.prepend( blackoutHtml ).hide().fadeIn().append( modalHtml(message) );
                });
            });*/
        },
        init: () =>
        {
           /* $( '.js-float-label-wrapper' ).FloatLabel();
            auth.setOnEvents();
            auth.auth.checkHash();*/
        }
    };

    /*const vacancy =
    {
        $company: $("div.vacancy-company a.vacancy-company-name"),
        $vacancy: $("div.vacancy-title h1"),
    };*/
    /*const vacancies =
    {
        $all:

        ,
        getVacancy: item =>
        {
            let $item = $(item);
            let $vacancyLink = $item.find("div.resume-search-item__name a");
            let $employerLink = $item.find("div.vacancy-serp-item__meta-info a.bloko-link.bloko-link_secondary");
            return {
                employer_name: $employerLink.text().trim(),
                employer_id: $employerLink.attr("href").match(/[(\d)]+/)[0],
                vacancy_id: $vacancyLink.attr("href").match(/[(\d)]+/)[0],
                vacancy_name: $vacancyLink.text().trim()
            }
        }
    };
    const employer =
    {
        $name: vacancies
    };*/

    const contentHahaChat =
    {
        $ajax: (route, data) =>
        {
            return $.ajax(
            {
                url: domain + route,
                type: "POST",
                data: data,
                dataType: "json",
                global: false
            })
        },
        dateOptions: () =>
        ({
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            timezone: 'UTC',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
        }),
        $resumes: $("div[data-resume-id]"),
        /*modalForm:
            `<div id='hahaModal'>
                <div class="hahawrapper">
                    <form id="hhAuthForm" hidden novalidate>
                        <h2 id="hhAction">Регистрация</h2>
                        <div class="js-float-label-wrapper">
                            <label for="login">Email</label>
                            <input type="email" required id="hhLogin" name="login" placeholder="E-mail *" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$"/>
                        </div>
            
                        <div class="js-float-label-wrapper">
                            <label for="password">Пароль</label>
                            <input type="password" required id="hhPassword" name="password" pattern="[A-Za-z0-9]{8,16}" title="Только латинские символы, минимальная длина пароля 8 символов" placeholder="Придумайте пароль *" />
                        </div>
                        
                        <div class="js-float-label-wrapper">
                            <label for="recovery">Код восстановления</label>
                            <input type="text" id="hhRecover" name="recovery" pattern="[A-Za-z0-9]{13}" title="Код восстановления, 13 символов" placeholder="Код восстановления *"/>
                        </div>
            
                        <input id="hhAuthSubmit" type="submit" data-action="register" value="Зарегистрироваться" />
                    </form>
                   
                    <form id="hhForm">
                        <div id="hahaComments"></div> 
                        <textarea class="haha" name="text" maxlength="512" required placeholder="Текст отзыва *"/></textarea>
                        <input class="haha" id="hahaSubmit" type="submit" data-action="addComment" value="Оставить комментарий">
                        <input id="hahaOwner" type="text" name="owner_id" hidden>
                        <input id="hahaResume" type="text" name="resume_id" hidden>
                        <input id="hahaEmployer" type="text" name="employer_id" hidden>
                        <input id="hahaVacancy" type="text" name="vacancy_id" hidden>
                        <input id="hahaIndex" type="text" hidden> 
                        <input id="hahaCommentId" type="text" name="comment_id" hidden> 
                    </form>
                    <div class="hhAuthNav">
                        <a class="hhLogin">Войти</a>
                        <a class="hhRegister" hidden>Зарегистрироваться</a>
                        <a class="hhRecovery">Забыли пароль?</a>
                        <a class="hhLogout" hidden >Выйти <span></span></a>
                    </div>
                </div>
            </div>`,*/
        commentsLinkHtml: "<a class='commentCount'></a>",
        getResumeCommentHtml: (comment) =>
        {
            let date = new Date(comment['update_time']);
            let html = `<div class="hh-comment-container" data-id="${comment.id}">
                <p><span>${comment.login.slice(0, comment.login.indexOf('@'))}</span> <span class="hh-comment-date">${date.toLocaleString("ru", contentHahaChat.dateOptions())}</span></p>
                <p><a target="_blank" href="/resume/${comment['resume_id']}">Резюме: ${comment.name}</a><br><span class="hh-comment-text">${comment.text}</span></p>`;
            if (login === comment.login)
            {
                html += `<p class="hh-comment-action"><a class="hhEdit">Редактировать</a><a class="hhDelete">Удалить</a></p>`;
            }
            return html + "</div>";
        },
        getEmployerCommentHtml: (comment) =>
        {
            /*let date = new Date(comment['update_time']);
            let a;
            if (comment["vacancy_id"].length === 32)
            {
                a = `<a target="_blank" href="/employer/${comment['employer_id']}">Компания: ${comment['employer_name']}</a>`;
            }
            else
            {
                a = `<a target="_blank" href="/vacancy/${comment['vacancy_id']}">Вакансия: ${comment["vacancy_name"]}</a>`;
            }
            let html = `<div class="hh-comment-container" data-id="${comment.id}">
                <p><span>${comment.login.slice(0, comment.login.indexOf('@'))}</span> <span class="hh-comment-date">${date.toLocaleString("ru", contentHahaChat.dateOptions())}</span></p>
                <p>${a}<br><span class="hh-comment-text">${comment.text}</span></p>`;
            if (login === comment.login)
            {
                html += `<p class="hh-comment-action"><a class="hhEdit">Редактировать</a><a class="hhDelete">Удалить</a></p>`;
            }
            return html + "</div>";*/
        },
        hhForm: () =>
        ({
            $wrapper: $(".hahawrapper"),
            $form: $("#hhForm"),
            $textarea: $("textarea.haha"),
            $submit: $("#hahaSubmit"),
            $ownerId: $("#hahaOwner"),
            $resumeId: $("#hahaResume"),
            $comments: $("#hahaComments"),
            $employerId: $("#hahaEmployer"),
            $index: $("#hahaIndex"),
            $commentId: $("#hahaCommentId"),
            $vacancyId: $("#hahaVacancy")
        }),
        setParams: data =>
        {
            userId = data.id || "";
            login = data.login || "";
        },
        createIziModal: () =>
        {
            /*iziModal = $(contentHahaChat.modalForm).appendTo('body');
            iziModal = iziModal.iziModal(
            {
                headerColor: "rgb(0, 63, 145)",
                width: 400,
                borderBottom:false,
                zindex: 1500,
                overlay: false,
                onClosed: contentHahaChat.destroyModal,
                onOpening: contentHahaChat.clearCommentTextArea
            });*/
            contentHahaChat.commentFormOnSubmit();
        },
        commentFormOnSubmit: () =>
        {
            /*iziModal.on("submit","#hhForm", function (e)
            {
                e.preventDefault();
                if (userId === "" || userId === undefined)
                {
                    auth.form.toLogin();
                    contentHahaChat.hhForm().$wrapper.prepend( blackoutHtml ).hide().fadeIn().append( modalHtml("Авторизуйтесь") );
                }
                else
                {
                    let $this = $(this);
                    let data = $this.serialize();

                    if (/resume/.test(location.href))
                    {
                        if (contentHahaChat.hhForm().$submit.data("action") === "editComment")
                        {
                            let dataArray = $this.serializeArray();
                            let commentId = dataArray.filter(item => item.name === "comment_id")[0].value;
                            let oldText = $(`.hh-comment-container[data-id='${commentId}'] span.hh-comment-text`).text();
                            let newText = dataArray.filter(item => item.name === "text")[0].value;
                            if (oldText !== newText)
                            {
                                contentHahaChat.editResumeComment($this);
                            }
                            else
                            {
                                contentHahaChat.hhForm().$submit.data("action", "addComment").val("Оставить комментарий");
                                contentHahaChat.clearCommentTextArea();
                            }
                        }
                        else if (contentHahaChat.hhForm().$submit.data("action") === "addComment")
                        {
                            contentHahaChat.sendComment(data);
                        }
                    }
                    else
                    {
                        if (contentHahaChat.hhForm().$submit.data("action") === "editComment")
                        {
                            let dataArray = $this.serializeArray();
                            let commentId = dataArray.filter(item => item.name === "comment_id")[0].value;
                            let oldText = $(`.hh-comment-container[data-id='${commentId}'] span.hh-comment-text`).text();
                            let newText = dataArray.filter(item => item.name === "text")[0].value;
                            if (oldText !== newText)
                            {
                                contentHahaChat.editEmployerComment($this);
                            }
                            else
                            {
                                contentHahaChat.hhForm().$submit.data("action", "addComment").val("Оставить комментарий");
                                contentHahaChat.clearCommentTextArea();
                            }
                        }
                        else if (contentHahaChat.hhForm().$submit.data("action") === "addComment")
                        {
                            contentHahaChat.sendEmployerComment(data);
                        }
                    }
                }
            });*/
        },
        destroyModal: () =>
        {
            /*$('.blackout').fadeOut(function()
            {
                $(this).remove();
                $(".modal").fadeOut(function () {
                    $(this).remove();
                })
            });*/
        },
        clearCommentTextArea: () => contentHahaChat.hhForm().$textarea.val(""),
        /*sendResumes: () =>
        {
            let data = {result: []};

            $.each(contentHahaChat.$resumes, (index, item) =>
            {
                let $item = $(item);
                let name = $item.find("a.resume-search-item__name").text().trim();
                let id = $item.data("hh-resume-hash");
                let resumes = [];

                resumes.push(
                {
                    id: id,
                    name: name,
                });

                $.each($item.find("ul.output__stackedresumes li a"), (index, item) =>
                {
                    let pathname = item.pathname;
                    resumes.push(
                    {
                        id: pathname.replace("/resume/", ""),
                        name: $(item).text(),
                    });
                });
                data.result.push(resumes);
            });
            contentHahaChat.send(data);
        },
        sendResume: () =>
        {
            let data = {result: []};
            const elements =
            {
                $id: $("div[data-hh-resume-hash]"),
                $name: $("span.resume-block__title-text span"),
            };
            let resumes = [];
            resumes.push(
            {
                id: location.pathname.replace('/resume/', ''),
                name: elements.$name.text().trim(),
            });
            data.result.push(resumes);
            contentHahaChat.send(data);
        },*/
        send: data =>
        {
            $.ajax(
            {
                url: `${domain}resumes`,
                type: "POST",
                data: data,
                dataType: "json",
                global: false
            }).done(data =>
            {
                dbData = data.comments;
                iziModal.iziModal("setTitle", "Отзывы о сотруднике");
                $.each(dbData, (index, item) =>
                {
                    let fio, $resumeDiv, mainResumeId;
                    if (/search\/resume/.test(location.href))
                    {
                         $resumeDiv = $(contentHahaChat.$resumes[index]);
                         fio = $resumeDiv.find("div.resume-search-item__fullname").text().split(",");
                         fio = ((fio.length >= 1) ? (isNaN(parseInt(fio[0].trim())) ? fio[0].trim() : "") : "").replace(/\s+/g,' ');
                         mainResumeId = $resumeDiv.data("hh-resume-hash");
                    }
                    else if(/resume/.test(location.href))
                    {
                        $resumeDiv = $(".bloko-button-group.bloko-button-group_stretched");
                        fio = ($("div.resume-header-name").text().trim()|| "").replace(/\s+/g,' ');
                        mainResumeId = location.pathname.replace('/resume/', '');
                    }
                    
                    $.each(item, (owner, comments) =>
                    {
                        let ownerId = owner;
                        let $commentsLink;
                        let commentsHtml = "";
                        if (dbData[index][ownerId].length)
                        {
                            $.each(dbData[index][ownerId], (key, comment) =>
                            {
                                commentsHtml += contentHahaChat.getResumeCommentHtml(comment);
                            });
                        }
                        if (/search\/resume/.test(location.href))
                        {
                            $commentsLink = $(contentHahaChat.commentsLinkHtml).appendTo($resumeDiv.find(".resume-search-item__content-wrapper")).text(comments.length).addClass('commentCountBottom');
                        }
                        else if(/resume/.test(location.href))
                        {
                            $commentsLink = $(contentHahaChat.commentsLinkHtml).appendTo($(".supernova-navi-wrapper")).text(comments.length).addClass(["hhFloat", 'fixedComment']);
                            contentHahaChat.hhForm().$comments.html(commentsHtml);
                            contentHahaChat.hhForm().$index.val(index);
                            contentHahaChat.hhForm().$comments.html(commentsHtml);
                            contentHahaChat.hhForm().$ownerId.val(ownerId);
                            contentHahaChat.hhForm().$resumeId.val(mainResumeId);
                            iziModal.iziModal('setSubtitle', fio);
                            iziModal.iziModal('open');
                        }

                        $commentsLink.on("click", () =>
                        {
                            let commentsHtml = "";
                            if (dbData[index][ownerId].length)
                            {
                                $.each(dbData[index][ownerId], (key, comment) =>
                                {
                                    commentsHtml += contentHahaChat.getResumeCommentHtml(comment);
                                });
                            }
                            contentHahaChat.hhForm().$index.val(index);
                            contentHahaChat.hhForm().$comments.html(commentsHtml);
                            contentHahaChat.hhForm().$ownerId.val(ownerId);
                            contentHahaChat.hhForm().$resumeId.val(mainResumeId);
                            iziModal.iziModal('setSubtitle', fio);
                            if ("none" === $("#hahaModal").css("display"))
                            {
                                iziModal.iziModal('open');
                            }
                        });
                    });
                });
            });
        },
        sendComment: data =>
        {
            $.ajax
            (
                {
                    url: `${domain}comment`,
                    type: "POST",
                    data: data+`&user_id=${userId}`,
                    dataType: "json",
                    global: false
                }
            ).done(result =>
            {
                let message = "Что-то пошло не так, попробуйте ещё раз.";
                if ("success" === result.result)
                {
                    if (result.message === "Комментарий успешно добавлен")
                    {
                        let date = new Date();
                        let index = $("#hahaIndex").val();
                        let ownerId = $("#hahaOwner").val();
                        let comment = result.comment;
                        comment.login = login;
                        comment.update_time = date;
                        comment.name = $(contentHahaChat.$resumes[index]).find("a.resume-search-item__name").text().trim() || $("span.resume-block__title-text")[0].innerText;
                        dbData[index][ownerId].push(comment);

                        let $commentCount = $($(".commentCount")[index]);
                        $commentCount.text(parseInt($commentCount.text()) + 1);

                        $("#hahaComments").html(contentHahaChat.getResumeCommentHtml(comment) + $("#hahaComments").html());
                    }
                    contentHahaChat.clearCommentTextArea();
                    message = result.message;
                }
                $('.hahawrapper').prepend( blackoutHtml ).hide().fadeIn().append( modalHtml(message) );
            });
        },
        sendEmployerComment: data =>
        {
            /*data += `&user_id=${userId}`;
            contentHahaChat.$ajax("employer/comment", data).done(result =>
            {
                let message = "Что-то пошло не так, попробуйте ещё раз.";
                if ("success" === result.result)
                {
                    if (result.message === "Комментарий успешно добавлен")
                    {
                        result.comment.login = login;
                        result.comment.update_time = new Date();
                        dbData[contentHahaChat.hhForm().$index.val()][contentHahaChat.hhForm().$employerId.val()].push(result.comment);

                        let $commentCount = $($(".commentCount")[contentHahaChat.hhForm().$index.val()]);
                        $commentCount.text(parseInt($commentCount.text()) + 1);

                        contentHahaChat.hhForm().$comments.html(contentHahaChat.getEmployerCommentHtml(result.comment) + contentHahaChat.hhForm().$comments.html());
                    }
                    contentHahaChat.clearCommentTextArea();
                    message = result.message;
                }

                $('.hahawrapper').prepend( blackoutHtml ).hide().fadeIn().append( modalHtml(message) );
            });*/
        },
        editResumeComment: $this =>
        {
            $.ajax
            (
                {
                    url: `${domain}resumes/edit-comment`,
                    type: "POST",
                    data: $this.serialize()+`&user_id=${userId}`,
                    dataType: "json",
                    global: false
                }
            ).done(result =>
                {
                    let message = "Что-то пошло не так, попробуйте ещё раз.";
                    if ("success" === result.result)
                    {
                        if (result.message === "Комментарий успешно обновлен")
                        {
                            let newData = $this.serializeArray();
                            let commentID = newData.filter(item => item.name === "comment_id")[0].value;
                            let newText = newData.filter(item => item.name === "text")[0].value;
                            $.each(dbData[contentHahaChat.hhForm().$index.val()][contentHahaChat.hhForm().$ownerId.val()], (index, comment) =>
                            {
                                if (comment.id == commentID)
                                {
                                    dbData[contentHahaChat.hhForm().$index.val()][contentHahaChat.hhForm().$ownerId.val()][index].text = newText;
                                    $(`.hh-comment-container[data-id='${commentID}'] span.hh-comment-text`).text(newText);
                                }
                            });
                        }
                        contentHahaChat.hhForm().$submit.data("action", "addComment").val("Оставить комментарий");
                        contentHahaChat.clearCommentTextArea();
                        message = result.message;
                    }

                    $('.hahawrapper').prepend( blackoutHtml ).hide().fadeIn().append( modalHtml(message) );
                }
            );
        },
        deleteResumeComment: () =>
        {
            $.ajax
            (
                {
                    url: `${domain}resumes/delete-comment`,
                    type: "POST",
                    data: contentHahaChat.hhForm().$form.serialize()+`&user_id=${userId}`,
                    dataType: "json",
                    global: false
                }
            ).done(result =>
                {
                    let message = "Что-то пошло не так, попробуйте ещё раз.";
                    if ("success" === result.result)
                    {
                        if (result.message === "Комментарий успешно удален")
                        {
                            let newData = contentHahaChat.hhForm().$form.serializeArray();
                            let commentID = newData.filter(item => item.name === "comment_id")[0].value;
                            $.each(dbData[contentHahaChat.hhForm().$index.val()][contentHahaChat.hhForm().$ownerId.val()], (index, comment) =>
                            {
                                if (comment !== undefined && comment.id == commentID)
                                {
                                    dbData[contentHahaChat.hhForm().$index.val()][contentHahaChat.hhForm().$ownerId.val()].splice(index, 1);
                                    $(`.hh-comment-container[data-id='${commentID}']`).remove();
                                }
                            });
                            let $commentCount = $($(".commentCount")[contentHahaChat.hhForm().$index.val()]);
                            $commentCount.text(parseInt($commentCount.text()) - 1);
                        }
                        message = result.message;
                    }
                    $('.hahawrapper').prepend( blackoutHtml ).hide().fadeIn().append( modalHtml(message) );
                }
            );
        },
        editEmployerComment: $this =>
        {
            /*contentHahaChat.$ajax("employer/edit-comment", $this.serialize()+`&user_id=${userId}`).done(result =>
                {
                    let message = "Что-то пошло не так, попробуйте ещё раз.";
                    if ("success" === result.result)
                    {
                        if (result.message === "Комментарий успешно обновлен")
                        {
                            let newData = $this.serializeArray();
                            let commentID = newData.filter(item => item.name === "comment_id")[0].value;
                            let newText = newData.filter(item => item.name === "text")[0].value;
                            $.each(dbData[contentHahaChat.hhForm().$index.val()][contentHahaChat.hhForm().$employerId.val()], (index, comment) =>
                            {
                                if (comment.id == commentID)
                                {
                                    dbData[contentHahaChat.hhForm().$index.val()][contentHahaChat.hhForm().$employerId.val()][index].text = newText;
                                    $(`.hh-comment-container[data-id='${commentID}'] span.hh-comment-text`).text(newText);
                                }
                            });
                        }
                        contentHahaChat.hhForm().$submit.data("action", "addComment").val("Оставить комментарий");
                        contentHahaChat.clearCommentTextArea();
                        message = result.message;
                    }

                    $('.hahawrapper').prepend( blackoutHtml ).hide().fadeIn().append( modalHtml(message) );
                }
            );*/
        },
        deleteEmployerComment: () =>
        {
            /*let data = contentHahaChat.hhForm().$form.serialize()+`&user_id=${userId}`;
            contentHahaChat.$ajax("employer/delete-comment", data).done(result =>
                {
                    let message = "Что-то пошло не так, попробуйте ещё раз.";
                    if ("success" === result.result)
                    {
                        if (result.message === "Комментарий успешно удален")
                        {
                            let newData = contentHahaChat.hhForm().$form.serializeArray();
                            let commentID = newData.filter(item => item.name === "comment_id")[0].value;
                            $.each(dbData[contentHahaChat.hhForm().$index.val()][contentHahaChat.hhForm().$employerId.val()], (index, comment) =>
                            {
                                if (comment !== undefined && comment.id == commentID)
                                {
                                    dbData[contentHahaChat.hhForm().$index.val()][contentHahaChat.hhForm().$employerId.val()].splice(index, 1);
                                    $(`.hh-comment-container[data-id='${commentID}']`).remove();
                                }
                            });
                            let $commentCount = $($(".commentCount")[contentHahaChat.hhForm().$index.val()]);
                            $commentCount.text(parseInt($commentCount.text()) - 1);
                        }
                        message = result.message;
                    }
                    $('.hahawrapper').prepend( blackoutHtml ).hide().fadeIn().append( modalHtml(message) );
                }
            );*/
        },
        ajaxEmployers: data =>
        {
            /*contentHahaChat.$ajax('vacancies-employers', {result: data}).done(result =>
            {
                if (dbData = result.comments)
                {
                    iziModal.iziModal("setTitle", "Отзывы о компании");
                    $.each(dbData, (index, item) =>
                    {
                        $.each(item, (employer, comments) =>
                        {
                            let $commentsLink;
                            let setParams = () =>
                            {
                                contentHahaChat.hhForm().$index.val(index);
                                contentHahaChat.hhForm().$comments.html(contentHahaChat.getCommentsHtml(index, employer));
                                contentHahaChat.hhForm().$employerId.val(data[index].employer_id);
                                contentHahaChat.hhForm().$vacancyId.val(data[index].vacancy_id);
                            };
                            if (dbData.length > 1)
                            {
                                $commentsLink = $(contentHahaChat.commentsLinkHtml).appendTo($(vacancies.$all[index])).text(comments.length).css("margin-left", "14px");
                            }
                            else
                            {
                                iziModal.iziModal('setSubtitle', data[index].employer_name);
                                iziModal.iziModal('open');
                                setParams();
                                $commentsLink = $(contentHahaChat.commentsLinkHtml).appendTo($(".supernova-navi-wrapper")).text(comments.length).addClass(["hhFloat", 'fixedComment']);
                            }

                            $commentsLink.on("click", () =>
                            {
                                setParams();
                                iziModal.iziModal('setSubtitle', data[index].employer_name);
                                if ("none" === $("#hahaModal").css("display"))
                                {
                                    iziModal.iziModal('open');
                                }
                            });
                        });
                    });
                }
            });*/
        },
        editResumeCommentClick: function()
        {
            let $div = $(this).closest(".hh-comment-container");
            contentHahaChat.hhForm().$commentId.val($div.data("id"));
            let $text = $div.find(".hh-comment-text").text();
            contentHahaChat.hhForm().$textarea.val($text).focus();
            contentHahaChat.hhForm().$submit.val("Редактировать комментарий").data("action", "editComment");
        },
        deleteResumeCommentClick: function()
        {
            let $div = $(this).closest(".hh-comment-container");
            contentHahaChat.hhForm().$commentId.val($div.data("id"));
            if (confirm("Вы действительно хотите удалить комметарий?"))
            {
                contentHahaChat.deleteResumeComment();
            }
        },
        editEmployerCommentClick: function()
        {
            /*let $div = $(this).closest(".hh-comment-container");
            contentHahaChat.hhForm().$commentId.val($div.data("id"));
            let $text = $div.find(".hh-comment-text").text();
            contentHahaChat.hhForm().$textarea.val($text).focus();
            contentHahaChat.hhForm().$submit.val("Редактировать комментарий").data("action", "editComment");*/
        },
        deleteEmployerCommentClick: function()
        {
            /*let $div = $(this).closest(".hh-comment-container");
            contentHahaChat.hhForm().$commentId.val($div.data("id"));
            if (confirm("Вы действительно хотите удалить комметарий?"))
            {
                contentHahaChat.deleteEmployerComment();
            }*/
        },
        getCommentsHtml: (index, entityId) =>
        {
            let commentsHtml = "";
            if (dbData[index][entityId] && dbData[index][entityId].length)
            {
                $.each(dbData[index][entityId], (key, comment) =>
                {
                    commentsHtml += contentHahaChat.getEmployerCommentHtml(comment);
                });
            }
            return commentsHtml;
        },
        init: () =>
        {
            /*$('body').on( 'click', '.blackout, .iziModal', contentHahaChat.destroyModal);
            chrome.storage.sync.get(["hash", "login", "id"], data => contentHahaChat.setParams(data));
            contentHahaChat.createIziModal();

            let conditions =
            {
                sendResumes:
                {
                    regExp: /\/search\/resume/,
                    init: () =>
                    {
                        $("#hahaModal").on("click", 'a.hhEdit', contentHahaChat.editResumeCommentClick).on("click", 'a.hhDelete', contentHahaChat.deleteResumeCommentClick);
                        contentHahaChat.sendResumes();
                    }
                },
                sendResume:
                {
                    regExp: /\/resume\//,
                    init: () =>
                    {
                        $("#hahaModal").on("click", 'a.hhEdit', contentHahaChat.editResumeCommentClick).on("click", 'a.hhDelete', contentHahaChat.deleteResumeCommentClick);
                        contentHahaChat.sendResume();
                    }
                },
                sendVacancies:
                {
                    regExp: /\/search\/vacancy/,
                    init: () =>
                    {
                        $("#hahaModal").on("click", 'a.hhEdit', contentHahaChat.editEmployerCommentClick).on("click", 'a.hhDelete', contentHahaChat.deleteEmployerCommentClick);
                        let data = [];

                        $.each(vacancies.$all, (index, item) =>
                        {
                            data.push(vacancies.getVacancy(item));
                        });
                        contentHahaChat.ajaxEmployers(data);
                    }
                },
                sendCatalog:
                    {
                        regExp: /\/catalog\//,
                        init: () =>
                        {
                            $("#hahaModal").on("click", 'a.hhEdit', contentHahaChat.editEmployerCommentClick).on("click", 'a.hhDelete', contentHahaChat.deleteEmployerCommentClick);
                            let data = [];

                            $.each(vacancies.$all, (index, item) =>
                            {
                                data.push(vacancies.getVacancy(item));
                            });
                            contentHahaChat.ajaxEmployers(data);
                        }
                    },
                sendVacancy:
                {
                    regExp: /\/vacancy\//,
                    init: () =>
                    {
                        $("#hahaModal").on("click", 'a.hhEdit', contentHahaChat.editEmployerCommentClick).on("click", 'a.hhDelete', contentHahaChat.deleteEmployerCommentClick);
                        let data =
                        {
                            employer_name: vacancy.$company.text().trim(),
                            employer_id: vacancy.$company.attr("href").replace("/employer/", ""),
                            vacancy_name: vacancy.$vacancy.text().trim(),
                            vacancy_id: location.href.match(/[(\d)]+/)[0]
                        };
                        contentHahaChat.ajaxEmployers([data]);
                    }
                },
                sendEmployer:
                {
                    regExp: /\/employer\//,
                    init: () =>
                    {
                        $("#hahaModal").on("click", 'a.hhEdit', contentHahaChat.editEmployerCommentClick).on("click", 'a.hhDelete', contentHahaChat.deleteEmployerCommentClick);
                        let employerId = location.href.match(/[(\d)]+/)[0];
                        let data =
                        {
                            employer_name: employer.$name.text().trim(),
                            employer_id: employerId,
                            vacancy_name: "company",
                            vacancy_id: employerId
                        };
                        contentHahaChat.ajaxEmployers([data]);
                    }
                }
            };

            $.each(conditions, (type, action) =>
            {
                if (action.regExp.test(location.href))
                {
                    action.init();
                    return false;
                }
            });*/
        }
    };
    //contentHahaChat.init();
    //auth.init();
});
