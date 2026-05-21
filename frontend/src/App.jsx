import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { useEffect } from 'react';
import { store } from './app/store';
import { checkAuth } from './features/auth/authSlice';
import Layout from './components/Layout/Layout';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import BookingForm from './features/bookings/BookingForm';
import BookingList from './features/bookings/BookingList';
import AdminPanel from './features/admin/AdminPanel';

function AppContent() {
  const dispatch = store.dispatch;

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/bookings" element={<PrivateRoute><BookingForm /></PrivateRoute>} />
          <Route path="/dashboard" element={<PrivateRoute><BookingList /></PrivateRoute>} />
          <Route path="/admin" element={<PrivateRoute adminOnly><AdminPanel /></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}