(function () {
    'use strict';

    var responseKey = 'screening_blurb_response';
    var form = document.getElementById('study-blurb-form');
    var blurb = document.getElementById('study-blurb');
    var exitPage = document.getElementById('exit-page');

    function showExitPage() {
        blurb.hidden = true;
        exitPage.hidden = false;
        document.title = 'Thank You';
    }

    function launchStudy() {
        blurb.hidden = true;
        var scriptTag = document.createElement('script');
        scriptTag.src = 'https://cdn.jsdelivr.net/gh/minnojs/minno-quest@0.3/dist/pi-minno.js';
        scriptTag.onload = function () {
            var container = document.createElement('div');
            container.className = 'container';
            var canvas = document.createElement('div');
            container.appendChild(canvas);
            document.body.appendChild(container);

            minnoJS(canvas, 'mgr.js');
            minnoJS.onEnd = function () { setTimeout(proceed, 100); };
        };
        document.head.appendChild(scriptTag);
    }

    if (sessionStorage.getItem(responseKey) === 'no') {
        showExitPage();
        return;
    }

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        var answer = form.elements[responseKey].value;
        sessionStorage.setItem(responseKey, answer);
        if (answer === 'yes') launchStudy();
        else showExitPage();
    });
}());
