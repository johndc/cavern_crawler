function calculate_courage_loss(data) {
    let run_data = data.non_persist.run

    let floor_loss_exponent = 2
    let add_courage_loss = Math.pow(floor_loss_exponent, run_data.floor - 1)

    // Torch Upgrade
    add_courage_loss -= (data.persist.upgrades.torch == 1? 0.25 : 0) + (data.persist.upgrades.torch_buff > 0? 0.05 * data.persist.upgrades.torch_buff : 0)

    // Combat Upgrades
    add_courage_loss *= (data.persist.upgrades.combat_sword == 1? 0.9 : 1)
    add_courage_loss *= (data.persist.upgrades.combat_armor == 1? 0.9 : 1)
    add_courage_loss *= (data.persist.upgrades.combat_boots == 1? 0.9 : 1)

    // Careful Looking Nerf
    add_courage_loss *= (data.persist.upgrades.careful_looking == 1? 1.1 : 1)

    // Torch Buff Upgrade
    add_courage_loss *= (data.persist.upgrades.torch_buff1 > 0? 1 - 0.1 * data.persist.upgrades.torch_buff1 : 1)

    return data.non_persist.run.in_combat? 0 : add_courage_loss
}

function calculate_health(data) {
    let return_health = 5

    // Endurance Training
    return_health += (data.persist.upgrades.train_endurance > 0? data.persist.upgrades.train_endurance : 0)

    return return_health
}

function calculate_defense(data) {
    let return_defense = 0

    // Combat Armor
    return_defense += (data.persist.upgrades.combat_armor > 0? data.persist.upgrades.combat_sword : 0)

    return return_defense
}

function calculate_attack(data) {
    let return_attack = 1

    // Combat Sword
    return_attack += (data.persist.upgrades.combat_sword > 0? data.persist.upgrades.combat_sword : 0)

    return return_attack
}

function calculate_attack_speed(data) {
    let return_attack_speed = 1

    // Agility Training
    return_attack_speed += (data.persist.upgrades.train_agility > 0? (0.1 * data.persist.upgrades.train_agility) : 0)

    return return_attack_speed
}

function calculate_move_speed(data) {
    let return_move_speed = 1

    // Panicked Pace
    return_move_speed += (data.persist.upgrades.growing_pace > 0? (0.2 * data.persist.upgrades.growing_pace) * (1 - data.non_persist.run.character_stats.courage / data.non_persist.run.character_stats.max_courage) : 0)

    // Combat Boots
    return_move_speed += (data.persist.upgrades.combat_boots > 0? (0.1 * data.persist.upgrades.combat_boots) : 0)

    return data.non_persist.run.in_combat? 0 : return_move_speed
}

function calculate_research_gain(data) {
    let run_data = data.non_persist.run

    let base_research_gain = (run_data.floor - 1) + run_data.progress / 10

    // Careful Looking
    base_research_gain *= (data.persist.upgrades.careful_looking > 0? 1 + 0.2 * data.persist.upgrades.careful_looking : 1)

    return base_research_gain
}

function calculate_damage_taken(damage, defense) {
    return Math.max(damage - defense, 0)
}

function evaluate_dynamic_amount(dynamic, level) {
    if (dynamic.type == "flat") {
        return level == 0 ? 0 : dynamic.value;
    }
    if (dynamic.type == "flat_constant") {
        return dynamic.value
    }
    if (dynamic.type == "increment") {
        return dynamic.value * level;
    }
    if (dynamic.type == "multiply") {
        return level == 0 ? dynamic.value : dynamic.value * Math.pow(dynamic.multiplier, level);
    }
    return null
}

function calculate_start_courage(data) {
    let return_courage = 5

    return_courage += (data.persist.upgrades.swallow_inhibitions > 0? data.persist.upgrades.swallow_inhibitions : 0)

    return return_courage
}

function calculate_player_stats(data) {
    data.non_persist.run.character_stats.max_courage = calculate_start_courage(data)
    data.non_persist.run.character_stats.courage = data.non_persist.run.character_stats.max_courage

    data.non_persist.run.character_stats.max_health = calculate_health(data)
    data.non_persist.run.character_stats.health = data.non_persist.run.character_stats.max_health
}