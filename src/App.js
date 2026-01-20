import React from 'react';
import Header from './components/Header';
import Content from './components/Content';
import Footer from './components/Footer';

function App() {
  const version = '0.4.0';
  const date = new Date();
  return (
    <>
    <Header />
    <Content className="content" />
    <Footer version={version} year={date.getFullYear()} />
    </>
  );
}

export default App;
