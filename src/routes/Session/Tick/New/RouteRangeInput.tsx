import { SliderInput, SliderTrack, SliderHandle } from "@reach/slider";
import "@reach/slider/styles.css";
import { SliderRange, SliderMarker } from "./Slider.styled";
import { RouteGrades } from "../../../../lib/grades";
import { Grade } from "../../../../types";

type Props = {
  value: Grade;
  onChange(newValue: Grade): void;
};

export function RouteRangeInput(props: Props) {
  return (
    <SliderInput
      value={props.value}
      onChange={props.onChange}
      min={RouteGrades["5.4"]}
      max={RouteGrades["5.15d"]}
      step={1}
    >
      <SliderTrack>
        <SliderRange />
        {Object.values(RouteGrades).map((value) => (
          <SliderMarker key={value} value={value} />
        ))}
        <SliderHandle />
      </SliderTrack>
    </SliderInput>
  );
}
