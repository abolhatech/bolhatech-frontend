import { MARGARET_AGENT_ID } from './config';

function getJsonSchemaFormat(name, schema) {
  return {
    type: 'json_schema',
    name,
    strict: true,
    schema,
  };
}

function getResponseText(response) {
  const texts = [];

  for (const output of response.output ?? []) {
    if (output.type !== 'message') continue;

    for (const content of output.content ?? []) {
      if (content.type === 'output_text' && content.text) {
        texts.push(content.text);
      }

      if (content.type === 'refusal' && content.refusal) {
        throw new Error(`OpenAI recusou a solicitação: ${content.refusal}`);
      }
    }
  }

  if (!texts.length) {
    throw new Error('Resposta da OpenAI sem conteúdo utilizável.');
  }

  return texts.join('\n').trim();
}

async function callOpenAI({ apiKey, model, input, schemaName, schema }) {
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY não configurada.');
  }

  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      input,
      text: {
        format: getJsonSchemaFormat(schemaName, schema),
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI Responses falhou (${response.status}): ${errorText}`);
  }

  const payload = await response.json();
  return JSON.parse(getResponseText(payload));
}

export async function classifyDigestItems({ apiKey, model, items, systemPrompt, runDate }) {
  const schema = {
    type: 'object',
    additionalProperties: false,
    required: ['dominant_theme', 'selection_summary', 'selected_items'],
    properties: {
      dominant_theme: { type: 'string' },
      selection_summary: { type: 'string' },
      selected_items: {
        type: 'array',
        minItems: 3,
        maxItems: 6,
        items: {
          type: 'object',
          additionalProperties: false,
          required: ['url', 'rank_position', 'selection_reason'],
          properties: {
            url: { type: 'string' },
            rank_position: { type: 'integer', minimum: 1, maximum: 6 },
            selection_reason: { type: 'string' },
          },
        },
      },
    },
  };

  return callOpenAI({
    apiKey,
    model,
    schemaName: 'margaret_digest_audit',
    schema,
    input: [
      {
        role: 'system',
        content: [
          {
            type: 'input_text',
            text: [
              'Você é um editor assistente da Bolha Tech.',
              'Sua tarefa é auditar uma shortlist de notícias tech e escolher as mais relevantes para Margaret.',
              'Priorize fatos do dia, sinais fortes do ecossistema, mudanças de produto/modelo/preço/política e notícias que gerem leitura crítica.',
              'Evite rumores fracos, duplicatas, press release vazio e itens sem contexto suficiente.',
              `Contexto da autora final:\n${systemPrompt}`,
            ].join('\n'),
          },
        ],
      },
      {
        role: 'user',
        content: [
          {
            type: 'input_text',
            text: JSON.stringify({
              run_date: runDate,
              agent_id: MARGARET_AGENT_ID,
              shortlist: items,
            }),
          },
        ],
      },
    ],
  });
}

export async function generateDigestPost({
  apiKey,
  model,
  systemPrompt,
  runDate,
  selectedItems,
  dominantTheme,
  selectionSummary,
}) {
  const schema = {
    type: 'object',
    additionalProperties: false,
    required: ['title', 'summary', 'content'],
    properties: {
      title: { type: 'string' },
      summary: { type: 'string' },
      content: { type: 'string' },
    },
  };

  return callOpenAI({
    apiKey,
    model,
    schemaName: 'margaret_daily_post',
    schema,
    input: [
      {
        role: 'system',
        content: [
          {
            type: 'input_text',
            text: [
              systemPrompt,
              '',
              'Instruções adicionais para esta tarefa:',
              '- Escreva em português do Brasil.',
              '- Gere um único post diário da Margaret baseado apenas nos itens fornecidos.',
              '- Mantenha o texto factual, rápido e cético.',
              '- Não invente números, bastidores ou consequências não citadas na shortlist.',
              '- Estrutura esperada: abertura curta, blocos separados por --- e fechamento com assinatura da Margaret.',
              '- O conteúdo deve parecer com os posts seedados da Margaret neste projeto.',
            ].join('\n'),
          },
        ],
      },
      {
        role: 'user',
        content: [
          {
            type: 'input_text',
            text: JSON.stringify({
              run_date: runDate,
              dominant_theme: dominantTheme,
              selection_summary: selectionSummary,
              selected_items: selectedItems,
            }),
          },
        ],
      },
    ],
  });
}
