import {
  CheckpointType,
  type Checkpoint,
  type SelectionValue,
} from "../data/items";
import { BatchCheckpointCard } from "./BatchCheckpointCard";
import { FactoryCheckpointCard } from "./FactoryCheckpointCard";
import { OptionsCheckpointCard } from "./OptionsCheckpointCard";

export { BatchCheckpointCard } from "./BatchCheckpointCard";
export { FactoryCheckpointCard } from "./FactoryCheckpointCard";
export { OptionsCheckpointCard } from "./OptionsCheckpointCard";

type Props = {
  index: number;
  checkpoint: Checkpoint;
  value?: SelectionValue;
  onChange: (checkpointId: string, optionId: string) => void;
};

export function CheckpointCard({ index, checkpoint, value, onChange }: Props) {
  if (checkpoint.type === CheckpointType.Batch) {
    return (
      <BatchCheckpointCard
        index={index}
        checkpoint={checkpoint}
        value={value}
        onChange={onChange}
      />
    );
  }

  if (checkpoint.type === CheckpointType.Factory) {
    return (
      <FactoryCheckpointCard
        index={index}
        checkpoint={checkpoint}
        value={value}
        onChange={onChange}
      />
    );
  }

  return (
    <OptionsCheckpointCard
      index={index}
      checkpoint={checkpoint}
      value={value}
      onChange={onChange}
    />
  );
}
