import layout from '@/layout'
export default {
  path: '/employee',
  name: 'employee',
  component: layout,
  children: [{
    path: '',
    name: 'employee',
    component: () => import('@/views/employee'),
    meta: {
      title: '员工',
      icon: 'people'
    }
  }, {
    path: '/employee/detail/:id?', // 员工详情地址(可以动态拼接id)? 代表id可有可无
    component: () => import('@/views/employee/detail.vue'),
    hidden: true, // // 只想在菜单中显示,
    meta: {
      title: '员工详情'
    }
  }]
}

// 只想在菜单中显示
