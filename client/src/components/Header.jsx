import React from "react";
import logo from "../assets/logo.png";
import Search from "./Search";
import { Link, useLocation } from "react-router-dom";
import { FaRegCircleUser } from "react-icons/fa6";
import useMobile from "../hooks/useMobile";

const Header = () => {
  const isMobile = useMobile(); // ✅ Detects if screen width < 768px
  const location = useLocation(); // ✅ Gets the current route

  const isSearchPage = location.pathname === "/search"; // ✅ Checks if the current page is '/search'

  return (
    <header className="h-24 lg:h-20 lg:shadow-md sticky top-0  flex flex-col justify-center gap-1">
      
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
          <div>
            <button className="text-neutral-500 lg:hidden">
              <FaRegCircleUser size={26} />
            </button>
            <div className="hidden lg:block">Login & My Cart</div>
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
