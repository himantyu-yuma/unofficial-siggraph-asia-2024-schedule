import { useEffect, useState } from "react"
import type { Session } from "../../types/session"

type Props = {
  sessions: Session[]
  // お気に入りしているセッション（タイトル）のリスト
  favoriteSessionTitles?: string[]
  onSessionClick: (session: Session) => void
}

const tagTable: Record<string, { name: string; color: string }> = {
  "People with a Enhanced Access can attend": {
    name: "EA",
    color: "rgb(0, 113, 255)",
  },
  "People with a Exhibit & Experience Access can attend": {
    name: "EX",
    color: "#009688",
  },
  "People with an Experience Hall Exhibitor Pass can attend": {
    name: "EH",
    color: "#F44336",
  },
  "People with a Full Access Registration Can Attend": {
    name: "FA",
    color: "#FF9800",
  },
  "People with a Full Access Supporter can attend": {
    name: "FS",
    color: "rgb(255 87 223)",
  },
  "People with a Trade Exhibitor Pass can attend": {
    name: "TE",
    color: "#F44336",
  },
  "This Session will be held in English Language": { name: "en", color: "" },
  "This Session will be held in Japanese Language": { name: "ja", color: "" },
  "No Photo Taking Allowed at this Session": { name: "No Photo", color: "" },
  "This Session will have Simultaneous Translation from English to Japanese": {
    name: "en to ja",
    color: "",
  },
  "This Session will have Simultaneous Translation from Japanese to English": {
    name: "ja to en",
    color: "",
  },
  "This Session will have AI Translation in Multi-Language": {
    name: "AI Translation",
    color: "",
  },
}

