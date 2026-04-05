import React, { useState } from "react";
import {
  Bot,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Circle,
  Compass,
  Flame,
  Plus,
  Sparkles,
  User,
  Users
} from "lucide-react";

const WEEK_DAYS = [
  { day: "M", date: 12 },
  { day: "T", date: 13 },
  { day: "W", date: 14, isRecommended: false },
  { day: "T", date: 15, isRecommended: true },
  { day: "F", date: 16 },
  { day: "S", date: 17 },
  { day: "S", date: 18 }
];

const TOP_CARDS = [
  { eyebrow: "Today's training", value: "12", suffix: "min" },
  { eyebrow: "Weight", value: "72.4", suffix: "kg", actionLabel: "Update" }
];

const INITIAL_NUTRITION_METRICS = [
  { key: "protein", name: "Protein", consumed: 84, target: 150, unit: "g", color: "#1C1E26" },
  { key: "carbs", name: "Carbs", consumed: 142, target: 230, unit: "g", color: "#D8C9B4" },
  { key: "fats", name: "Fats", consumed: 38, target: 60, unit: "g", color: "#7A9082" },
  { key: "fiber", name: "Fiber", consumed: 17, target: 28, unit: "g", color: "#A98D67" }
];

const INITIAL_CALORIE_SUMMARY = { target: 1850, consumed: 1300 };

const TRAINING_PLAN = [
  {
    id: 1,
    program: "Advanced full-body muscle gain plan",
    title: "Gym Training - Chest - High Efficiency Sculpt - Advanced",
    isActive: true
  },
  {
    id: 2,
    program: "Advanced full-body muscle gain plan",
    title: "Gym Training - Abs - High Efficiency Sculpt - Advanced"
  },
  {
    id: 3,
    program: "Advanced full-body muscle gain plan",
    title: "Gym Training - Shoulders - High Efficiency Sculpt - Advanced"
  }
];

const FOOD_LIBRARY = [
  { id: "chicken-breast", name: "Chicken Breast", defaultGrams: 150, focus: "Protein", nutrients: { protein: 31, carbs: 0, fats: 3.6, fiber: 0, calories: 165 } },
  { id: "greek-yogurt", name: "Greek Yogurt", defaultGrams: 180, focus: "Protein", nutrients: { protein: 10, carbs: 3.6, fats: 0.4, fiber: 0, calories: 59 } },
  { id: "salmon", name: "Salmon", defaultGrams: 140, focus: "Protein", nutrients: { protein: 20, carbs: 0, fats: 13, fiber: 0, calories: 208 } },
  { id: "jasmine-rice", name: "Jasmine Rice", defaultGrams: 160, focus: "Carbs", nutrients: { protein: 2.7, carbs: 28, fats: 0.3, fiber: 0.4, calories: 130 } },
  { id: "oats", name: "Oats", defaultGrams: 80, focus: "Carbs", nutrients: { protein: 13.2, carbs: 67.7, fats: 6.5, fiber: 10.1, calories: 389 } },
  { id: "banana", name: "Banana", defaultGrams: 120, focus: "Carbs", nutrients: { protein: 1.1, carbs: 22.8, fats: 0.3, fiber: 2.6, calories: 89 } },
  { id: "avocado", name: "Avocado", defaultGrams: 80, focus: "Fats", nutrients: { protein: 2, carbs: 8.5, fats: 14.7, fiber: 6.7, calories: 160 } },
  { id: "almonds", name: "Almonds", defaultGrams: 30, focus: "Fats", nutrients: { protein: 21.2, carbs: 21.6, fats: 49.9, fiber: 12.5, calories: 579 } },
  { id: "chia-seeds", name: "Chia Seeds", defaultGrams: 20, focus: "Fiber", nutrients: { protein: 16.5, carbs: 42.1, fats: 30.7, fiber: 34.4, calories: 486 } },
  { id: "broccoli", name: "Broccoli", defaultGrams: 120, focus: "Fiber", nutrients: { protein: 2.8, carbs: 6.6, fats: 0.4, fiber: 2.6, calories: 34 } },
  { id: "blueberries", name: "Blueberries", defaultGrams: 100, focus: "Fiber", nutrients: { protein: 0.7, carbs: 14.5, fats: 0.3, fiber: 2.4, calories: 57 } },
  { id: "sweet-potato", name: "Sweet Potato", defaultGrams: 150, focus: "Carbs", nutrients: { protein: 1.6, carbs: 20.1, fats: 0.1, fiber: 3, calories: 86 } }
];

const FOOD_PICK_CATEGORIES = [
  { key: "protein", label: "Protein", accent: "#1C1E26" },
  { key: "carbs", label: "Carbs", accent: "#D8C9B4" },
  { key: "fats", label: "Fats", accent: "#7A9082" },
  { key: "fiber", label: "Fiber", accent: "#A98D67" },
  { key: "supplements", label: "Supps", accent: "#B07E54" }
];

