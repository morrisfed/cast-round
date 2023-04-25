import * as O from 'fp-ts/Option'
import { useUserProfile } from './UserProfileContext'

function Profile() {
  const { loaded, userProfile } = useUserProfile()

  if (loaded) {
    if (O.isNone(userProfile)) {
      return (
        <div className="flex flex-col items-end">
          <p>Not logged in</p>
          <form action="/api/auth/mw" method="get">
            <button
              className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
              type="submit"
            >
              Log In
            </button>
          </form>
        </div>
      )
    } else {
      return (
        <div className="flex flex-col items-end">
          <p>{userProfile.value.name}</p>
          <p>{userProfile.value.type}</p>
          <div>
            <form action="/api/auth/logout" method="post">
              <button
                className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
                type="submit"
              >
                Log out
              </button>
            </form>
          </div>
        </div>
      )
    }
  } else {
    return (
      <div>
        <p>Loading...</p>
      </div>
    )
  }
}

export default Profile
