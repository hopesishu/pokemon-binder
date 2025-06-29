import { Row, Col } from 'antd';
import DropSlot from '../DragAndDrop/DropSlot';

const BinderPage = ({ activeCard, slots, nextEmptySlotIndex, onDelete, onFavourite, favouritedCards }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div style={{ maxWidth: '550px'}}>
        <Row gutter={[4, 4]} justify='center'>
          {slots?.map((card, index) => (
            <Col key={`slot-${index}`} span={8}>
                <DropSlot
                  key={`slot-${index}`}
                  id={`slot-${index}`}
                  card={card}
                  onDelete={onDelete}
                  hideCard={activeCard?.uniqueId === card?.uniqueId}
                  isDropSlotEmpty={index === nextEmptySlotIndex}
                  onFavourite={onFavourite}
                  favouritedCards={favouritedCards}
                />
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default BinderPage;