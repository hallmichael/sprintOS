import { LuLoader } from "react-icons/lu";
import "./Loader.scss";

const Loader = ({ loading = false, className }) => {
  if (!loading) return null;

  return (
    <div className={`loader-container ${className}`}>
      <LuLoader className="spinner" />
    </div>
  );
};

export default Loader;
