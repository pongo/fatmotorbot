/* eslint-disable @typescript-eslint/ban-ts-ignore */
import sinon from 'sinon';
import { IInfoRepository, UserInfo } from 'src/app/core/Info/InfoRepository';
import { IWeightRepository } from 'src/app/core/Weight/WeightRepository';
import { DatabaseError } from 'src/app/shared/errors';
import { Kg, MeasuresFromNewestToOldest } from 'src/app/shared/types';
import { Result } from 'src/shared/utils/result';

const message = 'Mock returns not specified';

type Call = unknown[];
type Calls = Call[];

class RepositoryMock {
  readonly calls = new Map<string, Calls>();
  readonly options!: object;

  async __handle(method: string, args: unknown[]) {
    const calls = this.calls.get(method) ?? [];
    calls.push(args);
    this.calls.set(method, calls);

    // @ts-ignore
    if (this.options[method] == null) throw Error(message);
    // @ts-ignore
    return Promise.resolve(this.options[method]);
  }
}

type WeightRepositoryMockOptions = {
  add?: Result;
  getAll?: Result<MeasuresFromNewestToOldest<Kg>, DatabaseError>;
  getCurrent?: Result<Kg | null, DatabaseError>;
};

export class WeightRepositoryMock extends RepositoryMock implements IWeightRepository {
  constructor(readonly options: WeightRepositoryMockOptions = {}) {
    super();
  }

  async add(...args: unknown[]) {
    return this.__handle('add', args);
  }

  async getAll(...args: unknown[]) {
    return this.__handle('getAll', args);
  }

  async getCurrent(...args: unknown[]) {
    return this.__handle('getCurrent', args);
  }
}

type InfoRepositoryMockOptions = {
  get?: Result<UserInfo | null, DatabaseError>;
  set?: Result<undefined, DatabaseError>;
};

export class InfoRepositoryMock extends RepositoryMock implements IInfoRepository {
  constructor(readonly options: InfoRepositoryMockOptions = {}) {
    super();
  }

  async get(...args: unknown[]) {
    return this.__handle('get', args);
  }

  async set(...args: unknown[]) {
    return this.__handle('set', args);
  }
}

async function handle(method: string, options: object) {
  // @ts-ignore
  if (options[method] == null) throw Error(message);
  // @ts-ignore
  return Promise.resolve(options[method]);
}

export function WeightRepositoryMockSinon(options: WeightRepositoryMockOptions = {}) {
  return {
    add: sinon.stub().callsFake(() => handle('add', options)),
    getAll: sinon.stub().callsFake(() => handle('getAll', options)),
    getCurrent: sinon.stub().callsFake(() => handle('getCurrent', options)),
  };
}

export function InfoRepositoryMockSinon(options: InfoRepositoryMockOptions = {}) {
  return {
    get: sinon.stub().callsFake(() => handle('get', options)),
    set: sinon.stub().callsFake(() => handle('set', options)),
  };
}
