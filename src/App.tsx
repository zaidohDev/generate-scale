import React from "react"
import Header from "./components/Header"
import ScheduleGroup from "./components/ScheduleGroup ";


const App: React.FC = () => {
  // This is a simple React component that renders a heading
  // It uses Tailwind CSS for styling
  // The heading says "Hello Vite + React!" and has a primary color
  // The component is wrapped in a div with padding
  // The heading is styled with a font size of 3xl and a bold font weight
  // The primary color is defined in the CSS variables

  return (
    <div className="min-h-screen bg-[color:var(--color-bg)] text-[color:var(--color-text)] p-6">
      <Header />
      <ScheduleGroup />
    </div>


  )
}

export default App
