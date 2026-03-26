package com.fanglin.seiya.service;

import com.fanglin.core.interceptor.FLException;

public interface A20260324Service {

	/**
	 * 同步职位信息（支持新增/更新/逻辑删除）
	 * 
	 * @param code 职位编码（更新时提供，新增时为null，如：POST9526）
	 * @param name 职位名称
	 * @param orgCode 部门编号（如：DEPT9526，保留但未使用）
	 * @param type 部门类型ID
	 * @param status 状态（1启用，2禁用）
	 * @param leaderFlag 是否领导岗（0否，1是）
	 * @return 职位ID（did）的字符串形式
	 * @throws FLException 业务异常
	 */
	public String syncDuty(String code, String name, String orgCode, Integer type, Integer status, Integer leaderFlag) throws FLException;

	/**
	 * 同步部门信息（支持新增/更新/逻辑删除）
	 * 
	 * @param code 部门编码（更新时提供，新增时为null，如：DEPT9526）
	 * @param name 部门名称
	 * @param type 部门类型ID
	 * @param parentCode 父部门编号（如：DEPT9525）
	 * @param orgCode 组织编码（如：DEPT9525）
	 * @param status 状态（1启用，2禁用）
	 * @param leaderCode 部门经理工号（如：FL-09527）
	 * @param posts 定岗数据（JSON字符串，如：{"1": 10, "2": 20}）
	 * @param orderValue 排序值
	 * @return 部门ID（did）的字符串形式
	 * @throws FLException 业务异常
	 */
	public String syncDepartment(String code, String name, Integer type, String parentCode, String orgCode, Integer status, String leaderCode, String posts, Integer orderValue) throws FLException;

	/**
	 * 同步用户信息（支持新增/更新）
	 * 
	 * @param code 用户工号（更新时提供，新增时为null，如：FL-09527）
	 * @param name 姓名
	 * @param currentName 现用名（可选，默认使用name）
	 * @param gender 性别（0女，1男）
	 * @param identity 身份证号
	 * @param phone 手机号
	 * @param loginId 登录用户名（可选，默认使用userId）
	 * @param deptId 部门ID
	 * @param dutyId 职位ID
	 * @param company 公司ID（user.company）
	 * @param status 状态（1在职，0离职，2停薪留职，外部参数）
	 * @return 用户ID（uid）的字符串形式，格式：{"code":"uid","belong_org_code":"company","userId":"工号"}
	 * @throws FLException 业务异常
	 */
	public String syncUser(String code, String name, String currentName, Integer gender, String identity, String phone, String loginId, Integer deptId, Long dutyId, Integer company, Integer status) throws FLException;

}
