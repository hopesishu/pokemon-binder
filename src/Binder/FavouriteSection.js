import { Flex, Row, Col, Button } from 'antd';
import DraggableCard from '../DragAndDrop/DraggableCard';
import { useCardPagination} from '../utils/useCardPagination';
import { displayFormattedNumber } from '../utils/utils';

const FavouriteSection = ({ onFavourite, favouritedCards, onCardClick }) => {

  const { visibleCardCount, handleShowMore } = useCardPagination();
  const visibleCards = favouritedCards.slice(0, visibleCardCount);

  return (
    <Flex vertical gap={12}>
      <div
        className='custom-scrollbar'
        style={{
          display: 'flex',
          justifyContent: 'center',
          overflowY: visibleCards.length > 0 ? 'scroll' : 'auto',
          overflowX: 'hidden',
          minHeight: 'calc(100vh - 108px)',
          maxHeight: 'calc(100vh - 108px)',
          paddingRight: '8px',
      }}>
        <div style={{ width: '100%' }}>
          <Row gutter={[8, 8]} justify='center'>
            {
              visibleCards.length > 0 && visibleCards.map(card => (
                <Col
                  key={card.id}
                  xs={12}     // 2 per row on mobile
                  sm={8}      // 3 per row on small screens
                  md={8}      // 3 per row on medium screens
                  lg={8}      // 3 per row on large screens
                  xl={6}      // 4 per row on extra-large screens
                >
                  <DraggableCard card={card} onFavourite={onFavourite} favouritedCards={favouritedCards} onCardClick={onCardClick} />
                </Col>
                ))
            } 
          </Row>
          <Row justify='center'>
            {visibleCards.length < favouritedCards.length &&
              <Button type='link' onClick={handleShowMore}>
                {`Show more cards (${displayFormattedNumber(visibleCardCount)}/${displayFormattedNumber(favouritedCards.length)} shown)`} 
              </Button>
            }
          </Row>
        </div>
      </div>
    </Flex>
  )
}

export default FavouriteSection;