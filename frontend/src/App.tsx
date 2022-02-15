import React, { Suspense } from 'react';
import { RecoilRoot } from 'recoil';
import LoadingSpiner from './components/load-page/LoadingSpiner';

// import Routing from './components/routing/Routing';

function App() {
  const Routing = React.lazy(() => import('./components/routing/Routing'));

  return (
    <div className="App">
      <RecoilRoot>
        <Suspense fallback={<LoadingSpiner />}>
          <Routing />
        </Suspense>
      </RecoilRoot>
    </div>
  );
}

export default App;
