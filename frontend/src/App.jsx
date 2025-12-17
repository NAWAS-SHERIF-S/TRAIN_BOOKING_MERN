import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import SearchTrains from './pages/SearchTrains';
import TrainDetailsPage from './pages/TrainDetailsPage';
import BookingPage from './pages/BookingPage';
import PaymentPage from './pages/PaymentPage';
import PaymentSuccess from './pages/PaymentSuccess';
import BookingHistory from './pages/BookingHistory';
import PNRStatus from './components/PNRStatus';
import ExternalTrainSearch from './components/ExternalTrainSearch';
import AdminDashboard from './pages/admin/Dashboard';
import ManageTrains from './pages/admin/ManageTrains';
import AddEditTrain from './pages/admin/AddEditTrain';
import ManageLiveStatus from './pages/admin/ManageLiveStatus';
import ViewBookings from './pages/admin/ViewBookings';
import Loader from './components/common/Loader';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loader fullScreen />;
  }

  return isAuthenticated() ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { isAdmin, loading } = useAuth();

  if (loading) {
    return <Loader fullScreen />;
  }

  return isAdmin() ? children : <Navigate to="/" />;
};

function AppContent() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/search" element={<SearchTrains />} />
          <Route path="/train/:id" element={<TrainDetailsPage />} />
          <Route path="/pnr-status" element={<PNRStatus />} />
          <Route path="/external-search" element={<ExternalTrainSearch />} />

          <Route
            path="/book/:trainId"
            element={
              <ProtectedRoute>
                <BookingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment"
            element={
              <ProtectedRoute>
                <PaymentPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment-success"
            element={
              <ProtectedRoute>
                <PaymentSuccess />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bookings"
            element={
              <ProtectedRoute>
                <BookingHistory />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/trains"
            element={
              <AdminRoute>
                <ManageTrains />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/trains/add"
            element={
              <AdminRoute>
                <AddEditTrain />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/trains/edit/:id"
            element={
              <AdminRoute>
                <AddEditTrain />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/live-status"
            element={
              <AdminRoute>
                <ManageLiveStatus />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/bookings"
            element={
              <AdminRoute>
                <ViewBookings />
              </AdminRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
