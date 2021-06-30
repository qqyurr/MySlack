import { CreateMenu, CloseModalButton } from '@components/Menu/styles';
import React, { CSSProperties, FC, PropsWithChildren, useCallback } from 'react';

interface Props {
  show: boolean;
  onCloseModal: (e: any) => void;
  style: CSSProperties;
  closeButton?: boolean;
}

const Menu: FC<PropsWithChildren<Props>> = ({ closeButton, style, show, children, onCloseModal }) => {
  const stopPropagation = useCallback((e) => {
    e.stopPropagation();
  }, []);

  if (!show) {
    return null;
  }
  return (
    // 내 부모를 누르면 창이 닫혀야하기 때문에 CreateMenu 태그에다가 onClick={onCloseModal} 모달 닫는 함수를 달아준다.
    <CreateMenu onClick={onCloseModal}>
      {/* stopPropagation으로 부모를 클릭했을 때는 닫히지만 나 자신을 클릭했을 때는 닫히지 않게 */}
      {/* HTML에서는 우너래 이벤트 버블링이 된다. 원래는 자식을 클릭하면 부모까지 클릭이벤트가 전달이되는데 stopPropagation이 그걸 막아줍니다. */}
      <div onClick={stopPropagation} style={style}>
        {closeButton && <CloseModalButton onClick={onCloseModal}>&times;</CloseModalButton>}
        {children}
      </div>
    </CreateMenu>
  );
};
// props의 기본값 설정
Menu.defaultProps = {
  closeButton: true,
};

export default Menu;
