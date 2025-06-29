import BinderPage from "./BinderPage";

const DisplaySection = ({ activeCard, slots, nextEmptySlotIndex, onDelete, onFavourite, favouritedCards }) => {
  return (
    <BinderPage 
      activeCard={activeCard} 
      slots={slots} 
      nextEmptySlotIndex={nextEmptySlotIndex}
      onDelete={onDelete} 
      onFavourite={onFavourite} 
      favouritedCards={favouritedCards}
    />
  )
}

export default DisplaySection;