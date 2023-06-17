import Layout from "../components/Layout";
import '../styles/globals.css'
import { Provider } from 'react-redux'
import { wrapper,store } from "../redux/store";

function App({ Component, pageProps }) {
  
  // dispatch(contract(state))

  return (
    <Provider store={store}>
    <Layout>
      <Component {...pageProps} />
    </Layout>
    </Provider>
  )
}
export default wrapper.withRedux(App)