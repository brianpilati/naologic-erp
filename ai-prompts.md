# AI Prompts & Timeline

## Timeline

1. 2025-01-06 - 1 hour
2. 2025-01-07 - .5 hours
3. 2025-01-07 - 2 hours
4. 2025-01-07 - 1.5 hours
5. 2025-01-08 - 2 hours

Total: 7 hours

## Prompt

1.  How long do you think it will take us to complete this assignment in angular 20?

    Can you review sketch websites?

    **response**

Short answer: yes, this is very doable in the stated 6–8 hours, but only if you’re disciplined about scope and sequence. Below is a realistic time estimate, plus a design/Sketch review from a frontend implementation perspective, and a recommended execution plan to hit the bar.

⸻

⏱️ Time Estimate (Angular 20, experienced dev)

Assuming:
• You’re comfortable with Angular standalone components, RxJS, and date math
• You don’t over-engineer (no premature virtual scroll, no full calendar lib)
• Pixel-perfect but pragmatic (no custom font rendering rabbit holes)

Core (Required) — ~6.5–7.5 hours

Task Est. Time
Project setup (Angular 20, libs, SCSS, fonts) 20 min
Data models + sample data 20 min
Timeline layout (fixed left, scrollable right) 45 min
Date scale logic (day/week/month headers) 60 min
Bar positioning (date → pixel math) 60–75 min
Current-day indicator 15 min
Create/Edit slide-out panel (form + styling) 60 min
Click-to-create (date inference) 30 min
Edit/Delete via kebab menu 20 min
Overlap detection logic 30 min
Polish + bug fixes 45 min
README + comments 20 min

➡️ Total: ~6.5–7.5 hours

This aligns well with their explicit 6–8 hour timebox.

⸻

Bonus Features (Only if time remains)

Feature Extra Time
localStorage persistence +20 min
Simple animations (panel slide, hover) +15–20 min
“Today” button +10 min
Tooltips on bars +15 min
Unit tests (basic) +45–60 min

⸻

🎨 Sketch / Design Review (Frontend POV)

I can’t inspect the file pixel-by-pixel here, but based on the brief and typical Sketch ERP designs, here’s what matters most and where teams usually lose time.

What looks straightforward

✅ Layout
• Fixed left column + scrollable timeline is standard
• Header + rows align cleanly
• No complex nested grids

✅ Visual hierarchy
• Status pills
• Kebab menu
• Slide-in panel

These are all common patterns and Angular-friendly.

⸻

⚠️ Where the real complexity is

1. Timeline scale math (biggest risk)
   This is the hardest part of the assignment, not Angular.

You’ll need:
• A canonical visibleStartDate
• A pixelsPerUnit depending on scale
• A function like:

dateToX(date: Date): number {
return differenceInDays(date, visibleStartDate) \* dayWidthPx;
}

🔴 Common pitfall:
Trying to recompute everything on scroll instead of decoupling date math from DOM scroll.

✅ Recommendation:
• Precompute date columns
• Let scroll just move the viewport
• Recalculate only on zoom change

⸻

2. Pixel-perfect expectations
   They explicitly say “don’t guess, measure”.

This means:
• You must inspect Sketch for:
• Row heights
• Header heights
• Badge padding
• Font sizes
• Hardcode constants (that’s OK here)

const ROW_HEIGHT = 56;
const DAY_WIDTH = 48;

This is expected, not bad practice, in a design test.

⸻

3. Slide-out panel behavior
   Looks simple, but they will notice:
   • Click-outside-to-close
   • Scroll locking
   • Correct animation timing

✅ Use:
• Fixed positioned panel
• Backdrop div
• Simple CSS transition (no animation lib needed)

⸻

4. Overlap detection
   Logic is easy but must be correct:

overlaps(a, b) {
return a.start <= b.end && b.start <= a.end;
}

Edge cases:
• Editing an existing order (exclude itself)
• Inclusive vs exclusive dates (decide and comment!)

⸻

🧠 Architectural Expectations (What reviewers want to see)

You don’t need brilliance — just clean thinking.

Good signals:
• TimelineComponent
• WorkOrderBarComponent
• WorkOrderPanelComponent
• TimelineService (date math + scale logic)
• Strong typing for documents
• @upgrade comments instead of half-baked features

Red flags:

