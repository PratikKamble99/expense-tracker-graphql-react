import { useLocation, useNavigate } from "react-router-dom";

const useNavigation = () => {
  const _navigate = useNavigate();
  const location = useLocation();

  const navigate = (to: string) => {
    const path = location.pathname + location.search;
    console.log(to, "--", path);
    _navigate(to, { state: { from: path } });
  };

  return navigate;
};

export default useNavigation;
