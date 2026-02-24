
const IMAGES = {
  vegetables: require('../assets/images/vegetables.jpeg'),
  fruits: require('../assets/images/fruits.jpg'),
  meat: require('../assets/images/meat.jpeg'),
  dairy: require('../assets/images/dairy.jpg'),
  bakery: require('../assets/images/bread.jpeg'),
  beverages: require('../assets/images/drinks.jpeg'),
  snacks: require('../assets/images/snacks.jpg'),
  cleaning: require('../assets/images/clean.jpeg'),
  hygiene: require('../assets/images/hygiene.jpeg'),
  other: require('../assets/images/others.jpeg')
};
export const CATEGORIES = {
  VEGETABLES: {
    id: 'vegetables',
    name: 'Vegetais',
    image: IMAGES.vegetables,
    color: '#4CAF50',
    keywords: ['tomate', 'tomato', 'alface', 'lettuce', 'cenoura', 'carrot', 'batata', 'potato', 'cebola', 'onion', 'pepino', 'cucumber', 'pimentão', 'pepper', 'brócolis', 'broccoli', 'couve', 'cabbage', 'abobrinha', 'zucchini', 'repolho']
  },
  FRUITS: {
    id: 'fruits',
    name: 'Frutas',
    image: IMAGES.fruits,
    color: '#FF5252',
    keywords: ['morango', 'strawberry', 'maçã', 'apple', 'banana', 'laranja', 'orange', 'uva', 'grape', 'melancia', 'watermelon', 'manga', 'mango', 'abacaxi', 'pineapple', 'pera', 'pear', 'limão', 'lemon', 'kiwi', 'melão', 'melon', 'abacate', 'avocado']
  },
  MEAT: {
    id: 'meat',
    name: 'Carnes',
    image: IMAGES.meat,
    color: '#D32F2F',
    keywords: ['carne', 'meat', 'frango', 'chicken', 'peixe', 'fish', 'porco', 'pork', 'boi', 'beef', 'linguiça', 'sausage', 'bacon', 'presunto', 'ham', 'salsicha', 'hot dog']
  },
  DAIRY: {
    id: 'dairy',
    name: 'Laticínios',
    image: IMAGES.dairy,
    color: '#2196F3',
    keywords: ['leite', 'milk', 'queijo', 'cheese', 'iogurte', 'yogurt', 'manteiga', 'butter', 'requeijão', 'cream cheese', 'nata', 'cream']
  },
  BAKERY: {
    id: 'bakery',
    name: 'Padaria',
    image: IMAGES.bakery,
    color: '#F57C00',
    keywords: ['pão', 'bread', 'bolo', 'cake', 'biscoito', 'cookie', 'torta', 'pie', 'croissant', 'rosca', 'donut']
  },
  BEVERAGES: {
    id: 'beverages',
    name: 'Bebidas',
    image: IMAGES.beverages,
    color: '#9C27B0',
    keywords: ['água', 'water', 'suco', 'juice', 'refrigerante', 'soda', 'cerveja', 'beer', 'vinho', 'wine', 'café', 'coffee', 'chá', 'tea', 'energético', 'energy drink']
  },
  SNACKS: {
    id: 'snacks',
    name: 'Snacks',
    image: IMAGES.snacks,
    color: '#FF9800',
    keywords: ['chips', 'batata frita', 'pipoca', 'popcorn', 'amendoim', 'peanut', 'chocolate', 'barra de cereal', 'granola bar', 'salgadinho']
  },
  CLEANING: {
    id: 'cleaning',
    name: 'Limpeza',
    image: IMAGES.cleaning,
    color: '#00BCD4',
    keywords: ['detergente', 'detergent', 'sabão', 'soap', 'amaciante', 'softener', 'desinfetante', 'disinfectant', 'esponja', 'sponge', 'papel higiênico', 'toilet paper', 'papel toalha', 'paper towel']
  },
  HYGIENE: {
    id: 'hygiene',
    name: 'Higiene',
    image: IMAGES.hygiene,
    color: '#E91E63',
    keywords: ['shampoo', 'condicionador', 'conditioner', 'sabonete', 'soap', 'pasta de dente', 'toothpaste', 'desodorante', 'deodorant', 'creme', 'cream', 'perfume']
  },
  OTHER: {
    id: 'other',
    name: 'Outros',
    image: IMAGES.other,
    color: '#607D8B',
    keywords: []
  }
};

// Unit types
export const UNIT_TYPES = {
  UNIT: { id: 'unit', label: 'Unidade', shortLabel: 'un' },
  KG: { id: 'kg', label: 'Quilograma', shortLabel: 'kg' },
  G: { id: 'g', label: 'Gramas', shortLabel: 'g' },
  L: { id: 'l', label: 'Litros', shortLabel: 'L' },
  ML: { id: 'ml', label: 'Mililitros', shortLabel: 'ml' },
};

// Function to categorize items based on name (suggestion only)
export const suggestCategory = (itemName) => {
  const normalizedName = itemName.toLowerCase().trim();
  
  for (const category of Object.values(CATEGORIES)) {
    if (category.keywords.some(keyword => normalizedName.includes(keyword))) {
      return category;
    }
  }
  
  return CATEGORIES.OTHER;
};

// Function to format currency
export const formatCurrency = (value) => {
  return `R$ ${parseFloat(value).toFixed(2).replace('.', ',')}`;
};

// Function to format quantity with unit
export const formatQuantity = (quantity, unit) => {
  const unitType = Object.values(UNIT_TYPES).find(u => u.id === unit) || UNIT_TYPES.UNIT;
  return `${quantity} ${unitType.shortLabel}`;
};

// Generate unique ID
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};