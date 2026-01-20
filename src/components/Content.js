import React from 'react';
import firebase from 'firebase/app';
import base, {firebaseApp} from '../base';
import Login from './Login';
import Profile from './Profile';
import {randomColor} from '../helpers';
import { animateScroll } from "react-scroll";

const d = new Date();

class Content extends React.Component {
    //create an empty state object
    freshState = {
        user : {
            info: {
                uid: '',
                name: '',
                email: '',
                last: d.toLocaleDateString(),
                photo: '',
                note: true,
            }
        },
        uid: null,
        challenges: {
            testPot: {
                name: 'Test Pot',
                owner: '',
                coinValue: 10,
                date: '',
                totalCoins: '',
                totalTickets: '',
                scheme: 'aon',
                leaderBoard: {
                    ghost: {
                        name: 'ghost',
                        tickets: 0,
                        coins: 0,
                        rating: 0,
                    },
                },
                chat: [
                    {
                        name: '',
                        photo: '',
                        color: '',
                        uid: '',
                        mssg: '',
                    },
                ],
                goals: [
                    {
                        name: "Sample Goal",
                        check: false,
                        schedule: {
                            0: true,
                            1: true,
                            2: true,
                            3: true,
                            4: true,
                            5: true,
                            6: true,
                        },
                    },
                ],
            },
        },
        currentChallenge : '',
    }

    state = {...this.freshState};

