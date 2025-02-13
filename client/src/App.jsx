import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './Components/HomePage/Home';
import PetProfiles from './Components/PetProfilesPage/PetProfilesBody'
import ContactUs from './Components/ContactUsPage/ContactBody'
import Events from './Components/EventsPage/EventsBody'
import Applications from './Components/ApplicationsPage/ApplicationBody'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} /> 
        <Route path="/home" element={<Home />} />
        <Route path="/contact" element={<ContactUs />} /> 
        <Route path="/petProfiles" element={<PetProfiles />} /> 
        <Route path="/apply" element={<Applications />} /> 
        <Route path="/events" element={<Events />} /> 
      </Routes>
    </Router>
  );
};

export default App;