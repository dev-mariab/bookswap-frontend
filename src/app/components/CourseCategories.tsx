import { Settings, Heart, Scale, BarChart3 } from 'lucide-react';

const courses = [
  {
    id: 1,
    name: 'Engenharia',
    icon: Settings,
    color: 'bg-blue-500',
    hoverColor: 'hover:bg-blue-600',
  },
  {
    id: 2,
    name: 'Medicina',
    icon: Heart,
    color: 'bg-red-500',
    hoverColor: 'hover:bg-red-600',
  },
  {
    id: 3,
    name: 'Direito',
    icon: Scale,
    color: 'bg-purple-500',
    hoverColor: 'hover:bg-purple-600',
  },
  {
    id: 4,
    name: 'Administração',
    icon: BarChart3,
    color: 'bg-green-500',
    hoverColor: 'hover:bg-green-600',
  },
];

export function CourseCategories() {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-[#2C3E50] mb-6">
          Encontre por seu curso
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {courses.map((course) => {
            const Icon = course.icon;
            return (
              <button
                key={course.id}
                className={`${course.color} ${course.hoverColor} text-white p-6 rounded-lg shadow-md transition-all transform hover:scale-105 flex flex-col items-center gap-3`}
              >
                <Icon className="w-12 h-12" />
                <span className="font-semibold text-lg">{course.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
