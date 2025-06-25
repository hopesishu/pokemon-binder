import BinderPage from "./BinderPage";

const DisplaySection = ({ activeCard, slots, onDelete }) => {
  return (
    <BinderPage 
      activeCard={activeCard} 
      slots={slots} 
      onDelete={onDelete} 
    />
  )
}

export default DisplaySection;