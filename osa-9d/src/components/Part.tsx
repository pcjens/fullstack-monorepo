import { CoursePart } from '../App';

interface ContentProps {
  part: CoursePart,
}

const Part = ({ part }: ContentProps) => {
  const { kind } = part;
  switch (kind) {
    case 'basic':
      return (
        <p>
          <strong>{part.name} {part.exerciseCount}</strong>
          <br />
          <em>{part.description}</em>
        </p>
      );
    case 'background':
      return (
        <p>
          <strong>{part.name} {part.exerciseCount}</strong>
          <br />
          <em>{part.description}</em>
          <br />
          background material: {part.backgroundMaterial}
        </p>
      );
    case 'group':
      return (
        <p>
          <strong>{part.name} {part.exerciseCount}</strong>
          <br />
          project exercises {part.groupProjectCount}
        </p>
      );
    case 'special':
      return (
        <p>
          <strong>{part.name} {part.exerciseCount}</strong>
          <br />
          <em>{part.description}</em>
          <br />
          required skills: {part.requirements.join(', ')}
        </p>
      );
    default: {
      const neverKind: never = kind;
      throw new Error(`CoursePart.kind "${neverKind}" is not being handled`);
    }
  }
}

export default Part;
