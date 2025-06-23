import { useState, useEffect } from 'react';
// import { v4 as uuidv4 } from 'uuid';
import {
  DndContext,
  useSensor,
  useSensors,
  PointerSensor,
  closestCenter,
  DragOverlay
} from '@dnd-kit/core';

import { Row, Col, Tabs, Layout } from 'antd';
import { HeartOutlined, SearchOutlined } from '@ant-design/icons';
import ExploreSection from './ExploreSection';
import FavouriteSection from './FavouriteSection';
import DisplaySection from './DisplaySection';
import PokeCard from '../PokeCard/PokeCard';

const { Header, Content } = Layout;

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
      <Header style={{
        color: '#fff',
        fontSize: '20px',
        fontWeight: 'bold',
        backgroundColor: '#001529',
        padding: '0 24px',
        lineHeight: '64px'
      }}>
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
            <Col span={12} style={{ height: '100%', padding: 16 }}>
              <DisplaySection slots={slots} onDelete={handleDeleteCard}/>
            </Col>
            <Col span={2}/>
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
