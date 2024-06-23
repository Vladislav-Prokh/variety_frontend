const clothesFields = [
  { name: 'size', label: 'Size', type: 'text' },
  { name: 'material', label: 'Material', type: 'text' },
  { name: 'country', label: 'country', type: 'text' },
];

const subcategoryFields = {
  'accessories': [
    { name: 'material', label: 'Material', type: 'text' },
    { name: 'country', label: 'country', type: 'text' },
  ],
  'men clothes': [
    ...clothesFields,
  ],
  'women clothes': [
    ...clothesFields,
  ],
  'child clothes': [
    ...clothesFields,
  ],
  'parfums': [
    { name: 'volume', label: 'volume', type: 'number' },
    { name: 'kind', label: 'kind', type: 'text' },
    { name: 'sex', label: 'sex', type: 'text' },
    { name: 'country', label: 'country', type: 'text' },
    { name: 'basic_chords', label: 'basic_chords', type: 'text' },
    { name: 'note_heart', label: 'Note_Heart', type: 'text' },
    { name: 'final_note', label: 'Final_note', type: 'text' },
    { name: 'classification_of_aroma', label: 'Classification_of_aroma', type: 'text' },
  ],

  'laptops': [
    { name: 'processor', label: 'Processor', type: 'text' },
    { name: 'graphics', label: 'Graphics', type: 'text' },
    { name: 'RAM', label: 'RAM', type: 'number' },
    { name: 'storage', label: 'Storage', type: 'number' },
    { name: 'motherboard', label: 'motherboard', type: 'text' }
  ],
  'pc': [
    { name: 'processor', label: 'Processor', type: 'text' },
    { name: 'graphics', label: 'Graphics', type: 'text' },
    { name: 'RAM', label: 'RAM', type: 'number' },
    { name: 'storage', label: 'Storage', type: 'number' },
    { name: 'display', label: 'Display', type: 'text' },
    { name: 'motherboard', label: 'Motherboard', type: 'text' },
    { name: 'operatingSystem', label: 'Operating System', type: 'text' },
    { name: 'powerSupply', label: 'Power Supply', type: 'text' },
    { name: 'keyboard', label: 'Keyboard', type: 'text' },
    { name: 'opticalDrive', label: 'Optical Drive', type: 'text' },
    { name: 'weight', label: 'Weight', type: 'number' },
],

  'smartphones': [
    { name: 'processor', label: 'Processor', type: 'text' },
    { name: 'display', label: 'Display', type: 'text' },
    { name: 'diagonal', label: 'diagonal', type: 'number' },
    { name: 'RAM', label: 'RAM', type: 'number' },
    { name: 'storage', label: 'Storage', type: 'number' },
    { name: 'camera', label: 'camera', type: 'number' },
    { name: 'screenType', label: 'screen type', type: 'text' },

  ]
};

export default subcategoryFields;