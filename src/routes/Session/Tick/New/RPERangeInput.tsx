import { SliderInput, SliderTrack, SliderHandle } from "@reach/slider";
import "@reach/slider/styles.css";
import { SliderRange, SliderMarker } from "./Slider.styled";
import { RPE } from "../../../../types";

type Props = {
  value: RPE;
  onChange(newValue: RPE): void;
};

export function RPERangeInput(props: Props) {
  return (
    <SliderInput
      value={props.value}
      onChange={props.onChange}
      min={1}
      max={10}
      step={1}
    >
      <SliderTrack>
        <SliderRange />
        {Array.from({ length: 11 }).map((_, index) => (
          <SliderMarker key={index} value={index} />
        ))}
        <SliderHandle />
      </SliderTrack>
    </SliderInput>
  );
}
