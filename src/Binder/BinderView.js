import { useState, useEffect } from 'react';
import {
  DndContext,
  useSensor,
  useSensors,
  PointerSensor,
  closestCenter,
  DragOverlay
} from '@dnd-kit/core';

import { Row, Col, Tabs, Layout, Pagination, Button } from 'antd';
import { HeartOutlined, SearchOutlined, DeleteOutlined } from '@ant-design/icons';

import ExploreSection from './ExploreSection';
import FavouriteSection from './FavouriteSection';
import DisplaySection from './DisplaySection';
import PokeCard from '../PokeCard/PokeCard';

const { Header, Content } = Layout;

const SAVED_CARDS_STORAGE_KEY = 'pokemon_binder_cards';
const NUMBER_OF_PAGES = 5;
const NUMBER_OF_SLOTS = 9;

const BinderView = () => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, 
      },
    })
  );

  const [cards, setCards] = useState(() => {
    const savedCards = localStorage.getItem(SAVED_CARDS_STORAGE_KEY);
    return savedCards ? JSON.parse(savedCards) : [];
  });

  const [currentPage, setCurrentPage] = useState(0);
  const [activeCard, setActiveCard] = useState(null);
  const [activeTab, setActiveTab] = useState('explore-section');

  useEffect(() => {
    localStorage.setItem(SAVED_CARDS_STORAGE_KEY, JSON.stringify(cards));
    console.log("cards", cards)
  }, [cards]);

  const getSlotsForPage = (pageIndex) => {
    const slots = Array(NUMBER_OF_SLOTS).fill(null);
    cards.forEach(card => {
      if (card.pageIndex === pageIndex && card.slotIndex >= 0 && card.slotIndex < NUMBER_OF_SLOTS) {
        slots[card.slotIndex] = card;
      }
    });
    return slots;
  };

  const slots = getSlotsForPage(currentPage);

  const handleDragStart = (event) => {
    setActiveCard(event.active.data.current.card);
  };

  const handleDragEnd = (event) => {
    setActiveCard(null);
    const { active, over } = event;
    if (!over) return;

    const slotIndex = parseInt(over.id.replace('slot-', ''), 10);
    const card = active.data.current.card;

    const newCard = {
      ...card,
      slotIndex,
      pageIndex: currentPage
    };

    setCards((prevCards) => {
      const updated = [...prevCards];
      const existingIndex = updated.findIndex(
        (c) => c.slotIndex === slotIndex && c.pageIndex === currentPage
      );

      if (existingIndex !== -1) {
        updated[existingIndex] = newCard; 
      } else {
        updated.push(newCard); 
      }

      return updated;
    });
  };

  const handleDeleteCard = (cardToDelete) => {
    setCards(prev =>
      prev.filter(c =>
        !(c.id === cardToDelete.id &&
          c.slotIndex === cardToDelete.slotIndex &&
          c.pageIndex === cardToDelete.pageIndex)
      )
    );
  };

  const handlePageChange = (pageNum) => {
    setCurrentPage(pageNum - 1);
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  const handleClearPage = () => {
    const updatedCards = cards.filter(c => c.pageIndex !== currentPage);
    setCards(updatedCards);
  };

  const tabItems = [
    {
      key: 'explore-section',
      label: 'Explore',
      children: <ExploreSection />,
      icon: <SearchOutlined />
    },
    {
      key: 'favourite-section',
      label: 'Favourites',
      children: <FavouriteSection />,
      icon: <HeartOutlined />
    }
  ];

  return (
    <Layout>
      <Header
        style={{
          color: '#fff',
          fontSize: '20px',
          fontWeight: 'bold',
          backgroundColor: '#001529',
          padding: '0 24px',
          lineHeight: '64px'
        }}
      >
        Pokémon Binder
      </Header>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <Content style={{ height: 'calc(100vh - 64px)', overflow: 'hidden' }}>
          <Row style={{ height: '100%' }}>
            <Col span={10} style={{ height: '100%', padding: 16 }}>
              <Tabs
                tabPosition='left'
                defaultActiveKey={activeTab}
                items={tabItems}
                onChange={handleTabChange}
              />
            </Col>

            <Col span={8} style={{ height: '100%', padding: 16 }}>
              <div style={{ marginBottom: 12 }}>
                <Pagination
                  defaultCurrent={1}
                  current={currentPage + 1}
                  total={NUMBER_OF_PAGES * 9}
                  showSizeChanger={false}
                  onChange={handlePageChange}
                  align="center"
                />
              </div>
              <DisplaySection slots={slots} onDelete={handleDeleteCard} />
            </Col>

            <Col
              span={4}
              style={{
                display: 'flex',
                flexDirection: 'column',
                padding: 24,
                gap: 12 
              }}
            >
              <Button 
                danger 
                type='primary'
                onClick={handleClearPage}
                icon={<DeleteOutlined />}
              >
                Clear current page
              </Button>
            </Col>
            <Col span={2} />
          </Row>

          <DragOverlay>
            {activeCard ? <PokeCard card={activeCard} /> : null}
          </DragOverlay>
        </Content>
      </DndContext>
    </Layout>
  );
};

export default BinderView;
