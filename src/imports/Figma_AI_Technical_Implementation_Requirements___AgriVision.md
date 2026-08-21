# TECHNICAL IMPLEMENTATION REQUIREMENTS

The prototype must be designed with the following technology stack.

## Frontend

Use:

- **React.js**
- **Vite**
- **JavaScript only**
- **Tailwind CSS**

### Strict JavaScript Requirement

**DO NOT use TypeScript anywhere in the project.**

Do not generate:

- `.ts` files
- `.tsx` files
- TypeScript interfaces
- TypeScript types
- Type annotations
- TypeScript-specific syntax

All React components must use standard **JavaScript / JSX**.

---

# Backend

Use:

- **Node.js**
- **Express.js**

The backend architecture should be designed as a REST API that will eventually provide:

- Farm information
- Field information
- Multispectral imagery metadata
- Crop health analysis
- Soil condition analysis
- Pest-risk analysis
- Alerts
- AI-generated insights
- Historical field analysis

For the current prototype, the frontend may use **mock/static data**, but structure the UI and data flow so that these values can later be replaced with API responses without redesigning the interface.

---

# Build Tool

Use:

**Vite**

The React application should follow a standard Vite project structure.

Example:

```text
agri-vision/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── data/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── assets/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── index.html
│   └── package.json
│
└── server/
    ├── routes/
    ├── controllers/
    ├── services/
    ├── data/
    ├── app.js
    └── package.json
```

The exact folder structure can be adjusted if necessary, but maintain a clean separation between frontend and backend.

---

# Frontend Architecture

Build the UI using reusable React components.

Examples:

- Sidebar
- TopNavigation
- MetricCard
- FieldCard
- FieldMap
- SpectralViewer
- SpectralLayerSelector
- ImageComparison
- ZoneOverlay
- ZoneDetailsDrawer
- AIAnalysisPanel
- RecommendationCard
- AlertCard
- HealthTrend
- RiskHeatmap
- StatusBadge
- LoadingAnalysis
- EmptyState

Avoid creating one enormous React component.

Keep components modular and reusable.

---

# Routing

Use client-side routing for the major application screens.

Suggested routes:

```text
/                  → Dashboard
/fields            → Fields
/fields/:id        → Field Analysis
/health            → Crop Health
/soil              → Soil Intelligence
/pest-risk         → Pest Risk
/alerts            → Alerts
/reports           → Reports
```

The Field Analysis route should dynamically display the selected field's information.

---

# Data Architecture

For the prototype, create a centralized mock-data layer.

Example conceptual structure:

```javascript
const fields = [
  {
    id: "field-d",
    name: "Field D",
    crop: "Wheat",
    area: 12.4,
    health: 63,
    soilMoisture: 31,
    pestRisk: 78,
    zones: [...]
  }
];
```

Keep mock data separate from UI components.

Do not hardcode the same values independently inside multiple components.

The same field and zone data should power:

- Dashboard
- Field Analysis
- Health Monitoring
- Soil Intelligence
- Pest Risk
- Alerts
- Reports

This will make the prototype behave like a real application.

---

# Future ML Integration

Design the application so the current mock analysis layer can later be replaced by real machine-learning services.

Current:

```text
Multispectral Image
        ↓
Mock Analysis Data
        ↓
React Dashboard
```

Future:

```text
Multispectral Image
        ↓
Node.js / Express API
        ↓
ML / AI Analysis Service
        ↓
Crop Health
Soil Condition
Pest Risk
Anomaly Detection
        ↓
React Dashboard
```

Do not tightly couple the frontend to the mocked results.

The UI should consume structured analysis data as if it were coming from an API.

---

# API-Ready Design

Even though the current prototype can use mock data, conceptually prepare endpoints such as:

```text
GET    /api/farms
GET    /api/fields
GET    /api/fields/:id
GET    /api/fields/:id/analysis
GET    /api/fields/:id/zones
GET    /api/fields/:id/health
GET    /api/fields/:id/soil
GET    /api/fields/:id/pest-risk
GET    /api/alerts
GET    /api/reports/:fieldId
```

These endpoints do not need to be fully implemented for the visual prototype unless required.

---

# Styling

Use:

**Tailwind CSS**

for the frontend styling.

Do not introduce another CSS framework.

Do not use:

- Bootstrap
- Material UI
- Chakra UI
- Ant Design

The design system should be implemented consistently using Tailwind CSS utility classes and reusable React components.

---

# Important Technology Restrictions

Strictly follow these constraints:

**Frontend**
→ React.js + Vite + JavaScript + Tailwind CSS

**Backend**
→ Node.js + Express.js

**Language**
→ JavaScript only

Do NOT introduce:

- TypeScript
- Next.js
- Angular
- Vue
- Create React App
- Bootstrap
- Material UI
- Other frontend frameworks

The application should be structured so that the current prototype can evolve into the final SIH solution without requiring a major frontend rewrite.

---

# Final Technical Principle

The prototype should separate:

**Presentation**

from

**Data**

from

**Analysis**

so that the mocked AI results used today can later be replaced by real ML predictions.

The current goal is:

**Build the complete user experience now.**

The future goal is:

**Replace the mocked analysis engine with the actual AI/ML pipeline without changing the core UI.**