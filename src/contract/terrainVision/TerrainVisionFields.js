export const terrainVisionFields = (terrainVisionData) => [
  {
    name: 'allPhotosUploaded',
    label: 'Wszystkie zdjęcia przesłane',
    value: terrainVisionData?.allPhotosUploaded || false,
    type: 'checkbox',
  },
  {
    name: 'deadline',
    label: 'Termin',
    value: terrainVisionData?.deadline ? terrainVisionData.deadline : '',
    type: 'date',
  },
  {
    name: 'terrainVisionStatus',
    label: 'Status wizji terenowej',
    value: terrainVisionData?.terrainVisionStatus || '',
    type: 'select',
    options: [
      { value: 'HOLD', label: 'Wstrzymane' },
      { value: 'IN_PROGRESS', label: 'W trakcie' },
      { value: 'COMPLETED', label: 'Zakończone' },
    ],
  },
  {
    name: 'mapChange',
    label: 'Zmiana mapy',
    value: terrainVisionData?.mapChange || '',
    type: 'select',
    options: [
      { value: 'NONE', label: 'Brak' },
      { value: 'MODIFIED', label: 'Zmodyfikowana' },
      { value: 'NOT_NECESSARY', label: 'Nie wymagana' },
    ],
  },
];