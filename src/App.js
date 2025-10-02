import React, { useState, useEffect } from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import tmdbApi from "./api/tmdb";
import HomePage from "./pages/HomePage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DetailPage from "./pages/DetailPage";
import FavoritesPage from "./pages/FavoritesPage";
import WatchlistPage from "./pages/WatchListPage";
import FilterSidebar from "./components/FilterSidebar";
import ProfilePage from "./pages/ProfilePage";
import PublicProfilePage from "./pages/PublicProfilePage";
import UserList from "./components/UserList";
import ActivityFeedPage from "./pages/ActivityFeedPage";
import NotificationsPage from "./pages/NotificationsPage";
import CreateListPage from "./pages/CreateListPage";
import UserListsPage from "./pages/UserListsPage";
import ListPage from "./pages/ListPage";
import DiscoverUsersPage from "./pages/DiscoverUsersPage";
import ForYouPage from "./pages/ForYouPage";
import PullToRefresh from "./components/PullToRefresh";
import MobileSidebar from "./components/MobileSidebar";
import { useAuth } from "./context/AuthContext";

import "./styles.css";

const AppLayout = () => {
  const { user, logout } = useAuth();
  const [query, setQuery] = useState("");
  const [isFilterSidebarOpen, setFilterSidebarOpen] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [genres, setGenres] = useState([]);
  const [filters, setFilters] = useState({
    sortBy: "popularity.desc",
    genre: "",
    rating: 0,
  });

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await tmdbApi.get("/genre/movie/list");
        setGenres(response.data.genres);
      } catch (err) {
        console.error("Failed to fetch genres:", err);
      }
    };
    fetchGenres();
  }, []);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <>
      <FilterSidebar
        isOpen={isFilterSidebarOpen}
        onClose={() => setFilterSidebarOpen(false)}
        filters={filters}
        onFilterChange={handleFilterChange}
        genres={genres}
      />
      {user && (
        <MobileSidebar
          isOpen={isSidebarOpen}
          onClose={() => setSidebarOpen(false)}
          user={user}
          onLogout={logout}
        />
      )}
      <PullToRefresh>
        <div className="min-h-screen font-sans text-brand-text bg-brand-dark flex flex-col">
          <Header
            onFilterToggle={() => setFilterSidebarOpen(!isFilterSidebarOpen)}
            onSidebarToggle={() => setSidebarOpen(!isSidebarOpen)}
          />
          <main className="flex-grow">
            <Outlet
              context={{
                query,
                setQuery,
                filters,
              }}
            />
          </main>
          <Footer />
        </div>
      </PullToRefresh>
    </>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "register",
        element: <RegisterPage />,
      },
      {
        path: "favorites",
        element: <FavoritesPage />,
      },
      {
        path: "watchlist",
        element: <WatchlistPage />,
      },
      {
        path: "foryou",
        element: <ForYouPage />,
      },
      {
        path: "details/:mediaType/:id",
        element: <DetailPage />,
      },
      {
        path: "profile",
        element: <ProfilePage />,
      },
      {
        path: "profile/:userId",
        element: <PublicProfilePage />,
      },
      {
        path: "profile/following/:userId",
        element: <UserList type="following" />,
      },
      {
        path: "profile/followers/:userId",
        element: <UserList type="followers" />,
      },
      {
        path: "activity-feed",
        element: <ActivityFeedPage />,
      },
      {
        path: "discover-users",
        element: <DiscoverUsersPage />,
      },
      {
        path: "notifications",
        element: <NotificationsPage />,
      },
      {
        path: "create-list",
        element: <CreateListPage />,
      },
      {
        path: "lists/:userId",
        element: <UserListsPage />,
      },
      {
        path: "list/:userId/:listId",
        element: <ListPage />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
