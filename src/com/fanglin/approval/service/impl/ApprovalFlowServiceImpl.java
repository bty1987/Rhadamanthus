/**
 * @File Name		: ApprovalFlowServiceImpl.java
 * @Package   		: com.fanglin.approval.service.impl
 * @Version			: 1.0
 * @Description		: 审批流程定义管理服务实现。流程+节点增删改查。
 * 					  仿照现有 ProcessServiceImpl 的 addProcess/updateProcess/deleteProcess 模式。
 */

package com.fanglin.approval.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.approval.dao.ApprovalFlowDao;
import com.fanglin.approval.dao.ApprovalFlowNodeDao;
import com.fanglin.approval.po.ApprovalFlowNodePO;
import com.fanglin.approval.po.ApprovalFlowPO;
import com.fanglin.approval.service.ApprovalFlowService;
import com.fanglin.approval.vo.ApprovalFlowNodeVO;
import com.fanglin.approval.vo.ApprovalFlowVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("approvalFlowService")
@Transactional(readOnly = true)
public class ApprovalFlowServiceImpl implements ApprovalFlowService {

	@Autowired
	private ApprovalFlowDao approvalFlowDao;

	@Autowired
	private ApprovalFlowNodeDao approvalFlowNodeDao;

	@Override
	public void pageApprovalFlow(Paging paging, List<Filter> filters, int company) {

		filters.add(new Filter("company", String.valueOf(company), "eq"));

		List<ApprovalFlowPO> flowPOs = approvalFlowDao.pageApprovalFlow(paging, filters);
		List<ApprovalFlowVO> flowVOs = new ArrayList<ApprovalFlowVO>();

		for (ApprovalFlowPO flowPO : flowPOs) {
			flowVOs.add(flowPOToVO(flowPO));
		}

		paging.setData(flowVOs);
	}

	@Override
	public List<ApprovalFlowVO> queryApprovalFlow(int company) {

		List<ApprovalFlowPO> flowPOs = approvalFlowDao.queryApprovalFlow(company);
		List<ApprovalFlowVO> flowVOs = new ArrayList<ApprovalFlowVO>();

		for (ApprovalFlowPO flowPO : flowPOs) {
			flowVOs.add(flowPOToVO(flowPO));
		}

		return flowVOs;
	}

	@Override
	public ApprovalFlowVO queryApprovalFlowByFlowId(ApprovalFlowVO flowVO) throws FLException {

		ApprovalFlowPO flowPO = approvalFlowDao.get(flowVO.getFlowId());

		if (flowPO == null) {
			throw new FLException(240050, "流程定义不存在");
		}

		return flowPOToVO(flowPO);
	}

	@Override
	public List<ApprovalFlowNodeVO> queryApprovalFlowNode(ApprovalFlowVO flowVO) {

		List<ApprovalFlowNodePO> nodePOs = approvalFlowNodeDao.queryApprovalFlowNodeByFlowId(flowVO.getFlowId());
		List<ApprovalFlowNodeVO> nodeVOs = new ArrayList<ApprovalFlowNodeVO>();

		for (ApprovalFlowNodePO nodePO : nodePOs) {
			ApprovalFlowNodeVO nodeVO = new ApprovalFlowNodeVO();
			BeanUtil.copyProperties(nodePO, nodeVO);
			nodeVOs.add(nodeVO);
		}

		return nodeVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addApprovalFlow(ApprovalFlowVO flowVO, List<ApprovalFlowNodeVO> nodeVOs, int company) throws FLException {

		// 同 code+company+version 不允许重复
		int version = flowVO.getVersion() == null ? 1 : flowVO.getVersion();
		ApprovalFlowPO exists = approvalFlowDao.queryApprovalFlow(flowVO.getCode(), company, version);
		if (exists != null) {
			throw new FLException(240051, "流程编码已存在(code=" + flowVO.getCode() + ",version=" + version + ")");
		}

		if (nodeVOs == null || nodeVOs.isEmpty()) {
			throw new FLException(240052, "流程至少需要配置一个节点");
		}

		ApprovalFlowPO flowPO = new ApprovalFlowPO();
		BeanUtil.copyProperties(flowVO, flowPO);
		flowPO.setVersion(version);
		flowPO.setCompany(company);
		flowPO.setStatus(ApprovalFlowPO.STATUS_ENABLED_INT);

		approvalFlowDao.save(flowPO);

		for (ApprovalFlowNodeVO nodeVO : nodeVOs) {
			ApprovalFlowNodePO nodePO = new ApprovalFlowNodePO();
			BeanUtil.copyProperties(nodeVO, nodePO);
			nodePO.setFlowId(flowPO.getFlowId());
			nodePO.setStatus(ApprovalFlowNodePO.STATUS_ENABLED_INT);
			approvalFlowNodeDao.save(nodePO);
		}
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateApprovalFlow(ApprovalFlowVO flowVO, List<ApprovalFlowNodeVO> nodeVOs) throws FLException {

		ApprovalFlowPO flowPO = approvalFlowDao.get(flowVO.getFlowId());

		if (flowPO == null) {
			throw new FLException(240050, "流程定义不存在");
		}

		BeanUtil.copyProperties(flowVO, flowPO, Arrays.asList("status", "company", "flowId"));
		approvalFlowDao.update(flowPO);

		// 节点先删后建(与现有 ProcessServiceImpl.updateProcess 一致)
		approvalFlowNodeDao.deleteApprovalFlowNodeByFlowId(flowPO.getFlowId());

		if (nodeVOs != null) {
			for (ApprovalFlowNodeVO nodeVO : nodeVOs) {
				ApprovalFlowNodePO nodePO = new ApprovalFlowNodePO();
				BeanUtil.copyProperties(nodeVO, nodePO);
				nodePO.setFlowId(flowPO.getFlowId());
				nodePO.setStatus(ApprovalFlowNodePO.STATUS_ENABLED_INT);
				approvalFlowNodeDao.save(nodePO);
			}
		}
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateApprovalFlowForStatus(ApprovalFlowVO flowVO) throws FLException {

		ApprovalFlowPO flowPO = approvalFlowDao.get(flowVO.getFlowId());

		if (flowPO == null) {
			throw new FLException(240050, "流程定义不存在");
		}

		flowPO.setStatus(flowVO.getStatus());
		approvalFlowDao.update(flowPO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void deleteApprovalFlow(ApprovalFlowVO flowVO) throws FLException {

		ApprovalFlowPO flowPO = approvalFlowDao.get(flowVO.getFlowId());

		if (flowPO == null) {
			throw new FLException(240050, "流程定义不存在");
		}

		approvalFlowNodeDao.deleteApprovalFlowNodeByFlowId(flowPO.getFlowId());
		approvalFlowDao.delete(flowPO);
	}

	private ApprovalFlowVO flowPOToVO(ApprovalFlowPO flowPO) {
		ApprovalFlowVO vo = new ApprovalFlowVO();
		BeanUtil.copyProperties(flowPO, vo);
		return vo;
	}

}
