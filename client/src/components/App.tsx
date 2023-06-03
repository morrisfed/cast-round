import { UserProfileLoadingContextProvider } from "./UserProfileLoadingContext";
import Layout from "./Layout";

function App() {
  return (
    <UserProfileLoadingContextProvider>
      <Layout />
    </UserProfileLoadingContextProvider>
  );
}

export default App;
