import { useState } from 'react';
import { Input, Button, Space, Row, Col } from 'antd';

import DraggableCard from '../DragAndDrop/DraggableCard';

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
      console.log("data", data)
      setCards(data);
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
    <>
      <Space.Compact style={{ width: '300px' }}>
        <Input
          spellCheck={false}
          placeholder="Input Pokemon Name"
          value={pokemonName}
          onChange={(e) => setPokemonName(e.target.value)}
          onPressEnter={handleSubmit}
        />
        <Button onClick={handleSubmit} type="primary">Submit</Button>
      </Space.Compact>

      <div style={{ display: 'flex', justifyContent: 'centre', backgroundColor: 'gray', overflowY: 'auto', overflowX: 'hidden'}}>
        <div style={{ width: '100%' }}>
          <Row gutter={[4, 4]} justify='centre'>
            {cards && cards.map(card => (
                <Col span={8} key={card.id}>
                  <DraggableCard card={card} />
                </Col>
            ))}
          </Row>
        </div>
      </div>
    </>

  );
}

export default ExploreSection;