import { LuCheck } from "react-icons/lu";

const SubMenu = ({ subMenuRef, list, position = "right" }) => {
  return (
    <ul ref={subMenuRef} className={`sub-menu ${position}`}>
      {list?.map((item) => (
        <li key={item.title} onClick={item.onClick}>
          <span className="item-selected">{item.selected && <LuCheck size={14} />}</span>
          {item.icon}
          <span>{item.title}</span>
        </li>
      ))}
    </ul>
  );
};

export default SubMenu;
