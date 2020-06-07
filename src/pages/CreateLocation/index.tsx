import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { Link, useHistory } from 'react-router-dom'
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

interface CityResponse {
    nome: string
}

const CreateLocation = () => {
    const [items, setItems] = useState<Item[]>([])

    const [ufs, setUfs] = useState<string[]>([])
    const [selectedUf, setSelectedUf] = useState('0')
    
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        wpp: ''
    })
    const [selectedItems, setSelectedItems] = useState<number[]>([])

    const [cities, setCities] = useState<string[]>([])
    const [selectedCity, setSelectedCity] = useState('0')

    const [selectedPosition, setSelectedPosition] = useState<[number,number]>([0,0])
    const [initialPosition, setInitialPosition] = useState<[number,number]>([0,0])

    const history = useHistory()

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => {
            const  {latitude, longitude } = position.coords
            setInitialPosition([latitude, longitude])
        })
    }, [])

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
        if (selectedUf === '0') return
        axios.get<CityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
            .then(res => {
                const cityNames = res.data.map(city => city.nome)
                setCities(cityNames)
            })
    }, [selectedUf])

    function handleSelectedUF(event: ChangeEvent<HTMLSelectElement>) {
        const uf = event.target.value
        setSelectedUf(uf)
    }

    function handleSelectedCity(event: ChangeEvent<HTMLSelectElement>) {
        const uf = event.target.value
        setSelectedCity(uf)
    }

    function handleSelectedItem(id: number) {
        const alreaySelected = selectedItems.findIndex(item => item === id)

        if (alreaySelected >= 0) {

            const filteredItems = selectedItems.filter(item => item !== id)
            setSelectedItems(filteredItems)

        } else setSelectedItems([...selectedItems, id])
    }
    
    function handleMapClick(event: LeafletMouseEvent) {
        setSelectedPosition([
            event.latlng.lat,
            event.latlng.lng
        ])
    }
    
    function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
        const {name, value} = event.target
        setFormData({...formData, [name]: value})
    }
    
    async function handleSubmit(event: FormEvent) {
        event.preventDefault()

        const { name, email, wpp } = formData
        const uf = selectedUf
        const city = selectedCity
        const [latitude, longitude] = selectedPosition
        const items = selectedItems

        const data = {
            name,
            email,
            wpp,
            state: uf,
            city,
            lat: latitude,
            long: longitude,
            items
        }

        await api.post('locations', data)

        alert('Registered location!')
        history.push('/')

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

            <form onSubmit={handleSubmit}>
                <h1>Location point register</h1>

                <fieldset>
                    <legend>
                        <h2>Info</h2>
                    </legend>

                    <div className="field">
                        <label htmlFor="name">Entity name</label>
                        <input type="text" name="name" id="name" onChange={handleInputChange}/>                
                    </div>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="email">E-mail</label>
                            <input type="email" name="email" id="email" onChange={handleInputChange}/>                
                        </div>

                        <div className="field">
                            <label htmlFor="wpp">Whatsapp</label>
                            <input type="text" name="wpp" id="wpp" onChange={handleInputChange}/>                
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Address</h2>
                        <span>Select the address in the map</span>
                    </legend>

                    <Map center={initialPosition} zoom={15} onClick={handleMapClick}>
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
                            <select name="city" id="city" value={selectedCity} onChange={handleSelectedCity}>
                                <option value="0">Select a City</option>
                                {cities.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
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
                            <li key={i.id} onClick={() => handleSelectedItem(i.id)} 
                                className={selectedItems.includes(i.id) ? 'selected' : ''}>
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