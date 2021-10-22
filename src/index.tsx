import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import 'css/global.css';
import '!style-loader!css-loader!react-reflex/styles.css';
import '!style-loader!css-loader!react-tippy/dist/tippy.css';
import '!style-loader!css-loader!react-calendar/dist/Calendar.css';
import '!style-loader!css-loader!react-datetime-picker/dist/DateTimePicker.css';
import '!style-loader!css-loader!react-clock/dist/Clock.css';

import { RecoilRoot } from 'recoil';

import { Router } from 'react-router-dom';

import history from 'utils/history';

import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

ReactDOM.render(
  <React.StrictMode>
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <Router history={history}>
          <App />
        </Router>
      </QueryClientProvider>
    </RecoilRoot>
  </React.StrictMode>,
  document.getElementById('root'),
);
