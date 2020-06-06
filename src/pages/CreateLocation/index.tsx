import React from 'react';
import { Link } from 'react-router-dom'
import './styles.css';
import logo from '../../assets/logo.svg'
import { FiArrowLeft } from 'react-icons/fi'
import { Map, TileLayer, Marker } from 'react-leaflet'


const CreateLocation = () => {
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

                <Map center={[-25.3843819, -49.2692895]} zoom={15} >
                    <TileLayer
                        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={[-25.3843819, -49.2692895]}/>
                </Map>

                <div className="field-group">
                    <div className="field">
                        <label htmlFor="uf">State</label>
                        <select name="uf" id="uf">
                            <option value="0">Select a state</option>
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
                    <li>
                        <img src="http://localhost:3333/uploads/batteries.svg" alt="goku"/>
                        <span>Batteries</span>
                    </li>
                    <li className="selected">
                        <img src="http://localhost:3333/uploads/batteries.svg" alt="goku"/>
                        <span>Batteries</span>
                    </li>
                    <li>
                        <img src="http://localhost:3333/uploads/batteries.svg" alt="goku"/>
                        <span>Batteries</span>
                    </li>
                    <li>
                        <img src="http://localhost:3333/uploads/batteries.svg" alt="goku"/>
                        <span>Batteries</span>
                    </li>
                    <li>
                        <img src="http://localhost:3333/uploads/batteries.svg" alt="goku"/>
                        <span>Batteries</span>
                    </li>
                    <li>
                        <img src="http://localhost:3333/uploads/batteries.svg" alt="goku"/>
                        <span>Batteries</span>
                    </li>
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