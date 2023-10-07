import { Routes, Route } from "react-router-dom";
import AdBrowser from "./pages/AdBrowser";
import NotFound from "./pages/NotFound";
import Office from "./pages/Office";

export default function App() {
    return (
        <Routes>
            <Route path="/" /* element={<Layout />} */>
                {
                    !window.Telegram.WebApp.initData ?
                        <Route index element={<NotFound />} />
                        : null
                }
                <Route index element={<AdBrowser />} />
                <Route path="office" element={<Office />} />
                <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>
    );
}