import React, { useState } from 'react';
import Navbar from './components/navbar';
import MainSection from './components/MainSection';
import AllProfessionals from './components/AllProfessionals';
import sitebg from './images/sitebg.png';

function App() {
  // "home" for MainSection, "professionals" for AllProfessionals.
  const [view, setView] = useState("home");

  const appStyle = {
    backgroundImage: `url(${sitebg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    minHeight: '100vh', // Covers full viewport height.
  };

  return (
    <div style={appStyle}>
      {/* Pass setView to Navbar so it can change the view. */}
      <Navbar setView={setView} />
      
      {/* Conditionally render MainSection or AllProfessionals based on view state */}
      {view === "home" && <MainSection />}
      {view === "professionals" && <AllProfessionals setView={setView} />}
    </div>
  );
}

export default App;
