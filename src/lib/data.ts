export interface Story {
  id: number;
  names: string;
  location: string;
  year: string;
  image: string;
  align: 'left' | 'right';
  category: 'Wedding' | 'Elopement' | 'Engagement';
  description: string;
}

export const ALL_STORIES: Story[] = [
  {
    id: 1,
    names: 'KAVINDU & ANUTHTHARA',
    location: ' Arcade Independence, Colombo',
    year: '2025',
    category: 'Wedding',
    image: '/portfolio/2.webp',
    description:
      'An intimate celebration captured on 35mm film and digital, preserving the quiet emotions that unfold naturally. This collection lingers on subtle glances, gentle gestures, and unspoken connections, revealing the beauty that lives between moments. Each frame is composed with patience, allowing authenticity to lead the story.',
    align: 'left',
  },
  {
    id: 2,
    names: 'SHANI & MANULA',
    location: 'Pelmadulle, Sri Lanka',
    year: '2025',
    category: 'Engagement',
    image: '/portfolio/22.webp',
    description:
      'Captured film and digital formats, this album explores the spaces between movement and stillness. It is a visual narrative shaped by light, texture, and silence, where emotions surface without direction. The photographs embrace imperfection, allowing moments to exist exactly as they were.',
    align: 'right',
  },
  {
    id: 3,
    names: 'RANINDU & HESHANI',
    location: 'ITC Ratnadipa, Colombo',
    year: '2024',
    category: 'Wedding',
    image: '/portfolio/14.webp',
    description:
      'This series documents an intimate celebration through a cinematic blend of film and digital photography. Rather than focusing on posed scenes, it follows the rhythm of the day as it unfolds—fleeting expressions, tender pauses, and honest interactions. The result is a story that feels lived, not staged.',
    align: 'left',
  },
  {
    id: 4,
    names: 'TADANO & RASANJALI',
    location: 'Ratnapura, Sri Lanka',
    year: '2025',
    category: 'Wedding',
    image: '/portfolio/3.webp',
    description:
      'Photographed using 85mm film alongside digital, this album is rooted in stillness and sincerity. It captures the understated beauty of human connection, where emotion emerges softly and naturally. The imagery reflects a calm, deliberate approach, honoring the moments that often go unnoticed.',
    align: 'right',
  },
];
