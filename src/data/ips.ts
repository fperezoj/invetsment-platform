import type { IpsDocument } from '@/types'

export const ipsDocs: IpsDocument[] = [
  {
    id: 'ips-c001-v2',
    clientId: 'c001',
    version: 2,
    status: 'vigente',
    createdAt: '2024-11-20',
    updatedAt: '2025-01-15',
    approvedAt: '2025-01-20',
    sections: [
      {
        id: 's1',
        title: '1. Objetivo de la inversión',
        content:
          'El objetivo principal de Alejandro García Ruiz es acumulación de patrimonio a largo plazo con horizonte de 10+ años, orientado a complementar su retiro. El cliente acepta volatilidad moderada a cambio de retornos superiores al benchmark de largo plazo.',
      },
      {
        id: 's2',
        title: '2. Perfil de riesgo',
        content:
          'Perfil: Balanceado (score KYC: 23/40). El cliente tiene experiencia intermedia en mercados, ingresos estables como empresario y un patrimonio diversificado. El 30% del patrimonio total está bajo gestión en esta plataforma.',
      },
      {
        id: 's3',
        title: '3. Asignación estratégica de activos (SAA)',
        content:
          'La asignación estratégica sigue el benchmark SAA Balanceado: 30% Renta Fija, 63% Renta Variable, 7% Alternativos. Se revisará anualmente o ante cambios materiales en las circunstancias del cliente.',
      },
      {
        id: 's4',
        title: '4. Restricciones y preferencias',
        content:
          'Sin restricciones sectoriales explícitas. Se evitarán instrumentos con calificación por debajo de BB-. No se permitirán posiciones apalancadas. El cliente prefiere ETFs de bajo costo sobre fondos activos.',
      },
      {
        id: 's5',
        title: '5. Política de rebalanceo',
        content:
          'Se realizará rebalanceo cuando cualquier clase de activo se desvíe más de ±5 pp de su peso objetivo. Revisión formal del portafolio cada trimestre. Rebalanceo automático al inicio de cada año.',
      },
      {
        id: 's6',
        title: '6. Parámetros de liquidez',
        content:
          'Se mantendrá un mínimo de 5% en activos líquidos (CETES / fondeo). No se requerirán retiros en los próximos 36 meses. Ante emergencias, el cliente dispone de fuentes alternas de liquidez.',
      },
      {
        id: 's7',
        title: '7. Consideraciones fiscales',
        content:
          'Persona física con régimen simplificado de confianza. Se optimizará la posición de los instrumentos para minimizar la retención de ISR sobre intereses. Ganancias de capital aplicarán tasa del 10%.',
      },
      {
        id: 's8',
        title: '8. Vigencia y revisión',
        content:
          'Este IPS tiene vigencia de 12 meses a partir de la fecha de aprobación (20 enero 2025). Cualquier cambio material en las circunstancias del cliente requerirá una revisión anticipada y nuevo cuestionario KYC.',
      },
    ],
  },
]
