const PrimaryButton = ({
  text,
}: {
  text: string;
  iconProps?: { iconName: string; styles?: Record<string, unknown> };
  styles?: Record<string, unknown>;
}) => (
  <button className="px-4 py-2 bg-blue-600 text-white rounded">{text}</button>
);
export default PrimaryButton;
