import React from 'react'
import { HashRouter as Router, Routes, Route } from "react-router-dom";

import { Menu } from './features/menu/Menu'
import { Counter } from './features/counter/Counter'
import { HeroesTable } from './features/heroes/Heroes'
import { TenantsTable } from './features/tenants/Tenants'
import { Events } from './features/events/Events'
import { BigEvents } from './features/bigevents/BigEvents'
import { Leveling } from './features/lvl/lvl'
import { Daylies } from './features/daylies/daylies'
import { Images } from './features/images'
import './App.css'

function App() {
  return (
    <div className="App">
      <Router >
        <table id='mainContainer'>
          <tbody>
            <tr>
            <td id='menuContainer'>
              <Menu />
            </td>
            <td id='contentContainer'>
              <Routes>
                <Route path='/' element={<Counter />} />
                <Route path='/heroes' element={<HeroesTable />} />
                <Route path='/tenants' element={<TenantsTable />} />
                <Route path='/events' element={<Events />} />
                <Route path='/lvl' element={<Leveling />} />
                <Route path='/daylies' element={<Daylies />} />
                <Route path='/bigevents' element={<BigEvents />} />
                <Route path='/others' element={<Images />} />
              </Routes>
            </td>
            <td id='fakeMenuContainer'>
            </td>
            </tr>
          </tbody>
        </table>
      </Router> 
    </div>
  )
}

export default App
