'use client';

import { useState } from 'react';
import {
    Plus, Trash2, Store, Coins, ShoppingCart,
    Sword, Shield, FlaskConical, Package, Sparkles, Box
} from 'lucide-react';
import { Shop as ShopType, ShopItem } from '@/lib/firebase';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import styles from './Shop.module.css';

interface ShopProps {
    shop: ShopType | undefined;
    isDM: boolean;
    playerGold?: number;
    onUpdateShop: (shop: ShopType) => Promise<void>;
    onBuyItem?: (item: ShopItem) => Promise<void>;
    onClose: () => void;
}

const CATEGORY_ICONS = {
    weapon: Sword,
    armor: Shield,
    potion: FlaskConical,
    gear: Package,
    magic: Sparkles,
    other: Box,
};

const CATEGORY_LABELS = {
    weapon: 'Weapon',
    armor: 'Armor',
    potion: 'Potion',
    gear: 'Gear',
    magic: 'Magic Item',
    other: 'Other',
};

const DEFAULT_ITEMS: Partial<ShopItem>[] = [
    { name: 'Healing Potion', description: 'Restores 2d4+2 HP', price: 50, category: 'potion' },
    { name: 'Rope (50 ft)', description: 'Hemp rope', price: 1, category: 'gear' },
    { name: 'Torch (10)', description: 'Bundle of 10 torches', price: 1, category: 'gear' },
    { name: 'Longsword', description: '1d8 slashing', price: 15, category: 'weapon' },
    { name: 'Shield', description: '+2 AC', price: 10, category: 'armor' },
    { name: 'Potion of Greater Healing', description: 'Restores 4d4+4 HP', price: 150, category: 'potion' },
];

