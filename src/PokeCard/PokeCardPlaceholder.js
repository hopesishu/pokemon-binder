import { Card } from 'antd';
import './PokeCard.css';

const PokeCardPlaceholder = ({ isOver }) => {
  return (
    <div className='poke-card-container'>
      <Card
        variant='borderless'
        className={`poke-card-placeholder ${isOver ? 'over' : ''}`}
        cover={<img 
          src="https://assets.tcgdex.net/en/sv/sv09/135/low.png" 
          style={{ visibility: 'hidden' }}
          alt={"Placeholder"} 
        />}
      />
    </div>
  );
}

export default PokeCardPlaceholder;