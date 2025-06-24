import { Card, Button, Tooltip } from 'antd';
import { DeleteFilled } from '@ant-design/icons';
import './PokeCard.css';

const PokeCard = ({ card, isDisplay, onDelete }) => {
  return (
    <div className='poke-card-container'>
      {isDisplay && (
        <Tooltip title="Remove card">
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

      <Card
        hoverable
        variant='borderless'
        cover={<img alt={card.name} src={`${card.image}/low.png`} />}
        className='poke-card'
      />
    </div>
  );
};

export default PokeCard;
