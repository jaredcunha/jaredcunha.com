import { parseISO, format } from 'date-fns';

interface DateProps {
  dateString: string;
}

export default function Date({ dateString }: DateProps) {
  const date = parseISO(dateString);
  return (
    <>
      <span className="sr-only">Posted on</span>
      <time dateTime={dateString}> {format(date, 'LLLL d, yyyy')}</time>
    </>
  );
}
