import { TranscriptItem } from '@/types/transcript';
import { PaginationData } from '@/types/common';

export type GetTranscriptResponse = {
  data: TranscriptItem[];
  pagination: PaginationData;
};
