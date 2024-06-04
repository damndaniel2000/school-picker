import { useState } from "react"
import Pill from "./components/Pill"

const CATEGORIES = [
  "Schools",
  "Kindertageseinrichtungen",
  "Schulsozialarbeit",
  "Jugendberufshilfe"
]

export default function App() {

  const [categories, setCategories] = useState<string[]>([])

  return (
    <>
      <nav className="w-full bg-blue-500 flex justify-center items-center px-8 py-4">
        <h1>Sexiest Project Ever</h1>
      </nav>
      <div>
        <div className="flex justify-center items-center space-x-6 py-5">
          {CATEGORIES.map(item =>
            <Pill text={item} onClick={(item) => setCategories(prev => [...prev, item])} />
          )}
        </div>

        <div className="h-[calc(100vh-128px)] bg-blue-200">
          Map will come here
        </div>
      </div>
    </>
  )
}