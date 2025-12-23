'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Backpack, Search, Plus, Coins, Package, Sword, Shield, FlaskConical, Scroll } from 'lucide-react';
import styles from './page.module.css';

interface InventoryItem {
    id: string;
    name: string;
    type: 'weapon' | 'armor' | 'potion' | 'scroll' | 'misc' | 'treasure';
    quantity: number;
    weight: number;
    value: { amount: number; currency: 'gp' | 'sp' | 'cp' };
    description?: string;
    equipped?: boolean;
}

const dummyInventory: InventoryItem[] = [
    { id: '1', name: 'Longsword', type: 'weapon', quantity: 1, weight: 3, value: { amount: 15, currency: 'gp' }, equipped: true },
    { id: '2', name: 'Chain Mail', type: 'armor', quantity: 1, weight: 55, value: { amount: 75, currency: 'gp' }, equipped: true },
    { id: '3', name: 'Healing Potion', type: 'potion', quantity: 3, weight: 0.5, value: { amount: 50, currency: 'gp' }, description: 'Restores 2d4+2 HP' },
    { id: '4', name: 'Scroll of Fireball', type: 'scroll', quantity: 1, weight: 0, value: { amount: 200, currency: 'gp' } },
    { id: '5', name: 'Rope (50 ft)', type: 'misc', quantity: 1, weight: 10, value: { amount: 1, currency: 'gp' } },
    { id: '6', name: 'Gold Coins', type: 'treasure', quantity: 150, weight: 3, value: { amount: 150, currency: 'gp' } },
];

const typeIcons: Record<string, React.ReactNode> = {
    weapon: <Sword size={16} />,
    armor: <Shield size={16} />,
    potion: <FlaskConical size={16} />,
    scroll: <Scroll size={16} />,
    misc: <Package size={16} />,
    treasure: <Coins size={16} />,
};

export default function InventoryPage() {
    const [inventory] = useState<InventoryItem[]>(dummyInventory);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState<string | null>(null);

    const filteredItems = inventory.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = !filterType || item.type === filterType;
        return matchesSearch && matchesType;
    });

    const totalWeight = inventory.reduce((sum, item) => sum + item.weight * item.quantity, 0);
    const totalValue = inventory.reduce((sum, item) => {
        let gpValue = item.value.amount * item.quantity;
        if (item.value.currency === 'sp') gpValue /= 10;
        if (item.value.currency === 'cp') gpValue /= 100;
        return sum + gpValue;
    }, 0);

    return (
        <div className={styles.inventoryPage}>
            <motion.header
                className={styles.pageHeader}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className={styles.headerContent}>
                    <h1><Backpack size={32} /> Inventory</h1>
                    <p>Manage your equipment and possessions</p>
                </div>
                <button className="btn btn-gold">
                    <Plus size={18} /> Add Item
                </button>
            </motion.header>

            {/* Summary */}
            <motion.div
                className={styles.summary}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <div className={styles.summaryCard}>
                    <Package size={20} />
                    <div>
                        <span className={styles.summaryValue}>{totalWeight.toFixed(1)} lbs</span>
                        <span className={styles.summaryLabel}>Total Weight</span>
                    </div>
                </div>
                <div className={styles.summaryCard}>
                    <Coins size={20} />
                    <div>
                        <span className={styles.summaryValue}>{totalValue.toFixed(0)} gp</span>
                        <span className={styles.summaryLabel}>Total Value</span>
                    </div>
                </div>
                <div className={styles.summaryCard}>
                    <Backpack size={20} />
                    <div>
                        <span className={styles.summaryValue}>{inventory.length}</span>
                        <span className={styles.summaryLabel}>Items</span>
                    </div>
                </div>
            </motion.div>

            {/* Filters */}
            <motion.div
                className={styles.filters}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
            >
                <div className={styles.searchBox}>
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Search items..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className={styles.typeFilters}>
                    {['weapon', 'armor', 'potion', 'scroll', 'misc', 'treasure'].map(type => (
                        <button
                            key={type}
                            className={`${styles.typeBtn} ${filterType === type ? styles.active : ''}`}
                            onClick={() => setFilterType(filterType === type ? null : type)}
                        >
                            {typeIcons[type]}
                            {type}
                        </button>
                    ))}
                </div>
            </motion.div>

            {/* Inventory List */}
            <div className={styles.inventoryList}>
                {filteredItems.length === 0 ? (
                    <div className={styles.emptyState}>
                        <Backpack size={48} />
                        <p>No items found</p>
                    </div>
                ) : (
                    filteredItems.map((item, index) => (
                        <motion.div
                            key={item.id}
                            className={`${styles.itemCard} ${item.equipped ? styles.equipped : ''}`}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 + index * 0.03 }}
                        >
                            <div className={styles.itemIcon}>
                                {typeIcons[item.type]}
                            </div>
                            <div className={styles.itemInfo}>
                                <h3>{item.name}</h3>
                                {item.description && <p className={styles.itemDesc}>{item.description}</p>}
                            </div>
                            <div className={styles.itemMeta}>
                                <span className={styles.quantity}>×{item.quantity}</span>
                                <span className={styles.weight}>{item.weight * item.quantity} lbs</span>
                                <span className={styles.value}>{item.value.amount} {item.value.currency}</span>
                            </div>
                            {item.equipped && <span className={styles.equippedBadge}>Equipped</span>}
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
}
