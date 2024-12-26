import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { Opts } from '@e2e/opts';
import {
  loadPackageDefinition,
  Server,
  ServerCredentials,
  type ServiceClientConstructor,
} from '@grpc/grpc-js';
import { load } from '@grpc/proto-loader';

const opts = Opts(process.argv);

async function startServer(debug = false): Promise<Server> {
  const logger = debug ? (...args) => console.log(...args) : () => {};
  const server = new Server();

  const packageDefinition = await load('./pet.proto', {
    includeDirs: [join(dirname(fileURLToPath(import.meta.url)), './proto')],
  });
  const grpcObject = loadPackageDefinition(packageDefinition);
  console.log(grpcObject);
  server.addService((grpcObject.PetService as ServiceClientConstructor).service, {
    GetAllPets(call, callback) {
      // Static pet store data
      const pets = [
        { id: 1, name: 'Pet1' },
        { id: 2, name: 'Pet2' },
        { id: 3, name: 'Pet3' },
        { id: 4, name: 'Pet4' },
        { id: 5, name: 'Pet5' },
      ];

      logger('called with MetaData:', JSON.stringify(call.metadata.getMap()));
      callback(null, { pets });
    },
  });
  return new Promise((resolve, reject) => {
    server.bindAsync(
      '0.0.0.0:' + opts.getServicePort('pets'),
      ServerCredentials.createInsecure(),
      (error, port) => {
        if (error) {
          reject(error);
          return;
        }
        logger('Server started, listening: 0.0.0.0:' + port);
        resolve(server);
      },
    );
  });
}

startServer(true).catch(console.error);

process.on('uncaughtException', err => {
  console.error(`process on uncaughtException error: ${err}`);
});

process.on('unhandledRejection', err => {
  console.error(`process on unhandledRejection error: ${err}`);
});
