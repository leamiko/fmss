import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login/Login'
import NotFound from '@/404'
import Home from '@/Home'
import User from '@/components/user/User'
import Curtain from '@/components/curtain/Curtain'
import Subject from '@/components/subject/Subject'
import Voucher from '@/components/voucher/Voucher'
import DetailList from '@/components/voucher/DetailList'
import CurtainInit from '@/components/curtain/CurtainInit'
import Subalance from '@/components/balance/Subalance'
import Monthend from '@/components/balance/Monthend'
import Reportbelement from '@/components/report/ReportBElement'
import Reportpelement from '@/components/report/ReportPElement'
import Reportb from '@/components/report/ReportB'
import Reportp from '@/components/report/ReportP'

Vue.use(Router)
/* eslint-disable */

export default new Router({
  routes: [
  	{
    	path: '/login',
        component: Login,
        name: '登录',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    {
        path: '/',
        component: Home,
        name: '基础信息',
        iconCls: 'fa fa-address-card',//图标样式class
        roleCodes: ['ROLE_ADMIN'],
        children: [
            { path: '/user', component: User, name: '人员' },
            { path: '/curtain', component: Curtain, name: '帐套' },
            { path: '/subject', component: Subject, name: '科目' },
            { path: '/curtaininit/:curtainId', component: CurtainInit, name: '起初余额', hidden: true },
        ]
    },
    {
        path: '/',
        component: Home,
        name: '报表设置',
        iconCls: 'el-icon-tickets',//图标样式class
        roleCodes: ['ROLE_ADMIN'],
        children: [
            { path: '/reportbelement', component: Reportbelement, name: '资产负债表设置' },
            { path: '/reportpelement', component: Reportpelement, name: '利润表设置' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '账务处理',
        iconCls: 'el-icon-edit-outline',//图标样式class
        roleCodes: ['ROLE_EM','ROLE_MA'],
        children: [
            { path: '/voucher', component: Voucher, name: '凭证' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '账务查询',
        iconCls: 'el-icon-search',//图标样式class
        roleCodes: ['ROLE_EM','ROLE_MA'],
        children: [
            { path: '/detaillist', component: DetailList, name: '明细账' },
            { path: '/subalance', component: Subalance, name: '余额查询' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '月末结账',
        iconCls: 'el-icon-rank',//图标样式class
        roleCodes: ['ROLE_EM','ROLE_MA'],
        children: [
            { path: '/monthend', component: Monthend, name: '结账' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '报表',
        iconCls: 'el-icon-tickets',//图标样式class
        roleCodes: ['ROLE_MA'],
        children: [
            { path: '/reportb', component: Reportb, name: '资产负债表' },
            { path: '/reportp', component: Reportp, name: '利润表' }
        ]
    }
  ]
})
