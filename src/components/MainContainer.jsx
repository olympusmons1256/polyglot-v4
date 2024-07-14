import { useNavigate } from "react-router-dom";
import LeftMenu from "./LeftMenu";
import "../styles/MainContainer.css"; // Import the CSS file from the styles folder

export default function MainContainer() {
  const navigate = useNavigate();

  return (
    <div>
      <LeftMenu />
      {/* Add your main content here */}
    </div>
  );
}