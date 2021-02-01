import { SliderInput, SliderTrack, SliderHandle } from "@reach/slider";
import "@reach/slider/styles.css";
import { SliderRange, SliderMarker } from "./Slider.styled";
import { BoulderGrades } from "../../../../lib/grades";
import { Grade } from "../../../../types";

type Props = {
  value: Grade;
  onChange(newValue: Grade): void;
};

export function BoulderRangeInput(props: Props) {
  return (
    <SliderInput
      value={props.value}
      onChange={props.onChange}
      min={BoulderGrades.V0}
      max={BoulderGrades.V16}
      step={1}
    >
      <SliderTrack>
        <SliderRange />
        {Object.values(BoulderGrades).map((value) => (
          <SliderMarker key={value} value={value} />
        ))}
        <SliderHandle />
      </SliderTrack>
    </SliderInput>
  );
}
