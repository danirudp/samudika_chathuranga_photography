export interface Story {
  id: number;
  names: string;
  location: string;
  year: string;
  image: string;
  align: 'left' | 'right';
  category: 'Wedding' | 'Elopement' | 'Engagement';
}

export const ALL_STORIES: Story[] = [
  {
    id: 1,
    names: 'Elena & Mateo',
    location: 'Lake Como, Italy',
    year: '2024',
    category: 'Wedding',
    image:
      'https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=2070&auto=format&fit=crop',
    align: 'left',
  },
  {
    id: 2,
    names: 'Sarah & David',
    location: 'New York City',
    year: '2024',
    category: 'Elopement',
    image:
      'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=2070&auto=format&fit=crop',
    align: 'right',
  },
  {
    id: 3,
    names: 'Aria & Liam',
    location: 'Kyoto, Japan',
    year: '2023',
    category: 'Wedding',
    image:
      'https://images.unsplash.com/photo-1621621667797-e06afc217fb0?q=80&w=2070&auto=format&fit=crop',
    align: 'left',
  },
  {
    id: 4,
    names: 'Noah & Emma',
    location: 'Paris, France',
    year: '2023',
    category: 'Engagement',
    image:
      'https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070&auto=format&fit=crop',
    align: 'right',
  },
];
