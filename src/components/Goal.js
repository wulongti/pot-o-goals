import React from 'react';

const Goal = ({gid, goal, updateGoal, schedule, groupId, groupName}) => (
//1. goal message
//2. delete button
//3. check/uncheck button
    <div className={`goals__entry ${goal.check}`}>
        <button className="goals__entry-check" onClick={()=>{updateGoal({action: 'check', groupId, gid})}}>Complete Me!</button>
        <div className="goals__entry-challenge">{groupName}</div>
        <div className="goals__entry-text">{goal.goal}</div>
        <ul className="goals__schedule">
            <li className={`goals__schedule-day ${(!!schedule[0])? true : false}`}>Su</li>
            <li className={`goals__schedule-day ${(!!schedule[1])? true : false}`}>Mo</li>
            <li className={`goals__schedule-day ${(!!schedule[2])? true : false}`}>Tu</li>
            <li className={`goals__schedule-day ${(!!schedule[3])? true : false}`}>We</li>
            <li className={`goals__schedule-day ${(!!schedule[4])? true : false}`}>Th</li>
            <li className={`goals__schedule-day ${(!!schedule[5])? true : false}`}>Fr</li>
            <li className={`goals__schedule-day ${(!!schedule[6])? true : false}`}>Sa</li>
        </ul>
        <button className="goals__entry-delete" onClick={()=>{updateGoal({action: 'delete', groupId, gid})}}>Delete</button>
    </div>
);

export default Goal;