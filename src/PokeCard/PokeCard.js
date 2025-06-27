import { useState } from 'react';
import { Card, Button, Tooltip, Skeleton } from 'antd';
import { DeleteFilled } from '@ant-design/icons';
import './PokeCard.css';

const PokeCard = ({ card, isInDisplaySection, onDelete }) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  return (
    <>
      <div className='poke-card-container'>
        {isInDisplaySection && isImageLoaded && (
          <Tooltip title='Remove card'>
            <Button 
              danger
              type="text"
              size="small"
              shape="circle"
              icon={<DeleteFilled style={{ fontSize: 14 }} />}
              onClick={() => onDelete?.(card)}
              className='poke-card-delete-button'
            />
          </Tooltip>
        )}

        {!isImageLoaded && (
          <Skeleton.Node 
            active 
            style={{
              height: '100%',
              aspectRatio: '0.75'
            }}
          />
        )}

        <Card
          hoverable
          variant='borderless'
          className='poke-card'
          cover={
            <img 
              alt={card.name} 
              src={`${card.image}/low.webp`} 
              onLoad={() => setIsImageLoaded(true)}
              onError={() => setIsImageLoaded(false)}
              style={{
                display: isImageLoaded ? 'block' : 'none',
              }} 
            />
          }
        />
      </div>
    </>
  );
};

export default PokeCard;