const FOOD_PICK_DETAILS = {
  protein: {
    title: "Protein foods",
    summary:
      "Prioritize complete or lean protein at each meal to support muscle repair, recovery, and stronger satiety across the day.",
    targetHint: "Good meal target: 25 to 40g protein.",
    spotlight: "Best moments: breakfast, post-workout, and the final meal of the day.",
    cards: [
      {
        title: "Lean everyday choices",
        description: "Easy staples for high protein without excess fat.",
        items: ["Chicken breast", "Turkey breast", "Lean beef", "White fish", "Shrimp", "Egg whites"]
      },
      {
        title: "Convenient high-protein foods",
        description: "Useful when meals need to be fast and repeatable.",
        items: ["Greek yogurt", "Cottage cheese", "Skyr", "Tofu", "Tempeh", "Edamame"]
      },
      {
        title: "Simple add-ons",
        description: "Small upgrades that raise protein without changing the meal too much.",
        items: ["Milk", "Protein oats", "Jerky", "Tuna packs", "Smoked salmon", "Cheese sticks"]
      }
    ],
    supplements: ["Whey isolate", "Casein", "Clear whey", "RTD protein shake"]
  },
  carbs: {
    title: "Quality carbs",
    summary:
      "Use reliable carbohydrate sources to improve training output, refill glycogen, and keep energy more stable around sessions.",
    targetHint: "Best around training: easy-digesting carbs before and after.",
    spotlight: "Choose simpler carbs near training and more filling carbs in normal meals.",
    cards: [
      {
        title: "Performance staples",
        description: "Consistent carb sources that are easy to measure and repeat.",
        items: ["Jasmine rice", "Oats", "Potatoes", "Sweet potato", "Rice cakes", "Pasta"]
      },
      {
        title: "Fast pre-workout options",
        description: "Lower-fiber choices that feel lighter before training.",
        items: ["Banana", "Bagel", "Cream of rice", "Toast", "Honey", "Applesauce"]
      },
      {
        title: "Daily meal builders",
        description: "Useful for balanced meals when you need more fullness.",
        items: ["Wholegrain bread", "Quinoa", "Beans", "Lentils", "Corn", "Fruit bowls"]
      }
    ],
    supplements: ["Cyclic dextrin", "Electrolyte drink", "Carb powder", "Sports drink"]
  },
  fats: {
    title: "Healthy fats",
    summary:
      "Healthy fats support hormones, recovery, satiety, and overall meal quality, especially when training volume is high.",
    targetHint: "Keep fats moderate around training and higher in regular meals.",
    spotlight: "Add fats to meals that need more fullness, not to every workout snack.",
    cards: [
      {
        title: "Daily fat sources",
        description: "Reliable foods that improve meal balance and taste.",
        items: ["Avocado", "Extra virgin olive oil", "Whole eggs", "Salmon", "Sardines", "Olives"]
      },
      {
        title: "Nuts and seeds",
        description: "Dense options for easy calories and better satiety.",
        items: ["Almonds", "Walnuts", "Peanut butter", "Cashews", "Chia seeds", "Flax seeds"]
      },
      {
        title: "Easy upgrades",
        description: "Simple ways to add quality fats without rebuilding the whole meal.",
        items: ["Tahini", "Dark chocolate", "Pesto", "Mixed nuts", "Nut butter", "Pumpkin seeds"]
      }
    ],
    supplements: ["Fish oil", "Omega-3 capsules", "MCT oil"]
  },
  fiber: {
    title: "Fiber foods",
    summary:
      "Fiber helps digestion, appetite control, blood sugar stability, and makes a muscle-gain diet easier to manage over time.",
    targetHint: "Most active adults do well around 25 to 35g fiber daily.",
    spotlight: "Push fiber in normal meals, but keep it lighter right before training.",
    cards: [
      {
        title: "Vegetable anchors",
        description: "High-volume foods that improve fullness and meal quality.",
        items: ["Broccoli", "Spinach", "Carrots", "Bell peppers", "Cabbage", "Green beans"]
      },
      {
        title: "Fruit and oats",
        description: "Easy ways to add fiber without making meals too heavy.",
        items: ["Blueberries", "Raspberries", "Kiwi", "Apple", "Pear", "Oats"]
      },
      {
        title: "High-fiber boosters",
        description: "Small portions that raise fiber quickly when the day is low.",
        items: ["Chia seeds", "Beans", "Lentils", "Psyllium husk", "Edamame", "Wholegrain wraps"]
      }
    ],
    supplements: ["Psyllium husk", "Greens powder"]
  },
  supplements: {
    title: "Useful supplements",
    summary:
      "Supplements should support consistency and convenience, not replace core meals. Use them to fill gaps in a busy training week.",
    targetHint: "Keep supplements simple and evidence-based.",
    spotlight: "The basics usually beat a large stack of products.",
    cards: [
      {
        title: "Recovery support",
        description: "Helpful when total protein or recovery is harder to cover with food alone.",
        items: ["Whey isolate", "Casein", "Protein bars", "Collagen with vitamin C"]
      },
      {
        title: "Performance support",
        description: "Useful around sessions that need more output or hydration support.",
        items: ["Creatine monohydrate", "Caffeine", "Electrolyte mix", "Carb powder"]
      },
      {
        title: "Daily health support",
        description: "Use only when diet or bloodwork suggests a real gap.",
        items: ["Fish oil", "Vitamin D", "Magnesium glycinate", "Multivitamin"]
      }
    ],
    supplements: ["Creatine 3 to 5g daily", "Whey for convenience", "Electrolytes on high-sweat days"]
  }
};

