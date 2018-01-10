import { DayPipe, MonthPipe, InputPipe, LongDate, FromNowPipe } from './date.pipe';
import { PersonaNombre,PersonaDomicilio,PersonaOriginario } from './persona.pipe';

export const pipes = [DayPipe,MonthPipe,InputPipe,LongDate,PersonaNombre,PersonaDomicilio,PersonaOriginario, FromNowPipe];
