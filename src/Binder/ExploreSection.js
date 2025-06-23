import { useState } from 'react';
import { Flex, Typography, Input, Row, Col } from 'antd';

import DraggableCard from '../DragAndDrop/DraggableCard';

const { Text } = Typography;

const ExploreSection = () => {
  const [cards, setCards] = useState([]);
  const [pokemonName, setPokemonName] = useState('');

    const fetchCards = async (input) => {
    try {
      const response = await fetch(`https://api.tcgdex.net/v2/en/cards?name=${input}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      const filteredData = data.filter(item => item.image && item.image.trim() !== '');
      console.log("filteredData", filteredData)
      setCards(filteredData);
    } catch (err) {
      console.error('Failed to fetch cards:', err);
    }
  };

  const handleSubmit = () => {
    if (pokemonName !== "") {
      console.log('Submitted name:', pokemonName);
      fetchCards(pokemonName);
    }
  }

  return (
    <Flex vertical gap={12}>
      <div>
        <Text strong>Search for Pokémon</Text>
        <Input.Search 
          spellCheck={false}
          placeholder="Enter name"
          value={pokemonName}
          onChange={(e) => setPokemonName(e.target.value)}
          onPressEnter={handleSubmit}
          onSearch={handleSubmit}
        />
      </div>

      <div 
      className="custom-scrollbar" 
      style={{
        display: 'flex',
        justifyContent: 'center',
        overflowY: 'auto',
        overflowX: 'hidden',
        maxHeight: 'calc(100vh - 200px)',
        paddingRight: '8px',
      }}>
        <div style={{ width: '100%' }}>
          <Row gutter={[8, 8]} justify="center">
            {cards && cards.map(card => (
              <Col span={6} key={card.id}>
                <DraggableCard card={card} />
              </Col>
            ))}
          </Row>
        </div>
      </div>
    </Flex>

  );
}

export default ExploreSection;