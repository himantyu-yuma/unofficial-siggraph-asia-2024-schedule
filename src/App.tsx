// import "./App.css"
import { TimetablePage } from "./components/page/timetable-page"
import day1 from "./assets/day1.json"
import day2 from "./assets/day2.json"
import day3 from "./assets/day3.json"
import day4 from "./assets/day4.json"
import { Button } from "./components/ui/button"
import { useState } from "react"
import type { Session } from "./types/session"

type Day = "day1" | "day2" | "day3" | "day4"
function App() {
  const [currentDay, setCurrentDay] = useState<Day>("day1")
  const [favoriteSessionTitles, setFavoriteSessionTitles] = useState<string[]>(
    JSON.parse(localStorage.getItem(currentDay) || "[]"),
  )
  const sessionDataTable = {
    day1: day1,
    day2: day2,
    day3: day3,
    day4: day4,
  }

  const handleDayChange = (day: Day) => {
    // セッションデータを切り替え
    switch (day) {
      case "day1":
        setCurrentDay("day1")
        break
      case "day2":
        setCurrentDay("day2")
        break
      case "day3":
        setCurrentDay("day3")
        break
      case "day4":
        setCurrentDay("day4")
        break
    }
    // お気に入りセッションのタイトルをローカルストレージから取得
    setFavoriteSessionTitles(JSON.parse(localStorage.getItem(day) || "[]"))
  }

  const handleSessionClick = (day: string) => (session: Session) => {
    const title = session.title
    const newFavoriteSessionTitles = favoriteSessionTitles.includes(title)
      ? favoriteSessionTitles.filter((t) => t !== title)
      : [...favoriteSessionTitles, title]
    setFavoriteSessionTitles(newFavoriteSessionTitles)
    localStorage.setItem(day, JSON.stringify(newFavoriteSessionTitles))
  }

  return (
    <>
      <div
        style={{
          display: "flex",
          gap: "10px",
          padding: "10px",
        }}
      >
        <Button
          color="primary"
          onClick={() => {
            handleDayChange("day1")
          }}
        >
          Day1
        </Button>
        <Button
          color="primary"
          onClick={() => {
            handleDayChange("day2")
          }}
        >
          Day2
        </Button>
        <Button
          color="primary"
          onClick={() => {
            handleDayChange("day3")
          }}
        >
          Day3
        </Button>
        <Button
          color="primary"
          onClick={() => {
            handleDayChange("day4")
          }}
        >
          Day4
        </Button>
      </div>
      <TimetablePage
        sessions={sessionDataTable[currentDay]}
        favoriteSessionTitles={favoriteSessionTitles}
        onSessionClick={handleSessionClick(currentDay)}
      />
    </>
  )
}

export default App
