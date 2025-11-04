# MODULE 2: Building Basic Visualizations

---

## **Topic 5: Creating Your First Visualization**

### **Understanding How Tableau Builds Views**

Tableau works on a **drag-and-drop** principle, but there's logic behind it. Every visualization is built using:
- **Shelves** (where you place fields)
- **Cards** (where you control visual properties)
- **Panes** (the actual visualization area)

### **The Core Shelves:**

1. **Columns Shelf** - Controls the horizontal structure
2. **Rows Shelf** - Controls the vertical structure
3. **Filters Shelf** - Limits what data is shown
4. **Marks Card** - Controls HOW data appears (color, size, shape, label, detail, tooltip)

### **The Golden Rule:**
> **Rows + Columns = Your Chart Type**
> What you put on Rows and Columns determines what visualization Tableau creates.

---

### **Building Your First Chart - Step by Step**

**Example Dataset:** Superstore (comes with Tableau)

**Scenario 1: Sales by Category (Bar Chart)**

**Steps:**
1. Connect to Sample - Superstore dataset
2. Drag **Category** (Dimension) → **Rows Shelf**
3. Drag **Sales** (Measure) → **Columns Shelf**

**What happens?**
- Tableau creates a **horizontal bar chart**
- Each bar represents a category
- Bar length represents total sales

**Why this happens:**
- Category (discrete/blue field) on Rows = creates separate bars
- Sales (continuous/green field) on Columns = creates horizontal axis with values
- Tableau automatically **aggregates** Sales as SUM(Sales)

---

**Scenario 2: Sales Over Time (Line Chart)**

**Steps:**
1. Drag **Order Date** → **Columns Shelf**
2. Drag **Sales** → **Rows Shelf**

**What happens?**
- Tableau creates a **line chart**
- X-axis shows time progression
- Y-axis shows sales values

**Key Insight:**
- Date fields automatically create a **time hierarchy** (Year → Quarter → Month → Day)
- Right-click on the date pill to change the level (Year, Quarter, Month, etc.)
- Continuous dates (green) create flowing lines
- Discrete dates (blue) create separate points

---

### **Understanding Pills (Field Buttons)**

When you drag fields to shelves, they appear as **pills** with colors:

**🔵 Blue Pills = Discrete (Separate/Categorical)**
- Creates headers, separate marks
- "Give me individual categories"
- Example: Product names, regions, categories

**🟢 Green Pills = Continuous (Flowing/Numeric)**
- Creates axes with ranges
- "Give me a range of values"
- Example: Sales amounts, profit, dates as continuous timeline

**You can convert between them:**
- Right-click on pill → Choose "Discrete" or "Continuous"

---

### **The Three Ways to Build Charts:**

**Method 1: Manual Drag & Drop** (Recommended for learning)
- You control exactly what goes where
- Best for understanding Tableau's logic

**Method 2: Double-Click**
- Double-click a field, Tableau adds it automatically
- First field → Rows, Second field → Columns
- Fast but less control

**Method 3: Show Me Panel** (We'll cover next)
- Select fields, click chart type
- Good for quick exploration
- Can make you lazy in understanding

---

## **Topic 6: Show Me Panel & Chart Types**

### **What is Show Me?**

The Show Me panel (top-right corner) displays all available chart types. It:
- Shows which charts are **possible** with selected fields
- **Grays out** impossible combinations
- Automatically arranges fields for you

### **How to Use Show Me:**

1. Select fields from data pane (Ctrl+Click for multiple)
2. Open Show Me panel
3. Click on available (colored) chart type
4. Tableau builds it automatically

---

### **Chart Types & When to Use Them**

**This is CRITICAL for scenario-based MCQs!**

| Chart Type | Data Requirements | Best Used For | Exam Scenarios |
|------------|------------------|---------------|----------------|
| **Bar Chart** | 1 Dimension + 1 Measure | Comparing categories | "Which region has highest sales?" |
| **Line Chart** | Date + 1 Measure | Trends over time | "Show sales trend for last 3 years" |
| **Pie Chart** | 1 Dimension + 1 Measure | Part-to-whole (avoid if >5 categories) | "Market share by category" |
| **Scatter Plot** | 2 Measures + optional Dimension | Correlation/relationship | "Relationship between Sales and Profit" |
| **Heat Map** | 2 Dimensions + 1-2 Measures | Patterns in categorical data | "Sales performance by Region and Category" |
| **Tree Map** | 1+ Dimensions + 1 Measure | Hierarchical part-to-whole | "Product contribution to total sales" |
| **Bullet Graph** | 1 Dimension + 2 Measures | Actual vs Target comparison | "Sales vs Target by region" |
| **Box Plot** | 1 Dimension + 1 Measure | Distribution analysis | "Sales distribution across regions" |

---

### **Scenario-Based Question Examples:**

**Q1:** You need to show monthly revenue trend for the last 2 years. Which chart is most appropriate?
- A) Bar Chart
- B) Line Chart ✅
- C) Pie Chart
- D) Heat Map

