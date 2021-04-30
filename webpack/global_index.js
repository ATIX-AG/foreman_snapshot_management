import { registerReducer } from 'foremanReact/common/MountingService';
import reducers from './reducers';

// register reducers
Object.entries(reducers).forEach(([key, reducer]) =>
  registerReducer(key, reducer)
);
