
import { Website } from '@sample/constructs';
import { Construct } from 'constructs';

export class Pattern extends Construct {

  constructor(scope: Construct, id: string) {
    super(scope, id);

    new Website(this, 'Website');

  }
}