export const TimetablePage = ({
  sessions,
  favoriteSessionTitles,
  onSessionClick,
}: Props) => {
  const handleSessionClick = (session: Session) => {
    onSessionClick(session)
  }

  const generateTimeSlots = () => {
    const slots = []
    for (let hour = 8; hour < 20; hour++) {
      slots.push(new Date(2024, 11, 2, hour, 0).toISOString())
      slots.push(new Date(2024, 11, 2, hour, 30).toISOString())
    }
    return slots
  }
  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString("ja-JP", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Asia/Tokyo",
    })
  }

  const { timeSlots, locations, events } = (() => {
    const allTimeSlots = generateTimeSlots()
    const allLocations = Array.from(
      new Set(sessions.map((event) => event.location)),
    )

    const processedEvents = sessions.map((event) => {
      const startTime = new Date(event.startTime)
      const endTime = new Date(event.endTime)
      const durationHours =
        (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60)

      return {
        ...event,
        startHour: startTime.getHours(),
        startMinute: startTime.getMinutes(),
        duration: durationHours,
      }
    })

    return {
      timeSlots: allTimeSlots,
      locations: allLocations,
      events: processedEvents,
    }
  })()

  const getEventAtSlot = (timeSlot: string, location: string) => {
    const slotTime = new Date(timeSlot)
    return events.find(
      (event) =>
        event.location === location &&
        event.startHour === slotTime.getHours() &&
        event.startMinute === slotTime.getMinutes(),
    )
  }

  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000) // 1分ごとに更新

    return () => clearInterval(interval)
  }, [])

  const getCurrentTimePosition = () => {
    const hours = currentTime.getHours()
    // 20時~8時の間は表示しない
    if (hours >= 20 || hours < 8) return 0
    const minutes = currentTime.getMinutes()
    return 13 + (hours - 8 + minutes / 60) * 7.0625 * 2
  }

  return (
    <div
      style={{
        position: "relative",
        maxWidth: "100%",
        overflowX: "auto",
        height: "calc(100vh - 100px)",
      }}
    >
      <div
        style={{
          position: "sticky",
          left: "0",
          right: "0",
          top: `${getCurrentTimePosition()}rem`,
          height: "2px",
          backgroundColor: "rgb(239, 68, 68)",
          zIndex: 100,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: "-4px",
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            backgroundColor: "rgb(239, 68, 68)",
          }}
        />
      </div>
      <table style={{ minWidth: "100%", borderCollapse: "collapse" }}>
        <thead
          style={{
            position: "sticky",
            zIndex: 50,
            top: 0,
          }}
        >
          <tr style={{ backgroundColor: "rgb(243, 244, 246)", height: "9rem" }}>
            <th
              style={{
                padding: "0.5rem",
                border: "1px solid #e5e7eb",
                minWidth: "200px",
              }}
            >
              Time
            </th>
            {locations.map((location) => (
              <th
                key={location}
                style={{
                  padding: "0.5rem",
                  border: "1px solid #e5e7eb",
                  minWidth: "200px",
                }}
              >
                {location}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {timeSlots.map((timeSlot, index) => (
            <tr
              key={timeSlot}
              style={{
                backgroundColor:
                  index % 2 === 0 ? "#ffffff" : "rgb(249, 250, 251)",
              }}
            >
              <th
                style={{
                  position: "sticky",
                  left: 0,
                  zIndex: 50 - 1,
                  padding: "0.5rem",
                  border: "1px solid #e5e7eb",
                  fontWeight: "500",
                  backgroundColor:
                    index % 2 === 0 ? "#ffffff" : "rgb(249, 250, 251)",
                }}
              >
                {formatTime(timeSlot)}
              </th>
              {locations.map((location) => {
                const event = getEventAtSlot(timeSlot, location)
                return (
                  <td
                    key={`${timeSlot}-${location}`}
                    style={{
                      padding: "0.5rem",
                      border: "1px solid #e5e7eb",
                      position: "relative",
                      height: "6rem",
                    }}
                  >
                    {event && (
                      <button
                        type="button"
                        style={{
                          // reset button style
                          border: "none",
                          background: "none",
                          padding: 0,
                          font: "inherit",
                          cursor: "pointer",
                          outline: "inherit",
                        }}
                        onClick={() => handleSessionClick(event)}
                      >
                        <div
                          style={{
                            position: "absolute",
                            left: "4px",
                            right: "4px",
                            top: "0",
                            // height: `${event.duration * 12 + event.duration * 2 - 1}rem`,
                            height: `${event.duration * 7.0625 * 2 - 1}rem`,
                            minHeight: "2.5rem",
                            backgroundColor: favoriteSessionTitles?.includes(
                              event.title,
                            )
                              ? "rgb(255, 199, 199)"
                              : "rgb(219, 234, 254)",
                            borderRadius: "0.25rem",
                            padding: "0.5rem",
                            boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                            border: "1px solid rgb(191, 219, 254)",
                            overflow: "visible",
                            zIndex: 10,
                          }}
                        >
                          <div
                            style={{
                              fontWeight: "500",
                              color: "rgb(30, 64, 175)",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            <span
                              style={{ display: "block", fontSize: "0.75rem" }}
                            >
                              {formatTime(event.startTime)} -{" "}
                              {formatTime(event.endTime)}
                            </span>
                            {event.title}
                            {event.duration <= 0.5 && (
                              <span
                                style={{
                                  marginLeft: "0.5rem",
                                  fontSize: "0.75rem",
                                  backgroundColor: "rgb(254, 240, 138)",
                                  color: "rgb(161, 98, 7)",
                                  padding: "0 0.25rem",
                                  borderRadius: "0.25rem",
                                }}
                              >
                                30min
                              </span>
                            )}
                          </div>
                          <div
                            style={{
                              fontSize: "0.875rem",
                              color: "rgb(37, 99, 235)",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {event.type}
                          </div>
                          {event.speakers && (
                            <div
                              style={{
                                fontSize: "0.75rem",
                                color: "rgb(29, 78, 216)",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {event.speakers}
                            </div>
                          )}
                          {event.tags && event.tags.length > 0 && (
                            <div
                              style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: "0.25rem",
                                marginTop: "0.25rem",
                              }}
                            >
                              {event.tags.map((tag, i) => (
                                <span
                                  // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                                  key={i}
                                  style={{
                                    fontSize: "0.75rem",
                                    backgroundColor:
                                      tagTable[tag]?.color || "rgb(90, 90, 90)",
                                    // color: "rgb(30, 64, 175)",
                                    color: "#fff",
                                    padding: "0.25rem 0.5rem",
                                    borderRadius: "0.25rem",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                  }}
                                >
                                  {tagTable[tag]?.name || tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </button>
                    )}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
