export const SEED_PROJECTS = [
  {
    id: 'forge',
    name: 'forge',
    branch: 'main',
    last: '12m',
    activity: 'run',
    dirty: true,
    files: [
      {
        name: 'src/',
        children: [
          {
            name: 'components/',
            open: true,
            children: [
              {
                name: 'terminal/',
                open: true,
                children: [
                  {
                    name: 'Terminal.jsx',
                    active: true,
                    git: 'M',
                    dirty: true,
                    path: 'src/components/terminal/',
                  },
                  { name: 'Terminal.css', git: '' },
                ],
              },
              {
                name: 'bridge/',
                children: [{ name: 'bridge.js' }],
              },
            ],
          },
          {
            name: 'hooks/',
            children: [
              { name: 'useBlink.js', git: 'A', path: 'src/hooks/' },
            ],
          },
          {
            name: 'styles/',
            children: [
              { name: 'variables.css', git: 'M', dirty: true, path: 'src/styles/' },
            ],
          },
          { name: 'App.jsx', path: 'src/' },
          { name: 'main.jsx', path: 'src/' },
        ],
      },
      { name: 'package.json' },
      { name: 'README.md' },
    ],
  },
  {
    id: 'archivist',
    name: 'archivist',
    branch: 'feat/search',
    last: '2h',
    activity: 'idle',
    dirty: false,
    files: [
      {
        name: 'src/',
        children: [
          { name: 'DiffView.tsx' },
        ],
      },
    ],
  },
  {
    id: 'mindcraft',
    name: 'mindcraft',
    branch: 'develop',
    last: '3d',
    activity: 'idle',
    dirty: false,
    files: [],
  },
  {
    id: 'routines',
    name: 'routines',
    branch: 'main',
    last: '6h',
    activity: 'idle',
    dirty: false,
    files: [],
  },
];
