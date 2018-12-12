import { formatterMenus } from '@/utils';

const menuData = [
  {
    name: '测试',
    icon: 'dashboard',
    path: 'parent',
    //authority: '3',
    children: [
      {
        name: '测试sub',
        path: 'sub'
      }
    ],
  },
  {
    name: '测试3',
    path: 'parent2',
    icon: 'user'
  }
];

export default () => formatterMenus(menuData);