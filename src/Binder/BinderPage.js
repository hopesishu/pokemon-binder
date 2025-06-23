import { Row, Col, Pagination } from 'antd';

import DropSlot from '../DragAndDrop/DropSlot';

const BinderPage = ({ slots, onDelete }) => {
  const handlePageChange = (pageNumber) => {
    console.log("pageNumber", pageNumber)
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div style={{ maxWidth: '550px'}}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
          <Pagination defaultCurrent={1} total={50} onChange={handlePageChange} />
        </div>
        <Row gutter={[4, 4]} justify='center'>
          {slots?.map((card, index) => (
            <Col key={`slot-${index}`} span={8} >
              <DropSlot id={`slot-${index}`} card={card} onDelete={onDelete}/>
            </Col>
          ))}
        </Row>

      </div>
    </div>
  );
};

export default BinderPage;