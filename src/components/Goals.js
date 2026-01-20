import React from 'react';
import '../sass/goals.scss';
import GoalGroup from './GoalGroup';

class Goals extends React.Component {

    newGoalRef = React.createRef();
    challengeRef = React.createRef();
    schSuRef = React.createRef();
    schMoRef = React.createRef();
    schTuRef = React.createRef();
    schWeRef = React.createRef();
    schThRef = React.createRef();
    schFrRef = React.createRef();
    schSaRef = React.createRef();

    addGoal = (event) => {
        event.preventDefault();
        if (!this.newGoalRef.current.value) {
            alert("You can't have a blank goal, silly");
            return false;
        }
        if (
            !this.schSuRef.current.checked &&
            !this.schMoRef.current.checked &&
            !this.schTuRef.current.checked &&
            !this.schWeRef.current.checked &&
            !this.schThRef.current.checked &&
            !this.schFrRef.current.checked &&
            !this.schSaRef.current.checked
        ) {
            alert("Your new goal must be scheduled for at least one day");
            return false;
        }
        const goal = {
            challenge: this.challengeRef.current.value,
            name: this.newGoalRef.current.value,
            schedule: {
                0: (this.schSuRef.current.checked)? true: false,
                1: (this.schMoRef.current.checked)? true: false,
                2: (this.schTuRef.current.checked)? true: false,
                3: (this.schWeRef.current.checked)? true: false,
                4: (this.schThRef.current.checked)? true: false,
                5: (this.schFrRef.current.checked)? true: false,
                6: (this.schSaRef.current.checked)? true: false,
            }
        }
        this.props.createGoal(goal);

        this.newGoalRef.current.value = '';
        this.schSuRef.current.checked = 'checked';
        this.schMoRef.current.checked = 'checked';
        this.schTuRef.current.checked = 'checked';
        this.schWeRef.current.checked = 'checked';
        this.schThRef.current.checked = 'checked';
        this.schFrRef.current.checked = 'checked';
        this.schSaRef.current.checked = 'checked';
    }

    render() {
        const {user, challenges, currentChallenge} = this.props;
        const groups = user.challenges;
        return (
            <div className="goals">
                <h2 className="goals__headline">Daily Goals</h2>
                {user.info.note &&
                    <div className="goals__note">
                        Manage your daily goals here.  Add new goals or remove ones that you don't need.  For each goal that you check off per day, you'll get a Lottery Ticket so the more you accomplish, the more you'll get!  For each day that you aren't able to complete all of your tasks, you'll have to contribute $0.10 to the Lucky Pot.  At the end of the challenge we will collect your dues and announce the winner.  Good luck!
                        <button className="goals__dismiss" onClick={this.props.dismiss}>Dismiss</button>
                    </div>
                }
                {user.info.challenges &&
                    <form className="goals__form" onSubmit={this.addGoal}>
                        <label htmlFor="newGoal" className="goals__form-label goal">Add a new goal</label>
                        <select name="challenge" id="challenge" className="goals__form-challenges" ref={this.challengeRef} defaultValue={currentChallenge}>
                            {user.info.challenges &&
                                Object.values(user.info.challenges).map((chId)=>{
                                if (challenges[chId]) {
                                    return <option key={chId} value={chId}>{challenges[chId].name}</option>
                                }else{
                                    return false;
                                }
                            })}
                        </select>
                        <input type="text" className="goals__form-input" name="newGoal" ref={this.newGoalRef} placeholder="Something I can do every day"/>
                        <div className="goals__form-schedule">
                            <label htmlFor="scheduleDay_Su" className="goals__form-schedule-day">
                                <input type="checkbox" className="goals__form-schedule-checkbox" name="scheduleDay_Su" id="scheduleDay_Su" defaultChecked="checked" value="true" ref={this.schSuRef} />
                                <span className="goals__form-schedule-label">Su</span>
                            </label>
                            <label htmlFor="scheduleDay_Mo" className="goals__form-schedule-day">
                                <input type="checkbox" className="goals__form-schedule-checkbox" name="scheduleDay_Mo" id="scheduleDay_Mo" defaultChecked="checked" value="true" ref={this.schMoRef} />
                                <span className="goals__form-schedule-label">Mo</span>
                            </label>
                            <label htmlFor="scheduleDay_Tu" className="goals__form-schedule-day">
                                <input type="checkbox" className="goals__form-schedule-checkbox" name="scheduleDay_Tu" id="scheduleDay_Tu" defaultChecked="checked" value="true" ref={this.schTuRef} />
                                <span className="goals__form-schedule-label">Tu</span>
                            </label>
                            <label htmlFor="scheduleDay_We" className="goals__form-schedule-day">
                                <input type="checkbox" className="goals__form-schedule-checkbox" name="scheduleDay_We" id="scheduleDay_We" defaultChecked="checked" value="true" ref={this.schWeRef} />
                                <span className="goals__form-schedule-label">We</span>
                            </label>
                            <label htmlFor="scheduleDay_Th" className="goals__form-schedule-day">
                                <input type="checkbox" className="goals__form-schedule-checkbox" name="scheduleDay_Th" id="scheduleDay_Th" defaultChecked="checked" value="true" ref={this.schThRef} />
                                <span className="goals__form-schedule-label">Th</span>
                            </label>
                            <label htmlFor="scheduleDay_Fr" className="goals__form-schedule-day">
                                <input type="checkbox" className="goals__form-schedule-checkbox" name="scheduleDay_Fr" id="scheduleDay_Fr" defaultChecked="checked" value="true" ref={this.schFrRef} />
                                <span className="goals__form-schedule-label">Fr</span>
                            </label>
                            <label htmlFor="scheduleDay_Sa" className="goals__form-schedule-day">
                                <input type="checkbox" className="goals__form-schedule-checkbox" name="scheduleDay_Sa" id="scheduleDay_Sa" defaultChecked="checked" value="true" ref={this.schSaRef} />
                                <span className="goals__form-schedule-label">Sa</span>
                            </label>
                        </div>
                        <button type="submit" className="goals__form-button">Add</button>
                    </form>
                }
                <div className="goals__entries">
                    {groups &&
                        Object.keys(groups).map(key => {
                        return <GoalGroup 
                            key={key} 
                            group={groups[key]} 
                            updateGoal={this.props.updateGoal}
                            groupId={key}
                            groupName = {challenges[key].name} />
                    })}
                </div>
            </div>
        );
    }
}

export default Goals;