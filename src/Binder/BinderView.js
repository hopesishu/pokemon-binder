import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  DndContext,
  useSensor,
  useSensors,
  PointerSensor,
  closestCenter,
  DragOverlay
} from '@dnd-kit/core';
import { Row, Col, Tabs } from 'antd';

import ExploreSection from './ExploreSection';
import FavouriteSection from './FavouriteSection';
import BinderPage from './BinderPage';
import PokeCard from '../PokeCard/PokeCard';

const STORAGE_KEY = 'pokemon_binder_slots';

const BinderView = () => {
  const [activeTab, setActiveTab] = useState('explore-section');
  const sensors = useSensors(useSensor(PointerSensor));

  const [slots, setSlots] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved.length !== 0 ? JSON.parse(saved) : Array(9).fill(null);
  });

  const [activeCard, setActiveCard] = useState(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(slots));
    console.log("slots", slots)
  }, [slots]);

  const handleDragStart = (event) => {
    setActiveCard(event.active.data.current.card);
  };

  const handleDragEnd = (event) => {
    setActiveCard(null);
    const { active, over } = event;
    if (!over) return;

    const slotIndex = parseInt(over.id.replace('slot-', ''), 10);
    const card = active.data.current.card;

    const clonedCard = {
      ...card,
      slotIndex
    };

    setSlots((prev) => {
      const newSlots = [...prev];
      newSlots[slotIndex] = clonedCard;
      return newSlots;
    });
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  const handleDeleteCard = (cardToDelete) => {
    console.log(cardToDelete);

    const cardToDeleteIndex = slots.indexOf(cardToDelete);
    setSlots((prev) => {
      const newSlots = [...prev];
      newSlots[cardToDeleteIndex] = null;
      return newSlots;
    });
  }

  const tabItems = [
    {
      key: 'explore-section',
      label: 'Explore',
      children: <ExploreSection />
    },
    {
      key: 'favourite-section',
      label: 'Favourite',
      children: <FavouriteSection />
    }
  ];

  return (
    <div style={{ height: '100vh', overflow: 'hidden' }}>
      <Row style={{ height: '100%' }}>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <Col span={6} style={{ height: '100%', overflowY: 'auto' }}>
            <Tabs defaultActiveKey={activeTab} items={tabItems} onChange={handleTabChange} />
          </Col>
          <Col span={18} style={{ height: '100%', overflow: 'hidden' }}>
            <BinderPage slots={slots} onDelete={handleDeleteCard} />
          </Col>

          <DragOverlay>
            {activeCard ? <PokeCard card={activeCard}/> : null}
          </DragOverlay>
        </DndContext>
      </Row>
    </div>
  );
};

export default BinderView;
