import { UserProfileAndFeatureFlagLoadingContextProvider } from "./UserProfileAndFeatureFlagLoadingContext";
import Layout from "./Layout";

function App() {
  return (
    <UserProfileAndFeatureFlagLoadingContextProvider>
      <Layout />
    </UserProfileAndFeatureFlagLoadingContextProvider>
  );
}

export default App;
