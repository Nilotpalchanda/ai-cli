export class TailwindUpgradeError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly cause?: Error
  ) {
    super(message);
    this.name = 'TailwindUpgradeError';
  }
}

export class PackageInstallError extends TailwindUpgradeError {
  constructor(packageName: string, cause?: Error) {
    super(
      `Failed to install package: ${packageName}`,
      'PACKAGE_INSTALL_ERROR',
      cause
    );
  }
}

export class FileOperationError extends TailwindUpgradeError {
  constructor(operation: string, filePath: string, cause?: Error) {
    super(
      `Failed to ${operation} file: ${filePath}`,
      'FILE_OPERATION_ERROR',
      cause
    );
  }
}

export class ConfigurationError extends TailwindUpgradeError {
  constructor(message: string, cause?: Error) {
    super(message, 'CONFIGURATION_ERROR', cause);
  }
}
