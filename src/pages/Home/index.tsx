import React from 'react'
import { FiLogIn } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import logo from '../../assets/logo.svg'
import './styles.css';


const Home = () => {
  return (
    <div id="page-home">
        <div className="content">

            <header>
                <img src={logo} alt="Ecoleta"/>
            </header>

            <main>
                <h1>Your waste collection marketplace.</h1>
                <p>We help people to find garbage collection locations in a efficient way.</p>
                <Link to="/create-location">
                    <span> <FiLogIn/ > </span>
                    <strong>Register a collection location</strong>
                </Link>
            </main>

        </div>
    </div>
  )
}

export default Home;