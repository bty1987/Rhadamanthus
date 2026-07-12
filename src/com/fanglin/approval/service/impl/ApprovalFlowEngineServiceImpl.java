/**
 * @File Name		: ApprovalFlowEngineServiceImpl.java
 * @Package   		: com.fanglin.approval.service.impl
 * @Version			: 1.0
 * @Description		: 审批流程引擎服务实现。串联流程定义、节点判定、审批人解析、后置处理器。
 * 					  <p>关键设计:与现有 ApprovalService 单 receiver 模型兼容——
 * 					  每个 ApprovalPO 的 receiver 始终指向当前活跃节点的待办审批人,
 * 					  现有 ApprovalAction.approve/refuse 仍可用于单任务节点的简单场景。
 */

package com.fanglin.approval.service.impl;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.approval.dao.ApprovalDao;
import com.fanglin.approval.dao.ApprovalFlowDao;
import com.fanglin.approval.dao.ApprovalFlowNodeDao;
import com.fanglin.approval.dao.ApprovalTaskDao;
import com.fanglin.approval.engine.ApprovalHandlerRegistry;
import com.fanglin.approval.engine.ApprovalNodeHandler;
import com.fanglin.approval.engine.ApproverResolver;
import com.fanglin.approval.engine.NodeCompletionResult;
import com.fanglin.approval.engine.NodeCompletionStrategy;
import com.fanglin.approval.engine.PostHandlerInvoker;
import com.fanglin.approval.po.ApprovalFlowNodePO;
import com.fanglin.approval.po.ApprovalFlowPO;
import com.fanglin.approval.po.ApprovalPO;
import com.fanglin.approval.po.ApprovalTaskPO;
import com.fanglin.approval.service.ApprovalFlowEngineService;
import com.fanglin.approval.vo.ApprovalTaskVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Service("approvalFlowEngineService")
@Transactional(readOnly = true)
public class ApprovalFlowEngineServiceImpl implements ApprovalFlowEngineService {

	@Autowired
	private ApprovalFlowDao approvalFlowDao;

	@Autowired
	private ApprovalFlowNodeDao approvalFlowNodeDao;

	@Autowired
	private ApprovalTaskDao approvalTaskDao;

	@Autowired
	private ApprovalDao approvalDao;

	@Autowired(required = false)
	private com.fanglin.approval.dao.ApprovalFormDao approvalFormDao;

	@Autowired
	private ApproverResolver approverResolver;

	@Autowired
	private UserDao userDao;

	@Autowired(required = false)
	private com.fanglin.approval.service.ApprovalFormDataService approvalFormDataService;

	@Autowired(required = false)
	private ApprovalHandlerRegistry approvalHandlerRegistry;

	@Autowired(required = false)
	private PostHandlerInvoker postHandlerInvoker;

	private final NodeCompletionStrategy completionStrategy = new NodeCompletionStrategy();

