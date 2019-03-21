import React from 'react';
import Main from '../lib/components/main';

import { configure,mount ,shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

test('Main components renders correctly', () => {
  const wrapper = shallow(<Main/>);
  expect(wrapper).toMatchSnapshot();
});
