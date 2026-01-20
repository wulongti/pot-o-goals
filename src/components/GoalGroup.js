import React from 'react';
import Goal from './Goal';

class GoalGroup extends React.Component {
    render() {
        const {group, groupId, groupName} = this.props;
        return (
            <>
                {Object.keys(group).map((key)=>{
                    const schedule = (group[key].schedule)? group[key].schedule : [true,true,true,true,true,true,true];
                    const d = new Date();
                    if(schedule[d.getDay()]){
                        return <Goal 
                            key={key} 
                            gid={key} 
                            goal={group[key]} 
                            updateGoal={this.props.updateGoal} 
                            schedule={schedule}
                            groupId={groupId}
                            groupName={groupName} />
                    }else{
                        return false;
                    }
                })}
            </>
        );
    }
}

export default GoalGroup;