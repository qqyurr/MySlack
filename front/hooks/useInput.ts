import { Dispatch, SetStateAction, useCallback, useState } from 'react';

// 리액트에서 제공하는 hook들을 하나로 합쳐서 새로운 hook 만드는 것 : 커스텀 훅
// useState와 useCallback을 합쳐서 한번에 값을 반환해준다.

//매개변수, return 값의 타입을 붙여준다. (ts) 변수는 붙여줘야하는데 추론을 알아서 하기때문에 안 붙여줘도 된다.
// 매개변수 T가 string이면 자동으로 리턴값도 string이 된다.
// T를 any로 하면 안좋은점, 매개변수의 T가 string일때 return값의 T도 string으로 자동으로 바뀌지 않는다.

type ReturnTypes<T = any> = [T, (e: any) => void, Dispatch<SetStateAction<T>>]; // 타입부분을 따로 변수로 빼서 지정 가능

const useInput = <T = any>(initialData: T): ReturnTypes<T> => {
  const [value, setValue] = useState(initialData);
  const handler = useCallback((e: any) => {
    setValue(e.target.value);
  }, []);
  return [value, handler, setValue]; // [T, (e: any) => void, Dispatch<SetStateAction<T>>]
};

export default useInput;
