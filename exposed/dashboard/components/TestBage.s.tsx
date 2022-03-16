import Styled from 'styled-components';

type TestBageStatusIconProps = {
  type: 'passing' | 'failling';
}

export const TestBageContainer = Styled.div`
  height: 20px;
  border-radius: 4px;
  background-color: #5a5a5a;
  display: flex;
  overflow: hidden;
  flex-direction: row;
  align-items: center;
`;

export const TestBageText = Styled.p`
  padding: 8px;
  font-size: 8px;
  font-weight: bold;
  letter-spacing: 1px;
  width: 100%;
  color: white;
`;

export const TestBageStatusIcon = Styled.div<TestBageStatusIconProps>`
${props => `
  display: flex;
  flex: 1;
  min-height: 100%;
  ${props.type === 'passing' ? `
  background-color: green;
  ` : `
  background-color: red;
  `}
`}
`;
