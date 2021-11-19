import Styled from 'styled-components';

import Image from '~/components/Shared/Image';

import { SearchBar } from '~/styles/inputs';

export const Container = Styled.div`
  width: 100%;
  display: flex;
  flex: 1;
  max-width: 326px;
`;
  
export const SearchInput = SearchBar;

export const SearchIcon = Styled(Image)`
`;
