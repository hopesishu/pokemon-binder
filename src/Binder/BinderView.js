import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
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
const FAVOURITED_CARDS_STORAGE_KEY = 'favourited_pokemon_cards';
const NUMBER_OF_PAGES = 5;
const NUMBER_OF_SLOTS = 9;

const BinderView = () => {
  const screens = useBreakpoint();
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 2,
      },
    })
  );

  const [savedCards, setSavedCards] = useState(() => {
    const saved = localStorage.getItem(SAVED_CARDS_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  const [favouritedCards, setFavouritedCards] = useState(() => {
    const favCards = localStorage.getItem(FAVOURITED_CARDS_STORAGE_KEY);
    return favCards ? JSON.parse(favCards) : [];
  });
  const [currentPage, setCurrentPage] = useState(0);
  const [activeCard, setActiveCard] = useState(null);
  const [activeTab, setActiveTab] = useState('explore-section');

  useEffect(() => {
    localStorage.setItem(SAVED_CARDS_STORAGE_KEY, JSON.stringify(savedCards));
    localStorage.setItem(FAVOURITED_CARDS_STORAGE_KEY, JSON.stringify(favouritedCards));
    console.log("favouritedCards", favouritedCards)
  }, [savedCards, favouritedCards]);

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
    savedCards.forEach(card => {
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
    const { active, over } = event;
    setActiveCard(null);
    if (!over || !active) return;

    const fromSlot = parseInt(active.id.replace('slot-', ''), 10);
    const toSlot = parseInt(over.id.replace('slot-', ''), 10);
    if (isNaN(toSlot)) return;

    const draggedCard = active.data.current.card;
    // If the card is from the binder (no valid uniqueId). Move within binder
    if (draggedCard.uniqueId !== undefined) {
      setSavedCards((prev) => {
        const updated = [...prev];

        const updatedCards = updated.map((card) => {
          // Move the dragged card
          if (card.uniqueId === draggedCard.uniqueId) {
            return { ...card, slotIndex: toSlot };
          }
          // Move the card in destination slot (if exists) to source slot
          if (card.slotIndex === toSlot && card.pageIndex === currentPage) {
            return { ...card, slotIndex: fromSlot };
          }
          return card;
        });

        return updatedCards;
      });
    } else {
      // Card is coming from Explore section
      const newCard = {
        uniqueId: uuidv4(),
        ...draggedCard,
        slotIndex: toSlot,
        pageIndex: currentPage,
      };

      setSavedCards((prevCards) => {
        const updated = [...prevCards];
        const existingIndex = updated.findIndex(
          (c) => c.slotIndex === toSlot && c.pageIndex === currentPage
        );

        if (existingIndex !== -1) {
          updated[existingIndex] = newCard;
        } else {
          updated.push(newCard);
        }

        return updated;
      });
    }
  };

  const handleDeleteCard = (cardToDelete) => {
    setSavedCards(prev => {
      return prev.filter(c => c.uniqueId !== cardToDelete.uniqueId);
    });
  };

  const handleFavouriteCard = (cardToFavourite) => {
    const isFavourited = favouritedCards.some(c => c.id === cardToFavourite.id);
    if (isFavourited) {
      setFavouritedCards(prev => prev.filter(c => c.id !== cardToFavourite.id));
    } else {
      setFavouritedCards(prev => [...prev, cardToFavourite]);
    }
  }

  const handlePageChange = (pageNum) => {
    setCurrentPage(pageNum - 1);
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  const handleClearPage = () => {
    const updatedCards = savedCards.filter(c => c.pageIndex !== currentPage);
    setSavedCards(updatedCards);
  };

  const tabItems = [
    {
      key: 'explore-section',
      label: 'Explore',
      children: <ExploreSection onFavourite={handleFavouriteCard} favouritedCards={favouritedCards}/>,
      icon: <SearchOutlined />
    },
    {
      key: 'favourite-section',
      label: 'Favourites',
      children: <FavouriteSection onFavourite={handleFavouriteCard} favouritedCards={favouritedCards}/>,
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
            <Col xs={24} lg={10}>
              <Tabs
                tabPosition={screens.lg ? 'left' : 'top'}
                defaultActiveKey={activeTab}
                activeKey={activeTab}
                onChange={handleTabChange}
                items={tabItems}
              />
            </Col>

            <Col xs={24} lg={10}>
              <div style={{ textAlign: 'center', marginBottom: 12 }}>
                <Pagination
                  align='center'
                  current={currentPage + 1}
                  total={NUMBER_OF_PAGES * 9}
                  showSizeChanger={false}
                  onChange={handlePageChange}
                />
              </div>

              <DisplaySection activeCard={activeCard} slots={slots} onDelete={handleDeleteCard} />
            </Col>

            <Col xs={24} lg={4} style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
              <Button
                danger
                type='primary'
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
