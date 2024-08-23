// IMPORTS
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import ReactQueryProvider from './utils/ReactQueryProvider';


// PAGES
import ProtectedRoute from './ProtectedRoute';
import AuthLayout from './_auth/AuthLayout';
import LoginForm from './_auth/forms/LoginForm';
import SignupForm from './_auth/forms/SignupForm';
import HomeLayout from './_root/HomeLayout';
import Home from './_root/_pages/Home';



// COMPONENTS
// import Navbar from './_root/components/Navbar';
// import Footer from './_root/components/Footer';
// import Post from './_root/pages/Post';
// import CreatePost from './components/CreatePost';
// import DispFriends from './components/DispFriends';
// import Sidebar from './components/Sidebar';





function App() {

  return (
    <>
      <BrowserRouter>
        {/* PRIVATE ROUTES */}
        <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={< HomeLayout />}>
            <Route path='home' element={< Home />} />
          </Route>
        </Route>
        {/* PUBLIC ROUTES */}
        <Route element={< AuthLayout />}>
          <Route path="/login" element={< LoginForm />} />
          <Route path="/signup" element={< SignupForm />} />
        </Route>
      </Routes>
    </BrowserRouter >
    </>
  )
}

export default App
