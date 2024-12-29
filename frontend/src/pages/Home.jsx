import React, { useState, useEffect } from "react";
import Navbar from "../components/NavBar";
import Carsoule from "../components/Carsoule";
import Meet from "../components/Meet";
import Footer from "../components/Footer";
import API from "../api/api";
import Cookies from "js-cookie";
import TherpistHome from "../components/TherpistHome";
import UserHome from "../components/UserHome";
import ShowBlogs from "../components/ShowBlogs";
import { ToastContainer } from "react-toastify";
import Loading from "../components/Loading";

const Home = () => {
  const [user, setUser] = useState("");
  const [avatar, setAvatar] = useState("");
  const [role, setRole] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const userEmail = Cookies.get("email");
    const userRole = Cookies.get("role");

    if (userEmail && userRole) {
      setRole(userRole);
      setIsLoggedIn(true);

      const fetchUserDetails = async () => {
        try {
          const response =
            userRole === "USER"
              ? await API.get(`/user/${userEmail}`)
              : await API.get(`/therapist/${userEmail}`);

          if (response.status === 200) {
            setUser(response.data.name);
            setAvatar(response.data.profilePicture || "");
          }
        } catch (error) {
          console.error("Error fetching user details:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchUserDetails();
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await API.get("/user/blogs");
        setBlogs(response.data);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };

    fetchBlogs();
  }, []);

  let content;
  if (role === "USER") {
    content = (
      <>
        <UserHome />
        <Carsoule />
        <div className="mt-[450px]">
          <h1 className="pt-5 text-6xl text-[#001A35] font-bold drop-shadow text-center mb-6">
            Stories of Hope
          </h1>
          <div className="w-[80%]  m-auto my-[45px]">
            <p className=" text-[18px] text-center text-gray-600">
              Sharing is caring! Encourage and inspire others with your stories.
              Your experiences can give them the courage to face their fears,
              overcome their struggles, and come out stronger.
            </p>
          </div>
          <ShowBlogs blogs={blogs} setBlogs={setBlogs} />
        </div>
        <Meet />
      </>
    );
  } else if (role === "THERAPIST") {
    content = <TherpistHome />;
  } else {
    content = (
      <>
        <UserHome />
        <Carsoule />
        <div className="mt-[450px]">
          <h1 className="pt-5 text-6xl text-[#001A35] font-bold drop-shadow text-center mb-6">
            Stories of Hope
          </h1>
          <div className="w-[80%]  m-auto my-[45px]">
            <p className=" text-[18px] text-center text-gray-600">
              Sharing is caring! Encourage and inspire others with your stories.
              Your experiences can give them the courage to face their fears,
              overcome their struggles, and come out stronger.
            </p>
          </div>
          <ShowBlogs blogs={blogs} setBlogs={setBlogs} />
        </div>
        <Meet />
      </>
    );
  }

  return (
    <div className="bg-white">
      <Navbar
        isLoggedIn={isLoggedIn}
        userName={user}
        avatar={avatar}
        role={role}
      />
      {loading ? (
        <Loading />
      ) : (
        <>
          <ToastContainer />
          {content}
          <Footer />
        </>
      )}
    </div>
  );
};

export default Home;
