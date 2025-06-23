import { useDroppable } from '@dnd-kit/core';
import { Row, Col } from 'antd';

import DropSlot from '../DragAndDrop/DropSlot';


const BinderPage = ({ slots }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div style={{ maxWidth: '600px'}}>
        <Row gutter={[4, 4]} justify='center'>
          {slots && slots.map((card, index) => (
            <Col key={`slot-${index}`} span={8} >
              <DropSlot id={`slot-${index}`} card={card} />
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default BinderPage;