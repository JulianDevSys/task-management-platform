export const taskProposalSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    tasks: {
      type: 'array',
      minItems: 1,
      maxItems: 10,
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          title: {
            type: 'string',
            description: 'Título corto y claro de la tarea.',
          },
          description: {
            type: 'string',
            description: 'Descripción detallada de la tarea.',
          },
          priority: {
            type: 'string',
            enum: ['low', 'medium', 'high'],
            description: 'Nivel de prioridad de la tarea.',
          },
        },
        required: ['title', 'description', 'priority'],
      },
    },
  },
  required: ['tasks'],
} as const;