**Why?** Time-based trends are best shown with line charts for continuous flow.

---

**Q2:** You have 15 product categories and need to compare their sales. Which chart should you avoid?
- A) Bar Chart
- B) Tree Map
- C) Pie Chart ✅
- D) Heat Map

**Why?** Pie charts become unreadable with >5-7 slices. Bar charts or tree maps are better.

---

**Q3:** You want to analyze if there's a relationship between discount percentage and profit margin. Best chart?
- A) Line Chart
- B) Bar Chart
- C) Scatter Plot ✅
- D) Bullet Graph

**Why?** Scatter plots show correlation between two numeric measures.

---

### **Chart Selection Decision Tree:**

```
START: What do you want to show?

├─ Compare categories? 
│  ├─ Few categories (<10)? → BAR CHART
│  └─ Many categories? → TREE MAP
│
├─ Show trend over time? → LINE CHART
│
├─ Show part of a whole?
│  ├─ Few parts (<7)? → PIE CHART
│  └─ Many parts? → TREE MAP
│
├─ Compare actual vs target? → BULLET GRAPH
│
├─ Show relationship between 2 numbers? → SCATTER PLOT
│
└─ Show patterns in table format? → HEAT MAP
```

---

## **Topic 7: Marks Card & Visual Encoding**

### **What is the Marks Card?**

The Marks Card controls **HOW your data is visually represented**. It's the most powerful customization area in Tableau.

**Location:** Left side, below the data pane

---

### **Components of Marks Card:**

#### **1. Mark Type Dropdown** (Top of Marks Card)

Controls the **shape** of your marks:
- **Automatic** - Tableau decides (default)
- **Bar** - Rectangular bars
- **Line** - Connected lines
- **Area** - Filled areas under lines
- **Square** - Fixed-size squares
- **Circle** - Dots/points
- **Shape** - Custom shapes
- **Text** - Numbers/text labels
- **Map** - Geographic maps
- **Pie** - Pie wedges
- **Gantt Bar** - Timeline bars
- **Polygon** - Custom shapes for maps
- **Density** - Heat density maps

**When to change it manually:**
- Tableau's automatic choice doesn't match your intent
- You want multiple mark types (requires dual axis)

---

#### **2. Color** 

**Purpose:** Add dimension of information through color

**Drag a field here to:**
- **Dimension (blue)** → Creates distinct colors for each category
  - Example: Drag "Region" → Each region gets different color
- **Measure (green)** → Creates color gradient
  - Example: Drag "Profit" → Green (high) to Red (low) gradient

**Customization:**
- Click Color button → Edit colors, transparency, borders
- Use color to highlight insights (red for negative, green for positive)

**Exam Tip:** Scenario questions often ask "How do you show profit by color intensity?" → Drag Profit to Color

---

#### **3. Size**

**Purpose:** Control mark size to show magnitude

**Drag a field here to:**
- **Measure** → Larger values = larger marks
  - Example: Drag "Sales" → Bigger bubbles for higher sales

**Customization:**
- Click Size slider → Adjust overall size
- Useful for scatter plots, bubble charts, tree maps

**Common mistake:** Don't put dimensions on Size (creates same-size marks with legend)

---

#### **4. Label**

**Purpose:** Show text on marks

**Drag a field here to:**
- Display values directly on visualization
- Can add multiple fields (shows all labels)

**Customization:**
- Click Label button → Adjust font, alignment, format
- Toggle "Show mark labels" checkbox

**Best Practice:**
- Use sparingly (cluttered labels = hard to read)
- Good for: Bar charts (show exact values), Maps (show location names)

---

#### **5. Detail**

**Purpose:** Add granularity WITHOUT visual change

**This is tricky but important for exams!**

**What it does:**
- Splits marks into more granular pieces
- Doesn't change how they LOOK
- Changes level of detail in data

**Example:**
- Bar chart showing Sales by Region
- Drag "Product Category" to Detail
- Still shows 4 regional bars, but now each bar represents sum of all categories
- If you drag Category to Color instead → bars split and show categories

**Exam scenarios:** "Show data at customer level but don't display customer names" → Add Customer to Detail

---

#### **6. Tooltip**

**Purpose:** Information shown on hover

**Drag a field here to:**
- Add information to hover popup
- Doesn't affect visualization appearance

