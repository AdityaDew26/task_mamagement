import React from 'react'
import "./App.css"
import {Routes, Route} from "react-router-dom"
import Signup from './components/Auth/Signup/Signup'
import Login from './components/Auth/Login/Login'
import AdminDashboard from './pages/admin/Admin'
import ManagerDashboard from './pages/manager/Manager'
import EditorDashboard from './pages/editor/Editor'
import ViewerDashboard from './pages/viewer/Viewer'
import TaskManager from './components/tasks/Task'
import ErrorBoundary from './ErrorBoundary';
import TeamManager from './components/teams/Team'



const App = () => {
  return (
    <div>
     <Routes>
      <Route path='/' element={<Signup/>}/>
      <Route path='/login' element={<Login/>}/>
       <Route path='/admin/dashboard' element={<AdminDashboard/>}/>
       <Route path='/manager/dashboard' element={<ManagerDashboard/>}/>
        <Route path='/editor/dashboard' element={<EditorDashboard/>}/>
        <Route path='/viewer/dashboard' element={<ViewerDashboard/>}/>
        <Route path='/tasks' element={ <ErrorBoundary>
      <TaskManager />
    </ErrorBoundary>}/>
    <Route path='/teams' element={<TeamManager/>}/>
        

     </Routes>
    </div>
  )
}

export default App
