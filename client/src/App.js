
import './App.css';
import Employe from './components/Employe';
import { Provider } from 'react-redux';
import Store from './redux/Store';
function App() {
  return (
    <div className="App">
      <Provider store={Store}>
     <Employe/>
     </Provider>
    </div>
  );
}

export default App;
