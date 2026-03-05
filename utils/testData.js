// ✏️✏️✏️ NEW FILE
import { generateId, CATEGORIES } from './categories';

// ✏️✏️✏️ SAMPLE ITEMS DATABASE
const sampleItems = {
  vegetables: [
    { name: 'Tomate', price: 7.90, unit: 'kg' },
    { name: 'Alface', price: 3.50, unit: 'unit' },
    { name: 'Cenoura', price: 4.20, unit: 'kg' },
    { name: 'Batata', price: 5.80, unit: 'kg' },
    { name: 'Cebola', price: 6.50, unit: 'kg' },
    { name: 'Pepino', price: 4.90, unit: 'kg' },
  ],
  fruits: [
    { name: 'Banana', price: 5.90, unit: 'kg' },
    { name: 'Maçã', price: 8.50, unit: 'kg' },
    { name: 'Laranja', price: 4.20, unit: 'kg' },
    { name: 'Morango', price: 12.90, unit: 'kg' },
    { name: 'Uva', price: 9.80, unit: 'kg' },
    { name: 'Melancia', price: 15.00, unit: 'unit' },
  ],
  meat: [
    { name: 'Picanha', price: 89.90, unit: 'kg' },
    { name: 'Frango', price: 18.90, unit: 'kg' },
    { name: 'Alcatra', price: 45.90, unit: 'kg' },
    { name: 'Linguiça', price: 25.50, unit: 'kg' },
    { name: 'Bacon', price: 32.00, unit: 'kg' },
  ],
  dairy: [
    { name: 'Leite Integral', price: 4.50, unit: 'l' },
    { name: 'Queijo Mussarela', price: 42.90, unit: 'kg' },
    { name: 'Iogurte Natural', price: 6.80, unit: 'unit' },
    { name: 'Manteiga', price: 18.90, unit: 'unit' },
    { name: 'Requeijão', price: 12.50, unit: 'unit' },
  ],
  bakery: [
    { name: 'Pão Francês', price: 0.80, unit: 'unit' },
    { name: 'Pão de Forma', price: 8.90, unit: 'unit' },
    { name: 'Bolo de Chocolate', price: 25.00, unit: 'unit' },
    { name: 'Biscoito Recheado', price: 6.50, unit: 'unit' },
  ],
  beverages: [
    { name: 'Água Mineral', price: 2.50, unit: 'unit' },
    { name: 'Refrigerante 2L', price: 7.90, unit: 'unit' },
    { name: 'Suco de Laranja', price: 9.80, unit: 'unit' },
    { name: 'Cerveja Lata', price: 3.50, unit: 'unit' },
    { name: 'Café 500g', price: 18.90, unit: 'unit' },
  ],
  snacks: [
    { name: 'Chips 100g', price: 8.50, unit: 'unit' },
    { name: 'Chocolate Barra', price: 5.90, unit: 'unit' },
    { name: 'Pipoca Microondas', price: 7.20, unit: 'unit' },
    { name: 'Amendoim', price: 12.50, unit: 'kg' },
  ],
  cleaning: [
    { name: 'Detergente', price: 2.50, unit: 'unit' },
    { name: 'Sabão em Pó', price: 18.90, unit: 'unit' },
    { name: 'Amaciante', price: 12.50, unit: 'unit' },
    { name: 'Desinfetante', price: 8.90, unit: 'unit' },
  ],
  hygiene: [
    { name: 'Shampoo', price: 15.90, unit: 'unit' },
    { name: 'Sabonete', price: 3.50, unit: 'unit' },
    { name: 'Pasta de Dente', price: 8.90, unit: 'unit' },
    { name: 'Desodorante', price: 12.50, unit: 'unit' },
  ],
};

// ✏️✏️✏️ GENERATE RANDOM LIST
export const generateTestList = (itemCount = 8) => {
  const allItems = [];
  const categoryKeys = Object.keys(sampleItems);
  
  // Get random items from different categories
  for (let i = 0; i < itemCount; i++) {
    const randomCategoryKey = categoryKeys[Math.floor(Math.random() * categoryKeys.length)];
    const categoryItems = sampleItems[randomCategoryKey];
    const randomItem = categoryItems[Math.floor(Math.random() * categoryItems.length)];
    
    // Get the actual category object
    const category = Object.values(CATEGORIES).find(
      cat => cat.id === randomCategoryKey
    ) || CATEGORIES.OTHER;
    
    // Random quantity based on unit
    let quantity;
    if (randomItem.unit === 'kg') {
      quantity = (Math.random() * 2 + 0.5).toFixed(1); // 0.5 to 2.5 kg
    } else if (randomItem.unit === 'l') {
      quantity = Math.floor(Math.random() * 3 + 1); // 1 to 3 liters
    } else {
      quantity = Math.floor(Math.random() * 5 + 1); // 1 to 5 units
    }
    
    allItems.push({
      id: generateId(),
      name: randomItem.name,
      price: randomItem.price,
      quantity: parseFloat(quantity),
      unit: randomItem.unit,
      category: category,
      bought: false,
    });
  }
  
  return allItems;
};

// ✏️✏️✏️ GENERATE RANDOM LIST NAME
export const generateTestListName = () => {
  const names = [
    'Compras da Semana',
    'Feira do Mês',
    'Lista de Emergência',
    'Churrasco Sábado',
    'Aniversário João',
    'Compras Básicas',
    'Supermercado Quinta',
    'Lista Rápida',
  ];
  
  return names[Math.floor(Math.random() * names.length)];
};