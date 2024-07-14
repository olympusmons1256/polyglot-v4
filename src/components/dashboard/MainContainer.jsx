import { useNavigate } from "react-router-dom";
import LeftMenu from "../LeftMenu";

export default function MainContainer() {
  const navigate = useNavigate();

  return (
    <div>
      <LeftMenu />
      {/* Add your main content here */}
    </div>
  );
}