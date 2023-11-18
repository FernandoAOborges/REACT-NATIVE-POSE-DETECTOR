export type TPosePointProps = {
  position: {
    x: number;
    y: number;
  };
};

export interface IResultPosesProps {
  width: number;
  height: number;
  blocks: TPosePointProps[];
}
