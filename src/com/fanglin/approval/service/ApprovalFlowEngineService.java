/**
 * @File Name		: ApprovalFlowEngineService.java
 * @Package   		: com.fanglin.approval.service
 * @Version			: 1.0
 * @Description		: 审批流程引擎服务。提供基于 approvalFlow 定义的新一代审批能力:
 * 					  配置化流程、串行/并签/或签/会签、节点流转。
 * 					  <p>与现有 ApprovalService 并存:未配置 approvalFlow 的业务类型仍走老逻辑,
 * 					  配置了 approvalFlow 的走本引擎,两条链路互不干扰。
 */

package com.fanglin.approval.service;

import java.util.List;
import java.util.Map;

import com.fanglin.approval.po.ApprovalPO;
import com.fanglin.approval.vo.ApprovalTaskVO;
import com.fanglin.core.interceptor.FLException;

public interface ApprovalFlowEngineService {

	/**
	 * 判断指定业务类型+公司是否已配置启用流程定义。
	 * 用于业务提交时决定走新引擎还是走老 ApprovalService。
	 */
	public boolean hasFlow(short businessType, int company);

	/**
	 * 启动流程:为已存在的 ApprovalPO 创建首节点的审批任务。
	 * 调用时机:业务 Service 已 save(approvalPO) 之后,本方法负责按流程定义激活首节点。
	 *
	 * @param approvalPO 已创建的审批主表对象
	 * @return 首节点创建的任务数
	 */
	public int startFlow(ApprovalPO approvalPO) throws FLException;

	/**
	 * 启动流程(带表单数据):除激活首节点外,把前端提交的表单数据存入 approvalFormData 表。
	 *
	 * @param approvalPO 已创建的审批主表对象
	 * @param formData   前端提交的表单数据(fieldKey→fieldValue),null 或空则跳过表单存储
	 * @return 首节点创建的任务数
	 */
	public int startFlow(ApprovalPO approvalPO, Map<String, String> formData) throws FLException;

	/**
	 * 通用审批发起:不依赖业务单据,引擎自动创建 ApprovalPO 并激活首节点。
	 * 用于请假、报销、用车等非业务审批场景。
	 *
	 * @param flowCode 流程定义编码(如 GENERAL_LEAVE)
	 * @param senderId 发起人 userId
	 * @param company  公司ID
	 * @param formData 表单数据(fieldKey→fieldValue),可为 null
	 * @return 审批单 aid
	 */
	public long startGeneralFlow(String flowCode, String senderId, int company, Map<String, String> formData) throws FLException;

	/**
	 * 审批通过:处理指定任务,判定节点完成状态,推进流程或终结。
	 *
	 * @param taskId    任务ID
	 * @param userId    操作人 userId(必须 == task.assigneeId)
	 * @param comment   审批意见
	 */
	public void agreeTask(long taskId, String userId, String comment) throws FLException;

	/**
	 * 审批拒绝:处理指定任务,按节点 rejectStrategy 决定整体驳回或回退。
	 *
	 * @param taskId    任务ID
	 * @param userId    操作人 userId
	 * @param comment   审批意见
	 */
	public void refuseTask(long taskId, String userId, String comment) throws FLException;

	/**
	 * 转交任务:把当前任务转给他人。
	 *
	 * @param taskId      任务ID
	 * @param userId      操作人 userId(必须 == task.assigneeId)
	 * @param transferTo  转交目标 userId
	 * @param comment     转交说明
	 */
	public void transferTask(long taskId, String userId, String transferTo, String comment) throws FLException;

	/**
	 * 钉钉/外部渠道审批通过入口:仅有 aid + assigneeId(无 taskId),内部按 assignee 匹配待办 task 后流转。
	 * 用于钉钉回调驱动本地引擎节点流转,实现"钉钉端/Web端 双端互认"。
	 *
	 * @param aid        审批单ID
	 * @param assigneeId 审批人 userId
	 * @param comment    审批意见
	 * @return true=匹配到 task 并已处理;false=无匹配 task(调用方可回退老逻辑)
	 */
	public boolean agreeByAssignee(long aid, String assigneeId, String comment) throws FLException;

	/**
	 * 钉钉/外部渠道审批拒绝入口。
	 */
	public boolean refuseByAssignee(long aid, String assigneeId, String comment) throws FLException;

	/**
	 * 查询某审批单的审批轨迹(全部任务,按节点顺序)。
	 */
	public List<ApprovalTaskVO> queryTaskTrace(long aid) throws FLException;

	/**
	 * 查询某用户的待办任务列表。
	 */
	public List<ApprovalTaskVO> queryTodoTasks(String userId) throws FLException;

}
