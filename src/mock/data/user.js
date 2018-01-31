import Mock from 'mockjs'
const LoginUsers = [
  {
    id: 1,
    username: 'admin',
    password: '123456',
    avatar: 'https://raw.githubusercontent.com/taylorchen709/markdown-images/master/vueadmin/user.png',
    name: '张某某'
  }
]

const Users = []

for (let i = 0; i < 86; i++) {
  Users.push(Mock.mock({
    id: Mock.Random.guid(),
    name: Mock.Random.cname(),
    // addr: Mock.mock('@county(true)'),
    'age|18-60': 1,
    birth: Mock.Random.date(),
    sex: Mock.Random.integer(0, 1),
    role: '会计'
  }))
}

const Curtains = [
  {
    id: 1,
    name: '华夏诚信',
    code: '001',
    date: '2017-01-01'
  },
  {
    id: 2,
    name: '华夏成宇',
    code: '002',
    date: '2017-02-01'
  }
]

const Subjects = [
  {
    id: 1,
    code: '1001',
    name: '库存现金',
    level: 1,
    type: '固定资产',
    balance: '借方'
  },
  {
    id: 2,
    code: '1002',
    name: '银行存款',
    level: 1,
    type: '固定资产',
    balance: '借方'
  },
  {
    id: 3,
    code: '100201',
    name: '建设银行',
    level: 2,
    type: '固定资产',
    curtain: 1,
    balance: '借方'
  }
]

export { LoginUsers, Users, Curtains, Subjects }
