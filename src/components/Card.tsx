import sunIcon from '../assets/sun.png'
import cloudyIcon from '../assets/cloudy.png'
import snowingIcon from '../assets/snowing.png'
import rainIcon from '../assets/rain.png'
import windIcon from '../assets/wind.png'


interface CardItem {
  name?: string
  city?: string
  country?: string
  temperature?: number | string
  description?: string
  condition?: string
  humidity?: number | string
  wind?: number | string
  pressure?: number | string
  chanceOfRain?: number | string
  formattedDateTime?: string
}

export function Card({ item }: { item: CardItem }) {
  const getWeatherIcon = () => {
    const condition = (item.condition || item.description || '').toLowerCase()
    if (condition.includes('snow') || condition.includes('nieve')) {
      return snowingIcon
    } else if (condition.includes('rain') || condition.includes('lluvia') || 
               condition.includes('llovizna') || condition.includes('chubascos') || 
               condition.includes('tormenta') || condition.includes('storm')) {
      return rainIcon
    } else if (condition.includes('cloud') || condition.includes('nublado') || 
               condition.includes('niebla') || condition.includes('fog')) {
      return cloudyIcon
    } else {
      return sunIcon
    }
  }

  const temperature = item.temperature ? `${item.temperature}°` : '--°'
  
  const humidity = item.humidity !== undefined ? `${item.humidity}%` : "--%";
  
  
  const wind = item.wind !== undefined ? `${item.wind} km/h` : "-- km/h";
  
  const chanceOfRain = item.chanceOfRain !== undefined ? `${item.chanceOfRain}%` : "--%";

  return (
    <div className="flex justify-center mt-10 px-4">
      <div 
        className="bg-gradient-to-br from-sky-100 to-white rounded-2xl shadow-lg p-6 md:p-8 w-full max-w-md relative overflow-hidden transition-all duration-300 hover:scale-105"
        style={{
          background: 'linear-gradient(135deg, #e0f2fe 0%, #ffffff 100%)'
        }}
      >
        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">
            {item.name || item.city || 'Ciudad'}
          </h2>
          <p className="text-sm md:text-base text-gray-500 mb-2">
            {item.country || 'País'}
          </p>
          {item.formattedDateTime && (
            <p className="text-xs text-gray-400 italic">
              {item.formattedDateTime}
            </p>
          )}
        </div>

        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="text-6xl md:text-7xl font-bold text-gray-800 mb-2">
              {temperature}
            </div>
            <p className="text-base md:text-lg text-gray-700 font-medium">
              {item.description || item.condition || 'Condición'}
            </p>
          </div>

          <div className="flex-shrink-0 ml-4">
            <img 
              src={getWeatherIcon()} 
              alt="icono de clima" 
              className="w-16 h-16 md:w-20 md:h-20 object-contain"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <svg 
                className="w-5 h-5 text-blue-500" 
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
              </svg>
              <div>
                <p className="text-xs text-gray-500">Humidity</p>
                <p className="text-sm font-semibold text-gray-700">{humidity}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <img 
                src={windIcon} 
                alt="icono de viento" 
                className="w-5 h-5 object-contain"
              />
              <div>
                <p className="text-xs text-gray-500">Wind</p>
                <p className="text-sm font-semibold text-gray-700">{wind}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <img 
              src={rainIcon} 
              alt="icono de precipitación" 
              className="w-5 h-5 object-contain opacity-80"
            />
            <div>
              <p className="text-xs text-gray-500">Prob. de precipitaciones</p>
              <p className="text-sm font-semibold text-gray-700">{chanceOfRain}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}