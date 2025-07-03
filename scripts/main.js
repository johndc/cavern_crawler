function changetab(tab_name) {
    document.getElementById("click-sound").play()
    document.querySelectorAll('button[id^=select_tab_]').forEach((tab, _index, _parent) => {
        if (tab.id.endsWith(tab_name)) {
            tab.dataset.selected = true;
        } else {
            tab.dataset.selected = false;
        }
    })

    document.querySelectorAll('div[id^=tab_]').forEach((tab, _index, _parent) => {
        if (tab.id.endsWith(tab_name)) {
            tab.style.display = "block";
        } else {
            tab.style.display = "none";
        }
    })
}

function game_tick(data) {
    data.persist.other.time_played = data.persist.other.time_played + 0.016;
}

function start() {
    let data = {
        persist: {
            currencies: {
                research: 0
            },
            upgrades: {

            },
            other: {
                settings: {

                },
                time_played: 0
            }
        },
        non_persist: {
            character_stats: {
                courage: 10,
                health: 10,
                defense: 0,
                attack: 0,
                move_speed: 1,
                attack_speed: 1
            }
        }
    }
    setInterval(game_tick, 1000/60, data)
}

start()