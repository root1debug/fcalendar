import { HashRouter, Route, Routes, useNavigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '@/renderer/store';
import NotFoundScreen from '@/renderer/screens/NotFoundScreen';
import DashBoard from './screens/dashboard';
import '@/renderer/assets/css/global.css';
import Calendar from './screens/calendar';
import License from './screens/license';

export default function App() {
  return (
    <Provider store={store}>
      <HashRouter>
        <Routes>
          <Route path="/">
            <Route index element={<DashBoard />} />
            <Route path="calendar/:calId" element={<Calendar />} />
            <Route path="license" element={<License />} />
            <Route path="*" element={<NotFoundScreen />} />
          </Route>
        </Routes>
      </HashRouter>
    </Provider>
  );
}
