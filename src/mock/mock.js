import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { LoginUsers, Users, Curtains, Subjects } from './data/user'
let _Users = Users
let _Curtains = Curtains
let _Subjects = Subjects
/* eslint-disable */
export default {
  /**
   * mock bootstrap
   */
  bootstrap() {
    let mock = new MockAdapter(axios);

    // mock success request
    mock.onGet('/success').reply(200, {
      msg: 'success'
    });

    // mock error request
    mock.onGet('/error').reply(500, {
      msg: 'failure'
    });

    //登录
    mock.onPost('/login').reply(config => {
      console.log('-----login user...')
      let {username, password} = JSON.parse(config.data);
      return new Promise((resolve, reject) => {
        let user = null;
        setTimeout(() => {
          let hasUser = LoginUsers.some(u => {
            if (u.username === username && u.password === password) {
              user = JSON.parse(JSON.stringify(u));
              user.password = undefined;
              return true;
            }
          });

          if (hasUser) {
            resolve([200, { code: 200, msg: '请求成功', user }]);
          } else {
            resolve([200, { code: 500, msg: '账号或密码错误' }]);
          }
        }, 1000);
      });
    });

    //获取用户列表
    mock.onGet('/user/list').reply(config => {
      let {name} = config.params;
      let mockUsers = _Users.filter(user => {
        if (name && user.name.indexOf(name) == -1) return false;
        return true;
      });
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            users: mockUsers
          }]);
        }, 1000);
      });
    });

    //获取用户列表（分页）
    mock.onGet('/user/listpage').reply(config => {
      let {page, name} = config.params;
      let mockUsers = _Users.filter(user => {
        if (name && user.name.indexOf(name) == -1) return false;
        return true;
      });
      let total = mockUsers.length;
      mockUsers = mockUsers.filter((u, index) => index < 20 * page && index >= 20 * (page - 1));
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            total: total,
            users: mockUsers
          }]);
        }, 1000);
      });
    });

    //获取用户列表（所有）
    mock.onGet('/user/getall').reply(config => {
      let mockUsers = _Users.filter(user => {
        if (name && user.name.indexOf(name) == -1) return false;
        return true;
      });
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            users: mockUsers
          }]);
        }, 1000);
      });
    });

    //获取用户列表（通过帐套获得用户）
    mock.onGet('/user/getbycurtain').reply(config => {
      let mockUsers = _Users
      let selectUserIds = []
      mockUsers.some(u => {
        if (u.sex === 0) {
          selectUserIds.push(u.id)
        }
      })
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            selectUserIds: selectUserIds
          }]);
        }, 1000);
      });
    });


    //删除用户
    mock.onGet('/user/remove').reply(config => {
      let { id } = config.params;
      _Users = _Users.filter(u => u.id !== id);
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            code: 200,
            msg: '删除成功'
          }]);
        }, 500);
      });
    });

    //批量删除用户
    mock.onGet('/user/batchremove').reply(config => {
      let { ids } = config.params;
      ids = ids.split(',');
      _Users = _Users.filter(u => !ids.includes(u.id));
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            code: 200,
            msg: '删除成功'
          }]);
        }, 500);
      });
    });

    //编辑用户,,废弃
    mock.onGet('/user/edit').reply(config => {
      let { id, name, addr, age, birth, sex } = config.params;
      _Users.some(u => {
        if (u.id === id) {
          u.name = name;
          u.addr = addr;
          u.age = age;
          u.birth = birth;
          u.sex = sex;
          return true;
        }
      });
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            code: 200,
            msg: '编辑成功'
          }]);
        }, 500);
      });
    });

    //新增用户
    mock.onGet('/user/add').reply(config => {
      let { id, name, addr, age, birth, sex } = config.params;
      if (id==null) {
        _Users.push({
          name: name,
          addr: addr,
          age: age,
          birth: birth,
          sex: sex
        });
      } else {
        _Users.some(u => {
          if (u.id === id) {
            u.name = name;
            u.addr = addr;
            u.age = age;
            u.birth = birth;
            u.sex = sex;
            return true;
          }
        });
      }
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            code: 200,
            msg: '新增成功'
          }]);
        }, 500);
      });
    });

    //获取帐套列表（分页）
    mock.onGet('/curtain/listpage').reply(config => {
      let {page, name} = config.params;
      let mockCurtains = _Curtains.filter(curtain => {
        if (name && curtain.name.indexOf(name) == -1) return false;
        return true;
      });
      let total = mockCurtains.length;
      mockCurtains = mockCurtains.filter((u, index) => index < 20 * page && index >= 20 * (page - 1));
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            total: total,
            curtains: mockCurtains
          }]);
        }, 1000);
      });
    });

    //删除帐套
    mock.onGet('/curtain/remove').reply(config => {
      let { id } = config.params;
      _Curtains = _Curtains.filter(u => u.id !== id);
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            code: 200,
            msg: '删除成功'
          }]);
        }, 500);
      });
    });

    //新增帐套
    mock.onGet('/curtain/add').reply(config => {
      let { id, name, code, date } = config.params;
      if (id==null) {
        _Curtains.push({
          name: name,
          code: code,
          date: date
        });
      } else {
        _Curtains.some(u => {
          if (u.id === id) {
            u.name = name;
            u.code = code;
            u.date = date;
            return true;
          }
        });
      }
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            code: 200,
            msg: '新增成功'
          }]);
        }, 500);
      });
    });

    //获取帐套列表（分页）
    mock.onGet('/subject/listpage').reply(config => {
      let {curtain, type} = config.params;
      console.log('curtain---' + curtain)
      let mockSubjects = _Subjects.filter(subject => {
        if (curtain) { 
          if (subject.level!=1 && subject.curtain != curtain) return false;
          return true
        }else {
          if (subject.level === 1) return true;
          return false
        }
      });
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            subjects: mockSubjects
          }]);
        }, 1000);
      });
    });

    //删除帐套
    mock.onGet('/subject/remove').reply(config => {
      let { id } = config.params;
      _Subjects = _Subjects.filter(u => u.id !== id);
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            code: 200,
            msg: '删除成功'
          }]);
        }, 500);
      });
    });

    //新增帐套
    mock.onGet('/subject/add').reply(config => {
      let { id, name, code} = config.params;
      if (id==null) {
        _Subjects.push({
          name: name,
          code: code
        });
      } else {
        _Subjects.some(u => {
          if (u.id === id) {
            u.name = name;
            u.code = code;
            return true;
          }
        });
      }
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            code: 200,
            msg: '新增成功'
          }]);
        }, 500);
      });
    });

     //帐套
    mock.onGet('/subject/getFilterCurtains').reply(config => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            curtains: _Curtains
          }]);
        }, 500);
      });
    });
    //类型
    mock.onGet('/subject/getFilterTypes').reply(config => {
      let types = [{
        value: 'A',
        label: '资产'
      },{
        value: 'B',
        label: '负债'
      },{
        value: 'C',
        label: '权益'
      },{
        value: 'D',
        label: '损益'
      }]
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            types
          }]);
        }, 500);
      });
    });



  }
};