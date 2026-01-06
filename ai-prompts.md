# AI Prompts

## Examples

1. 
    How long do you think it will take us to complete this assignment in angular 20?

    Can you review sketch websites?

    **response**

Short answer: yes, this is very doable in the stated 6–8 hours, but only if you’re disciplined about scope and sequence. Below is a realistic time estimate, plus a design/Sketch review from a frontend implementation perspective, and a recommended execution plan to hit the bar.

⸻

⏱️ Time Estimate (Angular 20, experienced dev)

Assuming:
	•	You’re comfortable with Angular standalone components, RxJS, and date math
	•	You don’t over-engineer (no premature virtual scroll, no full calendar lib)
	•	Pixel-perfect but pragmatic (no custom font rendering rabbit holes)

Core (Required) — ~6.5–7.5 hours

Task	Est. Time
Project setup (Angular 20, libs, SCSS, fonts)	20 min
Data models + sample data	20 min
Timeline layout (fixed left, scrollable right)	45 min
Date scale logic (day/week/month headers)	60 min
Bar positioning (date → pixel math)	60–75 min
Current-day indicator	15 min
Create/Edit slide-out panel (form + styling)	60 min
Click-to-create (date inference)	30 min
Edit/Delete via kebab menu	20 min
Overlap detection logic	30 min
Polish + bug fixes	45 min
README + comments	20 min

➡️ Total: ~6.5–7.5 hours

This aligns well with their explicit 6–8 hour timebox.

⸻

Bonus Features (Only if time remains)

Feature	Extra Time
localStorage persistence	+20 min
Simple animations (panel slide, hover)	+15–20 min
“Today” button	+10 min
Tooltips on bars	+15 min
Unit tests (basic)	+45–60 min


⸻

🎨 Sketch / Design Review (Frontend POV)

I can’t inspect the file pixel-by-pixel here, but based on the brief and typical Sketch ERP designs, here’s what matters most and where teams usually lose time.

What looks straightforward

✅ Layout
	•	Fixed left column + scrollable timeline is standard
	•	Header + rows align cleanly
	•	No complex nested grids

✅ Visual hierarchy
	•	Status pills
	•	Kebab menu
	•	Slide-in panel

These are all common patterns and Angular-friendly.

⸻

⚠️ Where the real complexity is

1. Timeline scale math (biggest risk)
This is the hardest part of the assignment, not Angular.

You’ll need:
	•	A canonical visibleStartDate
	•	A pixelsPerUnit depending on scale
	•	A function like:

dateToX(date: Date): number {
  return differenceInDays(date, visibleStartDate) * dayWidthPx;
}

🔴 Common pitfall:
Trying to recompute everything on scroll instead of decoupling date math from DOM scroll.

✅ Recommendation:
	•	Precompute date columns
	•	Let scroll just move the viewport
	•	Recalculate only on zoom change

⸻

2. Pixel-perfect expectations
They explicitly say “don’t guess, measure”.

This means:
	•	You must inspect Sketch for:
	•	Row heights
	•	Header heights
	•	Badge padding
	•	Font sizes
	•	Hardcode constants (that’s OK here)

const ROW_HEIGHT = 56;
const DAY_WIDTH = 48;

This is expected, not bad practice, in a design test.

⸻

3. Slide-out panel behavior
Looks simple, but they will notice:
	•	Click-outside-to-close
	•	Scroll locking
	•	Correct animation timing

✅ Use:
	•	Fixed positioned panel
	•	Backdrop div
	•	Simple CSS transition (no animation lib needed)

⸻

4. Overlap detection
Logic is easy but must be correct:

overlaps(a, b) {
  return a.start <= b.end && b.start <= a.end;
}

Edge cases:
	•	Editing an existing order (exclude itself)
	•	Inclusive vs exclusive dates (decide and comment!)

⸻

🧠 Architectural Expectations (What reviewers want to see)

You don’t need brilliance — just clean thinking.

Good signals:
	•	TimelineComponent
	•	WorkOrderBarComponent
	•	WorkOrderPanelComponent
	•	TimelineService (date math + scale logic)
	•	Strong typing for documents
	•	@upgrade comments instead of half-baked features

Red flags:

🚫 One giant component
🚫 Inline date math everywhere
🚫 CSS hacks instead of layout structure
🚫 Overusing external libs (calendar libs are overkill here)

⸻

🧩 Angular 20 Fit

