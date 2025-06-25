import { useState, useEffect } from 'react';
import {
  DndContext,
  useSensor,
  useSensors,
  PointerSensor,
  DragOverlay,
  rectIntersection
} from '@dnd-kit/core';

import { Row, Col, Tabs, Layout, Pagination, Button, Grid } from 'antd';
import { HeartOutlined, SearchOutlined, DeleteOutlined } from '@ant-design/icons';

import ExploreSection from './ExploreSection';
import FavouriteSection from './FavouriteSection';
import DisplaySection from './DisplaySection';
import PokeCard from '../PokeCard/PokeCard';

const { Header, Content } = Layout;
const { useBreakpoint } = Grid;

const SAVED_CARDS_STORAGE_KEY = 'pokemon_binder_cards';
const NUMBER_OF_PAGES = 5;
const NUMBER_OF_SLOTS = 9;

const BinderView = () => {
  const screens = useBreakpoint();
  const sensors = useSensors(useSensor(PointerSensor));

  const [cards, setCards] = useState(() => {
    const savedCards = localStorage.getItem(SAVED_CARDS_STORAGE_KEY);
    return savedCards ? JSON.parse(savedCards) : [];
  });
  const [currentPage, setCurrentPage] = useState(0);
  const [activeCard, setActiveCard] = useState(null);
  const [activeTab, setActiveTab] = useState('explore-section');

  useEffect(() => {
    localStorage.setItem(SAVED_CARDS_STORAGE_KEY, JSON.stringify(cards));
  }, [cards]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowLeft' && currentPage > 0) {
        setCurrentPage((prev) => prev - 1);
      } else if (event.key === 'ArrowRight' && currentPage < NUMBER_OF_PAGES - 1) {
        setCurrentPage((prev) => prev + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage]);

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
    <Layout style={{ height: '100vh' }}>
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
        collisionDetection={rectIntersection}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        autoScroll={false}
      >
        <Content style={{ overflowY: 'auto', padding: 16 }}>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={10}>
              <Tabs
                tabPosition={screens.md ? 'left' : 'top'}
                defaultActiveKey={activeTab}
                activeKey={activeTab}
                onChange={handleTabChange}
                items={tabItems}
              />
            </Col>

            <Col xs={24} md={10}>
              <div style={{ textAlign: 'center', marginBottom: 12 }}>
                <Pagination
                  align='center'
                  current={currentPage + 1}
                  total={NUMBER_OF_PAGES * 9}
                  showSizeChanger={false}
                  onChange={handlePageChange}
                />
              </div>

              <DisplaySection slots={slots} onDelete={handleDeleteCard} />
            </Col>

            <Col xs={24} md={4} style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
              <Button
                danger
                type="primary"
                onClick={handleClearPage}
                icon={<DeleteOutlined />}
                block={!screens.md}
              >
                Clear Page
              </Button>
            </Col>
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
