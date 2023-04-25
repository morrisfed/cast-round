import Header from './Header'

function Layout() {
  return (
    <div>
      <h2 className="bg-red-200 p-1 text-center text-xl font-bold">
        Under development
      </h2>
      <div className="p-4">
        <div className="mb-8">
          <Header />
        </div>
        <p>
          Welcome to Cast Round, the Morris Federation&apos;s voting system.
        </p>
      </div>
    </div>
  )
}

export default Layout
