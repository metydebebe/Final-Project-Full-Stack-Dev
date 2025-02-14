import React, { useState, useEffect } from 'react';
import Header from '../HomePage/Header'; 
import Navigation from '../HomePage/Navigation'; 
import Footer from '../HomePage/Footer'; 

const EventsBody = () => {
  const [events, setEvents] = useState([]);
  const [searchEvent, setSearchEvent] = useState('');
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [noEventsMessage, setNoEventsMessage] = useState('');

  // State for event form
  const [eventForm, setEventForm] = useState({
    event_name: '',
    event_date: '',
    location: '',
    description: '',
  });
  const [editingEventId, setEditingEventId] = useState(null);

  const fetchEvents = async () => {
    try {
      const response = await fetch('http://localhost:3000/events');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setEvents(data.response || []);
      setFilteredEvents(data.response || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

const handleSearch = () => {
    if (searchEvent.trim() === '') {
        setFilteredEvents(events);
        setNoEventsMessage(''); // Clear the message when search is empty
    } else {
        const lowerCaseSearch = searchEvent.toLowerCase();
        const filtered = events.filter(event => 
            event.event_name.toLowerCase().includes(lowerCaseSearch)
        );

        setFilteredEvents(filtered);

        if (filtered.length === 0) {
            setNoEventsMessage('No events found matching your search.');
        } else {
            setNoEventsMessage(''); // Clear the message if there are results
        }
    }
};

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingEventId) {
      // Update event
      try {
        const response = await fetch(`http://localhost:3000/events/${editingEventId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(eventForm),
        });

        if (!response.ok) {
          throw new Error('Failed to update event');
        }
        fetchEvents(); // Refresh events
        resetForm();
      } catch (error) {
        console.error('Error updating event:', error);
      }
    } else {
      // Create new event
      try {
        const response = await fetch('http://localhost:3000/events', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(eventForm),
        });

        if (!response.ok) {
          throw new Error('Failed to create event');
        }
        fetchEvents(); // Refresh events
        resetForm();
      } catch (error) {
        console.error('Error creating event:', error);
      }
    }
  };

  const handleEdit = (event) => {
    setEventForm({
      event_name: event.event_name,
      event_date: event.event_date,
      location: event.location,
      description: event.description,
    });
    setEditingEventId(event.event_id);
  };

  const handleDelete = async (eventId) => {
    try {
      await fetch(`http://localhost:3000/events/${eventId}`, {
        method: 'DELETE',
      });
      fetchEvents(); // Refresh events
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const resetForm = () => {
    setEventForm({
      event_name: '',
      event_date: '',
      location: '',
      description: '',
    });
    setEditingEventId(null);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="container my-4">
      <h2 className='mb-4'>Upcoming Events</h2>
      <input
        type="text"
        placeholder="Search for an event..."
        className="form-control mb-2"
        value={searchEvent}
        onChange={(e) => setSearchEvent(e.target.value)}
        onKeyDown={handleKeyPress}
      />
      <button className="btn btn-primary mb-3" onClick={handleSearch}>
        Search
      </button>

      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          name="event_name"
          placeholder="Event Name"
          value={eventForm.event_name}
          onChange={handleInputChange}
          required
          className="form-control mb-2"
        />
        <input
          type="datetime-local"
          name="event_date"
          value={eventForm.event_date}
          onChange={handleInputChange}
          required
          className="form-control mb-2"
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={eventForm.location}
          onChange={handleInputChange}
          required
          className="form-control mb-2"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={eventForm.description}
          onChange={handleInputChange}
          className="form-control mb-2"
        />
        <button type="submit" className="btn btn-success ">
          {editingEventId ? 'Update Event' : 'Add Event'}
        </button>
        <button type="button" className="btn btn-secondary m-2" onClick={resetForm}>
          Cancel
        </button>
      </form>

      {filteredEvents.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <div className="row">
          {filteredEvents.map(event => (
            <div key={event.event_id} className="col-md-4 mb-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{event.event_name}</h5>
                  <p className="card-text">
                    <strong>Description:</strong> {event.description}<br />
                    <strong>Date & Time:</strong> {event.event_date}<br />
                    <strong>Location:</strong> {event.location}
                  </p>
                  <button className="btn btn-warning me-2" onClick={() => handleEdit(event)}>
                    Edit
                  </button>
                  <button className="btn btn-danger ms-2" onClick={() => handleDelete(event.event_id)}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Events = () => {
  return (
    <div>
      <Header />       
      <Navigation />   
      <EventsBody />  
      <Footer />       
    </div>
  );
};

export default Events;