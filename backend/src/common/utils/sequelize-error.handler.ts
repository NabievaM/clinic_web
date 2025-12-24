import { BadRequestException } from '@nestjs/common';

export function handleDbLengthError(error: any): never {
  if (
    error?.name === 'SequelizeDatabaseError' &&
    error?.parent?.code === '22001'
  ) {
    throw new BadRequestException('Matn juda uzun, iltimos qisqaroq kiriting!');
  }

  throw error;
}
