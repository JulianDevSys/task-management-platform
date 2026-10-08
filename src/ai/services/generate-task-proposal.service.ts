import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import OpenAI from 'openai';

import { TaskProposalDto } from '../dtos/task-proposal.dto';
import { taskProposalSchema } from '../schemas/task-proposal.schema';

@Injectable()
export class GenerateTaskProposalService {
  /* private readonly openai: almacena el cliente que se utilizará para comunicarse con el proveedor.

ConfigService: obtiene la API key desde las variables de entorno.

getOrThrow: genera un error si no encuentra la variable requerida.

baseURL: dirige las peticiones al servicio de OpenRouter. */
  private readonly openai: OpenAI;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.getOrThrow<string>('OPENROUTER_API_KEY');

    this.openai = new OpenAI({
      apiKey,
      baseURL: 'https://openrouter.ai/api/v1',
    });
  }

  async generate(prompt: string): Promise<TaskProposalDto> {
    let response;

    try {
      response = await this.openai.chat.completions.create({
        model: 'openrouter/free',

        messages: [
          {
            role: 'system',
            content: `
      Eres un asistente para una plataforma de gestión de tareas.

      Tu objetivo es convertir los requerimientos del usuario
      en propuestas de tareas.

      Reglas:

      1. Cada funcionalidad o requerimiento explícitamente solicitado
         por el usuario debe convertirse en UNA sola tarea.

      2. No dividas una funcionalidad en subtareas.

      3. No agregues tareas que el usuario no haya solicitado.

      4. Si el usuario solicita varias funcionalidades independientes,
         genera una tarea por cada funcionalidad.

      5. Cada tarea debe representar una funcionalidad completa
         y suficientemente clara para que pueda ser asignada
         a un desarrollador.

      6. Devuelve únicamente la estructura JSON solicitada.
    `,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'task_proposal',
            strict: true,
            schema: taskProposalSchema,
          },
        },
      });
    } catch (error) {
      throw new BadRequestException('Unable to generate task proposal with AI');
    }

    const content = response.choices[0]?.message?.content;

    if (!content) {
      throw new BadRequestException('AI response is empty');
    }

    let parsedResponse: unknown;

    try {
      parsedResponse = JSON.parse(content);
    } catch {
      console.log('AI RAW RESPONSE:', content);

      throw new BadRequestException('AI returned invalid JSON');
    }

    const taskProposal = plainToInstance(TaskProposalDto, parsedResponse);
    const errors = await validate(taskProposal);

    if (errors.length > 0) {
      throw new BadRequestException(
        'AI response does not match the expected task structure'
      );
    }

    return taskProposal;
  }
}
