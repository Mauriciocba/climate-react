import climateLogo from '../assets/favicon-global.png'

export function Navbar() {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50 w-full">
      <nav className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <div className="flex items-center gap-3 md:gap-4">
            <img
              src={climateLogo}
              alt="Climate Logo"
              className="h-10 w-10 md:h-12 md:w-12 object-contain transition-transform hover:scale-110"
            />
            <h1 className="text-xs text-gray-600 uppercase tracking-wide">
              Weather now
            </h1>
          </div>
        </div>
      </nav>
    </header>
  )
}