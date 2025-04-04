// src/services/learningPathService.ts
import { supabase } from 'D:/intel/project/project/src/lib/supabase';
import { LearningPath, LearningModule } from '../types/assessment';

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export async function getLearningPathForStudent(
  courseId: string,
  level: DifficultyLevel,
  conceptScores: Record<string, number>
): Promise<LearningPath> {
  // Get the base learning path for this level
  const { data: pathData, error: pathError } = await supabase
    .from('learning_paths')
    .select('*')
    .eq('course_id', courseId)
    .eq('level', level)
    .single();

  if (pathError || !pathData) {
    throw new Error(`Failed to fetch learning path: ${pathError?.message || 'No path found'}`);
  }

  // Get all modules for this path
  const { data: modulesData, error: modulesError } = await supabase
    .from('learning_modules')
    .select('*')
    .eq('path_id', pathData.id)
    .order('sequence', { ascending: true });

  if (modulesError) {
    throw new Error(`Failed to fetch modules: ${modulesError.message}`);
  }

  // Personalize module sequence based on concept scores
  const weakConcepts = Object.entries(conceptScores)
    .filter(([_, score]) => score < 70)
    .map(([concept]) => concept);

  // Prioritize modules addressing weak concepts
  const prioritizedModules = [...(modulesData || [])].sort((a, b) => {
    const aAddressesWeakConcept = weakConcepts.some(concept => 
      a.concepts?.includes(concept)
    );
    const bAddressesWeakConcept = weakConcepts.some(concept => 
      b.concepts?.includes(concept)
    );

    if (aAddressesWeakConcept && !bAddressesWeakConcept) return -1;
    if (!aAddressesWeakConcept && bAddressesWeakConcept) return 1;
    return a.sequence - b.sequence;
  });

  return {
    id: pathData.id,
    courseId,
    level,
    description: pathData.description,
    modules: prioritizedModules
  };
}

// If you need to test without database, use this function
export async function getMockLearningPathForStudent(
  courseId: string,
  level: DifficultyLevel,
  conceptScores: Record<string, number>
): Promise<LearningPath> {
  // Mock data for testing
  const mockModules: LearningModule[] = [
    {
      id: 'm1',
      title: 'Introduction to Variables',
      description: 'Learn about variables and how to use them in your code.',
      contentUrl: '/content/variables-intro',
      estimatedTimeMinutes: 15,
      difficulty: 'beginner',
      prerequisites: [],
      concepts: ['variables'],
      sequence: 1
    },
    {
      id: 'm2',
      title: 'Working with Functions',
      description: 'Understanding functions and how to create reusable code.',
      contentUrl: '/content/functions-basics',
      estimatedTimeMinutes: 20,
      difficulty: 'beginner',
      prerequisites: ['m1'],
      concepts: ['functions'],
      sequence: 2
    },
    {
      id: 'm3',
      title: 'Loops and Iterations',
      description: 'Learn how to repeat actions with loops.',
      contentUrl: '/content/loops-intro',
      estimatedTimeMinutes: 25,
      difficulty: 'beginner',
      prerequisites: ['m1'],
      concepts: ['loops'],
      sequence: 3
    },
    // Add more modules as needed
  ];

  // Filter modules for the right level
  const levelModules = mockModules.filter(m => m.difficulty === level);

  // Personalize based on concept scores
  const weakConcepts = Object.entries(conceptScores)
    .filter(([_, score]) => score < 70)
    .map(([concept]) => concept);

  // Prioritize modules addressing weak concepts
  const prioritizedModules = [...levelModules].sort((a, b) => {
    const aAddressesWeakConcept = weakConcepts.some(concept => 
      a.concepts.includes(concept)
    );
    const bAddressesWeakConcept = weakConcepts.some(concept => 
      b.concepts.includes(concept)
    );

    if (aAddressesWeakConcept && !bAddressesWeakConcept) return -1;
    if (!aAddressesWeakConcept && bAddressesWeakConcept) return 1;
    return a.sequence - b.sequence;
  });

  return {
    id: `mock-path-${level}`,
    courseId,
    level,
    description: `This is a personalized ${level} learning path for the course.`,
    modules: prioritizedModules
  };
}