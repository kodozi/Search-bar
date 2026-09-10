/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Resource } from "./types";

export const DEFAULT_RESOURCES: Resource[] = [
  {
    id: "1",
    title: "Tailwind CSS Documentation",
    description: "A utility-first CSS framework packed with classes like flex, pt-4, text-center and rotate-90 that can be composed to build any design, directly in your markup.",
    url: "https://tailwindcss.com/docs",
    category: "Development",
    tags: ["CSS", "Framework", "Frontend", "Styling"],
    clicks: 142
  },
  {
    id: "2",
    title: "React.js official documentation",
    description: "The library for web and native user interfaces. Build user interfaces out of individual pieces called components written in JavaScript or TypeScript.",
    url: "https://react.dev",
    category: "Development",
    tags: ["React", "JavaScript", "Frontend", "UI Library"],
    clicks: 189
  },
  {
    id: "3",
    title: "Lucide Icons",
    description: "Beautiful & consistent icon toolkit made by the community. An open-source fork of Feather Icons with hundreds of newly added clean SVG icons.",
    url: "https://lucide.dev",
    category: "Design",
    tags: ["Icons", "Assets", "Vector", "UI Design"],
    clicks: 95
  },
  {
    id: "4",
    title: "Framer Motion (Motion)",
    description: "A production-ready motion library for React. Utilize simple declarative syntax to create smooth, high-fidelity entry animations and gestures.",
    url: "https://motion.dev",
    category: "Development",
    tags: ["Animations", "React", "Transitions", "Interactive"],
    clicks: 76
  },
  {
    id: "5",
    title: "Google Fonts",
    description: "A robust catalog of open-source designer web fonts and APIs for convenient integration via CSS, helping developers pair distinctive typography seamlessly.",
    url: "https://fonts.google.com",
    category: "Design",
    tags: ["Typography", "Fonts", "Design Systems", "Assets"],
    clicks: 63
  },
  {
    id: "6",
    title: "DevDocs.io",
    description: "Combines multiple API documentations in a fast, organized, and searchable client-side interface. Works offline, is completely open-source, and highly customizable.",
    url: "https://devdocs.io",
    category: "Learning",
    tags: ["API Reference", "Cheat Sheet", "Offline", "All-in-one"],
    clicks: 82
  },
  {
    id: "7",
    title: "MDN Web Docs",
    description: "The ultimate resource for developers, maintained by Mozilla. Providing comprehensive documentation on HTML, CSS, JavaScript, and web APIs with up-to-date standards.",
    url: "https://developer.mozilla.org",
    category: "Learning",
    tags: ["Reference", "HTML", "CSS", "JavaScript", "Standards"],
    clicks: 120
  },
  {
    id: "8",
    title: "Notion Workspace",
    description: "A versatile productivity suite combining notes, tasks, databases, wiki entries, and calendars. Highly customizable with multi-user real-time collaboration features.",
    url: "https://notion.so",
    category: "Productivity",
    tags: ["Organization", "Notes", "Wiki", "Collaboration"],
    clicks: 51
  },
  {
    id: "9",
    title: "Dribbble Inspiration",
    description: "The leading destination to find & showcase creative work and home to the world's best design professionals to discover beautiful user interfaces and graphic illustrations.",
    url: "https://dribbble.com",
    category: "Design",
    tags: ["Inspiration", "UI Design", "Visuals", "Mockups"],
    clicks: 44
  },
  {
    id: "10",
    title: "Figma Collaborative Design",
    description: "The industry-standard collaborative vector graphics editor and prototyping tool, built for teams to design user interfaces and share prototypes in real-time.",
    url: "https://figma.com",
    category: "Design",
    tags: ["Vector", "Prototyping", "UI Design", "Collaboration"],
    clicks: 112
  },
  {
    id: "11",
    title: "Excalidraw Virtual Whiteboard",
    description: "A virtual whiteboard for drawing hand-drawn like diagrams. Fully open-source, end-to-end encrypted, supporting rapid wireframing and flowcharts with ease.",
    url: "https://excalidraw.com",
    category: "Productivity",
    tags: ["Wireframing", "Sketching", "Diagrams", "Whiteboard"],
    clicks: 58
  },
  {
    id: "12",
    title: "StackBlitz Online IDE",
    description: "Instant, secure developer environments running directly inside your browser. Powered by WebContainers, running full-stack Node.js servers in seconds.",
    url: "https://stackblitz.com",
    category: "Productivity",
    tags: ["IDE", "Online Editor", "Node.js", "Sandbox"],
    clicks: 49
  },
  {
    id: "13",
    title: "Exercism Code Practice",
    description: "Develop fluency in 67 programming languages with high-quality coding exercises, human mentoring, and feedback loops. Completely free and non-profit.",
    url: "https://exercism.org",
    category: "Learning",
    tags: ["Coding Exercises", "Mentoring", "Practice", "Free"],
    clicks: 35
  },
  {
    id: "14",
    title: "CodePen Sandbox",
    description: "A social development environment for front-end designers and developers. Build and deploy a website, show off your work, build test cases, and find inspiration.",
    url: "https://codepen.io",
    category: "Development",
    tags: ["HTML", "CSS", "JavaScript", "Playground"],
    clicks: 41
  },
  {
    id: "15",
    title: "Unsplash Creative Photography",
    description: "The internet's source for high-quality, freely-usable images. Powered by creators everywhere, providing millions of curated high-resolution photography assets.",
    url: "https://unsplash.com",
    category: "Design",
    tags: ["Stock Photos", "Photography", "Assets", "Backgrounds"],
    clicks: 29
  }
];

export const CATEGORIES = ["Development", "Design", "Productivity", "Learning"] as const;
