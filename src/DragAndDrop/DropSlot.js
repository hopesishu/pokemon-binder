import { useDroppable, useDraggable } from '@dnd-kit/core';
import PokeCard from '../PokeCard/PokeCard';
import PokeCardPlaceholder from '../PokeCard/PokeCardPlaceholder';

const DropSlot = ({ id, card }) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div ref={setNodeRef}>
      {card ? <PokeCard card={card}/> : <PokeCardPlaceholder isOver={isOver}/>}
    </div>
  );
};


export default DropSlot;
