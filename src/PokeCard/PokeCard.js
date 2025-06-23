import { Card } from 'antd';

import './PokeCard.css';

const PokeCard = ({ card }) => {
  return (
    <>
      <Card
        hoverable
        variant='borderless'
        cover={<img 
          alt={card.name} 
          src={`${card.image}/low.png`} 
        />}
        className='poke-card'
      /> 
    </>
  );
}

export default PokeCard;