**Customization:**
- Click Tooltip button → Edit text, formatting, add images
- Can include calculations, aggregations

**Best Practice:**
- Add context without cluttering view
- Include: exact values, percentages, additional dimensions

---

### **Visual Encoding Strategy (Exam Important!)**

**Question pattern:** "You need to show Sales by Region with Profit indicated. How?"

**Options analysis:**

**Option A:** Region on Rows, Sales on Columns, Profit on Color ✅
- **Best:** Easy to compare regions AND see profit at a glance

**Option B:** Region on Rows, Sales on Columns, Profit on Label
- **Okay:** But requires reading numbers (slower than color)

**Option C:** Region on Rows, Sales on Columns, Profit on Tooltip
- **Weak:** Requires hovering (not visible at a glance)

**Option D:** Region on Rows, Profit on Columns, Sales on Color
- **Wrong:** Reverses primary vs secondary metric

**Rule:** Most important metric → Position (Rows/Columns), Secondary → Color, Tertiary → Tooltip

---

### **Practical Exercise for You:**

After reading this, try this in Tableau:

**Exercise 1:**
1. Create Sales by Category bar chart
2. Add Region to Color → What changes?
3. Add Region to Detail instead → What's different?
4. Add Profit to Size → What happens?

**Exercise 2:**
1. Create scatter plot: Sales (Columns) vs Profit (Rows)
2. Add Category to Color
3. Add Sales to Size
4. Add Order Date to Detail → Notice mark count changes?

---

## **Topic 8: Filters (Basic & Quick Filters)**

### **What are Filters?**

Filters **limit what data is displayed** in your visualization. They answer: "Show me only..."

**Types of Filters in Tableau:**
1. **Dimension Filters** - Filter categorical data
2. **Measure Filters** - Filter numeric ranges
3. **Date Filters** - Filter time periods
4. **Context Filters** - Special filter that affects other filters
5. **Top N Filters** - Show top/bottom records

---

### **How to Add Filters:**

**Method 1: Drag to Filters Shelf**
- Drag any field from Data pane → Filters shelf
- Configure filter dialog appears

**Method 2: Right-click Field**
- Right-click field → "Show Filter"
- Creates filter and displays control on right side

**Method 3: Click Field in View**
- Click on mark/header → "Keep Only" or "Exclude"
- Quick ad-hoc filtering

---

### **Dimension Filters:**

**When you drag a dimension to Filters shelf, you get options:**

**1. General Tab**
- ☑ Select from list (checkboxes for each value)
- Example: Select only "East" and "West" regions

**2. Wildcard Tab**
- Filter based on text patterns
- Contains / Starts with / Ends with / Exactly matches
- Example: Products containing "Chair"

**3. Condition Tab**
- Filter based on calculations
- Example: "Show only Categories where SUM(Sales) > 10000"
- Uses aggregations

**4. Top Tab**
- Show Top/Bottom N by measure
- Example: "Top 5 customers by Sales"

---

### **Measure Filters:**

**When you drag a measure to Filters shelf:**

**1. Aggregation Dialog**
- Choose how to aggregate: Sum, Average, Median, Count, etc.
- Example: Filter by SUM(Sales) or AVG(Profit)

**2. Filter Range**
- **Range of values:** Slider with min/max
- **At least:** Minimum value only
- **At most:** Maximum value only
- **Special:** Null values, All values
- Example: Show only Sales > $5000

---

### **Date Filters:**

**Most versatile and exam-important!**

**Options when filtering dates:**

**1. Relative Date**
- Last N days/weeks/months/years
- Next N periods
- Example: "Last 3 months" (dynamically updates)
- **Exam favorite!** Questions like "Show rolling 6-month view"

**2. Range of Dates**
- Specific start and end dates
- Example: 01/01/2023 to 12/31/2023
- Static, doesn't update

**3. Date Part**
- Filter by Year, Quarter, Month, Day, etc.
- Example: Show only "Q1" across all years
- Great for seasonal analysis

**4. Individual Dates**
- Checkbox list of specific dates
- Rarely used for large datasets

**5. Count/Count (Distinct)**
- Filter based on number of records

---

### **Quick Filters:**

**What is a Quick Filter?**
- A filter **visible to users** on dashboard
- Allows interactive filtering
- Right side of view by default

**How to create:**
1. Right-click dimension/measure → "Show Filter"
2. OR: Drag to Filters shelf, then click dropdown → "Show Filter"

**Quick Filter Display Types:**
(Right-click on filter → "Single Value (list/dropdown/slider)" etc.)

