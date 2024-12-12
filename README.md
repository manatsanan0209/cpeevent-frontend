visite our online websitre https://cpeevo.encall.live/
# CPE Event (CPEEVO)

CPE Event is a web application for managing events, posts, and user interactions. Built with React and TypeScript, it utilizes modern libraries like NextUI and Tailwind CSS to deliver a responsive and interactive user interface.

## Features

- Create and manage events
- Post updates and announcements
- User authentication and context management
- Responsive design with NextUI components
- Markdown support for posts

## Technologies Used

- **React**: Front-end library for building user interfaces
- **TypeScript**: Superset of JavaScript for type safety
- **NextUI**: UI components library for React
- **Tailwind CSS**: Utility-first CSS framework
- **React Router**: Client-side routing
- **Axios**: Promise-based HTTP client
- **React Markdown**: Render Markdown content
- **Framer Motion**: Animation library

## Getting Started

### Prerequisites

- Node.js 18.17.0 or higher
- pnpm package manager

### Installation

1. Clone the repository:
    ```bash
    git clone <repository-url>
    ```
2. Navigate to the project directory:
    ```bash
    cd cpeevent-frontend
    ```
3. Install dependencies:
    ```bash
    pnpm install
    ```

### Running the Application

Start the development server:
```bash
pnpm dev
```
The app will be available at ``http://localhost:3000.``

### Building for Production
Build the application:
```bash
pnpm build
```
Preview the production build:
```bash
pnpm preview
```

## Project Structure

```
.
├── index.html
├── package.json
├── pnpm-lock.yaml
├── public/
├── src/
│   ├── api/
│   ├── App.tsx
│   ├── components/
│   ├── context/
│   ├── data/
│   ├── hooks/
│   ├── layouts/
│   ├── main.tsx
│   ├── pages/
│   ├── router/
│   ├── styles/
│   ├── types/
│   └── vite-env.d.ts
├── tailwind.config.js
└── vite.config.ts
```

## Scripts

- Dev Server: `pnpm dev`
- Build: `pnpm build`
- Preview: `pnpm preview`
- Lint: `pnpm lint`

## License

Licensed under the [MIT license](https://github.com/Encall/cpeevent-frontend/blob/main/LICENSE).

