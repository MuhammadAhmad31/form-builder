import type { NIconProps } from "../NIcon";

export type BadgeColor =
  | 'gray'
  | 'yellow'
  | 'orange'
  | 'blue'
  | 'purple'
  | 'green'
  | 'red';
export type BadgeType = 'prominent' | 'standard';

export interface NBadgeProps {
  color: BadgeColor;
  type: BadgeType;
  prependIcon?: NIconProps['name'];
  appendIcon?: NIconProps['name'];
  isNumberOnly?: boolean;
  class?: string;
}