    componentDidMount() {
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                this.authHandler({user});
            }
        });
    }

    authHandler = async (authData) => {
        console.log("authHandler");
        //retrieve and sync the challenges data
        const challenges = await base.fetch('challenges', {context: this});
        this.setState({challenges});
        this.challengesRef = await base.syncState('challenges', {
            context: this,
            state: 'challenges',
        });

        const userResult = await base.fetch(authData.user.uid, {context: this});
        if (!userResult.info){
            //no user data, push a new record
            const user = {...this.freshState.user};
            user.info = {
                uid: authData.user.uid,
                name: authData.user.name,
                email: authData.user.email,
                last: d.toLocaleDateString(),
                photo: authData.user.photoURL,
                note: true,
                color: randomColor(),
            }
            this.setState({user});
            this.state.uid = authData.user.uid;
            this.userRef = await base.syncState(authData.user.uid, {
                context: this,
                state: 'user',
            });
        }else{
            const cc = (userResult.info.challenges)? userResult.info.challenges[0] : '';
            this.setState({user: userResult, uid: authData.user.uid, currentChallenge: cc});
            this.userRef = await base.syncState(authData.user.uid, {
                context: this,
                state: 'user',
            });
        }

        animateScroll.scrollToBottom({
            containerId: "chatWindow"
        });

        console.log(authData);
        //run the daily resets and checks
        this.dailyCleanup();
    }
    authenticate = (provider) => {
        const authProvider = new firebase.auth[`${provider}AuthProvider`]();
        firebaseApp.auth().signInWithPopup(authProvider).then(this.authHandler);
    }
    logout = async () => {
        //console.log("logging out");
        console.log(this.state);
        console.log(this.freshState);
        await firebase.auth().signOut();
        window.location.reload();
    }

    dailyCleanup = () => {
        console.log('dailyCleanup()');
        const nd = new Date();
        const currentD =  nd.toLocaleDateString();
        //get copy of state
        const user = {...this.state.user};
        //check to see if the date changed from last login
        if (Date.parse(currentD) > Date.parse(user.info.last)) {
            const diffD = Date.parse(currentD) - Date.parse(user.info.last);
            const aday = 1000 * 60 * 60 * 24;
            const days = diffD / aday;
            console.log(`It has been ${days} day(s) since the last login`);

            if (user.challenges) this.processGoals(days); //run through goals and determine tickets or coins per challenge group
            if (user.info.challenges) this.setRatings(); //now update all the user ratings in the joined leaderboards
        }
        //update value of last login date
        user.info.last = currentD;
        //update state
        this.setState({user});
        //double check the date every hour
        this.dateCheck();
    }

    processGoals = (days) => {
        //process the goals according to the scheme for the given challenge
        const user = {...this.state.user};
        const challenges = {...this.state.challenges};
        const td = new Date(); //today
        const yd = (td.getDay() === 0)? 6 : td.getDay() - 1; //yesterday's day index

        Object.keys(user.challenges).map((key)=>{ //this loops through the challenge groups
            const group = user.challenges[key];
            let chTx = 0; //the tickets to add for just this challenge
            let addTx =  true;
            let chCn = 0; //the coins to add for just this challenge

            Object.keys(group).map((k)=>{ //this loops through the goals in the group
                const goal = group[k];
                const scheduled = (goal.schedule)? goal.schedule[yd] : true; //was the goal scheduled for yesterday? default true
                switch (challenges[key].scheme) {
                    case '1pg' :
                        //the 1 ticket or coin per goal scheme (1pg)
                        if (goal.check === true && scheduled) {
                            chTx++;
                        } else if (!goal.check && scheduled) {
                            chCn++;
                        }
                        break;
                    case 'tpg':
                        //"ticket per goal", if all goals aren't met then a single coin given
                        if (goal.check === true && scheduled) {
                            chTx++;
                        } else if (!goal.check && scheduled) {
                            chCn = 1;
                        }
                        break;
                    default :
                        //aon or "All or nothing", all goals must be completed to get 1 ticket, or 1 coin given
                        if (goal.check === true && scheduled) {
                            chTx = 1;
                        } else if (!goal.check && scheduled) {
                            chCn = 1;
                            addTx = false;
                        }
                        break;
                }
                //reset the status
                user.challenges[key][k].check = false;
                console.log(`chTx: ${chTx} | chCn: ${chCn}`);
                return chTx;
            });//exit the goal loop

            if (days > 1) chCn += (days - 1); //add a coin for each day missed login

            //update the challenges object
            const LBstarter = {
                tickets: 0,
                coins: 0,
                rating: 0,
                name: user.info.name,
            };
            if (!challenges[key].leaderBoard) {
                challenges[key].leaderBoard = {
                    [this.state.uid] : LBstarter,
                }
            }
            if (!challenges[key].leaderBoard[this.state.uid]) {
                challenges[key].leaderBoard[this.state.uid] = LBstarter;
            }
            if (addTx) {
                console.log(`${chTx} tickets to add for ${challenges[key].name}`);
                challenges[key].totalTickets += chTx;
                challenges[key].leaderBoard[this.state.uid].tickets += chTx;
            }else{
                chTx = 0;
            }
            console.log(`${chCn} coins to add to ${challenges[key].name}`);
            challenges[key].totalCoins += chCn;
            challenges[key].leaderBoard[this.state.uid].coins += chCn;

            this.setState({challenges});

            return challenges;
        });//exit the group loop

        this.setState({user});
    }

    setRatings = () => {
        const challenges = {...this.state.challenges};
        Object.keys(this.state.user.info.challenges).map((key) => {
            const chId = this.state.user.info.challenges[key];
            const chGroup = challenges[chId];
            const leaderBoard = chGroup.leaderBoard;
            Object.keys(leaderBoard).map((key)=>{
                //determine ticket and coin % based on challenge totals
                const tx = (leaderBoard[key].tickets > 0)? (100 / (chGroup.totalTickets / leaderBoard[key].tickets)) : 0;
                const cn = (leaderBoard[key].coins> 0)? (1 / (chGroup.totalCoins / leaderBoard[key].coins)) : 0;
                //update the entry
                leaderBoard[key].rating = (tx - (tx * cn));
                return leaderBoard[key];
            });//end leaderBoard entry loop
            challenges[chId].leaderBoard = leaderBoard;
            return leaderBoard;
        });//end challenge group loop
        this.setState({challenges});
    }

    dateCheck = () => {
        console.log("Date Check");
        setTimeout(
            () => {
                //did the date change?
                const oldDate = Date.parse(d.toLocaleDateString());
                const nd = new Date();
                const newDate = Date.parse(nd.toLocaleDateString());
                console.log(d);
                console.log(nd);
                if (newDate > oldDate) window.location.reload();
                else this.dateCheck();
            }, 
            1000*60*60
        );
    }

    updateName = name => {
        console.log('updateName()');
        //get copy of state
        const user = {...this.state.user};
        const challenges = {...this.state.challenges};
        //update value
        user.info.name = name;
        if (user.info.challenges) {
            Object.values(user.info.challenges).map((chId)=>{
                if (challenges[chId].leaderBoard){
                    if (challenges[chId].leaderBoard[user.info.uid]) {
                        challenges[chId].leaderBoard[user.info.uid].name = name;
                    }
                }
                return name;
            });
        }
        //update state
        this.setState({user, challenges});
    }

    switchChallenge = challenge => {
        console.log(`switchChallenge(${this.state.currentChallenge} -> ${challenge})`);
        this.setState({currentChallenge: challenge});
    }

    dismiss = () => {
        console.log("dismiss()");
        //get copy of state
        const user = {...this.state.user};
        //update value
        user.info.note = false;
        this.setState({user});
    }

    createGoal = (goal) => {
        console.log('createGoal:');
        console.log(goal);
        //form the goal object
        const newGoalId = Date.now();
        const newGoal = {
            check: false,
            goal: goal.name,
            schedule: goal.schedule,
        };
        //get current user goal state
        const user = {...this.state.user};
        //add to the list
        if (!user.challenges){
            user.challenges = {
                [goal.challenge] : {
                    [newGoalId] : newGoal,
                }
            }
        }else if(!user.challenges[goal.challenge]){
            user.challenges[goal.challenge] = {
                [newGoalId] : newGoal,
            };
        }else {
            user.challenges[goal.challenge][newGoalId] = newGoal;
        }
        //update state w/ new value
        this.setState({user});
    }

    updateGoal = (goal) => {
        console.log('updateGoal:');
        console.log(goal);
        //get current user goal state
        const user = {...this.state.user};
        switch(goal.action){
            case 'check':
                //mark the target goal as checked
                user.challenges[goal.groupId][goal.gid].check = true;
                break;
            case 'delete':
                user.challenges[goal.groupId][goal.gid] = null;
                break;
            default:
                break;
        }
        //updat state
        this.setState({user});
    }

    addChat = (mssg) => {
        console.log(`addChat(${mssg})`);
        //new chat mssg object
        const d = new Date();
        const mObj = {
            photo: this.state.user.info.photo,
            name: this.state.user.info.name,
            color: this.state.user.info.color,
            date: d.toLocaleString(),
            mssg: mssg,
            uid: this.state.uid,
        };
        const challenges = {...this.state.challenges}
        if (!challenges[this.state.currentChallenge].chat) challenges[this.state.currentChallenge].chat = [];
        challenges[this.state.currentChallenge].chat.push(mObj);
        if (challenges[this.state.currentChallenge].chat.length > 30) challenges[this.state.currentChallenge].chat.shift();
        this.setState({challenges}, this.scrollChat);
    }

    scrollChat() {
        animateScroll.scrollToBottom({
          containerId: "chatWindow"
        });
    }

    render() {
        if (!this.state.uid){
            return (
                <Login  authenticate = {this.authenticate} />
            );            
        }

        return (
            <Profile 
                user= {this.state.user}
                logout= {this.logout}
                createGoal= {this.createGoal}
                updateGoal= {this.updateGoal}
                updateName= {this.updateName}
                dismiss= {this.dismiss}
                currentChallenge= {this.state.currentChallenge}
                challenges= {this.state.challenges}
                luckyPot= {this.state.luckyPot}
                leaderBoard = {this.state.leaderBoard}
                addChat = {this.addChat}
                chat= {this.state.chat}
                switchChallenge = {this.switchChallenge}
            />
        );
        
    }    
}

export default Content;