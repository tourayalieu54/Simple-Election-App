import { useState } from 'react'
import Products from './components/products.tsx'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Products/>
  )
}

export default App