🚫 One giant component
🚫 Inline date math everywhere
🚫 CSS hacks instead of layout structure
🚫 Overusing external libs (calendar libs are overkill here)

⸻

🧩 Angular 20 Fit

Angular 20 is actually a plus here:
• Standalone components reduce boilerplate
• Signals (optional) are nice but not required
• OnPush + trackBy = easy performance win

They are not testing Angular 20 features, they are testing:

“Can you build a real UI with constraints?”

⸻

🎯 Final Verdict

Yes — this assignment is well-calibrated for a senior frontend engineer in ~7 hours.

If I were evaluating:
• I’d expect ~85–90% completeness
• Clean architecture
• Honest @upgrade notes for:
• Infinite scroll
• Deep accessibility
• Full test coverage

If you want, next I can:
• Break this into a strict 6-hour execution plan
• Propose a component & service structure
• Draft overlap detection + date math utilities
• Help you plan what to intentionally skip (very important in timed tests)

Just tell me how deep you want to go.

## Prompt

Let's see the component & service structure

---

Great choice — getting the component & service structure right upfront is the biggest leverage move for this assignment.

Below is a clean, review-friendly Angular 20 structure that fits the timebox, maps directly to the requirements, and makes your Loom walkthrough easy.

⸻

🧱 High-Level Architecture

Principles
• Standalone components only
• One “smart” container (timeline)
• Small, focused presentational components
• Services handle date math + data state
• No global store (NgRx would be overkill)

src/
├─ app/
│ ├─ app.component.ts
│ ├─ app.routes.ts
│
│ ├─ core/
│ │ ├─ models/
│ │ │ ├─ document.model.ts
│ │ │ ├─ work-center.model.ts
│ │ │ └─ work-order.model.ts
│ │ │
│ │ ├─ services/
│ │ │ ├─ work-order.service.ts
│ │ │ └─ timeline.service.ts
│ │
│ ├─ features/
│ │ └─ timeline/
│ │ ├─ timeline.component.ts ← container
│ │ ├─ timeline.component.scss
│ │ │
│ │ ├─ components/
│ │ │ ├─ timeline-header/
│ │ │ │ ├─ timeline-header.component.ts
│ │ │ │ └─ timeline-header.component.scss
│ │ │ │
│ │ │ ├─ timeline-grid/
│ │ │ │ ├─ timeline-grid.component.ts
│ │ │ │ └─ timeline-grid.component.scss
│ │ │ │
│ │ │ ├─ work-center-row/
│ │ │ │ ├─ work-center-row.component.ts
│ │ │ │ └─ work-center-row.component.scss
│ │ │ │
│ │ │ ├─ work-order-bar/
│ │ │ │ ├─ work-order-bar.component.ts
│ │ │ │ └─ work-order-bar.component.scss
│ │ │ │
│ │ │ ├─ work-order-panel/
│ │ │ │ ├─ work-order-panel.component.ts
│ │ │ │ └─ work-order-panel.component.scss
│ │ │ │
│ │ │ └─ kebab-menu/
│ │ │ ├─ kebab-menu.component.ts
│ │ │ └─ kebab-menu.component.scss
│
└─ styles/
├─ \_variables.scss
├─ \_mixins.scss
└─ \_typography.scss

⸻

🧠 Responsibility Breakdown

1️⃣ TimelineComponent (Smart Container)

**_FINISHED_**

Responsibilities
• Orchestrates everything
• Holds current zoom level
• Holds selected work order (edit mode)
• Listens for create/edit/delete events

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

**_FINISHED_**

This is the most important service.

Responsibilities
• Visible date range
• Column generation (days / weeks / months)
• Date → pixel calculations
• Current day indicator position

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
return differenceInDays(date, this.visibleStart()) \* this.DAY_WIDTH;
}
}

🟢 Reviewers love seeing:
• Centralized date logic
• Constants instead of magic numbers
• Comments explaining math

⸻

3️⃣ WorkOrderService (Data + Validation)

**_FINISHED_**

Responsibilities
• Holds work centers & work orders
• CRUD operations
• Overlap detection
• (Bonus) localStorage persistence

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

**_FINISHED_**

Responsibilities
• Timescale dropdown (ng-select)
• Renders date labels
• Emits zoom change

