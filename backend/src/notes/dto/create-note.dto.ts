export class CreateNoteDto {
  title: string;
  content?: string;
  archieved?: boolean;
  categories: { name: string }[];
}
