/**
 * @File Name		: ApprovalFlowService.java
 * @Package   		: com.fanglin.approval.service
 * @Version			: 1.0
 * @Description		: 审批流程定义管理服务。提供流程+节点的增删改查,供后台配置使用。
 */

package com.fanglin.approval.service;

import java.util.List;

import com.fanglin.approval.vo.ApprovalFlowNodeVO;
import com.fanglin.approval.vo.ApprovalFlowVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface ApprovalFlowService {

	public void pageApprovalFlow(Paging paging, List<Filter> filters, int company);

	public ApprovalFlowVO queryApprovalFlowByFlowId(ApprovalFlowVO flowVO) throws FLException;

	/** 查询流程下的全部节点定义 */
	public List<ApprovalFlowNodeVO> queryApprovalFlowNode(ApprovalFlowVO flowVO);

	/** 新建流程(含节点) */
	public void addApprovalFlow(ApprovalFlowVO flowVO, List<ApprovalFlowNodeVO> nodeVOs, int company) throws FLException;

	/** 更新流程(含节点,先删后建) */
	public void updateApprovalFlow(ApprovalFlowVO flowVO, List<ApprovalFlowNodeVO> nodeVOs) throws FLException;

	/** 启用/禁用流程 */
	public void updateApprovalFlowForStatus(ApprovalFlowVO flowVO) throws FLException;

	/** 删除流程(含节点) */
	public void deleteApprovalFlow(ApprovalFlowVO flowVO) throws FLException;

}
