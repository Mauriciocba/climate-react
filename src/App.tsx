import { Navbar } from './components/Navbar' 
import { Title } from './components/Title'
import { Footer } from './components/Footer'
import { WeatherPage } from './components/WeatherPage'
import { WeatherGrid } from './components/WeatherGrid'
import { Divider } from './components/Divider'
function App() {

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow">
        <Navbar />
        <Title />
        <WeatherPage />
        <Divider />
       <div>
        <WeatherGrid />
       </div>
      </div>
      <Footer />
    </div>
  )
}

export default App
