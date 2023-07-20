import { Component, OnInit } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Query, FileSystemItem, FileSystemItemExtended } from '../../types';
import { formatFileSize } from 'src/utils';

@Component({
  selector: 'filesystem-browser',
  styleUrls: ['./filesystem-browser.component.scss'],
  templateUrl: './filesystem-browser.component.html',
})
export class FileSystemBrowserComponent implements OnInit {

  /**
   * UI listing items (directories & files)
   */
  fileSystemItems: FileSystemItemExtended[];

  /**
   * UI Loading (fetching data)
   */
  loading: boolean = false;

  /**
   * UI disabling the back button (limit the user to initialized root path)
   */
  goBackDisabled: boolean = true;

  /**
   * Query options
   */
  options = {
    directoryPath: '/',
    limit: 500
  };

  /**
   * Initialized / docker host mounted path
   */
  initRootPath = this.options.directoryPath;

  /**
   * Unit root path
   */
  unixRootPath = '/'.toString();

  /**
   * Windows root path
   */
  winRootPath = 'C:\\'.toString();

  /**
   * @inheritdoc
   */
  constructor(private apollo: Apollo) {
    this.fileSystemItems = [];
  }

  /**
   * @inheritdoc
   */
  ngOnInit() {
    this.refresh(true);
  }

  /**
   * Refresh helper
   */
  refresh(initialize = false) {
    this.loading = true;
    if (initialize) {
      this.runInitQuery();
    } else {
      this.runQuery();
      this.runChecks();
    }
  }

  /**
   * Initialization query to fetch mounted directory path
   */
  runInitQuery() {
    this.apollo.watchQuery<Query>({
      query: gql`
        {
          getInitialDirectoryPath {
            path
            name
          }
        }
      `,
    })
    .valueChanges.subscribe((res) => {
      this.options = {
        ...this.options,
        directoryPath: res.data.getInitialDirectoryPath.path
      };
      this.initRootPath = res.data.getInitialDirectoryPath.path;
      this.fileSystemItems = [];
      this.refresh();
    });
  }

  /**
   * Query triggered on initialization and when clicking on a directory item
   */
  runQuery() {
    this.apollo.watchQuery<Query>({
      query: gql`
        {
          getPathDirectoriesAndFiles(directoryPath: "${this.options.directoryPath}", limit: ${this.options.limit}) {
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
      `,
    })
    .valueChanges.subscribe((res) => {
      // Map data to specific format
      this.fileSystemItems = [
        ...res.data.getPathDirectoriesAndFiles.map(item => ({
          ...item,
          size: formatFileSize(item.size, 2),
          createdAt: new Date(item.createdAt).toUTCString(),
          modifiedAt: new Date(item.modifiedAt).toUTCString()
        }) as FileSystemItemExtended)
      ];

      // Hide Loader
      this.loading = false;
    });
  }

  /**
   * UI triggers
   */
  runChecks() {
    const directoryPath = this.options.directoryPath;
    if (directoryPath === this.initRootPath || directoryPath === this.unixRootPath || directoryPath === this.winRootPath) {
      this.goBackDisabled = true;
    } else {
      this.goBackDisabled = false;
    }
  }

  /**
   * Handle back button click handler
   */
  onButtonBackClick(currentDirectoryPath: string) {

    const unixPathSep = this.unixRootPath;
    const winPathSep = '\\'.toString();
    const currentDirectoryPathIsUnix = currentDirectoryPath.startsWith(this.unixRootPath);

    let pathSep = currentDirectoryPathIsUnix ? unixPathSep : winPathSep;
    let pathSepLastIndex = currentDirectoryPath.lastIndexOf(pathSep);
    if (pathSepLastIndex > 0) {
      pathSepLastIndex = pathSepLastIndex;
    } else {
      pathSepLastIndex = 1;
    }

    const previousDirectoryPath = currentDirectoryPath.substring(0, pathSepLastIndex);
    this.options = {
      ...this.options,
      directoryPath: previousDirectoryPath
    };

    this.refresh();
  }

  /**
   * Listing item *Directory* click handler
   */
  onItemClick(fileSystemItem: FileSystemItem) {
    if (fileSystemItem.path === '' || fileSystemItem.type === 'file' || fileSystemItem.read === false) {
      return;
    }

    this.options = {
      ...this.options,
      directoryPath: fileSystemItem.path
    };

    this.refresh();
  }
}
