import axios from 'axios'
// let base = 'http://47.104.60.254:8081'
let base = 'http://192.168.1.104:8081'
// let base = 'http://localhost:8081'
// ----登录
export const getRoleByLoginName = params => { return axios.get(`${base}/auth/getRoleByLoginName`, { params: params }) }
// 登录
export const requestLogin = params => { return axios.post(`${base}/auth/getToken`, params) }
// ----人员
export const getUserList = params => { return axios.get(`${base}/user/list`, { params: params }) }

export const getRoleOptions = params => { return axios.get(`${base}/role/list`) }

export const removeUser = params => { return axios.get(`${base}/user/deleteById`, { params: params }) }

export const updatePassword = params => { return axios.post(`${base}/user/updatePwd`, params) }

export const addUser = params => { return axios.post(`${base}/user/add`, params) }
// ----帐套
export const getCurtainList = params => { return axios.get(`${base}/curtain/list`, { params: params }) }

export const addCurtain = params => { return axios.post(`${base}/curtain/add`, params) }

export const getCurtainById = params => { return axios.get(`${base}/curtain/getCurtainById`, { params: params }) }

export const getCurtainCode = params => { return axios.get(`${base}/curtain/getNewCode`, { params: params }) }
// 删除
export const removeCurtain = params => { return axios.get(`${base}/curtain/remove`, { params: params }) }
// 期初余额
export const getInitCurtainBalance = params => { return axios.get(`${base}/curtainbalance/getInitCurtainBalance`, { params: params }) }
// 保存起初余额
export const updateCurtainBalance = params => { return axios.post(`${base}/curtainbalance/updateCurtainBalance`, params) }
// 获得某帐套下的用户
export const getSelectUsers = params => { return axios.get(`${base}/curtain/getUsersByCurtain`, { params: params }) }
// 保存操作员和帐套主管
export const updateUserByCurtainId = params => { return axios.post(`${base}/curtain/updateUserByCurtainId`, params) }
// ----科目
export const getSubjectList = params => { return axios.get(`${base}/subject/findAllByCurtainId`, { params: params }) }

export const removeSubject = params => { return axios.get(`${base}/subject/remove`, { params: params }) }

