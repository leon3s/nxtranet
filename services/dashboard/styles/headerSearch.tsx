import Styled from 'styled-components';

import { ButtonDefault } from '~/styles/buttons';

export { SearchBar } from '~/styles/inputs';

export const Header = Styled.div`
  width: 100%;
  height: 30px;
  display: flex;
  flex-direction: row;
`;

export const SearchBarWrapper = Styled.div`
  width: 100%;
`;

export const CreateButton = Styled(ButtonDefault)`
  height: 100%;
  font-size: 10px;
  margin-left: 10px;
`;
