import { Medicine } from "@workspace/api-client-react";

interface ScheduleViewProps {
  medicines: Medicine[];
}

export function ScheduleView({ medicines }: ScheduleViewProps) {
  const morning = medicines.filter(m => m.timing?.includes('morning'));
  const afternoon = medicines.filter(m => m.timing?.includes('afternoon'));
  const evening = medicines.filter(m => m.timing?.includes('evening'));
  const night = medicines.filter(m => m.timing?.includes('night'));

  const renderBlock = (title: string, icon: string, items: Medicine[]) => {
    if (items.length === 0) return null;
    
    return (
      <div className="mb-4">
        <h3 className="font-sans font-bold text-brand-green-deep flex items-center gap-2 mb-2">
          <span>{icon}</span> {title}
        </h3>
        <div className="space-y-2 pl-6 border-l-2 border-brand-green-bg ml-3 py-1">
          {items.map(med => (
            <div key={med.id} className="bg-white border border-gray-100 p-2 rounded-lg text-sm shadow-sm">
              <span className="font-bold font-serif">{med.medicine_name}</span>
              {med.dosage && <span className="text-gray-500 ml-2">{med.dosage}</span>}
              {med.food_relation && (
                <span className="ml-2 text-xs bg-amber-50 text-amber-800 px-1.5 py-0.5 rounded">
                  {med.food_relation.replace('_', ' ')}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (medicines.length === 0) return null;

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-6">
      <h2 className="font-serif text-xl font-bold text-gray-900 mb-4">Daily Schedule</h2>
      
      {renderBlock('Morning', '☀️', morning)}
      {renderBlock('Afternoon', '🌞', afternoon)}
      {renderBlock('Evening', '🌆', evening)}
      {renderBlock('Night', '🌙', night)}
    </div>
  );
}
