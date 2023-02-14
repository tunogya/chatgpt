import {atom} from 'recoil';
import {recoilPersist} from 'recoil-persist';

const { persistAtom } = recoilPersist()

export const jwtAtom = atom({
  key: 'jwt',
  default: '',
  effects_UNSTABLE: [persistAtom],
})