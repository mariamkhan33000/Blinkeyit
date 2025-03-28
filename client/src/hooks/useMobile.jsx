import { useState, useEffect } from "react"

// 🔹 Custom Hook that detects if the window width is below a certain breakpoint
const useMobile = (breakpoint = 768) => {
    // ✅ Step 1: Define state to track if it's mobile or not
    const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoint)

    // ✅ Step 2: Function to check screen width
    const handleResize = () => {
        const checkpoint = window.innerWidth < breakpoint
        setIsMobile(checkpoint)
    }

    // ✅ Step 3: Run handleResize when the component mounts & listen for window resize events
    useEffect(() => {
      handleResize()  // Set initial value

      window.addEventListener('resize', handleResize) // Listen for changes
      return () => {
        window.removeEventListener('resize', handleResize) // Cleanup listener on unmount
      }
    }, []) // Runs only on mount & unmount

    // ✅ Step 4: Return the isMobile state
    return [isMobile]
}

export default useMobile;
