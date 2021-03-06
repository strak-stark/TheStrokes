import React, { useEffect, useState } from 'react';
import "./App.css"
import Nav from './components/Nav';
import Hero from './components/Hero';
import Contact from './components/Contact';
import { auth } from './services/firebase';
import TourDates from './components/TourDates';
import NewsPanel from './components/NewsPanel';
import { RoleContext } from './contexts/RoleContext';
import Strokes from './components/Strokes';
import Album from './components/Album';
import Showcase from './components/Showcase';
import Loader from './components/Loader';

const App = () => {
  document.addEventListener("DOMContentLoaded", function () {
    let active = false;
    const nav = document.querySelector('.nav')
    const burgerBars = document.querySelectorAll('.burgerBars')
    const navIcons = document.querySelectorAll('.nav__links-icons a')
    const navBrand = document.querySelector('.nav__brand')
    window.addEventListener('scroll', () => {
      if (active && window.scrollY < 130) {
        active = !active
        nav.style.background = "#ffffff00"
        nav.style.color = "#fff"
        navBrand.style.fontSize = "25px"
        nav.style.boxShadow = "none"
        burgerBars.forEach(bar => {
          bar.style.backgroundColor = "#fff"
        });
        navIcons.forEach(icon => {
          icon.style.color = "#fff"
        });
        setScrolled(false)
      } else if (active === false && window.scrollY >= 130) {
        active = true
        nav.style.background = "#fff"
        nav.style.color = "#000"
        navBrand.style.fontSize = "15px"
        nav.style.boxShadow = "0px 2px 5px 0px rgba(0, 0, 0, 0.75)"
        burgerBars.forEach(bar => {
          bar.style.backgroundColor = "#000"
        });
        navIcons.forEach(icon => {
          icon.style.color = "#000"
        });
        setScrolled(true)
      }
    });
    // this function runs when the DOM is ready, i.e. when the document has been parsed
    let checkExist = setInterval(function () {
      let app = document.getElementById('eapps-instagram-feed-1');
      if (app) {
        app.removeChild(app.lastElementChild);
        clearInterval(checkExist);
      }
    }, 100); // check every 100ms
  });
  const [isAdmin, setRole] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    auth().onAuthStateChanged(function (user) {
      if (user) {
        setRole(true)
      } else {
        setRole(false)
      }
    });
  }, [])
  return (
    <div className="App">
      <RoleContext.Provider value={isAdmin}>
        <header>
          <Nav scrolled={scrolled} />
        </header>
        <main>
          <Hero />
          <Strokes />
          <Album />
          <Showcase />
          <TourDates />
          <NewsPanel />
        </main>
        <footer>
          <Contact />
        </footer>
      </RoleContext.Provider>
      <Loader />
    </div>
  );
}

export default App;