Angular 20 is actually a plus here:
	•	Standalone components reduce boilerplate
	•	Signals (optional) are nice but not required
	•	OnPush + trackBy = easy performance win

They are not testing Angular 20 features, they are testing:

“Can you build a real UI with constraints?”

⸻

🎯 Final Verdict

Yes — this assignment is well-calibrated for a senior frontend engineer in ~7 hours.

If I were evaluating:
	•	I’d expect ~85–90% completeness
	•	Clean architecture
	•	Honest @upgrade notes for:
	•	Infinite scroll
	•	Deep accessibility
	•	Full test coverage

If you want, next I can:
	•	Break this into a strict 6-hour execution plan
	•	Propose a component & service structure
	•	Draft overlap detection + date math utilities
	•	Help you plan what to intentionally skip (very important in timed tests)

Just tell me how deep you want to go.


## Question 2

Let's see the component & service structure

---

Great choice — getting the component & service structure right upfront is the biggest leverage move for this assignment.

Below is a clean, review-friendly Angular 20 structure that fits the timebox, maps directly to the requirements, and makes your Loom walkthrough easy.

⸻

🧱 High-Level Architecture

Principles
	•	Standalone components only
	•	One “smart” container (timeline)
	•	Small, focused presentational components
	•	Services handle date math + data state
	•	No global store (NgRx would be overkill)

src/
 ├─ app/
 │   ├─ app.component.ts
 │   ├─ app.routes.ts
 │
 │   ├─ core/
 │   │   ├─ models/
 │   │   │   ├─ document.model.ts
 │   │   │   ├─ work-center.model.ts
 │   │   │   └─ work-order.model.ts
 │   │   │
 │   │   ├─ services/
 │   │   │   ├─ work-order.service.ts
 │   │   │   └─ timeline.service.ts
 │   │
 │   ├─ features/
 │   │   └─ timeline/
 │   │       ├─ timeline.component.ts        ← container
 │   │       ├─ timeline.component.scss
 │   │       │
 │   │       ├─ components/
 │   │       │   ├─ timeline-header/
 │   │       │   │   ├─ timeline-header.component.ts
 │   │       │   │   └─ timeline-header.component.scss
 │   │       │   │
 │   │       │   ├─ timeline-grid/
 │   │       │   │   ├─ timeline-grid.component.ts
 │   │       │   │   └─ timeline-grid.component.scss
 │   │       │   │
 │   │       │   ├─ work-center-row/
 │   │       │   │   ├─ work-center-row.component.ts
 │   │       │   │   └─ work-center-row.component.scss
 │   │       │   │
 │   │       │   ├─ work-order-bar/
 │   │       │   │   ├─ work-order-bar.component.ts
 │   │       │   │   └─ work-order-bar.component.scss
 │   │       │   │
 │   │       │   ├─ work-order-panel/
 │   │       │   │   ├─ work-order-panel.component.ts
 │   │       │   │   └─ work-order-panel.component.scss
 │   │       │   │
 │   │       │   └─ kebab-menu/
 │   │       │       ├─ kebab-menu.component.ts
 │   │       │       └─ kebab-menu.component.scss
 │
 └─ styles/
     ├─ _variables.scss
     ├─ _mixins.scss
     └─ _typography.scss


⸻

🧠 Responsibility Breakdown

1️⃣ TimelineComponent (Smart Container)

Responsibilities
	•	Orchestrates everything
	•	Holds current zoom level
	•	Holds selected work order (edit mode)
	•	Listens for create/edit/delete events

@Component({ standalone: true })
export class TimelineComponent {
  zoomLevel: ZoomLevel = 'day';
  selectedWorkOrder: WorkOrderDocument | null = null;
  isPanelOpen = false;

  constructor(
    public timelineService: TimelineService,
    public workOrderService: WorkOrderService
  ) {}

  onCreateAt(date: Date, workCenterId: string) { ... }
  onEdit(order: WorkOrderDocument) { ... }
  onDelete(orderId: string) { ... }
}

✅ This is the component you screen-share in Loom.

⸻

2️⃣ TimelineService (Date + Scale Brain 🧠)

This is the most important service.

Responsibilities
	•	Visible date range
	•	Column generation (days / weeks / months)
	•	Date → pixel calculations
	•	Current day indicator position

@Injectable({ providedIn: 'root' })
export class TimelineService {
  readonly DAY_WIDTH = 48;
  readonly WEEK_WIDTH = 120;
  readonly MONTH_WIDTH = 180;

