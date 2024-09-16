import './App.css'
import {Layout} from "./components/Layout.tsx";
import {AuthProvider} from "./components/auth/AuthProvider.tsx";

function App() {
    return (
        <AuthProvider>
            <Layout/>
        </AuthProvider>
    )
}

export default App;
