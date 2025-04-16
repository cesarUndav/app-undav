// data/agenda.ts

export type EventoAgenda = {
    id: number;
    titulo: string;
    fecha: string;
    color?: string;
  };
  
  export const agendaMock: EventoAgenda[] = [
    {
      id: 1,
      titulo: 'Manu',
      fecha: '10 al 14 de Marzo',
      color: '#0b5085',
    },
    {
      id: 2,
      titulo: 'Desarrollo 1° Cuatrimestre',
      fecha: '17 de Marzo a 5 de Junio',
    },
    {
      id: 3,
      titulo: 'Inscripción Finales Mayo',
      fecha: '21 al 25 de Mayo',
      color: '#c90000',
    },
    {
    id: 4,
    titulo: 'Entrega TP Final',
    fecha: '15 de Junio',
    },
    {
    id: 5,
    titulo: 'Flor se muere',
    fecha: ' de Junio',
    },
  ];
