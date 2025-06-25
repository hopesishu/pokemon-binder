import { useDroppable, useDraggable } from '@dnd-kit/core';
import PokeCard from '../PokeCard/PokeCard';
import PokeCardPlaceholder from '../PokeCard/PokeCardPlaceholder';

const DropSlot = ({ id, card, onDelete, hideCard = false }) => {
  const { setNodeRef: dropRef, isOver } = useDroppable({ id });

  const {
    attributes,
    listeners,
    transform,
    setNodeRef: dragRef,
  } = useDraggable({ id, data: { card } });

  const style = {
    transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined,
    transition: 'opacity 0.2s',
    opacity: hideCard ? 0 : 1,
    cursor: card ? 'grab' : 'default',
  };

  return (
    <div ref={dropRef}>
      {card 
        ? (<div style={style} ref={dragRef} {...listeners} {...attributes}>
            <PokeCard card={card} isDisplay onDelete={onDelete} />
          </div>) 
        : <PokeCardPlaceholder isOver={isOver}/>}
    </div>
  );
};

export default DropSlot;
