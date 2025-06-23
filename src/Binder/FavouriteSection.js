import { Row } from 'antd';

const FavouriteSection = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', overflowX: 'hidden'}}>
      <div style={{ width: '100%' }}>
        <Row gutter={[4, 4]} justify='center'>
          {/* {selectedCards && selectedCards.map(card => (
            <Col span={8} key={card.id}>
              <DraggableCard card={card} />
            </Col>
          ))} */}
        </Row>
      </div>
    </div>
  )
}

export default FavouriteSection;