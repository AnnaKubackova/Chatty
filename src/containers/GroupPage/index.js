import React, { useEffect, useState } from 'react';
import LeftSide from '../../components/LeftSide';
import RightSide from '../../components/RightSide'

const GroupPage = (props) => {
    return (
        <div>
            <LeftSide />
            <RightSide>
                <h3>Groups</h3>
            </RightSide>
        </div>
        
    )
}

export default GroupPage;