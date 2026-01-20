import React from 'react';
import '../sass/challenge.scss';
import {formatPrice} from '../helpers';

class Challenge extends React.Component {

    formatDate = (dateText) => {
        const date = new Date(dateText);
        return date.toLocaleString('default', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    }

    render() {
        const {challengeName, challengeDate, totalTickets, totalCoins, coinValue, leaderBoard} = this.props;
        const lb = (leaderBoard)? Object.keys(leaderBoard) : false;
        if (lb){
            lb.sort((a,b)=>{
                return leaderBoard[a].rating - leaderBoard[b].rating;
            });
            lb.reverse();
        }
        
        return (
            <div className="challenge">
                <h2 className="challenge__heading">{challengeName}</h2>
                <div className="challenge__totals">
                    <div className="challenge__total challenge__total--coins"><span role="img" aria-label="moneybag icon">💰</span>{formatPrice(totalCoins*coinValue)}</div>
                    <div className="challenge__total challenge__total--tickets"><span role="img" aria-label="ticket icon">🎟️</span>{totalTickets}</div>
                </div>
                {lb &&
                    <ul className="challenge__leader-board">
                        <li className="challenge__leader challenge__leader--first">
                            <span role="img" aria-label="first place icon">🥇</span>
                            {leaderBoard[lb[0]].name}
                        </li>
                        {leaderBoard[lb[1]] &&
                        <li className="challenge__leader challenge__leader--second">
                            <span role="img" aria-label="second place icon">🥈</span>
                            {leaderBoard[lb[1]].name}
                        </li>
                        }
                        {leaderBoard[lb[2]] &&
                        <li className="challenge__leader challenge__leader--third">
                            <span role="img" aria-label="third place icon">🥉</span>
                            {leaderBoard[lb[2]].name}
                        </li>
                        }
                    </ul>
                }
                
                <div className="challenge__enddate">
                    <div className="challenge__enddate-heading">This Pot o' Goals Challenge ends:</div>
                    <div className="challenge__enddate-date">{this.formatDate(challengeDate)}</div>
                </div>
                {lb &&
                    <ol className="challenge__leaderboard">
                        {lb.map((key, index)=>{
                            return (<li className="challenge__leaderboard-row" key={index}>
                                <span className="challenge__leaderboard-rank">{index + 1}</span>
                                <span className="challenge__leaderboard-name">{leaderBoard[key].name}</span>
                                <span className="challenge__leaderboard-tickets">
                                    <span className="challenge__leaderboard-icon" role="img" aria-label="ticket icon">🎟️</span>{leaderBoard[key].tickets}
                                </span>
                                <span className="challenge__leaderboard-coins">
                                    <span className="challenge__leaderboard-icon" role="img" aria-label="coin icon">🪙</span>{leaderBoard[key].coins}
                                </span>
                            </li>)
                        })}
                    </ol>
                }
                
            </div>
        );
    }
}

export default Challenge;