	@Override
	public boolean hasFlow(short businessType, int company) {
		return approvalFlowDao.queryEnabledFlow(businessType, company) != null;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int startFlow(ApprovalPO approvalPO) throws FLException {
		return startFlow(approvalPO, null);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int startFlow(ApprovalPO approvalPO, Map<String, String> formData) throws FLException {

		ApprovalFlowPO flow = approvalFlowDao.queryEnabledFlow(approvalPO.getType(), approvalPO.getCompany());

		if (flow == null) {
			throw new FLException(240040, "未找到启用的流程定义(businessType=" + approvalPO.getType() + ")");
		}

		List<ApprovalFlowNodePO> nodes = approvalFlowNodeDao.queryApprovalFlowNodeByFlowId(flow.getFlowId());

		if (nodes == null || nodes.isEmpty()) {
			throw new FLException(240041, "流程定义无可用节点(flowId=" + flow.getFlowId() + ")");
		}

		// 存储表单数据(若提交时携带):按 flowId 反查关联的表单定义,再存 EAV 行
		if (approvalFormDataService != null && formData != null && !formData.isEmpty()) {
			com.fanglin.approval.po.ApprovalFormPO formPO = approvalFormDao.queryApprovalFormByFlowId(flow.getFlowId());
			if (formPO != null) {
				approvalFormDataService.saveFormData(approvalPO.getAid(), formPO.getFormId(), formData, null);
			}
		}

		return activateNode(approvalPO, flow, nodes, 0);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void agreeTask(long taskId, String userId, String comment) throws FLException {

		ApprovalTaskPO task = approvalTaskDao.get(taskId);
		if (task == null) {
			throw new FLException(240009, "审批任务不存在");
		}

		checkAssignee(task, userId);

		task.setStatus(ApprovalTaskPO.STATUS_AGREE_INT);
		task.setAction("agree");
		task.setComment(comment);
		task.setActionTime(DateUtil.getDateToTimestamp(new Date()));
		approvalTaskDao.update(task);

		ApprovalPO approvalPO = approvalDao.get(task.getAid());
		if (approvalPO == null) {
			throw new FLException(240009, "审批信息不存在");
		}

		ApprovalFlowPO flow = approvalFlowDao.get(task.getFlowId());
		ApprovalFlowNodePO currentNode = approvalFlowNodeDao.get(task.getNodeId());

		List<ApprovalTaskPO> nodeTasks = approvalTaskDao.queryApprovalTaskByAidNode(task.getAid(), task.getNodeId());

		NodeCompletionResult result = completionStrategy.judge(currentNode, nodeTasks, task, "agree");

		// 失效其余待办(或签通过/串行通过时)
		for (Long invalidId : result.getInvalidTaskIds()) {
			ApprovalTaskPO invalid = approvalTaskDao.get(invalidId);
			if (invalid != null && invalid.getStatus() == ApprovalTaskPO.STATUS_PENDING_INT) {
				invalid.setStatus(ApprovalTaskPO.STATUS_INVALID_INT);
				approvalTaskDao.update(invalid);
			}
		}

		if (result.getNodeStatus() == NodeCompletionResult.NODE_PASSED) {
			List<ApprovalFlowNodePO> nodes = approvalFlowNodeDao.queryApprovalFlowNodeByFlowId(flow.getFlowId());
			int currentIdx = indexOfNode(nodes, currentNode.getNodeId());

			if (currentIdx + 1 < nodes.size()) {
				// 推进下一节点
				activateNode(approvalPO, flow, nodes, currentIdx + 1);
			} else {
				// 末节点通过,流程终结:触发后置业务 + 更新审批主表状态
				finalizeApproval(approvalPO, true);
			}
		}
		// NODE_RUNNING:节点仍在进行中(并签/会签未达条件),不推进,receiver 保持不变
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void refuseTask(long taskId, String userId, String comment) throws FLException {

		ApprovalTaskPO task = approvalTaskDao.get(taskId);
		if (task == null) {
			throw new FLException(240009, "审批任务不存在");
		}

		checkAssignee(task, userId);

		task.setStatus(ApprovalTaskPO.STATUS_REFUSE_INT);
		task.setAction("refuse");
		task.setComment(comment);
		task.setActionTime(DateUtil.getDateToTimestamp(new Date()));
		approvalTaskDao.update(task);

		ApprovalPO approvalPO = approvalDao.get(task.getAid());
		if (approvalPO == null) {
			throw new FLException(240009, "审批信息不存在");
		}

		ApprovalFlowNodePO currentNode = approvalFlowNodeDao.get(task.getNodeId());

		// 失效本节点其余待办
		approvalTaskDao.invalidPendingTask(task.getAid(), task.getNodeId(), task.getTaskId());

		// 按驳回策略处理:当前统一按"整体驳回"终结(P0 阶段),后续扩展 REJECT_TO_PREV/INITIATOR
		if (currentNode.getRejectStrategy() == ApprovalFlowNodePO.REJECT_TERMINAL_INT) {
			finalizeApproval(approvalPO, false);
		} else {
			// TODO: REJECT_TO_PREV / REJECT_TO_INITIATOR 的回退逻辑
			finalizeApproval(approvalPO, false);
		}
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void transferTask(long taskId, String userId, String transferTo, String comment) throws FLException {

		ApprovalTaskPO task = approvalTaskDao.get(taskId);
		if (task == null) {
			throw new FLException(240009, "审批任务不存在");
		}

		checkAssignee(task, userId);

		if (transferTo == null || transferTo.isEmpty()) {
			throw new FLException(240010, "转交目标不能为空");
		}

		// 旧任务标记为转交
		task.setStatus(ApprovalTaskPO.STATUS_TRANSFER_INT);
		task.setAction("transfer");
		task.setComment(comment);
		task.setTransferTo(transferTo);
		task.setActionTime(DateUtil.getDateToTimestamp(new Date()));
		approvalTaskDao.update(task);

		// 新建任务给目标人(同节点同序)
		ApprovalTaskPO newTask = new ApprovalTaskPO();
		newTask.setAid(task.getAid());
		newTask.setFlowId(task.getFlowId());
		newTask.setNodeId(task.getNodeId());
		newTask.setNodeSeq(task.getNodeSeq());
		newTask.setNodeType(task.getNodeType());
		newTask.setAssigneeId(transferTo);
		newTask.setStatus(ApprovalTaskPO.STATUS_PENDING_INT);
		newTask.setAssignTime(DateUtil.getDateToTimestamp(new Date()));
		approvalTaskDao.save(newTask);

		// 更新审批主表 receiver 为转交目标(兼容单 receiver 模型)
		ApprovalPO approvalPO = approvalDao.get(task.getAid());
		if (approvalPO != null) {
			UserPO receiver = userDao.queryUserByUserId(transferTo);
			if (receiver == null) {
				throw new FLException(240043, "转交目标用户不存在(userId=" + transferTo + ")");
			}
			approvalPO.setReceiver(receiver);
			approvalDao.update(approvalPO);
		}
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public boolean agreeByAssignee(long aid, String assigneeId, String comment) throws FLException {

		ApprovalTaskPO task = approvalTaskDao.queryPendingTask(aid, assigneeId);

		if (task == null) {
			return false;
		}

		agreeTask(task.getTaskId(), assigneeId, comment);

		return true;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public boolean refuseByAssignee(long aid, String assigneeId, String comment) throws FLException {

		ApprovalTaskPO task = approvalTaskDao.queryPendingTask(aid, assigneeId);

		if (task == null) {
			return false;
		}

		refuseTask(task.getTaskId(), assigneeId, comment);

		return true;
	}

	@Override
	public List<ApprovalTaskVO> queryTaskTrace(long aid) throws FLException {

		List<ApprovalTaskPO> tasks = approvalTaskDao.queryApprovalTaskByAid(aid);
		List<ApprovalTaskVO> vos = new ArrayList<ApprovalTaskVO>();

		for (ApprovalTaskPO task : tasks) {
			ApprovalTaskVO vo = new ApprovalTaskVO();
			BeanUtil.copyProperties(task, vo);
			vos.add(vo);
		}

		return vos;
	}

	@Override
	public List<ApprovalTaskVO> queryTodoTasks(String userId) throws FLException {

		List<ApprovalTaskPO> tasks = approvalTaskDao.queryApprovalTaskByAssignee(userId, ApprovalTaskPO.STATUS_PENDING_INT);
		List<ApprovalTaskVO> vos = new ArrayList<ApprovalTaskVO>();

		for (ApprovalTaskPO task : tasks) {
			ApprovalTaskVO vo = new ApprovalTaskVO();
			BeanUtil.copyProperties(task, vo);
			vos.add(vo);
		}

		return vos;
	}

	// ==================== 内部方法 ====================

	/**
	 * 激活指定下标的节点:解析审批人 → 建任务 → 更新 ApprovalPO.receiver。
	 */
	private int activateNode(ApprovalPO approvalPO, ApprovalFlowPO flow, List<ApprovalFlowNodePO> nodes, int nodeIndex) throws FLException {

		ApprovalFlowNodePO node = nodes.get(nodeIndex);

		List<String> approverIds = approverResolver.resolve(node, approvalPO.getSender().getUserId());

		if (approverIds == null || approverIds.isEmpty()) {
			throw new FLException(240042, "节点[" + node.getNodeName() + "]无可用审批人");
		}

		Timestamp now = DateUtil.getDateToTimestamp(new Date());

		for (String approverId : approverIds) {
			ApprovalTaskPO task = new ApprovalTaskPO();
			task.setAid(approvalPO.getAid());
			task.setFlowId(flow.getFlowId());
			task.setNodeId(node.getNodeId());
			task.setNodeSeq(node.getNodeSeq());
			task.setNodeType(node.getNodeType());
			task.setAssigneeId(approverId);
			task.setStatus(ApprovalTaskPO.STATUS_PENDING_INT);
			task.setAssignTime(now);
			approvalTaskDao.save(task);
		}

		// 更新审批主表 receiver 为首节点首个审批人(兼容现有单 receiver 模型,使老接口仍可用)
		// 注意:receiver 外键引用 UserPO.uid(非 userId),必须查完整对象,否则外键约束失败
		UserPO receiver = userDao.queryUserByUserId(approverIds.get(0));
		if (receiver == null) {
			throw new FLException(240043, "审批人不存在(userId=" + approverIds.get(0) + ")");
		}
		approvalPO.setReceiver(receiver);
		approvalDao.update(approvalPO);

		return approverIds.size();
	}

	/**
	 * 流程终结:更新审批主表状态,触发后置业务处理。
	 *
	 * @param approvalPO 审批主表
	 * @param approved   true=通过 false=驳回
	 */
	private void finalizeApproval(ApprovalPO approvalPO, boolean approved) throws FLException {

		approvalPO.setApprovalTime(DateUtil.getDateToTimestamp(new Date()));

		if (approved) {
			approvalPO.setStatus(ApprovalPO.APPROVAL_STATUS_APPROVE_INT);

			// 触发后置业务:优先走 SPI(ApprovalNodeHandler),其次走配置化 PostHandler
			if (approvalHandlerRegistry != null) {
				ApprovalNodeHandler handler = approvalHandlerRegistry.lookup(approvalPO.getType());
				if (handler != null) {
					handler.onApprove(approvalPO);
				}
			}

			ApprovalFlowPO flow = approvalFlowDao.queryEnabledFlow(approvalPO.getType(), approvalPO.getCompany());
			if (flow != null) {
				ApprovalFlowNodePO lastNode = findLastNode(flow.getFlowId());
				if (lastNode != null && postHandlerInvoker != null) {
					postHandlerInvoker.invoke(lastNode.getPostHandler(), approvalPO);
				}
			}
		} else {
			approvalPO.setStatus(ApprovalPO.APPROVAL_STATUS_REFUSE_INT);

			if (approvalHandlerRegistry != null) {
				ApprovalNodeHandler handler = approvalHandlerRegistry.lookup(approvalPO.getType());
				if (handler != null) {
					handler.onRefuse(approvalPO);
				}
			}
		}

		approvalDao.update(approvalPO);
	}

	private ApprovalFlowNodePO findLastNode(long flowId) {
		List<ApprovalFlowNodePO> nodes = approvalFlowNodeDao.queryApprovalFlowNodeByFlowId(flowId);
		if (nodes == null || nodes.isEmpty()) {
			return null;
		}
		return nodes.get(nodes.size() - 1);
	}

	private int indexOfNode(List<ApprovalFlowNodePO> nodes, long nodeId) {
		for (int i = 0; i < nodes.size(); i++) {
			if (nodes.get(i).getNodeId() == nodeId) {
				return i;
			}
		}
		return -1;
	}

	private void checkAssignee(ApprovalTaskPO task, String userId) throws FLException {
		if (task.getAssigneeId() == null || !task.getAssigneeId().equals(userId)) {
			throw new FLException(240010, "无权操作此审批任务");
		}
		if (task.getStatus() != ApprovalTaskPO.STATUS_PENDING_INT) {
			throw new FLException(240010, "审批任务已处理,不可重复操作");
		}
	}

}
