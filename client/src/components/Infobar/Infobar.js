import React from 'react';
import closeIcon from '../../icons/closeIcon.png';
import onlineIcon from '../../icons/onlineIcon.png';
import './Infobar.css';

const Infobar = ({ room }) => (
    <div className="infoBar">
        <div className="leftInnerContainer">
            <img src={onlineIcon} alt="onlineIcon" className="onlineIcon" />
            <h3>{ room }</h3>
        </div>
        <div className="rightInnerContainer">
            <a href="/"><img src={closeIcon} alt="closeIcon" /></a>
        </div>
    </div>
    
)
 
export default Infobar;