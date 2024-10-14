import { RouterProvider } from 'react-router-dom';
import router from './routes';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from 'react';
import ScrollToTop from 'react-scroll-to-top';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  useEffect(() => {
    AOS.init({
      offset: 0,
      easing: 'ease',
      once: true,
    });
    AOS.refresh();
  }, []);

  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default App;
