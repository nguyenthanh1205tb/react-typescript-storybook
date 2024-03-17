import React from 'react';
import '../src/assets/css/main.scss';

const preview = {
  decorators: [
    (Story) => (
      <div style={{ margin: '3em' }}>
        <Story />
      </div>
    ),
  ],
};

export default preview;
