import React, { useEffect, useState, ChangeEvent } from 'react';
import { Link } from 'react-router-dom'
import './styles.css';
import logo from '../../assets/logo.svg'
import { FiArrowLeft } from 'react-icons/fi'
import { Map, TileLayer, Marker } from 'react-leaflet'
import { LeafletMouseEvent } from 'leaflet'
import api from '../../services/api'
import axios from 'axios'

interface Item {
    id: number
    title: string
    image_url: string
}

interface UFResponse {
    sigla: string
}

const CreateLocation = () => {
    const [items, setItems] = useState<Item[]>([])
    const [ufs, setUfs] = useState<string[]>([])
    const [selectedUf, setSelectedUf] = useState('0')
    const [selectedPosition, setSelectedPosition] = useState<[number,number]>([0,0])

    useEffect(() => {
        api.get('items').then(res => {
            setItems(res.data.serializedItems)
        })
    }, [])

    useEffect(() => {
        axios.get<UFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
            .then(res => {
                const ufInitials = res.data.map(uf => uf.sigla)
                setUfs(ufInitials)
            })
    }, [])

    useEffect(() => {
        axios.get<UFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados/{UF}/municipios')
            .then(res => {
                const ufInitials = res.data.map(uf => uf.sigla)
                setUfs(ufInitials)
            })
    }, [])

    function handleSelectedUF(event: ChangeEvent<HTMLSelectElement>) {
        const uf = event.target.value
        setSelectedUf(uf)
    }
    
    function handleMapClick(event: LeafletMouseEvent) {
        setSelectedPosition([
            event.latlng.lat,
            event.latlng.lng
        ])
    }

    return (
        <div id="page-create-point">
            <header>
                <img src={logo} alt="Ecoleta"/>
                <Link to="/">
                    <FiArrowLeft />
                    Home
                </Link>
            </header>

            <form>
                <h1>Location point register</h1>

                <fieldset>
                    <legend>
                        <h2>Info</h2>
                    </legend>

                    <div className="field">
                        <label htmlFor="name">Entity name</label>
                        <input type="text" name="name" id="name"/>                
                    </div>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="email">E-mail</label>
                            <input type="email" name="email" id="email"/>                
                        </div>

                        <div className="field">
                            <label htmlFor="wpp">Whatsapp</label>
                            <input type="text" name="wpp" id="wpp"/>                
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Address</h2>
                        <span>Select the address in the map</span>
                    </legend>

                    <Map center={[-25.3843819, -49.2692895]} zoom={15} onClick={handleMapClick}>
                        <TileLayer
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={selectedPosition}/>
                    </Map>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="uf">State</label>
                            <select name="uf" id="uf" value={selectedUf} onChange= {handleSelectedUF}>
                                <option value="0">Select a state</option>
                                {ufs.map(uf => (
                                    <option key={uf} value={uf}>{uf}</option>
                                ))}
                            </select>                    
                        </div>

                        <div className="field">
                            <label htmlFor="city">City</label>
                            <select name="city" id="city">
                                <option value="0">Select a City</option>
                            </select>                    
                        </div>
                    </div>

                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Collection Items</h2>
                        <span>Select the items below</span>
                    </legend>

                    <ul className="items-grid">
                        {items.map(i => (
                            <li key={i.id}>
                                <img src={i.image_url} alt={i.title}/>
                                <span>{i.title}</span>
                            </li>
                        ))}
                    </ul>

                </fieldset>

                <button type="submit">
                    Register location
                </button>

            </form>
        </div>
    )
}

export default CreateLocation;