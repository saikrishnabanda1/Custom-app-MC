import { useState } from 'react';

const useShareState = () => {
  const [changeFieldLabel, setChangeFieldLabel] = useState({});
  return {
    changeFieldLabel,
    setChangeFieldLabel,
  };
};

export default useShareState;
