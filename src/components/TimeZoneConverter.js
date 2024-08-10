import React, { Component } from 'react';
import moment from 'moment-timezone';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import DatePicker from 'react-datepicker';
import TimeZoneDisplay from "./TimeZoneDisplay";
import AddTimeZone from './AddTimeZone';
import { MdOutlineSwapVert } from "react-icons/md";
import { SlCalender } from "react-icons/sl";
import { FaLink } from "react-icons/fa";
import { MdSunny } from "react-icons/md";
import { IoMoon } from "react-icons/io5";
import './styles.css';


class TimeZoneConverter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timeZones: [
        { name: 'UTC', label: 'UTC', offset: 0, dst: false, lat: 0, lng: 0 },
        { name: 'Asia/Kolkata', label: 'Home', offset: 5.5, dst: false, lat: 22.5726, lng: 88.3639 },
        { name: 'America/New_York', label: 'Work', offset: -5, dst: true, lat: 40.7128, lng: -74.0060 },
        { name: 'Europe/London', label: 'London', offset: 0, dst: true, lat: 51.5074, lng: -0.1278 },
        { name: 'Australia/Sydney', label: 'Sydney', offset: 10, dst: true, lat: -33.8651, lng: 151.2099 },
        { name: 'Africa/Johannesburg', label: 'Johannesburg', offset: 2, dst: false, lat: -26.2041, lng: 28.0456 },
        { name: 'Asia/Tokyo', label: 'Tokyo', offset: 9, dst: false, lat: 35.6895, lng: 139.7670 },
        { name: 'America/Los_Angeles', label: 'Los Angeles', offset: -8, dst: true, lat: 34.0522, lng: -118.2437 },
        { name: 'Europe/Berlin', label: 'Berlin', offset: 1, dst: true, lat: 52.5200, lng: 13.4050 },
        { name: 'Asia/Shanghai', label: 'Shanghai', offset: 8, dst: false, lat: 31.2304, lng: 121.4737 },
      ], // Default time zones
      currentTime: moment(),
      date: new Date(),
      darkMode: false,
      shareableLink: '',
      timeOffsets: {},
    };
  }
  

  handleTimeZoneAddition = (timeZone) => {
    this.setState((prevState) => ({
      timeZones: [...prevState.timeZones, timeZone],
    }));
  };

  handleTimeZoneDeletion = (index) => {
    const updatedTimeZones = this.state.timeZones.filter((_, i) => i !== index);
    this.setState({ timeZones: updatedTimeZones });
  };

  onDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(this.state.timeZones);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    this.setState({ timeZones: items });
  };

  handleDateChange = (date) => {
    this.setState({ date, currentTime: moment(date) });
  };

  handleTimeZoneReversal = () => {
    this.setState((prevState) => ({
      timeZones: prevState.timeZones.slice().reverse(),
    }));
  };

  handleDarkModeToggle = () => {
    this.setState((prevState) => ({
      darkMode: !prevState.darkMode,
    }));
  };

  handleTimeOffsetChange = (timeZoneName, timeOffset) => {
    const newTime = moment(this.state.currentTime).add(timeOffset, 'hours');
    const updatedTimeZones = this.state.timeZones.map((zone) => {
      if (zone.name === timeZoneName) {
        const offset = moment(newTime).utcOffset(zone.offset, true);
        return { ...zone, offset };
      } else {
        return zone;
      }
    });
    this.setState({ timeZones: updatedTimeZones, currentTime: newTime });
  };

  handleShareableLinkGeneration = () => {
    const link = `https://example.com/?date=${this.state.date.toISOString()}&timeZones=${this.state.timeZones.map((zone) => zone.name).join(',')}`;
    this.setState({ shareableLink: link });
    this.setState({ shareLinkContainerStyle: { display: 'flex', justifyContent: 'center', marginTop: '20px' } });
  };

  handleScheduleMeet = () => {
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Meeting&dates=${this.state.date.toISOString()}&details=Meeting%20at%20${this.state.date.toLocaleTimeString()}&location=Online`;
    window.open(calendarUrl, '_blank');
  };

  render() {
    const { timeZones, currentTime, date, darkMode, shareableLink, timeOffsets } = this.state;
    const colorChange = darkMode ? <MdSunny className={darkMode ? 'icon-style-dark' : 'icon-style'}/> : <IoMoon className={darkMode ? 'icon-style-dark' : 'icon-style'}/>;
  
    return (
      <div className={darkMode ? 'dark-mode' : ''}>
        <h1 className='mainHead'>Time Zone Converter</h1>
        <div className='Headers'>
          <AddTimeZone onAdd={this.handleTimeZoneAddition} darkMode={darkMode}/>
          <DatePicker
            selected={date}
            onChange={this.handleDateChange}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="MMMM d, yyyy h:mm aa"
          />
          <button onClick={this.handleTimeZoneReversal}><MdOutlineSwapVert className={darkMode ? 'icon-style-dark' : 'icon-style'}/></button>
          <button onClick={this.handleDarkModeToggle}>{colorChange}</button>
          <button onClick={this.handleShareableLinkGeneration}><FaLink className={darkMode ? 'icon-style-dark' : 'icon-style'} /></button>
          <button onClick={this.handleScheduleMeet}><SlCalender className={darkMode ? 'icon-style-dark' : 'icon-style'}/></button>
        </div>
        <div className='shareableLink'>
          {shareableLink && (
            <p className='paraLink'>
              Shareable Link: <a className='anchorLink' href={shareableLink}>{shareableLink}</a>
            </p>
          )}
        </div>
        
        <DragDropContext onDragEnd={this.onDragEnd}>
          <Droppable droppableId="droppable">
            {(provided, snapshot) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {timeZones.map((zone, index) => (
                  <Draggable key={zone.name} draggableId={zone.name} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <TimeZoneDisplay
                          timeZone={zone}
                          currentTime={currentTime}
                          timeOffset={timeOffsets[zone.name] || 0}
                          onDelete={() => this.handleTimeZoneDeletion(index)} // Correctly pass index
                          onTimeOffsetChange={(timeOffset) => this.handleTimeOffsetChange(zone.name, timeOffset)}
                          darkMode={darkMode}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    );
  }
}

export default TimeZoneConverter;