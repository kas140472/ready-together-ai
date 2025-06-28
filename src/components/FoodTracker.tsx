
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';

interface FoodItem {
  name: string;
  current: number;
  target: number;
  unit: string;
  category: string;
}

interface FoodTrackerProps {
  householdSize: number;
  dietary: string[];
}

export const FoodTracker = ({ householdSize, dietary }: FoodTrackerProps) => {
  const getRecommendedItems = (): FoodItem[] => {
    const baseItems: FoodItem[] = [
      { name: 'Water', current: 0, target: householdSize * 14, unit: 'gallons', category: 'Water' },
      { name: 'Canned proteins', current: 0, target: householdSize * 6, unit: 'cans', category: 'Protein' },
      { name: 'Rice/Pasta', current: 0, target: householdSize * 2, unit: 'lbs', category: 'Grains' },
      { name: 'Canned vegetables', current: 0, target: householdSize * 8, unit: 'cans', category: 'Vegetables' },
      { name: 'Peanut butter', current: 0, target: householdSize * 1, unit: 'jars', category: 'Protein' },
      { name: 'Crackers', current: 0, target: householdSize * 2, unit: 'boxes', category: 'Grains' },
      { name: 'Canned fruit', current: 0, target: householdSize * 4, unit: 'cans', category: 'Fruit' },
    ];

    // Adjust for dietary restrictions
    if (dietary.includes('Vegan') || dietary.includes('Vegetarian')) {
      baseItems.push(
        { name: 'Plant-based protein', current: 0, target: householdSize * 4, unit: 'cans', category: 'Protein' },
        { name: 'Nuts/Seeds', current: 0, target: householdSize * 2, unit: 'bags', category: 'Protein' }
      );
    }

    if (dietary.includes('Gluten-free')) {
      const riceIndex = baseItems.findIndex(item => item.name === 'Rice/Pasta');
      if (riceIndex !== -1) {
        baseItems[riceIndex] = { name: 'Rice/GF grains', current: 0, target: householdSize * 3, unit: 'lbs', category: 'Grains' };
      }
    }

    if (dietary.includes('Diabetic')) {
      baseItems.push(
        { name: 'Sugar-free snacks', current: 0, target: householdSize * 3, unit: 'boxes', category: 'Snacks' }
      );
    }

    return baseItems;
  };

  const [foodItems, setFoodItems] = useState<FoodItem[]>(getRecommendedItems());

  const updateItemQuantity = (index: number, quantity: number) => {
    const updated = [...foodItems];
    updated[index].current = Math.max(0, quantity);
    setFoodItems(updated);
  };

  const getOverallProgress = () => {
    const totalTarget = foodItems.reduce((sum, item) => sum + item.target, 0);
    const totalCurrent = foodItems.reduce((sum, item) => sum + item.current, 0);
    return Math.round((totalCurrent / totalTarget) * 100);
  };

  const getCategoryItems = (category: string) => {
    return foodItems.filter(item => item.category === category);
  };

  const categories = ['Water', 'Protein', 'Grains', 'Vegetables', 'Fruit', 'Snacks'];

  return (
    <Card className="p-6 space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Emergency Food Supply
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          2-week supply for {householdSize} {householdSize === 1 ? 'person' : 'people'}
        </p>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Overall Progress</span>
            <span className="font-medium">{getOverallProgress()}%</span>
          </div>
          <Progress value={getOverallProgress()} className="h-2" />
        </div>
      </div>

      <div className="space-y-4">
        {categories.map(category => {
          const categoryItems = getCategoryItems(category);
          if (categoryItems.length === 0) return null;

          return (
            <div key={category} className="space-y-2">
              <h4 className="font-medium text-foreground text-sm border-b border-muted pb-1">
                {category}
              </h4>
              {categoryItems.map((item, index) => {
                const actualIndex = foodItems.findIndex(f => f.name === item.name);
                const progress = item.target > 0 ? (item.current / item.target) * 100 : 0;
                
                return (
                  <div key={item.name} className="flex items-center space-x-3 bg-muted/30 p-3 rounded">
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">{item.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {item.current} / {item.target} {item.unit}
                        </span>
                      </div>
                      <Progress value={Math.min(progress, 100)} className="h-1" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-6 w-6 p-0"
                        onClick={() => updateItemQuantity(actualIndex, item.current - 1)}
                      >
                        -
                      </Button>
                      <Input
                        type="number"
                        value={item.current}
                        onChange={(e) => updateItemQuantity(actualIndex, parseInt(e.target.value) || 0)}
                        className="w-16 h-6 text-xs text-center p-1"
                        min="0"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-6 w-6 p-0"
                        onClick={() => updateItemQuantity(actualIndex, item.current + 1)}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      <div className="bg-sage-50 p-4 rounded-lg">
        <h4 className="font-medium text-foreground mb-2">💡 Smart Tips</h4>
        <div className="text-sm text-muted-foreground space-y-1">
          <p>• Store 1 gallon of water per person per day</p>
          <p>• Choose foods that don't require cooking</p>
          <p>• Check expiration dates every 6 months</p>
          {dietary.includes('Vegetarian') && <p>• Don't forget plant-based protein sources</p>}
          {dietary.includes('Gluten-free') && <p>• Verify all packaged foods are certified gluten-free</p>}
        </div>
      </div>
    </Card>
  );
};