export default function Shop({
    shop,
    isDM,
    playerGold = 0,
    onUpdateShop,
    onBuyItem,
    onClose
}: ShopProps) {
    const [shopName, setShopName] = useState(shop?.name || 'General Store');
    const [newItem, setNewItem] = useState<Partial<ShopItem>>({
        name: '',
        description: '',
        price: 0,
        quantity: -1,
        category: 'other'
    });
    const [showAddItem, setShowAddItem] = useState(false);

    const handleCreateShop = async () => {
        const newShop: ShopType = {
            isOpen: true,
            name: shopName,
            items: []
        };
        await onUpdateShop(newShop);
    };

    const handleAddItem = async () => {
        if (!shop || !newItem.name || !newItem.price) return;

        const item: ShopItem = {
            id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            name: newItem.name,
            description: newItem.description || '',
            price: newItem.price,
            quantity: newItem.quantity ?? -1,
            category: newItem.category || 'other'
        };

        await onUpdateShop({
            ...shop,
            items: [...shop.items, item]
        });

        setNewItem({ name: '', description: '', price: 0, quantity: -1, category: 'other' });
        setShowAddItem(false);
    };

    const handleAddQuickItem = async (template: Partial<ShopItem>) => {
        if (!shop) return;

        const item: ShopItem = {
            id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            name: template.name || 'Item',
            description: template.description || '',
            price: template.price || 0,
            quantity: -1,
            category: template.category || 'other'
        };

        await onUpdateShop({
            ...shop,
            items: [...shop.items, item]
        });
    };

    const handleRemoveItem = async (itemId: string) => {
        if (!shop) return;
        await onUpdateShop({
            ...shop,
            items: shop.items.filter(i => i.id !== itemId)
        });
    };

    const handleToggleShop = async () => {
        if (!shop) return;
        await onUpdateShop({
            ...shop,
            isOpen: !shop.isOpen
        });
    };

    const handleBuyItem = async (item: ShopItem) => {
        if (!onBuyItem || playerGold < item.price) return;
        await onBuyItem(item);

        // Update quantity if not unlimited
        if (shop && item.quantity > 0) {
            await onUpdateShop({
                ...shop,
                items: shop.items.map(i =>
                    i.id === item.id ? { ...i, quantity: i.quantity - 1 } : i
                ).filter(i => i.quantity !== 0)
            });
        }
    };

    // DM View - No shop exists yet
    if (isDM && !shop) {
        return (
            <Dialog open onOpenChange={() => onClose()}>
                <DialogContent className={styles.dialogContent}>
                    <DialogHeader>
                        <DialogTitle className={styles.dialogTitle}>
                            <Store size={24} /> Create Shop
                        </DialogTitle>
                    </DialogHeader>
                    <div className={styles.createShop}>
                        <p>Create a shop for players to buy items from.</p>
                        <div className={styles.formGroup}>
                            <label>Shop Name</label>
                            <input
                                type="text"
                                value={shopName}
                                onChange={(e) => setShopName(e.target.value)}
                                placeholder="General Store"
                            />
                        </div>
                        <Button onClick={handleCreateShop} className="bg-amber-600 hover:bg-amber-700">
                            <Store size={16} /> Create Shop
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    // Player View - Shop not open
    if (!isDM && (!shop || !shop.isOpen)) {
        return (
            <Dialog open onOpenChange={() => onClose()}>
                <DialogContent className={styles.dialogContent}>
                    <DialogHeader>
                        <DialogTitle className={styles.dialogTitle}>
                            <Store size={24} /> Shop
                        </DialogTitle>
                    </DialogHeader>
                    <div className={styles.shopClosed}>
                        <Store size={48} />
                        <p>The shop is currently closed.</p>
                        <span>Come back when the DM opens it!</span>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Dialog open onOpenChange={() => onClose()}>
            <DialogContent className={`${styles.dialogContent} ${styles.mainShopDialog}`}>
                <DialogHeader className={styles.shopHeader}>
                    <div className={styles.headerInfo}>
                        <Store size={24} />
                        <DialogTitle>{shop?.name || 'Shop'}</DialogTitle>
                        {shop?.isOpen ? (
                            <span className={styles.openBadge}>Open</span>
                        ) : (
                            <span className={styles.closedBadge}>Closed</span>
                        )}
                    </div>
                    <div className={styles.headerActions}>
                        {!isDM && (
                            <div className={styles.playerGold}>
                                <Coins size={16} />
                                <span>{playerGold} GP</span>
                            </div>
                        )}
                        {isDM && (
                            <Button
                                variant={shop?.isOpen ? 'secondary' : 'default'}
                                size="sm"
                                onClick={handleToggleShop}
                                className={shop?.isOpen ? '' : 'bg-amber-600 hover:bg-amber-700'}
                            >
                                {shop?.isOpen ? 'Close Shop' : 'Open Shop'}
                            </Button>
                        )}
                    </div>
                </DialogHeader>

                <div className={styles.content}>
                    {/* Items List */}
                    <div className={styles.itemsList}>
                        {shop?.items.length === 0 ? (
                            <div className={styles.emptyShop}>
                                <Package size={32} />
                                <p>No items in shop</p>
                                {isDM && <span>Add some items for players to buy!</span>}
                            </div>
                        ) : (
                            shop?.items.map(item => {
                                const Icon = CATEGORY_ICONS[item.category];
                                const canAfford = playerGold >= item.price;

                                return (
                                    <div key={item.id} className={styles.itemCard}>
                                        <div className={styles.itemIcon}>
                                            <Icon size={20} />
                                        </div>
                                        <div className={styles.itemInfo}>
                                            <span className={styles.itemName}>{item.name}</span>
                                            <span className={styles.itemDesc}>{item.description}</span>
                                            <span className={styles.itemCategory}>{CATEGORY_LABELS[item.category]}</span>
                                        </div>
                                        <div className={styles.itemPrice}>
                                            <Coins size={14} />
                                            <span>{item.price} GP</span>
                                        </div>
                                        {item.quantity > 0 && (
                                            <span className={styles.itemQty}>x{item.quantity}</span>
                                        )}
                                        {isDM ? (
                                            <button
                                                className={styles.removeBtn}
                                                onClick={() => handleRemoveItem(item.id)}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        ) : (
                                            <button
                                                className={`${styles.buyBtn} ${!canAfford ? styles.disabled : ''}`}
                                                onClick={() => handleBuyItem(item)}
                                                disabled={!canAfford}
                                                title={canAfford ? 'Buy this item' : 'Not enough gold'}
                                            >
                                                <ShoppingCart size={16} />
                                            </button>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* DM Add Item Section */}
                    {isDM && (
                        <div className={styles.addSection}>
                            {!showAddItem ? (
                                <>
                                    <button
                                        className={styles.addBtn}
                                        onClick={() => setShowAddItem(true)}
                                    >
                                        <Plus size={16} /> Add Custom Item
                                    </button>
                                    <div className={styles.quickAdd}>
                                        <span>Quick Add:</span>
                                        {DEFAULT_ITEMS.map((item, idx) => (
                                            <button
                                                key={idx}
                                                className={styles.quickAddBtn}
                                                onClick={() => handleAddQuickItem(item)}
                                            >
                                                {item.name}
                                            </button>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <div className={styles.addForm}>
                                    <div className={styles.formRow}>
                                        <div className={styles.formGroup}>
                                            <label>Item Name</label>
                                            <input
                                                type="text"
                                                value={newItem.name}
                                                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                                                placeholder="Longsword"
                                            />
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label>Price (GP)</label>
                                            <input
                                                type="number"
                                                value={newItem.price}
                                                onChange={(e) => setNewItem({ ...newItem, price: parseInt(e.target.value) || 0 })}
                                                placeholder="50"
                                                min="0"
                                            />
                                        </div>
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Description</label>
                                        <input
                                            type="text"
                                            value={newItem.description}
                                            onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                                            placeholder="1d8 slashing damage"
                                        />
                                    </div>
                                    <div className={styles.formRow}>
                                        <div className={styles.formGroup}>
                                            <label>Category</label>
                                            <select
                                                value={newItem.category}
                                                onChange={(e) => setNewItem({ ...newItem, category: e.target.value as ShopItem['category'] })}
                                            >
                                                <option value="weapon">Weapon</option>
                                                <option value="armor">Armor</option>
                                                <option value="potion">Potion</option>
                                                <option value="gear">Gear</option>
                                                <option value="magic">Magic Item</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label>Quantity (-1 = unlimited)</label>
                                            <input
                                                type="number"
                                                value={newItem.quantity}
                                                onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) })}
                                                min="-1"
                                            />
                                        </div>
                                    </div>
                                    <div className={styles.formActions}>
                                        <button className="btn btn-secondary" onClick={() => setShowAddItem(false)}>
                                            Cancel
                                        </button>
                                        <button
                                            className="btn btn-gold"
                                            onClick={handleAddItem}
                                            disabled={!newItem.name || !newItem.price}
                                        >
                                            <Plus size={16} /> Add Item
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
