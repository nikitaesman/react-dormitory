import React from "react";
import './styles/style.css'
import Navigation from "./components/Navigation/Navigation";
import {BrowserRouter as Router} from 'react-router-dom'
import AppRoutes from "./components/AppRoutes";
import {useAuth} from "./hooks/useAuth";
import {useEffect} from "react";
import {useSelector} from "react-redux";
import Loader from "./components/UI/Loader/Loader";
import MessagesList from "./components/MessagesList";


function App() {
    const {checkAuthenticate} = useAuth()
    const user = useSelector(state => state.user)
    const messages = useSelector(state => state.messages.messages)

    useEffect(() => {
        checkAuthenticate()
    }, [])

    if (user.ready === false) {
        return (
            <Loader/>
        )
    }

    return (
    <div className="App">
        <MessagesList
            mesArray={messages}
        />
        <Router>
            <Navigation pageName="Управление"/>
            <AppRoutes/>
        </Router>
    </div>
    );
}

export default App;
