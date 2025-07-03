function calculate_courage_loss(data) {
    let run_data = data.non_persist.run

    let add_courage_loss = Math.pow(2, run_data.floor - 1)
    return add_courage_loss
}

function calculate_research_gain(data) {
    let run_data = data.non_persist.run

    let base_research_gain = (run_data.floor - 1) + run_data.progress / 10
    return base_research_gain
}