@Input() columns!: TimelineColumn[];
@Input() zoomLevel!: ZoomLevel;
@Output() zoomChange = new EventEmitter<ZoomLevel>();

⸻

5️⃣ TimelineGridComponent

Responsibilities
• Scroll container
• Emits click position → date
• Renders current-day indicator

@Output() createAt = new EventEmitter<CreateEvent>();

onClick(event: MouseEvent) {
const date = this.timelineService.xToDate(event.offsetX);
this.createAt.emit({ date, workCenterId });
}

⸻

6️⃣ WorkCenterRowComponent

Responsibilities
• Displays work center label
• Hosts bars for that row
• Row hover highlight

@Input() workCenter!: WorkCenterDocument;
@Input() orders!: WorkOrderDocument[];

⸻

7️⃣ WorkOrderBarComponent

Responsibilities
• Render bar at correct x/width
• Status pill
• Kebab menu trigger

@Input() order!: WorkOrderDocument;
@Output() edit = new EventEmitter<void>();
@Output() delete = new EventEmitter<void>();

CSS does most of the work here.

⸻

8️⃣ WorkOrderPanelComponent (Create + Edit)

Responsibilities
• Reactive form
• Create vs Edit mode
• Validation
• Slide-in animation

@Input() mode!: 'create' | 'edit';
@Input() initialOrder?: WorkOrderDocument;
@Output() save = new EventEmitter<WorkOrderDocument>();
@Output() close = new EventEmitter<void>();

🟢 This reuse is something reviewers explicitly look for.

⸻

9️⃣ KebabMenuComponent

Optional but clean.

Responsibilities
• Three-dot button
• Dropdown logic
• Emits actions

Keeps bar component simple.

⸻

🔑 Models (Strong Typing = Easy Points)

**_FINISHED_**

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

When demoing: 1. Show TimelineService first (date math) 2. Show WorkOrderService (overlap logic) 3. Show panel reuse (create vs edit) 4. Point out @upgrade comments

This signals senior-level thinking.

⸻

If you want next, I can:
• Draft TimelineService date math
• Implement overlap detection cleanly
• Sketch SCSS layout strategy
• Provide a 6-hour execution checklist

Just say the word.

## Prompt

I have created all the models and extracted the types to be a stand-alone file.

What does the work-order.service look like now?

## Prompt

We will be using our standard testing data helpers.

import { WorkCenterDocument } from '../app/core/models/work-center-document.model';

const DATA: WorkCenterDocument[] = [
{ docId: 'wc-1', docType: 'workCenter', data: { name: 'Extrusion Line A' } },
{ docId: 'wc-2', docType: 'workCenter', data: { name: 'CNC Machine 1' } },
{ docId: 'wc-3', docType: 'workCenter', data: { name: 'Assembly Station' } },
{ docId: 'wc-4', docType: 'workCenter', data: { name: 'Quality Control' } },
{ docId: 'wc-5', docType: 'workCenter', data: { name: 'Packaging Line' } },
];

export function getWorkCenterDocumentData(index?: number, asArray = false): WorkCenterDocument| WorkCenterDocument[] {
if (index !== undefined && index >= 0 && index < DATA.length) {
const item = structuredClone(DATA[index]);
return asArray ? [item] : item;
}

return structuredClone(DATA);
}

## Prompt

Before we go further, I need a 100% jasmine test suite for this code. As usual, as few spyies and mocks as possible.

## Prompt

What does the timeline.service.ts file look like now?

## Prompt

Now I need a 100% jasmine test suite for that service

## Prompt

This test is failing

## Prompt

I need a test for this method

todayIndicatorX(today = new Date()): number {
return this.dateToX(today);
}

## Prompt

Now a test for this method

---

private startOfWeek(date: Date): Date {
const d = new Date(date);
const day = d.getDay() || ---> 7; // Monday start
d.setDate(d.getDate() - day + 1);
d.setHours(0, 0, 0, 0);
return d;
}

## prompt

Well, this test did not get the || 7 branch

it('should return Monday as start of week for a weekday', () => {
const date = localDate(2025, 1, 8); // Wed Jan 8, 2025

    const startOfWeek = (service as any).startOfWeek(date) as Date;

    expect(startOfWeek.getFullYear()).toBe(2025);
    expect(startOfWeek.getMonth()).toBe(0); // January
    expect(startOfWeek.getDate()).toBe(6); // Monday
    expect(startOfWeek.getHours()).toBe(0);
    expect(startOfWeek.getMinutes()).toBe(0);
    expect(startOfWeek.getSeconds()).toBe(0);

});

