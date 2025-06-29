import BinderPage from "./BinderPage";

const DisplaySection = ({ activeCard, slots, nextEmptySlotIndex, onDelete }) => {
  return (
    <BinderPage 
      activeCard={activeCard} 
      slots={slots} 
      nextEmptySlotIndex={nextEmptySlotIndex}
      onDelete={onDelete} 
    />
  )
}

export default DisplaySection;