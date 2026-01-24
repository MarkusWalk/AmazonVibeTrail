import React, { useState } from 'react'
import { Modal } from '../Modal'
import styles from './Inventory.module.css'

export interface InventoryItem {
  id: string
  name: string
  description: string
  icon: string // Emoji or sprite reference
  quantity: number
  category: 'tool' | 'consumable' | 'trade' | 'specimen' | 'quest'
  rarity?: 'common' | 'uncommon' | 'rare' | 'legendary'
  value?: number
  weight?: number
}

interface InventoryProps {
  isOpen: boolean
  onClose: () => void
  items: InventoryItem[]
  maxWeight?: number
  currentWeight?: number
  onUseItem?: (itemId: string) => void
  onDropItem?: (itemId: string, quantity: number) => void
}

type CategoryFilter = 'all' | 'tool' | 'consumable' | 'trade' | 'specimen' | 'quest'

export const Inventory: React.FC<InventoryProps> = ({
  isOpen,
  onClose,
  items,
  maxWeight = 100,
  currentWeight = 0,
  onUseItem,
  onDropItem,
}) => {
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null)
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all')
  const [sortBy, setSortBy] = useState<'name' | 'quantity' | 'value'>('name')

  const filteredItems = items
    .filter((item) => categoryFilter === 'all' || item.category === categoryFilter)
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'quantity':
          return b.quantity - a.quantity
        case 'value':
          return (b.value || 0) - (a.value || 0)
        default:
          return 0
      }
    })

  const handleItemClick = (item: InventoryItem) => {
    setSelectedItem(item)
  }

  const handleUseItem = () => {
    if (selectedItem) {
      onUseItem?.(selectedItem.id)
      setSelectedItem(null)
    }
  }

  const handleDropItem = (quantity: number = 1) => {
    if (selectedItem) {
      onDropItem?.(selectedItem.id, quantity)
      if (selectedItem.quantity <= quantity) {
        setSelectedItem(null)
      }
    }
  }

  const weightPercentage = (currentWeight / maxWeight) * 100

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Inventory" size="large">
      <div className={styles.inventoryLayout}>
        {/* Filters and Controls */}
        <div className={styles.controls}>
          <div className={styles.categoryFilters}>
            <button
              className={categoryFilter === 'all' ? styles.active : ''}
              onClick={() => setCategoryFilter('all')}
            >
              All
            </button>
            <button
              className={categoryFilter === 'tool' ? styles.active : ''}
              onClick={() => setCategoryFilter('tool')}
            >
              🔧 Tools
            </button>
            <button
              className={categoryFilter === 'consumable' ? styles.active : ''}
              onClick={() => setCategoryFilter('consumable')}
            >
              🍎 Consumables
            </button>
            <button
              className={categoryFilter === 'trade' ? styles.active : ''}
              onClick={() => setCategoryFilter('trade')}
            >
              💰 Trade
            </button>
            <button
              className={categoryFilter === 'specimen' ? styles.active : ''}
              onClick={() => setCategoryFilter('specimen')}
            >
              🔬 Specimens
            </button>
            <button
              className={categoryFilter === 'quest' ? styles.active : ''}
              onClick={() => setCategoryFilter('quest')}
            >
              📜 Quest
            </button>
          </div>

          <div className={styles.sortControls}>
            <label>Sort by:</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)}>
              <option value="name">Name</option>
              <option value="quantity">Quantity</option>
              <option value="value">Value</option>
            </select>
          </div>

          {/* Weight Display */}
          <div className={styles.weightDisplay}>
            <div className={styles.weightLabel}>
              Weight: {currentWeight.toFixed(1)} / {maxWeight} kg
            </div>
            <div className={styles.weightBar}>
              <div
                className={styles.weightFill}
                style={{
                  width: `${Math.min(100, weightPercentage)}%`,
                  backgroundColor:
                    weightPercentage > 90 ? '#ef4444' : weightPercentage > 70 ? '#facc15' : '#4ade80',
                }}
              />
            </div>
          </div>
        </div>

        {/* Item Grid */}
        <div className={styles.itemGrid}>
          {filteredItems.length === 0 && (
            <div className={styles.emptyState}>
              <p>No items in this category</p>
            </div>
          )}

          {filteredItems.map((item) => (
            <div
              key={item.id}
              className={`${styles.itemCard} ${selectedItem?.id === item.id ? styles.selected : ''} ${
                styles[item.rarity || 'common']
              }`}
              onClick={() => handleItemClick(item)}
            >
              <div className={styles.itemIcon}>{item.icon}</div>
              <div className={styles.itemName}>{item.name}</div>
              <div className={styles.itemQuantity}>×{item.quantity}</div>
              {item.rarity && item.rarity !== 'common' && (
                <div className={`${styles.rarityBadge} ${styles[item.rarity]}`}>
                  {item.rarity}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Item Details Panel */}
        {selectedItem && (
          <div className={styles.detailsPanel}>
            <div className={styles.detailsHeader}>
              <div className={styles.detailsIcon}>{selectedItem.icon}</div>
              <div>
                <h3>{selectedItem.name}</h3>
                <p className={styles.detailsCategory}>
                  {selectedItem.category}
                  {selectedItem.rarity && ` • ${selectedItem.rarity}`}
                </p>
              </div>
            </div>

            <div className={styles.detailsDescription}>{selectedItem.description}</div>

            <div className={styles.detailsStats}>
              <div className={styles.stat}>
                <span>Quantity:</span>
                <span>{selectedItem.quantity}</span>
              </div>
              {selectedItem.value !== undefined && (
                <div className={styles.stat}>
                  <span>Value:</span>
                  <span>{selectedItem.value} coins</span>
                </div>
              )}
              {selectedItem.weight !== undefined && (
                <div className={styles.stat}>
                  <span>Weight:</span>
                  <span>{selectedItem.weight} kg</span>
                </div>
              )}
            </div>

            <div className={styles.detailsActions}>
              {selectedItem.category === 'consumable' && (
                <button className={styles.useButton} onClick={handleUseItem}>
                  Use Item
                </button>
              )}
              <button className={styles.dropButton} onClick={() => handleDropItem(1)}>
                Drop (1)
              </button>
              {selectedItem.quantity > 1 && (
                <button className={styles.dropButton} onClick={() => handleDropItem(selectedItem.quantity)}>
                  Drop All ({selectedItem.quantity})
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}