## Prompt

I don't think that is reachable when would d.getDay() not return a value?

## Prompt

I have labeled the items I've finished. Let's move to the timeline.component.ts. Give me the code for that component.

## Prompt

I now need the timeline.coponent.html and scss files

## Prompt

You magically created an import for timelineZoomLevel service. Is that needed for is it covered in the timeline.service?

## Prompt

Now let's tie it together and give me the app.componen.ts file and the app.routes.ts file that uses the timeline.component.

I will also need the app.component.html file that has a outlet_router. The default route and only route will be the timeline.component

## Prompt

I just looked at the :4200 output. Looks great. When I reviewed the html, you are using old angular directives like @ngFor. Moving forward only new angular 17+ directives.

## Prompt

And where did you get that strange \_\_ class names for the scss what that in their style guide?

### My thoughts and per your request of major decisions

-- This one stunk. I have no idea why my AI decided to go with BEM.

## Prompt

This is the new standard for scss files "-" instead of "\_\_"

## Prompt

Are we going to need these scss files?

└─ styles/
├─ \_variables.scss
├─ \_mixins.scss
└─ \_typography.scss

## Prompt

Give me a 100% jasmine test suite for this code.

<timeline.component.ts code>

## Prompt

Argument of type '{ workCenters: () => WorkCenterDocument[]; workOrders: () => WorkOrderDocument[]; }' is not assignable to parameter of type 'readonly (keyof WorkOrderService)[] | { readonly workCenters?: Signal<WorkCenterDocument[]> | undefined; readonly workOrders?: Signal<WorkOrderDocument[]> | undefined; ... 5 more ...; createDraft?: ((workCenterId: string, startDate: Date, endDate: Date) => WorkOrderDocument) | undefined; } | undefined'.
Types of property 'workCenters' are incompatible.
Type '() => WorkCenterDocument[]' is not assignable to type 'Signal<WorkCenterDocument[]>'.
Type '() => WorkCenterDocument[]' is not assignable to type '{ [SIGNAL]: unknown; }'.ts(2345)

---

workOrderService = jasmine.createSpyObj<WorkOrderService>(
'WorkOrderService',
['create', 'update', 'delete', 'createDraft', 'workOrdersByCenter'],
{
workCenters: () => [workCenter],
workOrders: () => [workOrder]
}
);

## Prompt

Moving forward all test files need to have the `provideZonelessChangeDetection(),` provider. Do not regenerate the file.

## Prompt

This is the new canon for linting and selector prefixes.

```ts
const tseslint = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');
const eslintPluginPrettier = require('eslint-plugin-prettier');
const angular = require('@angular-eslint/eslint-plugin');

module.exports = [
  {
    ignores: ['**/coverage/*', '**/projects/testing/**']
  },
  {
    files: ['./src/**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.eslint.json',
        tsconfigRootDir: __dirname,
        sourceType: 'module',
        ecmaVersion: 'latest'
      }
    },
    plugins: {
      '@typescript-eslint': tseslint,
      '@angular-eslint': angular,
      prettier: eslintPluginPrettier
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      'no-console': 2,
      'prettier/prettier': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_'
        }
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          prefix: 'erp',
          style: 'kebab-case',
          type: 'element'
        }
      ],
      '@angular-eslint/directive-selector': [
        'error',
        {
          prefix: 'erp',
          style: 'camelCase',
          type: 'attribute'
        }
      ]
    }
  },
  {
    files: ['**/*.spec.ts', './src/typings/*.d.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off'
    }
  }
];
```

## Prompt

Let's get the code for this component now, including the .ts, .html and .scss files in separate code windows.

🧩 Presentation Components

4️⃣ TimelineHeaderComponent

Responsibilities
• Timescale dropdown (ng-select)
• Renders date labels
• Emits zoom change

@Input() columns!: TimelineColumn[];
@Input() zoomLevel!: ZoomLevel;
@Output() zoomChange = new EventEmitter<ZoomLevel>();

---

Current implementation in timeline.component.html

---

