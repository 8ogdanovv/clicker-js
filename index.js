window.addEventListener('load', function() {
    // change hard-coded placeholder
    document.getElementById('nickname').placeholder = 'Enter your nickname';

    const input = document.querySelector('input');
    const log = document.getElementById('values');
    input.addEventListener('input', updateValue);
    let start_wrapper = document.getElementById('start_wrapper');
    start_wrapper.addEventListener('click', updateValue);

    function alerting() {
        alert('Empty nickname');
    }

    const TIME_LIMIT = 5000;

    function start_game() {
        console.log('started');
        let clicks = 0;

        function game_click() {
            clicks++;
        }
        let game_button = document.getElementById('game_button');
        game_button.addEventListener('click', game_click);
        setTimeout(
            function() {
                alert(`Your clicked ${clicks} times`);
                update_results(clicks);
            },
            TIME_LIMIT);
    }

    function update_results(clicks) {

        let user_name = log.textContent;

        if (!localStorage.getItem('best_all_local')) {
            let best_all_local = clicks;
            let results_obj = { user_name: `${user_name}`, best_all_local: `${best_all_local}` };
            let results_str = JSON.stringify(results_obj);
            localStorage.setItem('best_all_local', results_str);
        } else if (localStorage.getItem('best_all_local')) {
            let local_best = JSON.parse(localStorage.getItem('best_all_local'));
            let local_best_res = parseInt(local_best['best_all_local'], 10);
            if (clicks > local_best_res) {
                local_best['best_all_local'] = clicks;
                local_best['user_name'] = user_name;
                let results_str = JSON.stringify(local_best);
                localStorage.removeItem('best_all_local');
                localStorage.setItem('best_all_local', results_str);
            }
        }

        if (!localStorage.getItem(user_name)) {
            let best = clicks;
            let best_all = clicks;
            let results_obj = { user_name: `${user_name}`, best: `${best}`, best_all: `${best_all}` };
            let results_str = JSON.stringify(results_obj);
            localStorage.setItem(user_name, results_str);
        } else {
            let parse_obj = JSON.parse(localStorage.getItem(user_name));
            let stored_res = parseInt(parse_obj['best'], 10);
            let best;
            let best_all;
            if (stored_res < clicks) {
                best = clicks;
                best_all = clicks;
            } else {
                best = stored_res;
                best_all = stored_res;
            }
            let results_obj = { user_name: `${user_name}`, best: `${best}`, best_all: `${best_all}` };
            let results_str = JSON.stringify(results_obj);
            localStorage.removeItem(user_name);
            localStorage.setItem(user_name, results_str);
        }
    }

    function clear_all() {
        localStorage.clear();
    }

    function clear_best() {
        let nick = document.getElementById('nickname');
        let user_name = nick.value;
        localStorage.removeItem(user_name);
    }

    function show_best_all() {
        let best_all = localStorage.getItem('best_all_local');
        let results_obj = JSON.parse(best_all);
        alert(`Best result for the whole time: ${results_obj['best_all_local']} by user ${results_obj['user_name']}`);
    }

    function show_best() {
        let nick = document.getElementById('nickname');
        let user_name = nick.value;
        if (localStorage.getItem(user_name)) {
            let user_result = localStorage.getItem(user_name);
            let results_obj = JSON.parse(user_result);
            let best = results_obj['best'];
            alert(`Best result is: ${best}`);
        } else {
            alert(`Best result does not exist now`);
        }
    }

    function updateValue(e) {

        log.textContent = e.target.value;

        if (e.target.value === '') {
            // block all buttons
            let btns = document.querySelectorAll('button');
            for (let btn of btns) {
                if (btn.id === 'start') {
                    btn.removeEventListener('click', updateValue);
                    btn.removeEventListener('click', start_game);
                }
                if (btn.id === 'best_results') {
                    btn.removeEventListener('click', show_best);
                }
                if (btn.id === 'best_for_all') {
                    btn.removeEventListener('click', show_best_all);
                }
                if (btn.id === 'clear_best') {
                    btn.removeEventListener('click', clear_best);
                }
                if (btn.id === 'clear_all') {
                    btn.removeEventListener('click', clear_all);
                }
                btn.addEventListener('click', alerting);
            }
            console.log('buttons are blocked');
            // alerting();
        } else {
            // unblock all buttons
            let start_wrapper = document.getElementById('start_wrapper');
            start_wrapper.removeEventListener('click', updateValue);

            let btns = document.querySelectorAll('button');
            for (let btn of btns) {
                if (btn.id === 'start') {
                    btn.removeEventListener('click', updateValue);
                    btn.addEventListener('click', start_game);
                }
                if (btn.id === 'best_results') {
                    btn.addEventListener('click', show_best);
                }
                if (localStorage.getItem('best_all_local')) {
                    if (btn.id === 'best_for_all') {
                        btn.addEventListener('click', show_best_all);
                    }
                }
                if (btn.id === 'clear_best') {
                    btn.addEventListener('click', clear_best);
                }
                if (btn.id === 'clear_all') {
                    btn.addEventListener('click', clear_all);
                }
                btn.removeEventListener('click', alerting);
            }
            console.log('buttons are active');
        }
    }
});