export const addSubject = params => { return axios.post(`${base}/subject/add`, params) }
// 获得科目类别
export const getFilterTypes = params => { return axios.get(`${base}/subject/getFilterTypes`) }
// 验证科目的编号
export const validateCode = params => { return axios.get(`${base}/subject/validateCode`, { params: params }) }
// 复制科目到新的帐套
export const copySubject = params => { return axios.post(`${base}/subject/copySubject`, params) }
// 获得科目树
export const getSubjectsTree = params => { return axios.get(`${base}/subject/getSubjectsTree`, { params: params }) }
// ----凭证
export const getVouchers = params => { return axios.get(`${base}/voucher/listPage`, { params: params }) }
// 保存凭证
export const saveVoucher = params => { return axios.post(`${base}/voucher/save`, params) }
// 获得凭证明细
export const getVoucherDetails = params => { return axios.get(`${base}/voucher/getVoucherDetails`, { params: params }) }
// 获得凭证和凭证明细信息
export const getVoucherInfo = params => { return axios.get(`${base}/voucher/getVoucherInfo`, { params: params }) }
// 获得凭证编号集合
export const getStatusOptions = params => { return axios.get(`${base}/voucher/getStatusOptions`) }
// 根据ID集合审核凭证
export const auditVouchers = params => { return axios.get(`${base}/voucher/auditVouchers`, { params: params }) }
// 审核全部
export const auditAllVouchers = params => { return axios.get(`${base}/voucher/auditAllVouchers`, { params: params }) }
// 上一页或下一页
export const getVoucherForm = params => { return axios.get(`${base}/voucher/getVoucherForm`, { params: params }) }
// 取消审核
export const cancelAudit = params => { return axios.get(`${base}/voucher/cancelAudit`, { params: params }) }
// 作废一张凭证
export const cancelVoucher = params => { return axios.get(`${base}/voucher/cancelVoucher`, { params: params }) }
// 凭证打印
export const getVoucherPrintInfo = params => { return axios.get(`${base}/voucher/getVoucherPrintInfo`, { params: params }) }
// ----明细账
export const getDetailList = params => { return axios.get(`${base}/voucher/getDetailList`, { params: params }) }
// 导出明细账
export const exportDetailExcel = params => { return axios.post(`${base}/voucher/exportDetailExcel`, params, {responseType: 'blob'}) }
// ----余额表
export const getSubalances = params => { return axios.get(`${base}/curtainbalance/getSubalances`, { params: params }) }
// 导出余额表
export const exportBalanceExcel = params => { return axios.post(`${base}/curtainbalance/exportBalanceExcel`, params, {responseType: 'blob'}) }
// 登账
export const chargeUp = params => { return axios.get(`${base}/curtainbalance/chargeUp`, { params: params }) }
// 试算是否平衡
export const checkSum = params => { return axios.get(`${base}/curtainbalance/checkSum`, { params: params }) }
// 自动转结账，将5类科目转为0
export const autoSettle = params => { return axios.get(`${base}/curtainbalance/autoSettle`, { params: params }) }
// 反结转
export const autoSettleCancel = params => { return axios.get(`${base}/curtainbalance/autoSettleCancel`, { params: params }) }
// 反结账
export const chargeUpCancel = params => { return axios.get(`${base}/curtainbalance/chargeUpCancel`, { params: params }) }
// 获得步骤条
export const getActive = params => { return axios.get(`${base}/curtainbalance/getActive`, { params: params }) }
// ----资产负债表
export const getSubjectsCode1List = params => { return axios.get(`${base}/subject/getSubjectsCode1List`, { params: params }) }
// 查询B报表元素
export const getReportBElements = params => { return axios.get(`${base}/reportbelement/getReportBElements`, { params: params }) }
// 删除
export const removeReportBElement = params => { return axios.get(`${base}/reportbelement/remove`, { params: params }) }
// 提交
export const addReportBElement = params => { return axios.post(`${base}/reportbelement/add`, params) }
// 配置科目
export const updateReportBSubjects = params => { return axios.post(`${base}/reportbelement/updateReportBSubjects`, params) }
// 生成资产负债表
export const createReport = params => { return axios.get(`${base}/reportb/createReport`, { params: params }) }
// 获得报表
export const getReports = params => { return axios.get(`${base}/reportb/getReports`, { params: params }) }
// 导出---下载excel
export const exportExcel = params => { return axios.post(`${base}/reportb/exportExcel`, params, {responseType: 'blob'}) }
// 删除报表
export const removeReportB = params => { return axios.get(`${base}/reportb/removeReports`, { params: params }) }
// ----利润表
export const getReportPElements = params => { return axios.get(`${base}/reportpelement/getReportPElements`, { params: params }) }
// 删除
export const removeReportPElement = params => { return axios.get(`${base}/reportpelement/remove`, { params: params }) }
// 提交
export const addReportPElement = params => { return axios.post(`${base}/reportpelement/add`, params) }
// 配置科目
export const updateReportPSubjects = params => { return axios.post(`${base}/reportpelement/updateReportPSubjects`, params) }
// 生成资产负债表
export const createReportp = params => { return axios.get(`${base}/reportp/createReport`, { params: params }) }
// 获得报表
export const getReportps = params => { return axios.get(`${base}/reportp/getReports`, { params: params }) }
// 导出---下载excel
export const exportReportpExcel = params => { return axios.post(`${base}/reportp/exportExcel`, params, {responseType: 'blob'}) }
// 删除报表
export const removeReportP = params => { return axios.get(`${base}/reportp/removeReports`, { params: params }) }
