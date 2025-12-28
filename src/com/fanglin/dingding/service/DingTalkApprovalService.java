package com.fanglin.dingding.service;

import java.util.List;
import java.util.Map;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.fanglin.core.interceptor.FLException;

/**
 * 钉钉审批服务接口
 */
public interface DingTalkApprovalService {

	/**
	 * 获取审批信息
	 * @param no 审批编号
	 * @return 审批信息
	 * @throws FLException 异常
	 */
	public JSONObject getApproval(String no) throws FLException;

	/**
	 * 获取审批字段
	 * @param no 审批编号
	 * @param field 字段名
	 * @return 字段值
	 * @throws FLException 异常
	 */
	public String getApproval(String no, String field) throws FLException;

	/**
	 * 发起审批
	 * @param processCode 流程代码
	 * @param senderId 发起人ID
	 * @param approver 审批人
	 * @param copy 抄送人
	 * @param copyPosition 抄送岗位
	 * @param formComponentValues 表单组件值
	 * @param company 公司ID
	 * @return 流程实例ID
	 * @throws FLException 异常
	 */
	public String initiateApproval(String processCode, String senderId, String approver, String copy, String copyPosition, JSONArray formComponentValues, int company) throws FLException;

	/**
	 * 获取表单值（单个字段）
	 * @param name 字段名
	 * @param value 字段值
	 * @return 表单JSON数组
	 */
	public JSONArray getForms(String name, String value);

	/**
	 * 获取表单值（多个字段）
	 * @param values 字段值Map
	 * @return 表单JSON对象列表
	 */
	public List<JSONObject> getForms(Map<String, Object> values);

}
