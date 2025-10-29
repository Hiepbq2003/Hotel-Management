import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Routers from './router/Routers';
import CheckInPage from "./staffPage/CheckInPage"
import TodayCheckIns from './staffPage/TodayCheckIns';
function App() {
  return (
    <>
      {/* <Routers /> */}
      <CheckInPage />
      <TodayCheckIns />
    </>
  );
}

export default App;
