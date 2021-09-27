import React, { lazy, Suspense } from 'react';
import { Switch, Route } from 'react-router-dom';
import './App.css';
import LoadingPage from './components/LoadingPage/LoadingPage';
const Login = lazy(() => import('./Pages/Auth/Login/Login'));
const Signup = lazy(() => import('./Pages/Auth/Signup/Signup'));
const AuthProvider = lazy(() => import('./AuthProvider'));
const Dashboard = lazy(() => import('./Pages/Dashboard/Dashboard'));
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
        <div className='App'>
          <Switch>
            <Route exact path='/' component={Login} />
            <Route path='/login' component={Login} />
            <Route path='/signup' component={Signup} />
            <PrivateRoute exact path='/dashboard' component={Dashboard} />
            <PrivateRoute exact path='/:id' component={Chat} />
          </Switch>
        </div>
      </AuthProvider>
    </Suspense>
  );
}

export default App;