```html
<app-timeline-header
  class="timeline-header"
  [columns]="timelineService.columns()"
  [zoomLevel]="timelineService.zoomLevel()"
  (zoomChange)="onZoomChange($event)" />
```

## Prompt

Do a websearch and solve this issue

---

Can't bind to 'modelValue' since it isn't a known property of 'ng-select'.

1. If 'modelValue' is an Angular directive, then add 'CommonModule' to the '@Component.imports' of this component.
2. To allow any property add 'NO_ERRORS_SCHEMA' to the '@Component.schemas' of this component.ngtsc(-998002)
   timeline-header.component.ts(12, 16): Error occurs in the template of component TimelineHeaderComponent.

---

```html
<ng-select
  class="timeline-header-select"
  [items]="zoomOptions"
  [clearable]="false"
  [searchable]="false"
  [modelValue]="zoomLevel"
  (change)="onZoomLevelChange($event)" />
```

## Prompt

Let's great a \_global.scss file and start to consolidate all the colors, etc. there.

--- Given these .scss files, give me a \_global.scss file with all the color variables

<two-scss-files>

## Prompt

Let's start with this file. Our "Work Orders" title, the timescale/month dropdown and Parent grid are not formatted correctly.

Can you analyze the attached file and give me the scss delta to come into pixel perfect alignment.

## Prompt

I see an issue ... this belongs in another component.

<div class="timeline-header-columns">
  @for (column of columns; track column.startDate.getTime()) {
    <div class="timeline-header-column" [style.width.px]="column.widthPx">
      {{ column.label }}
    </div>
  }
</div>

## Prompt

This is what I have for the header. The Timescale label is not in a container that matches the ng-select. And the spacing between the Work orders the controls is off.

Can you use that sketch file to fix the scss?

## Prompt

The scss is correct now but when I click on the triangle it disappears and the options do not appear

## Prompt

There has been a bit of a misunderstanding. The work center row and the app-timeline-grid are the same row. however the task can overlap months. It appears the dates should scroll left to right.

So the workcenter row corresponds to the task rows.

--- row 1 left

---

 <div class="timeline-left">
      <div class="work-center-header">
        <div class="work-center-header-label">Work Center</div>
      </div>

--- Row 1 right

<!-- <div class="timeline-header-columns">
  @for (column of columns; track column.startDate.getTime()) {
    <div class="timeline-header-column" [style.width.px]="column.widthPx">
      {{ column.label }}
    </div>
  }
</div> -->

--- rows - left
@for (center of workCenters(); track center.docId) {

<div class="timeline-work-center">
{{ center.data.name }}
</div>
}
</div>

--- Then the tasks assigned to the work center are on the right

## Prompt

This is the route you were planning.

Let's create the app-timeline-grid and merge all this code into one component. Or what do you recommend?

---

 <!-- Left: Work Centers (fixed) -->

    <div class="timeline-left">
      <div class="work-center-header">
        <div class="work-center-header-label">Work Center</div>
      </div>

      @for (center of workCenters(); track center.docId) {
        <div class="timeline-work-center">
          {{ center.data.name }}
        </div>
      }
    </div>

    <!-- Right: Timeline Grid (scrollable) -->
    <div class="timeline-right">
      app-timeline-grid
      <!-- <app-timeline-grid
        [columns]="timelineService.columns()"
        (createAt)="onCreateAt($event.date, $event.workCenterId)"
      >
        @for (center of workCenters(); track center.docId) {
          <app-work-center-row
            [workCenter]="center"
            [orders]="workOrdersForCenter(center)"
            (edit)="onEdit($event)"
            (delete)="onDelete($event)"
          />
        }
      </app-timeline-grid>
           -->
    </div>

## Prompt

In the timeilne-grid-rows, I need a way to display an empty word-order-bar when they hover on the timeline-grid-rows and not on a work-order-bar. They the user hovers, it creates the work-order-bar with an angular tool-top that says "Click to add dates".

Which copmonent would be best suited to handle the click?

<files>

## Prompt

## Prompt

## Prompt

## Prompt

## Prompt

## Prompt

## Prompt

## Prompt

## Prompt

## Prompt

## Prompt

## Prompt

## Prompt

## Prompt

## Prompt

## Prompt

## Prompt

## Prompt

## Prompt

## Prompt

## Prompt

## Prompt

## Prompt

## Prompt

## Prompt

## Prompt
