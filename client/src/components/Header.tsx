import Profile from './Profile'

function Header() {
  return (
    <div>
      <div className="flex flex-col-reverse justify-between sm:flex-row">
        <div className="flex flex-col">
          <h1 className="text-center text-4xl">Cast Round</h1>
        </div>
        <div className="flex flex-col items-end">
          <Profile />
        </div>
      </div>
    </div>
  )
}

export default Header