function createMealEntry(id, prefill = {}) {
  return { id, food: prefill.food || "", grams: prefill.grams || "" };
}

function calculateMealTotals(entries) {
  return entries.reduce(
    (totals, entry) => {
      const food = findFoodDefinition(entry.food);
      const grams = Number(entry.grams);
      if (!food || !grams) return totals;
      const factor = grams / 100;
      return {
        protein: totals.protein + food.nutrients.protein * factor,
        carbs: totals.carbs + food.nutrients.carbs * factor,
        fats: totals.fats + food.nutrients.fats * factor,
        fiber: totals.fiber + food.nutrients.fiber * factor,
        calories: totals.calories + food.nutrients.calories * factor
      };
    },
    { protein: 0, carbs: 0, fats: 0, fiber: 0, calories: 0 }
  );
}

function findFoodDefinition(foodName) {
  const normalizedFoodName = foodName.trim().toLowerCase();
  if (!normalizedFoodName) return null;
  return (
    FOOD_LIBRARY.find((food) => food.name.toLowerCase() === normalizedFoodName) ||
    FOOD_LIBRARY.find((food) => food.name.toLowerCase().includes(normalizedFoodName))
  );
}

function roundMetric(value) {
  return Math.round(value * 10) / 10;
}

function formatMetricValue(value) {
  const roundedValue = roundMetric(value);
  return Number.isInteger(roundedValue) ? String(roundedValue) : roundedValue.toFixed(1);
}

