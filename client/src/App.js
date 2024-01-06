import Home from "./pages/home/Home";
import Single from "./pages/single/Single";
import TopBar from "./components/topbar/TopBar";
import Write from "./pages/write/Write";
import Settings from "./pages/settings/Settings";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useContext } from "react";
import { Context } from "./context/Context";
import { ToastContainer } from "react-toastify";

function App() {
  const { user } = useContext(Context);
  return (
    <>
      <Router>
        <TopBar />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/register" element={user ? <Home /> : <Register />} />
          <Route path="/login" element={user ? <Home /> : <Login />} />
          <Route path="/write" element={user ? <Write /> : <Register />} />
          <Route
            path="/:username"
            element={user ? <Settings /> : <Register />}
          />
          <Route
            path="/:username/published"
            element={<Settings blognum={0} />}
          />
          <Route
            path="/:username/drafts"
            element={<Settings blognum={1} />}
          />
          <Route path="/post/:postId" element={<Single />} />
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss={false}
          draggable
          pauseOnHover={false}
          theme="light"
        />
      </Router>
    </>
  );
}

export default App;