  zoomLevel = signal<ZoomLevel>('day');
  visibleStart = signal<Date>(startOfTodayMinus(14));
  visibleEnd = signal<Date>(addDays(today(), 14));

  columns = computed(() =>
    generateColumns(this.visibleStart(), this.visibleEnd(), this.zoomLevel())
  );

  dateToX(date: Date): number {
    return differenceInDays(date, this.visibleStart()) * this.DAY_WIDTH;
  }
}

🟢 Reviewers love seeing:
	•	Centralized date logic
	•	Constants instead of magic numbers
	•	Comments explaining math

⸻

3️⃣ WorkOrderService (Data + Validation)

Responsibilities
	•	Holds work centers & work orders
	•	CRUD operations
	•	Overlap detection
	•	(Bonus) localStorage persistence

@Injectable({ providedIn: 'root' })
export class WorkOrderService {
  workCenters = signal<WorkCenterDocument[]>(SAMPLE_WORK_CENTERS);
  workOrders = signal<WorkOrderDocument[]>(SAMPLE_WORK_ORDERS);

  create(order: WorkOrderDocument) { ... }
  update(order: WorkOrderDocument) { ... }
  delete(id: string) { ... }

  hasOverlap(order: WorkOrderDocument, excludeId?: string): boolean { ... }
}

Keep it boring and readable.

⸻

🧩 Presentation Components

4️⃣ TimelineHeaderComponent

Responsibilities
	•	Timescale dropdown (ng-select)
	•	Renders date labels
	•	Emits zoom change

@Input() columns!: TimelineColumn[];
@Input() zoomLevel!: ZoomLevel;
@Output() zoomChange = new EventEmitter<ZoomLevel>();


⸻

5️⃣ TimelineGridComponent

Responsibilities
	•	Scroll container
	•	Emits click position → date
	•	Renders current-day indicator

@Output() createAt = new EventEmitter<CreateEvent>();

onClick(event: MouseEvent) {
  const date = this.timelineService.xToDate(event.offsetX);
  this.createAt.emit({ date, workCenterId });
}


⸻

6️⃣ WorkCenterRowComponent

Responsibilities
	•	Displays work center label
	•	Hosts bars for that row
	•	Row hover highlight

@Input() workCenter!: WorkCenterDocument;
@Input() orders!: WorkOrderDocument[];


⸻

7️⃣ WorkOrderBarComponent

Responsibilities
	•	Render bar at correct x/width
	•	Status pill
	•	Kebab menu trigger

@Input() order!: WorkOrderDocument;
@Output() edit = new EventEmitter<void>();
@Output() delete = new EventEmitter<void>();

CSS does most of the work here.

⸻

8️⃣ WorkOrderPanelComponent (Create + Edit)

Responsibilities
	•	Reactive form
	•	Create vs Edit mode
	•	Validation
	•	Slide-in animation

@Input() mode!: 'create' | 'edit';
@Input() initialOrder?: WorkOrderDocument;
@Output() save = new EventEmitter<WorkOrderDocument>();
@Output() close = new EventEmitter<void>();

🟢 This reuse is something reviewers explicitly look for.

⸻

9️⃣ KebabMenuComponent

Optional but clean.

Responsibilities
	•	Three-dot button
	•	Dropdown logic
	•	Emits actions

Keeps bar component simple.

⸻

🔑 Models (Strong Typing = Easy Points)

export interface DocumentBase {
  docId: string;
  docType: string;
}

export interface WorkCenterDocument extends DocumentBase {
  docType: 'workCenter';
  data: { name: string };
}

export interface WorkOrderDocument extends DocumentBase {
  docType: 'workOrder';
  data: {
    name: string;
    workCenterId: string;
    status: WorkOrderStatus;
    startDate: string;
    endDate: string;
  };
}


⸻

📝 @upgrade Comments (Use These!)

Examples reviewers love:

// @upgrade: replace fixed date range with infinite horizontal scroll

// @upgrade: extract overlap detection into reusable validation service

// @upgrade: virtualize timeline columns for very large ranges


⸻

🎬 Loom Walkthrough Tip

When demoing:
	1.	Show TimelineService first (date math)
	2.	Show WorkOrderService (overlap logic)
	3.	Show panel reuse (create vs edit)
	4.	Point out @upgrade comments

This signals senior-level thinking.

⸻

If you want next, I can:
	•	Draft TimelineService date math
	•	Implement overlap detection cleanly
	•	Sketch SCSS layout strategy
	•	Provide a 6-hour execution checklist

Just say the word.