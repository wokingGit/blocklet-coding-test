export interface InfoData {
  id?: number;
  name?: string;
  phone?: number;
  email?: string;
}

export type EditLabel = keyof InfoData;

export type InfoLabel = {
  label: EditLabel;
  icon: JSX.Element;
};

export type EditLabelList = {
  label: EditLabel;
  required: boolean;
  isError: boolean;
  helperText: string;
  rule: ((value: string | number | undefined) => boolean) | null;
};
