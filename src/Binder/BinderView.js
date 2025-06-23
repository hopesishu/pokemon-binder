import { useState } from 'react';
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

const BinderView = () => {
  const [activeTab, setActiveTab] = useState('explore-section');

  const sensors = useSensors(useSensor(PointerSensor));
  const [slots, setSlots] = useState(Array(9).fill(null));
  const [activeCard, setActiveCard] = useState(null);
  const handleDragStart = (event) => {
    console.log("handleDragStart", event)
    setActiveCard(event.active.data.current.card);
  };
  const handleDragEnd = (event) => {
    setActiveCard(null);
    const { active, over } = event;
    if (!over) return;

    const slotIndex = parseInt(over.id.replace('slot-', ''), 10);
    const card = active.data.current.card;

    setSlots((prev) => {
      const newSlots = [...prev];
      newSlots[slotIndex] = card;
      return newSlots;
    });
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

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
    <>
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
              <BinderPage slots={slots} />
            </Col>

            <DragOverlay>
              {activeCard ? <PokeCard card={activeCard} /> : null}
            </DragOverlay>
          </DndContext>
        </Row>
      </div>
    </>

  );
};

export default BinderView;
