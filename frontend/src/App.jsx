import React from 'react'
import PaymentPage from './components/PaymentPage'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import SuccessPage from './components/SuccessPage'
import FailurePage from './components/FailurePage'
import Status from './components/Status'

const App = () => {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<PaymentPage />} />
      <Route path='/payment/success' element={<SuccessPage />} />
      <Route path='/payment/failure' element={<FailurePage/>} />
      <Route path='/verify/:id' element={<Status/>}/>
    </Routes>
    </BrowserRouter>
  )
}

export default App