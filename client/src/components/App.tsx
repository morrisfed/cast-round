import { UserProfileContextProvider } from "./UserProfileContext";
import Layout from "./Layout";

function App() {
  return (
    <UserProfileContextProvider>
      <Layout />
    </UserProfileContextProvider>
  );
}

export default App;
