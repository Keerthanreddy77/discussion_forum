import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Routes, Route} from 'react-router-dom';
import Signin from "./Signin"
import Register from "./Register"
import CreateItem from "./CreateItem"
import Forums from './Forums'
import CreateForum from './Createforum';
import Profile from './Profile';

import ForumDiscussion from './ForumDiscussion';
function App() {
  return (
    <div className="App">
      
    <Routes>
      <Route exact path='/' element={<Signin/>}></Route>
      <Route exact path='/register' element={<Register/>}></Route>
      <Route exact path='/createprofile' element={<CreateItem/>}></Route>
      <Route exact path='/forums' element={<Forums/>}></Route>
      <Route exact path='/profile' element={<Profile/>}></Route>
      <Route path='/forums/posts' element={<ForumDiscussion/>}></Route>
      <Route exact path='/createforum' element={<CreateForum/>}></Route>
    </Routes>
    </div>
  );
}

export default App;
