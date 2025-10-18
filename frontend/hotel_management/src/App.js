import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './publicPage/Home';
import RoomTypeManagement from './manager/RoomTypeManagement';
// import Rooms from './publicPage/Rooms';
function App() {
  return (
    <div className="App">
      <Header />
<RoomTypeManagement />
      {/* <Rooms /> */}
      <Footer />
      {/* <header className="App-header">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"/>
        <Login/>
      </header> */}
      
    </div>
  );
}

export default App;
