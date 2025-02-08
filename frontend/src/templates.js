

import NovelistResume from "./resume_templates/NovelIstResume.jsx";



export const templates = [
  {
    id: 'novelist',
    component: NovelistResume,
    loader: () => Promise.resolve(NovelistResume),
  },
  // Add additional templates as needed
];
