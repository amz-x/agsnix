// Apollo & GraphQL Driver
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { DirectiveLocation, GraphQLDirective } from 'graphql';

// Modules
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { FileSystemModule } from './filesystem/filesystem.module';

// Custom Directives
import { upperDirectiveTransformer } from './common/directives/upper-case-directive';

@Module({
  imports: [
    FileSystemModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      installSubscriptionHandlers: true,
      playground: true,
      subscriptions: {
        'subscriptions-transport-ws': true,
        'graphql-ws': true
      },
      autoSchemaFile: 'schema.gql',
      sortSchema: true,
      transformSchema: (schema) => upperDirectiveTransformer(schema, 'upper'),
      buildSchemaOptions: {
        directives: [
          new GraphQLDirective({
            name: 'upper',
            locations: [DirectiveLocation.FIELD_DEFINITION],
          }),
        ],
      },
    }),
  ],
})
export class AppModule {}
