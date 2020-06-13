import React, { useEffect, useState, useContext } from 'react';
import './styles/TourDates.css'
import './styles/switch.css'
import { db } from '../services/firebase';
import { auth } from 'firebase';
import AdminPanelTd from './AdminPanelTd';
import { RoleContext } from '../contexts/RoleContext';
const TourDates = () => {
    const [events, setEvents] = useState([])
    const [concerts, setConcerts] = useState([])
    const [festivals, setFestivals] = useState([])
    const [showOverlay, setOverlay] = useState(false)
    const [switchChecked, setSwitch] = useState(false)
    const tourDatesRef = db.collection("tour-dates")
    let isAdmin = useContext(RoleContext)
    console.log(isAdmin);
    const handleChange = () => {
        setSwitch(!switchChecked)
    }

    const handleClick = (e) => {
        const overlay = document.querySelector('.tourDates__admin-panel')
        const modify = document.querySelector('.tourDates__modify')
        if (e.target == overlay || e.target == modify) {
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
                                    <span className="tourDates__loc">{event.salle},</span> <span className="tourDates__loc2">{event.ville}</span><br />
                                    <span className="tourDates__date">{event.time}</span><br />
                                    <a href={event.lien} target="_blank">TICKETS</a>
                                </li>
                            )
                        })
                        : concerts.map(event => {
                            return (
                                <li key={event.id}>
                                    <span className="tourDates__loc">{event.salle},</span> <span className="tourDates__loc2">{event.ville}</span><br />
                                    <span className="tourDates__date">{event.time}</span><br />
                                    <a href={event.lien} target="_blank">TICKETS</a>
                                </li>
                            )
                        })
                    }
                </ul>
                <div className="switchCtnr">
                    <p>Concert</p>
                    <label class="switch">
                        <input type="checkbox" checked={switchChecked} onChange={handleChange} />
                        <span class="slider"></span>
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