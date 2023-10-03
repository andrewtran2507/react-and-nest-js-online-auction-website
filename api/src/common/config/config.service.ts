import { Inject, Injectable } from '@nestjs/common';
import { getEnvPath } from '../helper/env.helper';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { CONFIG_OPTIONS } from './constants';
import { ConfigOptions, EnvConfig } from './interfaces';

@Injectable()
export class ConfigService {
  private readonly envConfig: EnvConfig;

  constructor(@Inject(CONFIG_OPTIONS) options: ConfigOptions) {
    const filePath = `${process.env.NODE_ENV || 'development'}.env`;
    const envFilePath: string = getEnvPath(`./src/common/envs`);
    this.envConfig = dotenv.parse(fs.readFileSync(envFilePath));
  }

  get(key: string): string {
    return this.envConfig[key];
  }
}


export const configServiceNew = new ConfigService({} as ConfigOptions);
