import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './publicPage/Header'
import Footer from './publicPage/Footer'
import Home from './publicPage/Home'
import Rooms from './publicPage/Rooms';
function App() {
  return (
    <div className="App">
      <Header />
      <Rooms />
      <Footer />
      {/* <header className="App-header">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"/>
        <Login/>
      </header> */}
      
    </div>
  );
}

export default App;