export default function App() {
  const [selectedDay, setSelectedDay] = useState(3);
  const [activeView, setActiveView] = useState("schedule");
  const [nutritionMetrics, setNutritionMetrics] = useState(INITIAL_NUTRITION_METRICS);
  const [calorieSummary, setCalorieSummary] = useState(INITIAL_CALORIE_SUMMARY);
  const [mealEntries, setMealEntries] = useState([createMealEntry(1)]);
  const [nextEntryId, setNextEntryId] = useState(2);
  const [selectedFoodCategory, setSelectedFoodCategory] = useState("protein");

  const calorieRemaining = Math.max(calorieSummary.target - calorieSummary.consumed, 0);
  const mealTotals = calculateMealTotals(mealEntries);

  function handleOpenMealLog() {
    setActiveView("mealLog");
  }

  function handleCloseMealLog() {
    setActiveView("schedule");
  }

  function handleOpenFoodPicks() {
    setActiveView("foodPicks");
  }

  function handleCloseFoodPicks() {
    setActiveView("mealLog");
  }

  function handleEntryChange(entryId, field, value) {
    setMealEntries((currentEntries) =>
      currentEntries.map((entry) =>
        entry.id === entryId
          ? { ...entry, [field]: field === "grams" ? value.replace(/[^0-9.]/g, "") : value }
          : entry
      )
    );
  }

  function handleAddEntry(prefill = null) {
    setMealEntries((currentEntries) => [
      ...currentEntries,
      createMealEntry(nextEntryId, prefill || undefined)
    ]);
    setNextEntryId((currentId) => currentId + 1);
  }

  function handleRemoveEntry(entryId) {
    setMealEntries((currentEntries) => {
      if (currentEntries.length === 1) {
        return [createMealEntry(entryId)];
      }

      return currentEntries.filter((entry) => entry.id !== entryId);
    });
  }

  function handleUploadMeal() {
    if (mealTotals.calories <= 0) return;

    setNutritionMetrics((currentMetrics) =>
      currentMetrics.map((metric) => ({
        ...metric,
        consumed: roundMetric(metric.consumed + mealTotals[metric.key])
      }))
    );

    setCalorieSummary((currentSummary) => ({
      ...currentSummary,
      consumed: Math.round(currentSummary.consumed + mealTotals.calories)
    }));

    setMealEntries([createMealEntry(nextEntryId)]);
    setNextEntryId((currentId) => currentId + 1);
    setActiveView("schedule");
  }

  return (
    <div
      className="min-h-screen bg-[#E7E3DC] px-4 py-6 text-[#1C1E26] antialiased"
      style={{
        fontFamily:
          'Inter, "SF Pro Display", "Segoe UI", -apple-system, BlinkMacSystemFont, sans-serif'
      }}
    >
      <div className="mx-auto flex w-full max-w-[430px] justify-center">
        <div className="relative flex h-[860px] min-h-0 w-full flex-col overflow-hidden rounded-[40px] border border-white/80 bg-[#F5F2EC] shadow-[0_30px_100px_rgba(28,30,38,0.18)]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(216,201,180,0.42),_transparent_34%),radial-gradient(circle_at_bottom_left,_rgba(122,144,130,0.22),_transparent_30%)]" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white/75 to-transparent" />
          <div className="absolute top-0 z-30 flex w-full justify-center pt-3">
            <div className="h-1.5 w-24 rounded-full bg-[#1C1E26]/10" />
          </div>

          {activeView === "schedule" ? (
            <>
              <div className="scrollbar-hide relative z-10 flex-1 overflow-y-auto px-6 pb-6 pt-10 min-h-0">
                <header className="mb-3.5 flex items-center justify-between">
                  <div>
                    <p className="mb-1 text-[11px] font-medium uppercase tracking-[0.28em] text-[#9A948B]">
                      Today
                    </p>
                    <h1 className="text-[28px] font-semibold tracking-[-0.04em] text-[#1C1E26]">
                      Wed, 14 Oct
                    </h1>
                  </div>

                  <div className="rounded-[24px] border border-white/70 bg-white/90 p-1 shadow-[0_10px_30px_rgba(28,30,38,0.08)]">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                      alt="Profile"
                      className="h-12 w-12 rounded-[20px] object-cover"
                    />
                  </div>
                </header>

                <section className="grid grid-cols-2 gap-1">
                  {TOP_CARDS.map((item) => (
                    <TopCard key={item.eyebrow} {...item} />
                  ))}
                </section>

                <section className="relative mt-4 overflow-hidden rounded-[26px] border border-white/90 bg-white/90 p-3.5 shadow-[0_20px_50px_rgba(28,30,38,0.08)] backdrop-blur">
                  <div className="pointer-events-none absolute right-0 top-0 h-24 w-24 rounded-bl-[48px] bg-gradient-to-bl from-[#F7F4EF] to-transparent opacity-90" />
                  <div className="relative z-10 mb-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-[#A39D95]">
                        Daily Nutrition
                      </p>
                      <div className="flex items-center gap-1 rounded-full border border-[#EFE4D3] bg-[#FBF6EE] px-2.5 py-1 text-[9px] font-medium text-[#A57942]">
                        <Flame size={10} strokeWidth={2.1} />
                        {Math.round(calorieRemaining)} kcal left
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleOpenMealLog}
                      className="rounded-full border border-[#E7E1D7] bg-[#F6F2EB] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#7F786F]"
                    >
                      Log meal
                    </button>
                  </div>

                  <div className="relative z-10 grid grid-cols-2 gap-2">
                    {nutritionMetrics.map((metric) => (
                      <NutritionMetricCard key={metric.key} {...metric} />
                    ))}
                  </div>
                </section>

                <section className="mt-3.5 rounded-[28px] border border-white/90 bg-white/90 p-3.5 shadow-[0_20px_50px_rgba(28,30,38,0.08)] backdrop-blur">
                  <div className="mb-3.5 flex items-center justify-between">
                    <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[#A39D95]">
                      My Schedule
                    </p>
                    <button className="flex h-9 w-9 items-center justify-center rounded-full border border-[#EEE9E1] bg-[#FBFAF8] text-[#8B857B] transition hover:text-[#1C1E26]">
                      <ChevronRight size={16} strokeWidth={1.7} />
                    </button>
                  </div>

                  <div className="mb-4 flex justify-between gap-1">
                    {WEEK_DAYS.map((item, index) => {
                      const isSelected = index === selectedDay;
                      return (
                        <button
                          key={`${item.day}-${item.date}`}
                          type="button"
                          onClick={() => setSelectedDay(index)}
                          className="relative flex flex-col items-center gap-1.5 rounded-[20px] px-1 py-1 transition"
                        >
                          <span className="text-[10px] font-medium text-[#A3A3A3]">{item.day}</span>
                          <div
                            className={`flex h-10 w-9 items-center justify-center rounded-full text-[13px] font-medium transition ${
                              isSelected ? "bg-[#1C1E26] text-white shadow-[0_10px_24px_rgba(28,30,38,0.24)]" : "text-[#1C1E26] hover:bg-[#F6F2EB]"
                            }`}
                          >
                            {item.date}
                          </div>
                          {item.isRecommended ? (
                            <div className="absolute right-0 top-4 text-[#B59F7A]">
                              <Sparkles size={11} strokeWidth={2.8} />
                            </div>
                          ) : null}
                        </button>
                      );
                    })}
                  </div>

                  <div className="space-y-3.5">
                    {TRAINING_PLAN.map((item, index) => (
                      <TrainingPlanRow key={item.id} item={item} isLast={index === TRAINING_PLAN.length - 1} />
                    ))}
                  </div>
                </section>
              </div>

              <nav className="relative z-20 flex h-[96px] w-full items-start justify-between bg-transparent px-6 pb-5 pt-4">
                <NavIcon icon={Calendar} label="Schedule" isActive />
                <NavIcon icon={Users} label="Community" />
                <NavIcon icon={Bot} label="AI Coach" isFeature />
                <NavIcon icon={Compass} label="Explore" />
                <NavIcon icon={User} label="Profile" />
              </nav>
            </>
          ) : activeView === "mealLog" ? (
            <MealLogScreen
              calorieTarget={calorieSummary.target}
              mealEntries={mealEntries}
              mealTotals={mealTotals}
              nutritionMetrics={nutritionMetrics}
              onBack={handleCloseMealLog}
              onOpenFoodPicks={handleOpenFoodPicks}
              onEntryChange={handleEntryChange}
              onAddEntry={handleAddEntry}
              onRemoveEntry={handleRemoveEntry}
              onUpload={handleUploadMeal}
            />
          ) : (
            <FoodPicksScreen
              selectedCategory={selectedFoodCategory}
              onSelectCategory={setSelectedFoodCategory}
              onBack={handleCloseFoodPicks}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function MealLogScreen({
  calorieTarget,
  mealEntries,
  mealTotals,
  nutritionMetrics,
  onBack,
  onOpenFoodPicks,
  onEntryChange,
  onAddEntry,
  onRemoveEntry,
  onUpload
}) {
  return (
    <div className="relative z-10 flex min-h-0 flex-1 flex-col">
      <div className="scrollbar-hide min-h-0 flex-1 overflow-y-auto px-6 pb-36 pt-5">
        <header className="mb-2.5 flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <button
              type="button"
              onClick={onBack}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/85 bg-white/85 text-[#6F6A63] shadow-[0_8px_24px_rgba(28,30,38,0.05)]"
            >
              <ChevronLeft size={18} strokeWidth={1.8} />
            </button>

            <div className="min-w-0">
              <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[#A39D95]">
                Nutrition Entry
              </p>
              <h1 className="mt-1 text-[28px] font-semibold tracking-[-0.04em] text-[#1C1E26]">
                Log Meal
              </h1>
              <p className="mt-1 max-w-[220px] text-[12px] leading-5 text-[#8E887E]">
                Add foods and sync this meal back to daily nutrition.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenFoodPicks}
            className="shrink-0 rounded-full border border-[#E7DCCB] bg-[#FBF5EB] px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8B6C44]"
          >
            Food Picks
          </button>
        </header>

        <section className="rounded-[26px] border border-white/90 bg-white/88 p-4 shadow-[0_18px_42px_rgba(28,30,38,0.08)] backdrop-blur">
          <div className="mb-2.5 flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#A39D95]">
                Meal Items
              </p>
              <p className="mt-1 text-[12px] text-[#8F8A82]">
                Enter food name and weight to calculate nutrition.
              </p>
            </div>

            <div className="rounded-full border border-[#EEE4D7] bg-[#FBF6EE] px-2.5 py-1 text-[9px] font-medium text-[#8C7D67]">
              {mealEntries.length} items
            </div>
          </div>

          <div className="space-y-2.5">
            {mealEntries.map((entry, index) => (
              <MealEntryCard
                key={entry.id}
                entry={entry}
                index={index}
                onChange={onEntryChange}
                onRemove={onRemoveEntry}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => onAddEntry()}
            className="mt-2.5 flex w-full items-center justify-center gap-2 rounded-[18px] border border-dashed border-[#DCCFBD] bg-[#FCFAF6] px-3 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7D756A]"
          >
            <Plus size={14} strokeWidth={2.4} />
            Add another food
          </button>

          <datalist id="food-library-options">
            {FOOD_LIBRARY.map((food) => (
              <option key={food.id} value={food.name} />
            ))}
          </datalist>
        </section>

        <section className="mt-2.5 rounded-[26px] border border-[#EFE4D7] bg-[linear-gradient(180deg,#FFFDF9_0%,#F6EFE6_100%)] p-4 shadow-[0_18px_42px_rgba(28,30,38,0.06)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#A39D95]">
                Meal Totals
              </p>
              <p className="mt-1 text-[12px] text-[#8D8478]">
                This meal will sync directly into Daily Nutrition.
              </p>
            </div>

            <div className="flex items-center gap-1 rounded-full border border-[#EFDFCA] bg-white/85 px-2.5 py-1 text-[10px] font-medium text-[#9A7A52]">
              <Flame size={11} strokeWidth={2.1} />
              {formatMetricValue(mealTotals.calories)} kcal
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            {nutritionMetrics.map((metric) => (
              <MealTotalCard
                key={metric.key}
                name={metric.name}
                unit={metric.unit}
                color={metric.color}
                value={mealTotals[metric.key]}
              />
            ))}
          </div>

          <div className="mt-3 rounded-[18px] border border-[#EEE2D4] bg-white/80 px-3.5 py-3">
            <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#A39D95]">
              Daily Sync Preview
            </p>
            <p className="mt-1 text-[12px] text-[#6F675C]">
              After upload, calories move toward {formatMetricValue(calorieTarget)} kcal and the macro cards on the
              schedule screen update instantly.
            </p>
          </div>
        </section>
      </div>

      <div className="relative z-20 bg-[linear-gradient(180deg,rgba(247,240,231,0.18)_0%,rgba(236,228,216,0.94)_30%,rgba(232,224,213,0.98)_100%)] px-5 pb-6 pt-4 backdrop-blur-xl shadow-[0_-16px_36px_rgba(28,30,38,0.05)]">
        <button
          type="button"
          onClick={onUpload}
          disabled={mealTotals.calories <= 0}
          className={`mx-auto flex h-[72px] w-full items-center justify-center rounded-[26px] border px-8 text-[15px] font-semibold uppercase tracking-[0.22em] text-white transition disabled:opacity-100 ${
            mealTotals.calories > 0 ? "hover:translate-y-[-1px]" : ""
          }`}
          style={{
            background:
              mealTotals.calories > 0
                ? "linear-gradient(180deg,#31463B 0%, #24362F 100%)"
                : "linear-gradient(180deg,#687D72 0%, #53675D 100%)",
            borderColor: mealTotals.calories > 0 ? "#22312B" : "#46594F",
            boxShadow:
              mealTotals.calories > 0
                ? "0 22px 40px rgba(28,42,37,0.34), inset 0 1px 0 rgba(255,255,255,0.08)"
                : "0 18px 30px rgba(39,56,49,0.22), inset 0 1px 0 rgba(255,255,255,0.06)",
            opacity: 1
          }}
        >
          Upload Meal
        </button>
      </div>
    </div>
  );
}

function FoodPicksScreen({ selectedCategory, onSelectCategory, onBack }) {
  const activeCategory = FOOD_PICK_DETAILS[selectedCategory];
  const activeCategoryMeta =
    FOOD_PICK_CATEGORIES.find((category) => category.key === selectedCategory) || FOOD_PICK_CATEGORIES[0];

  return (
    <div className="relative z-10 flex min-h-0 flex-1 flex-col">
      <div className="scrollbar-hide min-h-0 flex-1 overflow-y-auto px-6 pb-10 pt-10">
        <header className="mb-4 flex items-start gap-3">
          <button
            type="button"
            onClick={onBack}
            className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/85 bg-white/85 text-[#6F6A63] shadow-[0_8px_24px_rgba(28,30,38,0.05)]"
          >
            <ChevronLeft size={18} strokeWidth={1.8} />
          </button>

          <div className="min-w-0">
            <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[#A39D95]">
              Nutrition Guide
            </p>
            <h1 className="mt-1 text-[28px] font-semibold tracking-[-0.04em] text-[#1C1E26]">
              Food Picks
            </h1>
            <p className="mt-1 max-w-[290px] text-[12px] leading-5 text-[#8E887E]">
              Browse nutrient-focused foods and supplements, then return to Log Meal to enter the foods you actually
              ate.
            </p>
          </div>
        </header>

        <section className="rounded-[24px] border border-white/90 bg-white/84 p-3.5 shadow-[0_18px_40px_rgba(28,30,38,0.07)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#A39D95]">
                Nutrient Tabs
              </p>
              <p className="mt-1 text-[12px] text-[#8F8A82]">Tap a focus to switch the guide below.</p>
            </div>

            <div className="rounded-full border border-[#EEE4D7] bg-[#FBF6EE] px-2.5 py-1 text-[9px] font-medium text-[#8C7D67]">
              {FOOD_PICK_CATEGORIES.length} groups
            </div>
          </div>

          <div className="scrollbar-hide -mx-1 mt-3 flex gap-2 overflow-x-auto px-1 pb-1">
            {FOOD_PICK_CATEGORIES.map((category) => {
              const isActive = category.key === selectedCategory;
              return (
                <button
                  key={category.key}
                  type="button"
                  onClick={() => onSelectCategory(category.key)}
                  className={`shrink-0 rounded-full border px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] transition ${
                    isActive
                      ? "border-transparent text-white shadow-[0_10px_20px_rgba(28,30,38,0.12)]"
                      : "border-[#E7DDD0] bg-[#FCF9F4] text-[#7D756A]"
                  }`}
                  style={isActive ? { backgroundColor: category.accent } : undefined}
                >
                  {category.label}
                </button>
              );
            })}
          </div>
        </section>

        <section className="mt-4 overflow-hidden rounded-[28px] border border-[#EEE4D7] bg-[linear-gradient(180deg,#FFFDF8_0%,#F5EEE5_100%)] p-4 shadow-[0_18px_42px_rgba(28,30,38,0.06)]">
          <div className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: activeCategoryMeta.accent }}
            />
            <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#1C1E26]">
              {activeCategory.title}
            </p>
          </div>

          <p className="mt-2 text-[13px] leading-6 text-[#6F675C]">{activeCategory.summary}</p>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <article className="rounded-[18px] border border-[#EEE4D7] bg-white/82 px-3 py-3">
              <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#A39D95]">Guide Focus</p>
              <p className="mt-2 text-[12px] leading-5 text-[#6F675C]">{activeCategory.spotlight}</p>
            </article>

            <article className="rounded-[18px] border border-[#EEE4D7] bg-white/82 px-3 py-3">
              <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#A39D95]">Smart Target</p>
              <p className="mt-2 text-[12px] leading-5 text-[#6F675C]">{activeCategory.targetHint}</p>
            </article>
          </div>

          <div className="mt-4 space-y-3">
            {activeCategory.cards.map((card) => (
              <FoodGuideCard key={card.title} accent={activeCategoryMeta.accent} card={card} />
            ))}
          </div>

          <article className="mt-4 rounded-[22px] border border-[#EADFD1] bg-white/82 p-3.5 shadow-[0_8px_20px_rgba(28,30,38,0.04)]">
            <div className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: activeCategoryMeta.accent }}
              />
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#1C1E26]">
                Helpful Supplements
              </p>
            </div>

            <p className="mt-2 text-[12px] leading-5 text-[#8A7F71]">
              Keep these as support tools for convenience, recovery, or coverage gaps.
            </p>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {activeCategory.supplements.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-[#ECE3D7] bg-[#FBF8F3] px-2.5 py-1 text-[10px] text-[#5F584E]"
                >
                  {item}
                </span>
              ))}
            </div>
          </article>
        </section>

        <section className="mt-4 rounded-[24px] border border-white/90 bg-white/84 p-4 shadow-[0_16px_34px_rgba(28,30,38,0.05)]">
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#A39D95]">How To Use</p>
          <p className="mt-2 text-[12px] leading-5 text-[#6F675C]">
            Review foods here for ideas, return to Log Meal, then enter the exact foods and grams from the meal you
            actually ate.
          </p>
        </section>
      </div>
    </div>
  );
}

function TopCard({ eyebrow, value, suffix, actionLabel }) {
  return (
    <article className="min-h-[58px] rounded-[20px] border border-white/90 bg-white/88 px-3 py-1.5 shadow-[0_10px_30px_rgba(28,30,38,0.05)] backdrop-blur">
      <div className="flex items-start justify-between gap-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#A89A87]">
          {eyebrow}
        </p>

        {actionLabel ? (
          <button
            type="button"
            className="rounded-full border border-[#E7E1D7] bg-[#F6F2EB] px-2 py-0.5 text-[8px] font-semibold uppercase tracking-[0.12em] text-[#7F786F]"
          >
            {actionLabel}
          </button>
        ) : null}
      </div>

      <div className="mt-1.5 flex items-end gap-1">
        <span className="text-[31px] font-semibold tracking-[-0.06em] text-[#1C1E26]">{value}</span>
        <span className="pb-0.5 text-[12px] font-medium text-[#6F6A63]">{suffix}</span>
      </div>
    </article>
  );
}

function NutritionMetricCard({ name, consumed, target, unit, color }) {
  const remaining = Math.max(target - consumed, 0);
  const progress = Math.min((consumed / target) * 100, 100);

  return (
    <article className="rounded-[18px] border border-[#EEE9E1] bg-[#FAF8F4] px-3 py-2.5">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#7C766E]">{name}</p>
        <span className="text-[10px] text-[#9A958E]">
          {formatMetricValue(remaining)}
          {unit} left
        </span>
      </div>

      <div className="mt-2 flex items-end gap-1.5">
        <span className="text-[18px] font-semibold tracking-[-0.05em] text-[#1C1E26]">
          {formatMetricValue(consumed)}
        </span>
        <span className="pb-0.5 text-[11px] text-[#7D786F]">
          / {formatMetricValue(target)}
          {unit}
        </span>
      </div>

      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#E7E1D7]">
        <div className="h-full rounded-full" style={{ width: `${progress}%`, backgroundColor: color }} />
      </div>
    </article>
  );
}

function MealEntryCard({ entry, index, onChange, onRemove }) {
  const food = findFoodDefinition(entry.food);

  return (
    <article className="rounded-[20px] border border-[#EEE5D9] bg-[#FBF8F2] p-3">
      <div className="flex items-start justify-between gap-2">
        <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#A39D95]">
          Food {String(index + 1).padStart(2, "0")}
        </p>
        <div className="flex items-center gap-2">
          <span className="max-w-[120px] text-right text-[10px] leading-4 text-[#8E887E]">
            {food ? `${food.focus} focus` : "Manual entry"}
          </span>
          <button
            type="button"
            onClick={() => onRemove(entry.id)}
            className="rounded-full border border-[#E7DED2] bg-white/84 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-[#82796D]"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="mt-2.5 flex flex-nowrap items-stretch gap-2.5">
        <div className="min-w-0 flex-1">
          <label className="block rounded-[18px] border border-[#E9E1D5] bg-white px-3 py-2.5">
            <span className="block text-[10px] font-medium uppercase tracking-[0.12em] text-[#A39D95]">Food</span>
            <input
              list="food-library-options"
              value={entry.food}
              onChange={(event) => onChange(entry.id, "food", event.target.value)}
              placeholder="Chicken breast"
              className="mt-2 w-full min-w-0 border-0 bg-transparent p-0 text-[14px] font-medium text-[#1C1E26] outline-none placeholder:text-[#B0AAA0]"
            />
          </label>
        </div>

        <div className="w-[112px] shrink-0">
          <label className="block rounded-[18px] border border-[#E9E1D5] bg-white px-3 py-2.5">
            <span className="block text-[10px] font-medium uppercase tracking-[0.12em] text-[#A39D95]">Grams</span>
            <div className="mt-2 flex items-end justify-between gap-1">
              <input
                value={entry.grams}
                onChange={(event) => onChange(entry.id, "grams", event.target.value)}
                placeholder="100"
                className="w-full min-w-0 border-0 bg-transparent p-0 text-[16px] font-semibold text-[#1C1E26] outline-none placeholder:text-[#B0AAA0]"
              />
              <span className="pb-0.5 text-[11px] font-medium text-[#7D786F]">g</span>
            </div>
          </label>
        </div>
      </div>
    </article>
  );
}

function MealTotalCard({ name, value, unit, color }) {
  return (
    <article className="rounded-[18px] border border-[#EEE4D7] bg-white/84 px-3 py-2.5">
      <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#A39D95]">{name}</p>
      <div className="mt-2 flex items-end gap-1">
        <span className="text-[20px] font-semibold tracking-[-0.05em] text-[#1C1E26]">
          {formatMetricValue(value)}
        </span>
        <span className="pb-0.5 text-[12px] text-[#7D786F]">{unit}</span>
      </div>
      <div className="mt-2 h-1.5 w-full rounded-full bg-[#EEE4D7]">
        <div
          className="h-full rounded-full"
          style={{ width: `${Math.max(Math.min((value / 60) * 100, 100), 12)}%`, backgroundColor: color }}
        />
      </div>
    </article>
  );
}

function FoodGuideCard({ accent, card }) {
  return (
    <article className="rounded-[20px] border border-[#EADFD1] bg-white/78 p-3 shadow-[0_8px_22px_rgba(28,30,38,0.04)]">
      <div className="flex items-center gap-2">
        <span
          className="h-2.5 w-2.5 rounded-full"
          style={{ backgroundColor: accent }}
        />
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#1C1E26]">
          {card.title}
        </p>
      </div>

      <p className="mt-2 text-[11px] leading-5 text-[#8A7F71]">{card.description}</p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {card.items.map((food) => (
          <span
            key={food}
            className="rounded-full border border-[#ECE3D7] bg-[#FBF8F3] px-2.5 py-1 text-[10px] text-[#5F584E]"
          >
            {food}
          </span>
        ))}
      </div>
    </article>
  );
}

function TrainingPlanRow({ item, isLast }) {
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center pt-1">
        {item.isActive ? (
          <div className="relative">
            <Circle size={18} className="text-[#1C1E26]" strokeWidth={2} />
            <div className="absolute inset-0 m-auto h-2 w-2 rounded-full bg-[#1C1E26]" />
          </div>
        ) : (
          <Circle size={18} className="text-[#D4D4D4]" strokeWidth={1.5} />
        )}

        {!isLast ? (
          <div
            className={`mt-2 min-h-[24px] w-px rounded-full ${
              item.isActive ? "bg-[#1C1E26]" : "bg-[#ECE7DE]"
            }`}
          />
        ) : null}
      </div>

      <div
        className={`flex-1 rounded-[20px] ${
          item.isActive
            ? "border border-[#EEE9E1] bg-[#F9F7F3] px-3.5 py-3 shadow-[0_12px_20px_rgba(28,30,38,0.03)]"
            : "pb-0.5"
        }`}
      >
        <p className="mb-1 text-[10px] text-[#A3A3A3]">{item.program}</p>
        <h3 className="text-[14px] font-medium leading-5 text-[#1C1E26]">{item.title}</h3>
      </div>
    </div>
  );
}

function NavIcon({ icon: Icon, label, isActive = false, isFeature = false }) {
  return (
    <button
      className={`relative z-10 group flex flex-col items-center ${
        isFeature ? "w-[64px] gap-1 -mt-1" : "w-12 gap-1.5"
      }`}
    >
      <div
        className={`relative flex items-center justify-center transition-colors ${
          isFeature
            ? "h-11 w-11 rounded-[16px] border border-[#E6DDD0] bg-[linear-gradient(180deg,#FCFBF7_0%,#EFE8DD_100%)] text-[#1C1E26] shadow-[0_10px_22px_rgba(28,30,38,0.08)]"
            : isActive
              ? "text-[#1C1E26]"
              : "text-[#A3A3A3] group-hover:text-[#737373]"
        }`}
      >
        {isFeature ? (
          <span className="pointer-events-none absolute inset-0 rounded-[16px] bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.85),_transparent_58%)]" />
        ) : null}
        <Icon size={isFeature ? 20 : 22} strokeWidth={isActive || isFeature ? 2 : 1.6} />
        {isActive && !isFeature ? (
          <span className="absolute -bottom-2.5 h-1 w-1 rounded-full bg-[#1C1E26]" />
        ) : null}
      </div>
      <span
        className={`text-[9px] tracking-[0.08em] ${
          isFeature
            ? "font-semibold text-[#1C1E26]"
            : isActive
              ? "font-medium text-[#1C1E26]"
              : "font-medium text-[#A3A3A3]"
        }`}
      >
        {label}
      </span>
    </button>
  );
}
