import React, { useEffect, useState, useContext } from 'react';
import './styles/TourDates.css'
import './styles/switch.css'
import { db } from '../services/firebase';
import { auth } from 'firebase';
import AdminPanelTd from './AdminPanelTd';
import { RoleContext } from '../contexts/RoleContext';
import Fade from 'react-reveal/Fade';
const TourDates = () => {
    const [events, setEvents] = useState([])
    const [concerts, setConcerts] = useState([])
    const [festivals, setFestivals] = useState([])
    const [showOverlay, setOverlay] = useState(false)
    const [switchChecked, setSwitch] = useState(false)
    const tourDatesRef = db.collection("tour-dates")
    let isAdmin = useContext(RoleContext)
    const handleChange = () => {
        setSwitch(!switchChecked)
    }

    const handleClick = (e) => {
        const overlay = document.querySelector('.tourDates__admin-panel')
        const modify = document.querySelector('.tourDates__modify')
        const cross = document.querySelector('.td__admin-panel-cross')
        if (e.target == overlay || e.target == modify || e.currentTarget == cross) {
            setOverlay(!showOverlay)
        }
    }
    useEffect(() => {
        return tourDatesRef.onSnapshot((snapshot) => {
            const eventsData = []
            const concertsData = []
            const festivalsData = []
            snapshot.forEach(doc => {
                const { type } = doc.data()
                if (type === "1") {
                    concertsData.push(({ ...doc.data(), id: doc.id }))
                } else if (type === "2") {
                    festivalsData.push(({ ...doc.data(), id: doc.id }))
                }
                eventsData.push(({ ...doc.data(), id: doc.id }))
            })
            setEvents(eventsData)
            setConcerts(concertsData)
            setFestivals(festivalsData)
        })
    }, [])



    return (
        <section className="tourDates">
            {isAdmin
                ? < a className="tourDates__modify" onClick={handleClick}>Modifier</a>
                : null}
            <div className="tourDates__dates-ctnr">

                <h1 style={{
                    fontSize: "30px",
                    textTransform: "uppercase",
                    fontFamily: "Roboto",
                    fontStyle: "normal",
                    fontWeight: "900"
                }} className="tourDates__title">{switchChecked ? "Festival" : "Concert"}</h1>
                <ul className="tourDates__dates-list">
                    {switchChecked
                        ? festivals.map(event => {
                            return (
                                <li key={event.id}>
                                    <Fade bottom>
                                        <span className="tourDates__loc">{event.salle},</span> <span className="tourDates__loc2">{event.ville}</span><br />
                                        <span className="tourDates__date">{event.time}</span><br />
                                        <a href={event.lien} target="_blank">TICKETS</a>
                                    </Fade>
                                </li>
                            )
                        })
                        : concerts.map(event => {
                            return (
                                <li key={event.id}>
                                    <Fade bottom>
                                        <span className="tourDates__loc">{event.salle},</span> <span className="tourDates__loc2">{event.ville}</span><br />
                                        <span className="tourDates__date">{event.time}</span><br />
                                        <a href={event.lien} target="_blank">TICKETS</a>
                                    </Fade>
                                </li>
                            )
                        })
                    }
                </ul>
                <div className="switchCtnr">
                    <p>Concert</p>
                    <label className="switch">
                        <input type="checkbox" checked={switchChecked} onChange={handleChange} />
                        <span className="slider"></span>
                    </label>
                    <p>Festival</p>
                </div>
            </div>

            {
                showOverlay
                    ? <AdminPanelTd handleClick={handleClick} />
                    : null
            }

        </section >
    );
}

export default TourDates;