import { LuLayoutGrid, LuList, LuCheck } from "react-icons/lu";
import { useDetectOutsideClick } from "../../hooks/useDetectOutsideClick";
import { useLayout } from "../../contexts/LayoutContext";
import { useTranslation } from "../../contexts/TranslationProvider";

const LayoutToggler = ({ setShowToggleViewMenu, onLayoutChange }) => {
  const toggleViewRef = useDetectOutsideClick(() => {
    setShowToggleViewMenu(false);
  });
  const { activeLayout, setActiveLayout } = useLayout();
  const t = useTranslation();

  const layoutOptions = [
    {
      key: "grid",
      name: t("grid"),
      icon: <LuLayoutGrid size={14} />,
    },
    {
      key: "list",
      name: t("list"),
      icon: <LuList size={14} />,
    },
  ];

  const handleSelection = (key) => {
    setActiveLayout(key);
    onLayoutChange(key);
    setShowToggleViewMenu(false);
  };

  return (
    <div ref={toggleViewRef.ref} className="toggle-view" role="dropdown">
      <ul role="menu" aria-orientation="vertical">
        {layoutOptions.map((option) => (
          <li
            role="menuitem"
            key={option.key}
            onClick={() => handleSelection(option.key)}
            onKeyDown={() => handleSelection(option.key)}
          >
            <span>{option.key === activeLayout && <LuCheck size={14} />}</span>
            <span>{option.icon}</span>
            <span>{option.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LayoutToggler;
