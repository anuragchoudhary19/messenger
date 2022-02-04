import React, { lazy, Suspense } from 'react';
import { Switch, Route } from 'react-router-dom';
import './App.css';
import LoadingPage from './components/LoadingPage/LoadingPage';
import { SocketProvider } from './SocketProvider';
const Login = lazy(() => import('./Pages/Auth/Login/Login'));
const Signup = lazy(() => import('./Pages/Auth/Signup/Signup'));
const AuthProvider = lazy(() => import('./AuthProvider'));
const Home = lazy(() => import('./Pages/Home/Home'));
const Chat = lazy(() => import('./Pages/Chat/Chat'));
const PrivateRoute = lazy(() => import('./Routes/PrivateRoute'));

function App() {
  return (
    <Suspense
      fallback={
        <div className='loadingPage'>
          <LoadingPage />
        </div>
      }>
      <AuthProvider>
        <SocketProvider>
          <div className='App'>
            <Switch>
              <Route exact path='/' component={Login} />
              <Route path='/login' component={Login} />
              <Route path='/signup' component={Signup} />
              <PrivateRoute exact path='/home' component={Home} />
              <PrivateRoute exact path='/:userId' component={Chat} />
            </Switch>
          </div>
        </SocketProvider>
      </AuthProvider>
    </Suspense>
  );
}

export default App;
