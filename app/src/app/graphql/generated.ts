import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** Date custom scalar type */
  Date: { input: any; output: any; }
};

/** fileSystemItem */
export type FileSystemItem = {
  __typename?: 'FileSystemItem';
  createdAt?: Maybe<Scalars['Date']['output']>;
  execute?: Maybe<Scalars['Boolean']['output']>;
  modifiedAt?: Maybe<Scalars['Date']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  mime?: Maybe<Scalars['String']['output']>;
  path?: Maybe<Scalars['String']['output']>;
  read?: Maybe<Scalars['Boolean']['output']>;
  size?: Maybe<Scalars['Float']['output']>;
  type?: Maybe<Scalars['String']['output']>;
  write?: Maybe<Scalars['Boolean']['output']>;
};

/** FileSystemPathNotifier */
export type FileSystemPathNotifier = {
  __typename?: 'FileSystemPathNotifier';
  action: Scalars['String']['output'];
  path: Scalars['String']['output'];
  result?: Maybe<FileSystemItem>;
};

export type Query = {
  __typename?: 'Query';
  getPathDirectoriesAndFiles: Array<FileSystemItem>;
};


export type QueryGetPathDirectoriesAndFilesArgs = {
  directoryPath: Scalars['String']['input'];
  limit?: InputMaybe<Scalars['Float']['input']>;
};

export type Subscription = {
  __typename?: 'Subscription';
  fileSystemPathNotifier: FileSystemPathNotifier;
};

export type Unnamed_1_QueryVariables = Exact<{ [key: string]: never; }>;


export type Unnamed_1_Query = { __typename?: 'Query', getPathDirectoriesAndFiles: Array<{ __typename?: 'FileSystemItem', path?: string | null, name?: string | null, type?: string | null, size?: number | null, read?: boolean | null, write?: boolean | null, execute?: boolean | null, createdAt?: any | null, modifiedAt?: any | null }> };

export const Document = gql`
    {
  getPathDirectoriesAndFiles(directoryPath: "/", limit: 500) {
    path
    name
    type
    mime
    size
    read
    write
    execute
    createdAt
    modifiedAt
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GQL extends Apollo.Query<Query, QueryVariables> {
    document = Document;

    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
