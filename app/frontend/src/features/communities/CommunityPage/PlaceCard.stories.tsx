import { Meta, Story } from "@storybook/react";

import place from "../../../test/fixtures/place.json";
import PlaceCard from "./PlaceCard";

export default {
  title: "Communities/CommunityPage/PlaceCard",
  component: PlaceCard,
} as Meta;

const Template: Story<any> = (args) => (
  <>
    <PlaceCard {...args} />
  </>
);

export const placeCard = Template.bind({});
placeCard.args = {
  place,
};