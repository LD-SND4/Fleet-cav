# Fleet App POC - Implementation Prompt

Build a Proof of Concept (POC) fleet tracking web application using the following stack, role boundaries, and product decisions.

---

## Frontend Stack

```txt
Next.js App Router
React
Leaflet + react-leaflet
Tailwind CSS
Fetch or Axios for API calls
SignalR client for realtime updates
Mocked TypeScript data first, backend DTO alignment later
```

---

## Backend Stack

```txt
.NET Core Web API
SignalR self-hosted
OpenRouteService routing API
PostgreSQL or SQL Server
JWT Authentication with role-based access
```

---

## User Roles

```txt
admin_user
dispatcher_user
driver_user
viewer_user
```

---

## Role Responsibilities

### Admin

```txt
Review route performance across fleets
Review fleet content and assigned vehicles
Review delivery timing and delay data
Review deliveries completed per driver
Inspect dispatcher-generated reports
```

### Dispatcher

```txt
Create starting routes for drivers
Assign vehicles and drivers to fleets
Manage multiple drivers at once
Review route, cargo content, cargo weight, gas usage, and gas cost
Approve or reject route updates
Trigger fleet detail actions such as call, chat, export email, or export sheet
```

### Driver

```txt
See only essential assigned route information
See distance, route, cargo content, stops, route changes, vehicle, and map
Send emergency stop alert to dispatcher
Avoid dense admin or dispatcher data that could distract while driving
```

### Viewer

```txt
See dispatcher-approved basic fleet information
Focus on cargo content, route, and delivery time
View one fleet by fleet id
Support one-driver and multi-driver fleets
```

---

## Fleet ID Convention

```txt
Use two city abbreviations plus the fleet vehicle number.
Example display label: Caracas-Valencia 01
Example fleet id: ccsval_01
```

---

## Recommended Next.js Routing

```txt
/admin
  Admin overview for fleet performance, route timing, deliveries per driver, and reports.

/dispatcher
  Dispatcher role home.

/dispatcher/tracking
  Redirects to the currently selected or default vehicle detail.

/dispatcher/tracking/[vehicleId]
  Main dispatcher tracking dashboard with card selection mapped to a dedicated route.

/dispatcher/requests
  Future operational module for trucks, cargos, repair, drivers, and reports.

/driver
  Driver route and vehicle view for the authenticated driver.

/viewer
  Redirects to a default or provided fleet id.

/viewer/fleet/[fleetId]
  External or limited viewer page for a dispatcher-approved fleet.
```

Recommendation: make `/dispatcher/tracking/[vehicleId]` the first production-like route because it matches the current dashboard image and supports card-to-detail navigation. Add the other role pages as lightweight skeletons first, then deepen each role after the dispatcher workflow is stable.

---

## Frontend Responsibilities

```txt
Render interactive map using Leaflet
Display vehicle markers in real time
Draw planned routes as polylines
Draw actual trajectory as historical paths
Handle map clicks to select Point A and Point B
Call backend to request route calculation
Display distance in km and estimated time in minutes
Listen to SignalR for live vehicle updates
Update marker positions dynamically
Show vehicle status such as in_transit, stopped, delayed
Provide driver actions:
  - request stop
  - request route update
  - send message or status
```

---

## Backend Responsibilities

```txt
Expose REST API endpoints for:
  - fleet creation
  - vehicle assignment
  - route calculation
  - route recalculation

Integrate OpenRouteService:
  - calculate routes from Point A to Point B
  - return geometry, distance, and duration

Handle driver GPS updates:
  - receive lat/lng periodically
  - store in database
  - broadcast via SignalR

Implement realtime communication:
  - vehicle location updates
  - driver to dispatcher messages
  - route update requests

Manage business logic:
  - fleet lifecycle
  - route assignment
  - approval or denial of route changes

Implement JWT authentication:
  - role-based access control
```

---

## Key Constraints - POC Free Usage

```txt
Use only free tiers or self-hosted services
Do not expose the OpenRouteService API key in the frontend
Call OpenRouteService only when:
  - creating the initial route
  - recalculating route on request

Do not call routing API on every GPS update

Limit GPS updates:
  - send every 5 to 10 seconds

Use OpenStreetMap tiles only for development and light usage

Keep number of vehicles small, under 20, for testing
```

---

## Core Features - MVP

```txt
Create fleet with departure time
Assign vehicles to fleet
Display all vehicles on map
Generate route from Point A to Point B
Show distance and ETA
Track vehicles in real time
Allow driver to:
  - send GPS location
  - request stop
  - request route update

Allow dispatcher to:
  - monitor fleet live
  - approve route updates
  - see trajectory
```

---

## Data Flow

```txt
Driver sends GPS to backend
Backend broadcasts updates through SignalR
Frontend updates markers

Frontend requests route from backend
Backend calls OpenRouteService
Backend returns route geometry, distance, and duration

Driver requests reroute
Backend recalculates through OpenRouteService
Backend broadcasts new route through SignalR
Frontend updates route view
```

---

## UI Scope Decisions

```txt
Build UI skeleton first, then integrate the real Leaflet map
Keep chat, call, and route-change actions inside the same dashboard for now
Use popouts later where the workflow benefits from it
Support desktop and tablet responsive layouts first
Keep both flexible component styling and early design tokens available while the UX settles
Represent Request as operational modules:
  - trucks
  - cargos
  - repair
  - drivers
  - reports
```

---

## Expected Output

```txt
Working Next.js frontend with route-based role skeletons
Mocked dispatcher tracking dashboard
Dedicated tracking detail route per vehicle
.NET Core backend with REST and SignalR in a later phase
OpenRouteService integration in a later phase
Basic role-based system
Realtime vehicle updates
Route visualization for planned vs actual paths
```

---

## Non-Goals - POC Scope

```txt
No payment system
No large-scale traffic handling
No advanced traffic-aware routing
No high-frequency GPS streaming under 5 seconds
No real map integration until the UI skeleton is approved
```
