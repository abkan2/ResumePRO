// import React, { lazy } from 'react';

// import image1 from './images/AndyResume.jpeg';
// import image2 from './images/BobokResume.jpeg';
// import image3 from './images/CiesResume.jpeg';
// import image4 from './images/ClassicResume.jpeg';
// import image5 from './images/CreativeResume.jpeg';
// import image6 from './images/EngineerResume.png';
// import image7 from './images/andywiecko.png';
// import image8 from './images/bobok.png';
// import image9 from './images/cies.png';
// import image10 from './images/cimichi.png';
// import image11 from './images/compact.png';
// import image12 from './images/eivin.png';

// // Define import functions for each component
// const template1Import = () => import('./resume_templates/AndyResume.jsx');
// const template2Import = () => import('./resume_templates/BobokResume.jsx');
// const template3Import = () => import('./resume_templates/CiesResume.jsx');
// const template4Import = () => import('./resume_templates/ClassicResume.jsx');
// const template5Import = () => import('./resume_templates/CreativeResume.jsx');
// const template6Import = () => import('./resume_templates/EngineerResume.jsx');
// const template7Import = () => import('./resume_templates/MacOSIOSDevResume.jsx');
// const template8Import = () => import('./resume_templates/NovelIstResume.jsx');
// const template9Import = () => import('./resume_templates/ProfessionalAcademicResume.jsx');
// const template10Import = () => import('./resume_templates/ProfessionalResume.jsx');
// const template11Import = () => import('./resume_templates/ResearchResume.jsx');
// const template12Import = () => import('./resume_templates/ZeyiResume.jsx');

// // Use React.lazy with the import functions
// const template1Component = lazy(template1Import);
// const template2Component = lazy(template2Import);
// const template3Component = lazy(template3Import);
// const template4Component = lazy(template4Import);
// const template5Component = lazy(template5Import);
// const template6Component = lazy(template6Import);
// const template7Component = lazy(template7Import);
// const template8Component = lazy(template8Import);
// const template9Component = lazy(template9Import);
// const template10Component = lazy(template10Import);
// const template11Component = lazy(template11Import);
// const template12Component = lazy(template12Import);

// export const templates = [
//   {
//     id: 'template1',
//     name: 'Template 1',
//     previewImage: image1,
//     component: template1Component,
//     loader: template1Import,
//   },
//   {
//     id: 'template2',
//     name: 'Template 2',
//     previewImage: image2,
//     component: template2Component,
//     loader: template2Import,
//   },
//   {
//     id: 'template3',
//     name: 'Template 3',
//     previewImage: image3,
//     component: template3Component,
//     loader: template3Import,
//   },
//   {
//     id: 'template4',
//     name: 'Template 4',
//     previewImage: image4,
//     component: template4Component,
//     loader: template4Import,
//   },
//   {
//     id: 'template5',
//     name: 'Template 5',
//     previewImage: image5,
//     component: template5Component,
//     loader: template5Import,
//   },
//   {
//     id: 'template6',
//     name: 'Template 6',
//     previewImage: image6,
//     component: template6Component,
//     loader: template6Import,
//   },
//   {
//     id: 'template7',
//     name: 'Template 7',
//     previewImage: image7,
//     component: template7Component,
//     loader: template7Import,
//   },
//   {
//     id: 'template8',
//     name: 'Template 8',
//     previewImage: image8,
//     component: template8Component,
//     loader: template8Import,
//   },
//   {
//     id: 'template9',
//     name: 'Template 9',
//     previewImage: image9,
//     component: template9Component,
//     loader: template9Import,
//   },
//   {
//     id: 'template10',
//     name: 'Template 10',
//     previewImage: image10,
//     component: template10Component,
//     loader: template10Import,
//   },
//   {
//     id: 'template11',
//     name: 'Template 11',
//     previewImage: image11,
//     component: template11Component,
//     loader: template11Import,
//   },
//   {
//     id: 'template12',
//     name: 'Template 12',
//     previewImage: image12,
//     component: template12Component,
//     loader: template12Import,
//   },
// ];


import NovelistResume from "/Users/abdulkanu/ResumePRO/ResumePro_Project/frontend/src/resume_templates/NovelIstResume.jsx"; // Adjust the path based on your project structure

export const templates = [
  {
    id: 'novelist',
    component: NovelistResume,
    loader: () => Promise.resolve(NovelistResume),
  },
  // Add additional templates as needed
];