**For Dimensions:**
- **Single Value (list)** - Radio buttons
- **Single Value (dropdown)** - Dropdown menu
- **Multiple Values (list)** - Checkboxes
- **Multiple Values (dropdown)** - Dropdown with checkboxes
- **Multiple Values (custom list)** - Search + select
- **Wildcard Match** - Text box for search
- **Slider** - For ordered dimensions

**For Measures:**
- **Range of Values (slider)** - Two-ended slider
- **At least (slider)** - One-ended slider (minimum)
- **At most (slider)** - One-ended slider (maximum)

---

### **Filter Order of Operations** (CRITICAL for Exams!)

Tableau applies filters in this order:

1. **Extract Filters** (if using data extract)
2. **Data Source Filters** (applied before visualization)
3. **Context Filters** (we'll cover in Module 7)
4. **Dimension Filters**
5. **Measure Filters**
6. **Table Calc Filters** (we'll cover in Module 7)

**Why this matters:**
- Measure filters are calculated AFTER dimension filters
- If you filter dimensions, it affects measure calculations

**Exam Scenario:**
"You filter to show Top 10 Products by Sales, but after adding a Region filter, the count changes. Why?"
- **Answer:** Dimension filter (Region) applies before Top N filter (measure-based), changing which products qualify for Top 10.

---

### **Filter Best Practices:**

✅ **DO:**
- Use Relative Date filters for rolling time periods
- Add filters to context if they should apply first (more in Module 7)
- Use Quick Filters for dashboard interactivity
- Combine filters for precise control

❌ **DON'T:**
- Over-filter (hides important patterns)
- Use too many Quick Filters (clutters dashboard)
- Filter without understanding order of operations

---

### **Scenario-Based Questions:**

**Q1:** You need to show "Last 6 months of sales" that updates daily. Which filter?
- A) Range of Dates
- B) Relative Date ✅
- C) Date Part
- D) Individual Dates

**Why?** Relative Date dynamically updates; Range of Dates is static.

---

**Q2:** You want users to select one or more regions interactively. Best quick filter type?
- A) Single Value (list)
- B) Multiple Values (list) ✅
- C) Wildcard Match
- D) Slider

**Why?** Multiple Values allows selecting multiple options; Single Value allows only one.

---

**Q3:** You filtered to show Top 5 products. Then you add a Category filter. What happens?
- A) Top 5 remains same across all categories
- B) Top 5 changes based on selected category ✅
- C) Filter error occurs
- D) All products show

**Why?** Dimension filter (Category) applies before Top N (measure-based filter), recalculating Top 5 within selected category.

---

### **Hands-On Practice for You:**

**Exercise 1: Dimension Filters**
1. Create Sales by Sub-Category bar chart
2. Filter to show only "Furniture" category
3. Show filter as Quick Filter (checkboxes)
4. Change to dropdown display

**Exercise 2: Measure Filters**
1. Same chart as above
2. Add filter: Show only Sub-Categories where SUM(Sales) > 50,000
3. Notice which bars disappear

**Exercise 3: Date Filters**
1. Create Sales over Time line chart
2. Add date filter: "Last 2 years" (relative)
3. Change to "Current Year" (relative)
4. Compare with "Range of Dates" - notice difference?

**Exercise 4: Top N Filter**
1. Create Sales by Customer bar chart
2. Filter: Top 10 Customers by Sales
3. Add Region filter → "East" only
4. Notice: Top 10 now shows top 10 in East region only

---

## **MODULE 2 SUMMARY**

### **Key Takeaways:**

✅ **Visualizations are built by** dragging fields to Rows, Columns, and Marks Card

✅ **Blue (Discrete) vs Green (Continuous)** determines whether you get categories or axes

✅ **Chart selection** depends on: data type, number of fields, and what insight you want to show

✅ **Marks Card hierarchy:** Position (Rows/Columns) > Color > Size > Label > Tooltip

✅ **Filters control what data displays;** order of operations matters for calculations

✅ **Quick Filters** make dashboards interactive

---

### **Common Exam Traps:**

❌ Confusing Discrete vs Continuous (affects chart type)
❌ Not knowing which chart fits which scenario
❌ Adding fields to wrong part of Marks Card
❌ Not understanding filter order of operations
❌ Using pie charts for too many categories

---

### **Before Moving to Module 3:**

Can you answer these? (Just think through them, don't need to reply unless stuck)

1. What's the difference between adding a field to Color vs Detail?
2. When would you use a scatter plot vs a bar chart?
3. If you want "last 3 months" to update automatically, which date filter type?
4. What happens if you put a dimension on the Size card?

---

**Ready for Module 3: Working with Data?** 

Let me know when you're ready, or if you want to:
- Practice more with Module 2
- Ask questions about anything unclear
- See more scenario-based practice questions

Type **"Module 3"** when you're ready to continue! 📊
