import type { Transport } from '@graphql-mesh/transport-common';
import { getThriftExecutor } from './execution.js';

export { getThriftExecutor };

export type * from './types.js';

export default {
  getSubgraphExecutor({ subgraph }) {
    return getThriftExecutor(subgraph);
  },
} satisfies Transport;
