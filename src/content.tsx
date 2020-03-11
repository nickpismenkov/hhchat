import * as React from "react";
import * as ReactDOM from "react-dom";
import * as $ from "jquery";
import Helpers from "./helpers/Helpers";
import AppRouter from "./components/AppRouter";

import "./css/content.scss"
import "./lib/fontawesome.min"

Helpers
    .waitFor("body", document)
    .then(() => {
        $("<div id='hh-chat-root'></div>").appendTo('body');

        $("#hh-chat-root").one('bsTransitionEnd',function() {
            $(this).addClass('hide');
        });
        window.setTimeout(function(){
            $("#hh-chat-root").removeClass('in');
        },1000);

        ReactDOM.render(<AppRouter />, document.getElementById("hh-chat-root")); 
    });


