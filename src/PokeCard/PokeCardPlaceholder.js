import { Card } from 'antd';
import './PokeCard.css';

const PokeCardPlaceholder = ({ isCardOver, isDropSlotEmpty }) => {
  return (
    <div className='poke-card-container'>
      <Card
        variant='borderless'
        className={`poke-card-placeholder ${isCardOver || isDropSlotEmpty ? 'over' : ''}`}
        cover={<img 
          src="https://assets.tcgdex.net/en/sv/sv09/135/low.webp" 
          style={{ visibility: 'hidden' }}
          alt={"Placeholder"} 
        />}
      />
    </div>
  );
}

export default PokeCardPlaceholder;