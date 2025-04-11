import React from "react";
import logo from "../assets/logo.png";
import Search from "./Search";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaRegCircleUser } from "react-icons/fa6";
import useMobile from "../hooks/useMobile";
import { IoCartOutline } from "react-icons/io5";
import { useSelector } from 'react-redux'
import { GoTriangleDown, GoTriangleUp  } from "react-icons/go";


const Header = () => {
  const isMobile = useMobile(); // ✅ Detects if screen width < 768px
  const location = useLocation(); // ✅ Gets the current route
  const navigate = useNavigate()
  const user = useSelector((state) => state?.user)
  console.log('user from store', user)

  const redirectToLoginPage = () => {
    navigate("/login")
  }

  const isSearchPage = location.pathname === "/search"; // ✅ Checks if the current page is '/search'

  return (
    <header className="h-24 lg:h-20 lg:shadow-md sticky top-0  flex flex-col justify-center gap-1 bg-white">
      
      {/* Hide Header when on Search Page (Mobile Only) */}
      {!(isSearchPage && isMobile) && (
        <div className="container mx-auto flex items-center px-2 justify-between">
          
          {/* Logo */}
          <div className="h-full">
            <Link to={"/"} className="h-full flex justify-center items-center">
              <img
                src={logo}
                width={170}
                height={60}
                alt="logo"
                className="hidden lg:block" // ✅ Larger logo for desktop
              />
              <img
                src={logo}
                width={120}
                height={60}
                alt="logo"
                className="lg:hidden" // ✅ Smaller logo for mobile
              />
            </Link>
          </div>

          {/* Search Bar (Only on Desktop) */}
          <div className="hidden lg:block">
            <Search />
          </div>

          {/* Login and Cart Button */}
          <div className="">
            {/* User icons display in only mobile version */}

            <button className="text-neutral-500 lg:hidden">
              <FaRegCircleUser size={26} />
            </button>


            {/* Desktop  */}
            <div className="hidden lg:flex items-center gap-10">

              {
                user?._id ? (
                  <div>
                    <div className="flex items-center gap-2">
                      <p>Account</p>
                      <GoTriangleDown/>
                      {/* <GoTriangleUp/> */}
                    </div>
                  </div>
                ) : (
                  <button onClick={redirectToLoginPage} className="text-lg px-2">Login</button>
                )
              }
              
              <button className="flex items-center gap-2 bg-green-700 hover:bg-green-800 px-3 py-2 rounded text-white">
                {/* add to cart item */}
                <div className="animate-bounce">
                <IoCartOutline size={26}/>
                </div>
                <div className="font-semibold">
                  <p>My Cart</p>
                </div>
              </button>
            </div>
          </div>

        </div>
      )}

      {/* Mobile Search Bar (Always Visible) */}
      <div className="container mx-auto px-2 lg:hidden">
        <Search />
      </div>

    </header>
  );
};

export default Header;
