import { ApiProperty } from '@nestjs/swagger';

export class CreateChannelDto {
  @ApiProperty({
    example: '수다방',
    description: '채널명',
  })
  public name: string;
}
