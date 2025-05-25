import { NavLink } from "react-router-dom";
import { IoIosArrowRoundBack } from "react-icons/io";

export default function Navbar() {
  const linkStyle = {
    fontSize: "14px",
    fontWeight: "600",
    padding: "8px 16px",
    borderRadius: "9999px", // pill shape
    transition: "all 0.3s ease",
    border: "1px solid",
    textDecoration: "none",
    display: "inline-block",
  };

  return (
    <nav
      style={{
        background: "linear-gradient(to right, #f0f8ff, #ffffff, #f3e8ff)",
        borderBottom: "1px solid #ccc",
        boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "16px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {" "}
        <NavLink
          to="/admin"
          // style={({ isActive }) => ({
          //   ...linkStyle,
          //   // color: isActive ? "#fff" : "#dc2626",
          //   // backgroundColor: isActive ? "#dc2626" : "#fff",
          //   // borderColor: "#dc2626",
          //   // boxShadow: isActive ? "0 0 0 3px rgba(220, 38, 38, 0.3)" : "none",
          // })}
        >
          <IoIosArrowRoundBack />
        </NavLink>
        <div style={{ fontSize: "20px", fontWeight: "700", color: "#1d4ed8" }}>
          Admin Dashboard
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <NavLink
            to="/admin/items"
            style={({ isActive }) => ({
              ...linkStyle,
              color: isActive ? "#fff" : "#2563eb",
              backgroundColor: isActive ? "#2563eb" : "#fff",
              borderColor: "#2563eb",
              boxShadow: isActive ? "0 0 0 3px rgba(37, 99, 235, 0.3)" : "none",
            })}
          >
            ➕ Add Items
          </NavLink>
          <NavLink
            to="/admin/items/deleteItems"
            style={({ isActive }) => ({
              ...linkStyle,
              color: isActive ? "#fff" : "#dc2626",
              backgroundColor: isActive ? "#dc2626" : "#fff",
              borderColor: "#dc2626",
              boxShadow: isActive ? "0 0 0 3px rgba(220, 38, 38, 0.3)" : "none",
            })}
          >
            Manage Items
          </NavLink>
        </div>
      </div>
    </nav>
  );
}
