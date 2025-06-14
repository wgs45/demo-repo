type Props = {
  task: String;
  onRemove: () => void;
};

export default function TodoItem({ task, onRemove }: Props) {
  return (
    <li
      style={{ display: "flex", alignItems: "center", marginBottom: "0.5rem" }}
    >
      <span style={{ flexGrow: 1 }}>{task}</span>
      <button onClick={onRemove} style={{ marginLeft: "1rem" }}>
        X
      </button>
    </li>
  );
}
