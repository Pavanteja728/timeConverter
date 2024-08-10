import React from 'react';
import moment from 'moment-timezone';

const TimeZoneDisplay = ({
  timeZone,
  currentTime,
  timeOffset,
  onDelete,
  onTimeOffsetChange,
  darkMode,
}) => {
  const offset = timeZone.offset;
  const dst = timeZone.dst ? ' (DST)' : '';
  const adjustedTime = moment(currentTime).add(timeOffset, 'hours');
  

  return (
    <div className='displayTime'>
      <div className='newDisplayTime'>
        <div>
          <h2 className='timeZoneHeader'>{timeZone.label}</h2>
          <p className='currentTimeZone'>
            {adjustedTime.tz(timeZone.name).format('MMMM D, YYYY h:mm A')} {dst}
          </p>
          <p className='offset'>UTC{offset >= 0 ? '+' : '-'}{Math.abs(offset)} hours</p>
        </div>
        <input
          type="range"
          min="-12"
          max="12"
          value={timeOffset}
          onChange={(e) => onTimeOffsetChange(e.target.value)}
        />
        <button className={darkMode ? "deleteButton dark-mode" : "deleteButton"} onClick={onDelete}>Delete</button>
      </div>
    </div>
  );
};

export default TimeZoneDisplay;