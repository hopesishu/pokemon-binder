import { Row, Col } from 'antd';
import DropSlot from '../DragAndDrop/DropSlot';

const BinderPage = ({ activeCard, slots, onDelete }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div style={{ maxWidth: '550px'}}>
        <Row gutter={[4, 4]} justify='center'>
          {slots?.map((card, index) => (
            <Col key={`slot-${index}`} span={8} >
                <DropSlot
                  key={`slot-${index}`}
                  id={`slot-${index}`}
                  card={card}
                  onDelete={onDelete}
                  hideCard={activeCard?.uniqueId === card?.uniqueId}
                />
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default BinderPage;