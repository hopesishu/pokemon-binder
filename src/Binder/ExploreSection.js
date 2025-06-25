import { useState, useEffect, useRef } from 'react';
import { Flex, Typography, Input, Select, Row, Col, Spin } from 'antd';

import DraggableCard from '../DragAndDrop/DraggableCard';

const { Text } = Typography;

const ExploreSection = () => {
  const [cards, setCards] = useState([]);
  const [pokemonName, setPokemonName] = useState('');
  const [rarity, setRarity] = useState('all');
  const [rarityList, setRarityList] = useState([]);
  const [loading, setLoading] = useState(false);
  const selectRef = useRef(null);

  useEffect(() => {
    const getRarityList = async () => {
      try {
        const response = await fetch('https://api.tcgdex.net/v2/en/rarities');
        if (!response.ok) throw new Error('Network response was not ok');

        const data = await response.json();
        setRarityList(data);
      } catch (error) {
        console.error('Error fetching rarity list:', error);
      }
    };

    getRarityList();
  }, []);

  const fetchCards = async (name, rarity) => {
    setLoading(true);
    const params = new URLSearchParams();

    if (name) {
      params.set('name', name);
    }

    if (rarity && rarity !== 'all') {
      params.set('rarity', rarity);
    }

    try {
      console.log('params used', params.toString());
      const response = await fetch(`https://api.tcgdex.net/v2/en/cards?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      const filteredData = data.filter(
        (item) => item.image && item.image.trim() !== ''
      );

      if (filteredData.length > 0) {
        console.log('filteredData', filteredData);
        setCards(filteredData);
      } else {
        console.log('no data found');
        setCards([]);
      }
    } catch (err) {
      console.error('Failed to fetch cards:', err);
      setCards([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = () => {
    fetchCards(pokemonName, rarity);
  };

  const handleRaritySelectChange = (value) => {
    if (selectRef.current) {
      selectRef.current.blur();
    }

    setRarity(value);
    fetchCards(pokemonName, value);
  };

  return (
    <Flex vertical gap={12}>
      <Flex gap={16} align='flex-end' style={{ maxWidth: 800, width: '100%' }}>
        <Flex style={{ flex: 1, flexDirection: 'column' }}>
          <Text strong>Search for Pokémon</Text>
          <Input.Search 
            spellCheck={false}
            placeholder='Enter name'
            value={pokemonName}
            onChange={(e) => setPokemonName(e.target.value)}
            onPressEnter={handleSearchChange}
            onSearch={handleSearchChange}
          />
        </Flex>

        <Flex style={{ flexDirection: 'column', width: 200 }}>
          <Text strong>Select rarity</Text>
          <Select
            ref={selectRef}          
            defaultValue='all'
            showSearch
            placeholder='Select rarity'
            onChange={handleRaritySelectChange}
            options={[
              { value: 'all', label: 'All' },
              ...rarityList.map(rarity => ({ value: rarity, label: rarity })),
            ]}
          />
        </Flex>
      </Flex>

      <div 
        className='custom-scrollbar'
        style={{
          display: 'flex',
          justifyContent: 'center',
          overflowY: cards.length > 0 ? 'scroll' : 'auto',
          overflowX: 'hidden',
          minHeight: 'calc(100vh - 200px)',
          maxHeight: 'calc(100vh - 200px)',
          paddingRight: '8px',
      }}>
        <div style={{ width: '100%' }}>
          <Row gutter={[8, 8]} justify='center'>
            {loading
              ? 
              <Spin tip="Loading"> 
                <div style={{ padding: 50 }} />
              </Spin>
              : cards.length > 0
              ? cards.map(card => (
                <Col
                  key={card.id}
                  xs={12}     // 2 per row on mobile
                  sm={8}      // 3 per row on small screens
                  md={8}      // 3 per row on medium screens
                  lg={6}      // 4 per row on large screens
                  xl={6}      // 4 per row on extra-large screens
                >
                  <DraggableCard card={card} />
                </Col>
                ))
              : (
                <Text type="secondary">No data found</Text>
              )}
          </Row>
        </div>
      </div>
    </Flex>
  );

};

export default ExploreSection;
