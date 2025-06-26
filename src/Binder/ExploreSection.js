import { useState, useEffect, useRef } from 'react';
import { Flex, Typography, Input, Select, Row, Col, Spin, Button } from 'antd';

import DraggableCard from '../DragAndDrop/DraggableCard';

const { Text } = Typography;

const ExploreSection = () => {
  const [allCards, setAllCards] = useState([]);
  const [visibleCardCount, setVisibleCardCount] = useState(52);
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
      console.log('Params used', params.toString());
      const response = await fetch(`https://api.tcgdex.net/v2/en/cards?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      const filteredData = data.filter(
        (item) => item.image && item.image.trim() !== ''
      );

      if (filteredData.length > 0) {
        setAllCards(filteredData);
      } else {
        console.log('No data found');
        setAllCards([]);
      }
    } catch (err) {
      console.error('Failed to fetch cards:', err);
      setAllCards([]);
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

  const handleShowMore = () => {
    const newCount = visibleCardCount + 52;
    setVisibleCardCount(newCount);
  }

  const visibleCards = allCards.slice(0, visibleCardCount);

  return (
    <Flex vertical gap={12}>
      <Row gutter={[16, 16]} style={{ maxWidth: 800, width: '100%' }}>
        <Col xs={24} sm={16}>
          <Text strong>Search for Pokémon</Text>
          <Input.Search 
            spellCheck={false}
            placeholder='Enter name'
            value={pokemonName}
            onChange={(e) => setPokemonName(e.target.value)}
            onPressEnter={handleSearchChange}
            onSearch={handleSearchChange}
          />
        </Col>
        <Col xs={24} sm={8}>
          <Text strong>Rarity</Text>
          <Select
            ref={selectRef}
            placeholder='Select rarity'
            showSearch
            style={{ width: '100%' }}
            onChange={handleRaritySelectChange}
            options={[
              { value: 'all', label: 'All' },
              ...rarityList.map(rarity => ({ value: rarity, label: rarity })),
            ]}
          />
        </Col>
      </Row>

      <div
        className='custom-scrollbar'
        style={{
          display: 'flex',
          justifyContent: 'center',
          overflowY: visibleCards.length > 0 ? 'scroll' : 'auto',
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
              : visibleCards.length > 0
              ? visibleCards.map(card => (
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
          <Row justify='center'>
            {visibleCards.length < allCards.length && (
              <Button type='link' onClick={handleShowMore}>Show more cards</Button>
            )}
          </Row>
        </div>
      </div>
    </Flex>
  );

};

export default ExploreSection;
