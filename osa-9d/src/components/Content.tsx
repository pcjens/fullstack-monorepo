import { CoursePart } from '../App';

interface ContentProps {
  parts: CoursePart[],
}

const Content = (props: ContentProps) => {
  return (
    <div>
      {props.parts.map(({ name, exerciseCount }) => (
        <p>
          {name} {exerciseCount}
        </p>
      ))}
    </div>
  );
}

export default Content;
