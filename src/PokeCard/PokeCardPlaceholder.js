import { Card } from 'antd';

import './PokeCard.css';

const PokeCardPlaceholder = ({ isOver }) => {
  return (
    <>
      <Card
        variant='borderless'
        className={`poke-card-placeholder ${isOver ? 'over' : ''}`}
        cover={<img 
          src="https://assets.tcgdex.net/en/sv/sv09/135/low.png" 
          style={{ visibility: 'hidden' }}
          alt={"Placeholder"} 
        />}
      />
    </>
  );
}

export default PokeCardPlaceholder;