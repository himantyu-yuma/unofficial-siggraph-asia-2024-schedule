type Props = {
  children: React.ReactNode
  onClick: () => void
  color: "primary" | "secondary"
}

const getColorStyles = (color: "primary" | "secondary") => {
  switch (color) {
    case "primary":
      return {
        backgroundColor: "#007BFF",
        color: "#FFF",
      }
    case "secondary":
      return {
        backgroundColor: "#6C757D",
        color: "#FFF",
      }
    default:
      return {}
  }
}

export const Button = ({ children, onClick, color }: Props) => {
  return (
    <button
      onClick={onClick}
      className="button"
      type={"button"}
      style={{
        padding: "0.75rem 1.25rem",
        border: "none",
        borderRadius: "0.5rem",
        cursor: "pointer",
        ...getColorStyles(color),
      }}
    >
      {children}
    </button>
  )
}
