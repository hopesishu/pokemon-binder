import { useState, useEffect, useRef } from 'react';
import { Flex, Typography, Input, Select, Row, Col, Spin, Button, Tooltip } from 'antd';
import { PokemonTypeIconImg } from '../assets/pokmon-type-icons/PokemonTypeIcons';
import DraggableCard from '../DragAndDrop/DraggableCard';

const { Text } = Typography;

const DEFAULT_VISIBLE_COUNT = 52;

const ExploreSection = () => {
  const [allCards, setAllCards] = useState([]);
  const [visibleCardCount, setVisibleCardCount] = useState(DEFAULT_VISIBLE_COUNT);

  const [rarityList, setRarityList] = useState([]);
  const [pokemonTypeList, setPokemonTypeList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [pokemonName, setPokemonName] = useState('');
  const [rarity, setRarity] = useState('all');
  const [pokemonType, setPokemonType] = useState(null);

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

    const getPokemonTypeList = async() => {
      try {
        const response = await fetch('https://api.tcgdex.net/v2/en/types');
        if (!response.ok) throw new Error('Network response was not ok');

        const data = await response.json();
        setPokemonTypeList(data);
      } catch (error) {
        console.error('Error fetching Pokemon type list:', error);
      }
    }

    getRarityList();
    getPokemonTypeList();
    fetchCards(pokemonName, rarity, pokemonType);
  }, []);

  const fetchCards = async (pokemonName, rarity, pokemonType) => {
    setIsLoading(true);
    setVisibleCardCount(DEFAULT_VISIBLE_COUNT);
    const params = new URLSearchParams();

    if (pokemonName) {
      params.set('name', pokemonName);
    }

    if (rarity && rarity !== 'all') {
      params.set('rarity', rarity);
    }

    if (pokemonType) {
      params.set('types', pokemonType);
    } else {
      params.delete('types');
    }

    try {
      const response = await fetch(`https://api.tcgdex.net/v2/en/cards?${params.toString()}`);
      console.log('Params used:', params.toString());
      console.log(`api call: https://api.tcgdex.net/v2/en/cards?${params.toString()}`)
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
      setIsLoading(false);
    }
  };

  const handleSearchChange = () => {
    fetchCards(pokemonName, rarity, pokemonType);
  };

  const handleRaritySelectChange = (value) => {
    const raritySelected = value;
    if (selectRef.current) {
      selectRef.current.blur();
    }

    setRarity(value);
    fetchCards(pokemonName, raritySelected, pokemonType);
  };

  const handlePokemonTypeToggle = (type) => {
    const newType = pokemonType === type ? null : type;
    setPokemonType(newType);
    fetchCards(pokemonName, rarity, newType);
  }

  const handleShowMore = () => {
    const newCount = visibleCardCount + DEFAULT_VISIBLE_COUNT;
    setVisibleCardCount(newCount);
  }

  const capitalizeWords = (str) => {
    return str.replace(/\b\w/g, char => char.toUpperCase());
  }

  const visibleCards = allCards.slice(0, visibleCardCount);

  return (
    <Flex vertical gap={12}>
      <Row gutter={[8, 8]} style={{ maxWidth: 800, width: '100%' }}>
        <Col xs={24} lg={16}>
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
        <Col xs={24} lg={8}>
          <Text strong>Rarity</Text>
          <Select
            ref={selectRef}
            placeholder='Select rarity'
            showSearch
            style={{ width: '100%' }}
            onChange={handleRaritySelectChange}
            options={[
              { value: 'all', label: 'All' },
              ...rarityList.map(rarity => ({ value: rarity, label: capitalizeWords(rarity) })),
            ]}
          />
        </Col>
      </Row>
      <Row gutter={[16, 16]} style={{ maxWidth: 800, width: '100%' }}>
        <Col xs={24} lg={24}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Text strong>Filter by Energy</Text>
            <div style={{ display: 'flex', flexWrap: 'wrap', flexDirection: 'row', gap: 4 }}>
              {pokemonTypeList.map(type => {
                const isSelected = pokemonType === type;
                return (
                  <Tooltip title={type} key={type}>
                    <Button 
                      style={{
                        padding: 4,
                        border: isSelected ? '2px solid #1890ff' : '2px solid lightgray',
                        background: isSelected ? '#e6f7ff' : 'transparent',
                        width: 32,
                        height: 32,
                      }}
                      key={type} 
                      onClick={() => handlePokemonTypeToggle(type)}
                    >
                      <PokemonTypeIconImg pokemonType={type} />
                    </Button>
                  </Tooltip>)}
              )}
            </div>
          </div>
        </Col>
      </Row>

      <div
        className='custom-scrollbar'
        style={{
          display: 'flex',
          justifyContent: 'center',
          overflowY: visibleCards.length > 0 ? 'scroll' : 'auto',
          overflowX: 'hidden',
          minHeight: 'calc(100vh - 260px)',
          maxHeight: 'calc(100vh - 260px)',
          paddingRight: '8px',
      }}>
        <div style={{ width: '100%' }}>
          <Row gutter={[8, 8]} justify='center'>
            {isLoading
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
                  lg={8}      // 3 per row on large screens
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
            {visibleCards.length < allCards.length && !isLoading &&
              <Button type='link' onClick={handleShowMore}>
                {`Show more cards (${visibleCardCount}/${allCards.length} shown)`}
              </Button>
            }
          </Row>
        </div>
      </div>
    </Flex>
  );

};

export default ExploreSection;
