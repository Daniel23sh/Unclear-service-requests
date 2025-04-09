import React from 'react';
import Navbar from './components/navbar';
import MainSection from './components/MainSection';
import sitebg from './images/sitebg.png';

function App() {

  const appStyle = {
    backgroundImage: `url(${sitebg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    minHeight: '100vh', // Ensures it covers the full viewport height
  };

  return (
    <div style = {appStyle}>
      <Navbar />
      <MainSection />
    </div>
  );
}

export default App;

