import React from 'react';
import '../sass/profile.scss';
import Goals from './Goals';
import Challenge from './Challenge';
import {formatPrice} from '../helpers';
import Chat from './Chat';

class Profile extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showForm: false,
        }
        this.toggleForm = this.toggleForm.bind(this);
    }
    nameRef = React.createRef();

    updateDisplayName = (event) => {
        event.preventDefault();
        this.props.updateName(this.nameRef.current.value);
        this.toggleForm();
    }

    toggleForm() {
        this.setState(state => ({
          showForm: !state.showForm
        }));
    }

    render() {
        const {user, logout, createGoal, updateGoal, dismiss, challenges, currentChallenge, switchChallenge} = this.props;
        let userTickets = 0;
        let userCoins = 0;
        if (user.challenges){
            Object.values(user.info.challenges).map((value)=>{
                if (challenges[value].leaderBoard && challenges[value].leaderBoard[user.info.uid]) {
                    userTickets += challenges[value].leaderBoard[user.info.uid].tickets;
                    userCoins += challenges[value].leaderBoard[user.info.uid].coins * challenges[value].coinValue;
                }

                return true;
            });
        }

        return (
            <div className="profile">
                <div className="profile__user">
                    <div className={`profile__headline ${this.state.showForm}`}>
                        <h2 className="profile__headline-text">{user.info.name}!
                            <button className="profile__headline-edit" onClick={this.toggleForm}><span role="img" aria-label="crayon icon">🖍️</span></button>
                        </h2>
                        <form className="profile__headline-form" onSubmit={this.updateDisplayName}>
                            <input type="text" className="profile__headline-editText" ref={this.nameRef} defaultValue={user.info.name}/>
                            <button type="submit" className="profile__headline-edit"><span role="img" aria-label="check icon">✔️</span></button>
                        </form>
                    </div>
                    <img src={user.info.photo} alt={user.info.name} className="profile__photo" style={{borderColor: user.info.color}}/>
                    <div className="profile__stat profile__stat--tickets">
                        <div className="profile__stat-icon"><span role="img" aria-label="ticket icon">🎟️</span></div>
                        <div className="profile__stat-text">{userTickets}</div>
                    </div>
                    <div className="profile__stat profile__stat--coins">
                        <div className="profile__stat-icon"><span role="img" aria-label="money-flying-away icon">💸</span></div>
                        <div className="profile__stat-text">{formatPrice(userCoins)}</div>
                    </div>
                    <button className="profile__button profile__logout" onClick={()=>{logout()}}>Log Out</button>
                    {(user.info.challenges.length > 1) &&
                        <div className="profile__challenges">
                            <h3 className="profile__challenges-headline">My Challenges</h3>
                            <ul className="profile__challenges-list">
                                {user.info.challenges &&
                                    Object.keys(user.info.challenges).map((key)=>{
                                    return (
                                        <li key={key} className="profile__challenges-listItem">
                                            <button className="profile__challenges-listButton" onClick={()=>{switchChallenge(user.info.challenges[key])}}>{challenges[user.info.challenges[key]].name}</button>
                                            <div className="profile__challenges-listTotals">
                                                {(challenges[user.info.challenges[key]].leaderBoard[user.info.uid]) &&
                                                <>
                                                    <span role="img" aria-label="ticket icon">🎟️</span>
                                                    {challenges[user.info.challenges[key]].leaderBoard[user.info.uid].tickets} | 
                                                    <span role="img" aria-label="money-flying-away icon">💸</span>
                                                    {formatPrice(challenges[user.info.challenges[key]].leaderBoard[user.info.uid].coins * challenges[user.info.challenges[key]].coinValue)}
                                                </>
                                                }
                                                {(!challenges[user.info.challenges[key]].leaderBoard[user.info.uid]) &&
                                                <>
                                                    <span role="img" aria-label="ticket icon">🎟️</span> 0 | 
                                                    <span role="img" aria-label="money-flying-away icon">💸</span> $0.00
                                                </>
                                                }
                                            </div>
                                        </li>
                                    )
                                })}
                                {/* <li className="profile__challenges-listItem">
                                    <button className="profile__challenges-listButton">+ Join Challenge</button>
                                </li>
                                <li className="profile__challenges-listItem">
                                    <button className="profile__challenges-listButton">+ New Challenge</button>
                                </li> */}
                            </ul>
                        </div>
                    }
                </div>
                <Goals
                    currentChallenge = {currentChallenge}
                    user = {user}
                    challenges = {challenges}
                    createGoal = {createGoal}
                    updateGoal = {updateGoal}
                    dismiss = {dismiss}
                />
                {currentChallenge !== '' &&
                    <Challenge
                        challengeName = {challenges[currentChallenge].name}
                        challengeDate = {challenges[currentChallenge].date}
                        coinValue = {challenges[currentChallenge].coinValue}
                        totalCoins = {challenges[currentChallenge].totalCoins}
                        totalTickets = {challenges[currentChallenge].totalTickets}
                        leaderBoard = {challenges[currentChallenge].leaderBoard}
                    />
                }
                {currentChallenge !== '' &&
                    <Chat
                        challengeName = {challenges[currentChallenge].name}
                        addChat = {this.props.addChat}
                        chat = {challenges[currentChallenge].chat}
                        user = {user}
                    />
                }
            </div>
        );
    }
};

export default Profile;