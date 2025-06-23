import { useState } from 'react';
import { Card, Button } from 'antd';
import { DeleteFilled } from '@ant-design/icons';

import './PokeCard.css';

const PokeCard = ({ card, isDisplay, onDelete }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {isDisplay && hovered && (
        <Button 
          danger
          size="medium"
          shape="circle"
          icon={<DeleteFilled/>}
          onClick={() => onDelete?.(card)} 
          className='poke-card-delete-button'
        />
      )}      
      <Card
        hoverable
        variant='borderless'
        cover={<img 
          alt={card.name} 
          src={`${card.image}/low.png`} 
        />}
        className='poke-card'
      /> 
    </div>
  );
}

export default PokeCard;