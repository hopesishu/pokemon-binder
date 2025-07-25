import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import PokeCard from '../PokeCard/PokeCard';

const DraggableCard = ({ card, onFavourite, favouritedCards, onCardClick }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: card.id,
    data: { card },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    cursor: 'grab'
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <PokeCard card={card} onFavourite={onFavourite} favouritedCards={favouritedCards} onCardClick={onCardClick} />
    </div>
  );
};

export default DraggableCard;