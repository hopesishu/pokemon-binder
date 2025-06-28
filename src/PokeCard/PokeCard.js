import { useState } from 'react';
import { Card, Button, Tooltip, Skeleton } from 'antd';
import { DeleteFilled, HeartFilled, HeartOutlined } from '@ant-design/icons';
import './PokeCard.css';

const PokeCard = ({ card, isInDisplaySection, onDelete, onFavourite, favouritedCards }) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const isFavourited = (favouritedCards ?? []).some(favCard => favCard.id === card.id);

  return (
    <>
      <div className='poke-card-container'>
        {isInDisplaySection && isImageLoaded && (
          <Tooltip title='Remove card'>
            <Button 
              color="danger"
              variant="filled"
              type="text"
              size="small"
              shape="circle"
              icon={<DeleteFilled style={{ fontSize: 14 }} />}
              onClick={() => onDelete?.(card)}
              className='poke-card-delete-button'
            />
          </Tooltip>
        )}

        {!isInDisplaySection && isImageLoaded && (
          <Tooltip 
            title={isFavourited ? 'Remove Favourite' : 'Add to Favourites'}
            key={isFavourited ? 'favourited' : 'not-favourited'}
          >
            <Button 
              color="pink"
              variant="filled"
              type="text"
              size="small"
              shape="circle"
              icon={isFavourited ? <HeartFilled style={{ fontSize: 14 }} /> : <HeartOutlined style={{ fontSize: 14 }} />}
              onClick={() => onFavourite?.(card)}
              className={isFavourited ? 'poke-card-favourited-button' : 'poke-card-favourite-button'}
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
