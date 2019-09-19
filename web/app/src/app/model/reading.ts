export class Reading {

  constructor(public meterId: string, public date: Date, public value: number, public type: ReadingType, public id?: number, ) {}
}

export const enum ReadingType {
  MEASURE = 0,
  OFFSET = 1
}
