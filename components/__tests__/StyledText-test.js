import * as React from 'react';
import { create } from 'jest-expo'; // Updated import

import { MonoText } from '../StyledText';

it(`renders correctly`, () => {
  const tree = create(<MonoText>Snapshot test!</MonoText>).toJSON();

  expect(tree).toMatchSnapshot();
});
