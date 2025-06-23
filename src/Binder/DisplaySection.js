import BinderPage from "./BinderPage";

const DisplaySection = ({ slots, onDelete }) => {
  return (
    <BinderPage slots={slots} onDelete={onDelete} />
  )
}

export default DisplaySection;