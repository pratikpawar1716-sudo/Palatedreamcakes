export interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  shortcode?: string;
  category: string;
  description: string;
  priority: boolean;
}

export const products: Product[] = [
  {
    id: '1',
    name: 'Vintage Coquette Heart',
    price: 1800,
    category: 'Couture',
    description: 'Elegant heart-shaped masterpiece with signature ribbons.',
    images: ['https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&w=800&q=80'],
    priority: true
  },
  {
    id: '2',
    name: 'Belgian Truffle Royale',
    price: 1200,
    category: 'Signature',
    description: 'Deep chocolate experience with 70% dark Belgian cocoa.',
    images: ['https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80'],
    priority: true
  },
  {
    id: '3',
    name: 'Victorian Lace Cake',
    price: 2200,
    category: 'Couture',
    description: 'Intricate Victorian-style Lambeth piping for a timeless look.',
    images: ['https://images.unsplash.com/photo-1535141192574-5d4897c12636?auto=format&fit=crop&w=800&q=80'],
    priority: true
  },
  {
    id: '4',
    name: 'Pressed Flower Meadow',
    price: 3000,
    category: 'Couture',
    description: 'Artisanal vanilla base decorated with hand-pressed organic petals.',
    images: ['https://images.unsplash.com/photo-1519340333755-56e9c1d04579?auto=format&fit=crop&w=800&q=80'],
    priority: false
  },
  {
    id: '5',
    name: 'Wildflower Bloom',
    price: 2800,
    category: 'Couture',
    description: 'Garden-fresh design featuring a stunning arrangement of seasonal floral art.',
    images: ['https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=800&q=80'],
    priority: false
  },
  {
    id: '6',
    name: 'Lavender & Honey Zest',
    price: 1750,
    category: 'Signature',
    description: 'Sophisticated lavender notes with a bright citrus finish.',
    images: ['https://images.unsplash.com/photo-1542826438-bd32f43d626f?auto=format&fit=crop&w=800&q=80'],
    priority: false
  },
  {
    id: '7',
    name: 'Rose Petal Infusion',
    price: 2200,
    category: 'Signature',
    description: 'Classic luxury with premium rose water and soft petal accents.',
    images: ['https://images.unsplash.com/photo-1562440499-64c9a111f713?auto=format&fit=crop&w=800&q=80'],
    priority: false
  },
  {
    id: '8',
    name: 'Garden Herb & Citrus',
    price: 1900,
    category: 'Signature',
    description: 'Refreshing blend of fresh herbs and zesty lemon.',
    images: ['https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=800&q=80'],
    priority: false
  },
  {
    id: '9',
    name: 'Minimalist Rose Bento',
    price: 399,
    category: 'Bento',
    description: 'Signature petite lunchbox cake for intimate celebrations.',
    images: ['https://images.unsplash.com/photo-1550617931-e17a7b70dce2?auto=format&fit=crop&w=800&q=80'],
    priority: false
  },
  {
    id: '10',
    name: 'Classic Vanilla Petite',
    price: 450,
    category: 'Bento',
    description: 'Pure elegance in a minimalist vanilla bean bento.',
    images: ['https://images.unsplash.com/photo-1551404973-7bb676337000?auto=format&fit=crop&w=800&q=80'],
    priority: false
  },
  {
    id: '11',
    name: 'Salted Caramel Mini',
    price: 599,
    category: 'Bento',
    description: 'Explosion of house-made salted caramel and sea salt.',
    images: ['https://images.unsplash.com/photo-1516054575922-f0b8eeadec1a?auto=format&fit=crop&w=800&q=80'],
    priority: false
  },
  {
    id: '12',
    name: 'Hazelnut Praline',
    price: 1450,
    category: 'Signature',
    description: 'Crunchy house-made praline and smooth hazelnut cream.',
    images: ['https://images.unsplash.com/photo-1586985288123-2495f577c250?auto=format&fit=crop&w=800&q=80'],
    priority: false
  },
  {
    id: '13',
    name: 'Tiramisu Cheesecake',
    price: 2400,
    category: 'Signature',
    description: 'Fusion of coffee-soaked sponge and creamy cheesecake.',
    images: ['https://images.unsplash.com/photo-1571115177098-24ec42ed2bb4?auto=format&fit=crop&w=800&q=80'],
    priority: false
  },
  {
    id: '14',
    name: 'Lotus Biscoff Dream',
    price: 1900,
    category: 'Signature',
    description: 'Favorite featuring Biscoff spread and signature spiced crunch.',
    images: ['https://images.unsplash.com/photo-1559620192-032c4bc4674e?auto=format&fit=crop&w=800&q=80'],
    priority: false
  },
  {
    id: '15',
    name: 'Pistachio Dream Bento',
    price: 650,
    category: 'Bento',
    description: 'Petite gourmet masterpiece with premium Iranian pistachios.',
    images: ['https://images.unsplash.com/photo-1557308536-ee471f13bc94?auto=format&fit=crop&w=800&q=80'],
    priority: false
  },
  {
    id: '16',
    name: 'Pastel Ribbon Heart',
    price: 1600,
    category: 'Couture',
    description: 'Soft pastel tones with high-fashion ribbon accents.',
    images: ['https://images.unsplash.com/photo-1535254973040-607b474cb842?auto=format&fit=crop&w=800&q=80'],
    priority: false
  },
  {
    id: '17',
    name: 'Cherub Ornamented Cake',
    price: 2500,
    category: 'Couture',
    description: 'Heavenly vintage cake with classic cherub motifs.',
    images: ['https://images.unsplash.com/photo-1514517604298-cf80e0fb7f1e?auto=format&fit=crop&w=800&q=80'],
    priority: false
  },
  {
    id: '18',
    name: 'Classic Lambeth Design',
    price: 2100,
    category: 'Couture',
    description: 'Technical showcase of heritage piping and regal detailing.',
    images: ['https://images.unsplash.com/photo-1505976378723-9726b54e9bb9?auto=format&fit=crop&w=800&q=80'],
    priority: false
  },
  {
    id: '19',
    name: 'Dark Chocolate Petite',
    price: 499,
    category: 'Bento',
    description: 'Intense cocoa experience in a perfectly sized bento box.',
    images: ['https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80'],
    priority: false
  },
  {
    id: '20',
    name: 'Dark Knight Ganache',
    price: 3950,
    category: 'Couture',
    description: 'Our deepest, boldest chocolate ganache masterpiece.',
    images: ['https://images.unsplash.com/photo-1534432182912-63863115e106?auto=format&fit=crop&w=800&q=80'],
    priority: false
  }
];
