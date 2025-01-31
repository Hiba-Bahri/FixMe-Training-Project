import { ArgumentMetadata, BadRequestException, PipeTransform } from '@nestjs/common';

export class NonEmptyUpdatePipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (!value || Object.keys(value).length === 0) {
      throw new BadRequestException('At least one field must be updated');
    }
    return value;
  }
}
