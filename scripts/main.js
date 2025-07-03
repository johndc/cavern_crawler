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

function start_run(data) {
    data.non_persist.run.character_stats.max_courage = 5
    data.non_persist.run.character_stats.courage = 5

    data.non_persist.run.character_stats.max_health = 5
    data.non_persist.run.character_stats.health = 5

    data.non_persist.run.character_stats.attack = 1
    data.non_persist.run.character_stats.defense = 0

    data.non_persist.run.character_stats.move_speed = 1
    data.non_persist.run.character_stats.attack_speed = 1

    data.non_persist.run.move_tick = 0
    data.non_persist.run.floor = 1
    data.non_persist.run.progress = 0
    document.getElementById("run_player_icon").style.setProperty("--progress", data.non_persist.run.progress)

    document.getElementById("floor_record_text").style.display = "none"
    document.getElementById("active_run_container").style.display = "block"
    data.non_persist.run_active = true
}

function game_tick(data) {
    data.persist.other.time_played = data.persist.other.time_played + 0.016;

    if (data.non_persist.run_active == true) {
        document.getElementById("start_run_button").setAttribute("disabled", "disabled")
        console.log(data.non_persist.run.progress)
        data.non_persist.run.move_tick += data.non_persist.run.character_stats.move_speed / 60

        let current_courage_loss = calculate_courage_loss(data)
        data.non_persist.run.character_stats.courage = Math.max(data.non_persist.run.character_stats.courage - current_courage_loss / 60, 0)

        if (data.non_persist.run.character_stats.courage <= 0) {
            data.non_persist.run_active = false

            if (data.non_persist.run.floor > data.persist.other.records.floor) {
                data.persist.other.records.floor = data.non_persist.run.floor
                document.getElementById("floor_record_text").innerHTML = "Your furthest floor is Floor " + data.persist.other.records.floor.toString() + "!"
            }
            document.getElementById("floor_record_text").style.display = "block"

            if (data.persist.unlocks.upgrades != true) {
                data.persist.unlocks.upgrades = true
                document.getElementById("select_tab_upgrades").style.display = "block";
            }

            data.persist.currencies.research += calculate_research_gain(data)

            document.getElementById("active_run_container").style.display = "none"
            document.getElementById("start_run_button").removeAttribute("disabled")
        }

        if (data.non_persist.run.move_tick > 1) {
            data.non_persist.run.move_tick -= 1
            
            data.non_persist.run.progress += 1
            if (data.non_persist.run.progress >= 10) {
                data.non_persist.run.progress -= 10
                data.non_persist.run.floor += 1
            }
            document.getElementById("run_player_icon").style.setProperty("--progress", data.non_persist.run.progress)
        }

        document.getElementById("active_run_info").innerHTML = "Floor " + data.non_persist.run.floor.toString() + " - " + data.non_persist.run.progress.toString() + "/10"
        document.getElementById("courage_bar_text").innerHTML = "Courage: " + data.non_persist.run.character_stats.courage.toFixed(1).toString()  + "/" + data.non_persist.run.character_stats.max_courage.toFixed(0).toString() + " (-" + current_courage_loss.toFixed(2).toString() + "/s)"
        document.querySelector("#courage_bar > .fill_bar").style.setProperty("--percent", data.non_persist.run.character_stats.courage.toFixed(1) / data.non_persist.run.character_stats.max_courage)
    }

    if (data.persist.upgrades.basic.torch > 0 && data.persist.unlocks.extended_basic_upgrades == false) {
        data.persist.unlocks.extended_basic_upgrades = true
    }

    document.getElementById("research_display").innerHTML = "Research: " + data.persist.currencies.research.toFixed(2).toString()
}

function start() {
    let data = {
        persist: {
            currencies: {
                research: 0
            },
            upgrades: {
                basic: {
                    torch: 0,

                }
            },
            unlocks: {
                upgrades: false,
                extended_basic_upgrades: false
            },
            other: {
                settings: {

                },
                time_played: 0,

                records: {
                    floor: 0
                }
            }
        },
        non_persist: {
            run_active: false,
            run: {
                floor: 1,
                progress: 0,
                move_tick: 0,
                character_stats: {
                    courage: 5,
                    max_courage: 5,

                    health: 5,
                    max_health: 5,

                    defense: 0,
                    attack: 0,
                    move_speed: 1,
                    attack_speed: 1
                }
            }
        }
    }

    if (data.persist.unlocks.upgrades == true) {
        document.getElementById("select_tab_upgrades").style.display = "block";
    }

    if (data.persist.other.records.floor > 0) {
        document.getElementById("floor_record_text").innerHTML = "Your furthest floor is Floor " + data.persist.other.records.floor.toString() + "!"
    }

    document.getElementById("start_run_button").addEventListener("click", (_self, _event) => {
        if (data.non_persist.run_active == false) {
            start_run(data)
        }
    })

    setInterval(game_tick, 1000/60, data)
}

onload = start