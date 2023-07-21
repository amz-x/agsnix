import { NgModule } from '@angular/core';
import { APOLLO_OPTIONS, ApolloModule } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { ApolloClientOptions, InMemoryCache, split } from '@apollo/client/core';
import { environment } from 'src/environments/environment';

export function createApollo(httpLink: HttpLink): ApolloClientOptions<any> {

  const { API_HOST, API_PORT } = environment;

  const http = httpLink.create({
    uri: `http://${API_HOST}:${API_PORT}/graphql`,
  });

  // const ws = new WebSocketLink({
  //   uri: `ws://${API_HOST}:${API_PORT}/graphql`,
  //   options: {
  //     reconnect: true,
  //   },
  // });

  // const link = split(
  //   // split based on operation type
  //   ({ query }) => {
  //     const definition = getMainDefinition(query);
  //     return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
  //   },
  //   ws,
  //   http,
  // );

  return {
    link: http,
    cache: new InMemoryCache(),
  };
}

@NgModule({
  exports: [ApolloModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule {}
