package com.fanglin.quotation.service.impl;

import java.sql.Timestamp;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.quotation.dao.QuotationAssignConfigDao;
import com.fanglin.quotation.dao.QuotationAssignRecordDao;
import com.fanglin.quotation.dao.QuotationAssignRequestDao;
import com.fanglin.quotation.dao.QuotationAssignUserRuleDao;
import com.fanglin.quotation.dao.QuotationAssignUserRuleTypeDao;
import com.fanglin.quotation.po.QuotationAssignConfigPO;
import com.fanglin.quotation.po.QuotationAssignRecordPO;
import com.fanglin.quotation.po.QuotationAssignRequestPO;
import com.fanglin.quotation.po.QuotationAssignUserRulePO;
import com.fanglin.quotation.service.QuotationAssignService;

/**
 * 装修单预算分配服务实现 核心分配逻辑实现
 */
@Service
public class QuotationAssignServiceImpl implements QuotationAssignService {

	@Autowired
	private QuotationAssignUserRuleDao quotationAssignUserRuleDao;

	@Autowired
	private QuotationAssignUserRuleTypeDao quotationAssignUserRuleTypeDao;

	@Autowired
	private QuotationAssignRecordDao quotationAssignRecordDao;

	@Autowired
	private QuotationAssignRequestDao quotationAssignRequestDao;

	@Autowired
	private QuotationAssignConfigDao quotationAssignConfigDao;

	@Autowired
	private DecorationDao decorationDao;

	@Autowired(required = false)
	private InformationService informationService;

	@Override
	@Transactional(rollbackFor = Exception.class)
	public Integer autoAssignBudgetUser(String orderId, Integer companyId, Byte decorationType) {
		// 1. 检查装修单是否已分配预算员
		DecorationPO decoration = decorationDao.queryDecorationByOrderId(orderId);
		if (decoration == null) {
			throw new FLException("装修单不存在: " + orderId);
		}

		Integer currentQuoterUid = decoration.getQuoter() != null ? decoration.getQuoter().getUid() : null;
		if (currentQuoterUid != null) {
			// 已分配，记录并返回，不重新分配
			saveAssignRecord(orderId, currentQuoterUid, (short) 1, (short) 1, decorationType.shortValue(), null);
			return currentQuoterUid;
		}

		// 2. 获取装修单类型（如果未传入）
		if (decorationType == null) {
			decorationType = decoration.getType(); // 1-半包，2-整装
		}

		// 3. 查找待分配且完成时间最早的预算员（列表）
		List<QuotationAssignUserRulePO> budgetUsers = quotationAssignUserRuleDao.pullAvailableQuotationAssignUserRule(companyId, decoration.getDepartment());

		if (budgetUsers == null || budgetUsers.isEmpty()) {
			// 分支2：未找到预算员，进入待分配队列
			return createAssignRequest(orderId, companyId, decoration.getDepartment(), decorationType, decoration.getCuid());
		}

		// 4. 遍历预算员，查找支持该类型的预算员
		for (QuotationAssignUserRulePO budgetUser : budgetUsers) {
			// 验证预算员是否支持该装修类型
			boolean isTypeSupported = quotationAssignUserRuleTypeDao.countByQauridAndType(budgetUser.getQaurid(), decorationType.shortValue()) > 0;

			if (isTypeSupported) {
				// 分支1：找到匹配的预算员，执行分配
				return executeAssign(orderId, budgetUser, companyId, decorationType);
			}
			// 如果不支持，继续查找下一个预算员
		}

		// 分支3：有预算员但都不支持该类型，返回错误提示
		return handleTypeMismatch(orderId, companyId, decorationType, decoration.getCuid());
	}

	/**
	 * 执行分配操作（分支1：分配成功）
	 */
	private Integer executeAssign(String orderId, QuotationAssignUserRulePO budgetUser, Integer companyId, Byte decorationType) {
		// 1. 更新装修单的预算员ID
		DecorationPO decoration = decorationDao.queryDecorationByOrderId(orderId);
		if (decoration != null) {
			// 创建 UserPO 对象并设置预算员
			UserPO quoter = new UserPO();
			quoter.setUid(budgetUser.getUser().getUid());
			decoration.setQuoter(quoter);
			decorationDao.update(decoration);
		}

		// 2. 更新或创建 quotationassignrequest（状态改为已分配）
		QuotationAssignRequestPO request = quotationAssignRequestDao.queryQuotationAssignRequestByOrderId(orderId);

		if (request != null) {
			request.setStatus(QuotationAssignRequestPO.STATUS_ASSIGNED_INT);
			request.setAssignTime(new Timestamp(System.currentTimeMillis()));
			quotationAssignRequestDao.update(request);
		}

		// 3. 更新预算员状态（基于 quotationassignrequest 统计）
		updateBudgetUserStatus(budgetUser.getUser().getUid());

		// 4. 记录分配历史
		saveAssignRecord(orderId, budgetUser.getUser().getUid(), (short) 1, (short) 1, decorationType.shortValue(), null);

		// 5. 发送通知（异步）
		sendAssignNotification(orderId, budgetUser.getUser().getUid(), null, "auto");

		return budgetUser.getUser().getUid();
	}

	/**
	 * 创建待分配请求（分支2：无预算员）
	 */
	private Integer createAssignRequest(String orderId, Integer companyId, Integer department, Byte decorationType, Integer designerUid) {
		// 1. 检查是否已存在待分配请求
		QuotationAssignRequestPO existingRequest = quotationAssignRequestDao.queryQuotationAssignRequestByOrderId(orderId);
		if (existingRequest != null && existingRequest.getStatus() == QuotationAssignRequestPO.STATUS_PENDING_INT) {
			return null; // 已在队列中
		}

		// 2. 生成分配记录（进入队列）
		saveAssignRecord(orderId, null, (short) 1, (short) 0, decorationType.shortValue(), "无可用预算员");

		// 3. 创建待分配请求记录
		QuotationAssignRequestPO request = new QuotationAssignRequestPO();
		request.setOrderId(orderId);
		request.setCompany(companyId);
		request.setDepartment(department);
		request.setDecorationType(decorationType.shortValue());
		request.setPriority(QuotationAssignRequestPO.PRIORITY_NORMAL_INT);
		request.setRequestTime(new Timestamp(System.currentTimeMillis()));
		UserPO requestUser = new UserPO();
		requestUser.setUid(designerUid);
		request.setRequestUser(requestUser);
		request.setStatus(QuotationAssignRequestPO.STATUS_PENDING_INT);
		quotationAssignRequestDao.save(request);

		// 4. 发送通知：已加入待分配队列
		sendQueueNotification(orderId, designerUid, companyId, "added_to_queue");

		return null;
	}

	/**
	 * 处理类型不匹配（分支3：返回错误）
	 */
	private Integer handleTypeMismatch(String orderId, Integer companyId, Byte decorationType, Integer designerUid) {
		String typeName = (decorationType == 1) ? "半包" : "整装";

		// 1. 生成分配记录（类型不匹配）
		saveAssignRecord(orderId, null, (short) 1, (short) 0, decorationType.shortValue(), "无预算员支持该类型（" + typeName + "）");

		// 2. 不创建报价单

		// 3. 发送错误通知给设计师
		sendErrorNotification(designerUid, orderId, typeName);

		// 4. 发送通知给预算经理
		sendManagerNotification(companyId, orderId, typeName);

		// 5. 抛出异常或返回错误码
		throw new FLException("当前无预算员支持该装修类型（" + typeName + "），请联系管理员配置预算员类型");
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public boolean manualAssignBudgetUser(String orderId, Integer budgetUid, Integer assignUid) {
		// 1. 验证预算员
		QuotationAssignUserRulePO budgetUser = quotationAssignUserRuleDao.queryQuotationAssignUserRuleByUid(budgetUid);
		if (budgetUser == null) {
			throw new FLException("预算员不存在: " + budgetUid);
		}

		// 2. 获取装修单信息
		DecorationPO decoration = decorationDao.queryDecorationByOrderId(orderId);
		if (decoration == null) {
			throw new FLException("装修单不存在: " + orderId);
		}

		// 3. 验证类型匹配
		boolean isTypeSupported = quotationAssignUserRuleTypeDao.countByQauridAndType(budgetUser.getQaurid(), decoration.getType()) > 0;
		if (!isTypeSupported) {
			String typeName = (decoration.getType() == 1) ? "半包" : "整装";
			throw new FLException("该预算员不支持装修类型（" + typeName + "）");
		}

		// 4. 更新装修单的预算员ID
		Integer oldQuoterUid = decoration.getQuoter() != null ? decoration.getQuoter().getUid() : null;
		UserPO quoter = new UserPO();
		quoter.setUid(budgetUid);
		decoration.setQuoter(quoter);
		decorationDao.update(decoration);

		// 5. 更新或创建 quotationassignrequest
		QuotationAssignRequestPO request = quotationAssignRequestDao.queryQuotationAssignRequestByOrderId(orderId);
		if (request != null) {
			request.setStatus(QuotationAssignRequestPO.STATUS_ASSIGNED_INT);
			request.setAssignTime(new Timestamp(System.currentTimeMillis()));
			quotationAssignRequestDao.update(request);
		}

		// 6. 更新旧预算员状态
		if (oldQuoterUid != null) {
			updateBudgetUserStatus(oldQuoterUid);
		}

		// 7. 更新新预算员状态
		updateBudgetUserStatus(budgetUid);

		// 8. 记录分配历史
		saveAssignRecord(orderId, budgetUid, (short) 2, (short) 1, decoration.getType(), null);

		// 9. 发送通知
		sendAssignNotification(orderId, budgetUid, assignUid, "manual");

		return true;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void finishQuotation(String orderId) {
		DecorationPO decoration = decorationDao.queryDecorationByOrderId(orderId);
		if (decoration == null) {
			return;
		}

		Integer budgetUid = decoration.getQuoter() != null ? decoration.getQuoter().getUid() : null;
		if (budgetUid == null) {
			return;
		}

		// 1. 删除 quotationassignrequest 记录（已完成）
		QuotationAssignRequestPO request = quotationAssignRequestDao.queryQuotationAssignRequestByOrderId(orderId);
		if (request != null) {
			quotationAssignRequestDao.delete(request);
		}

		// 2. 更新预算员状态
		updateBudgetUserStatus(budgetUid);

		// 3. 反向自动分配：预算员变为空闲时，检查待分配队列
		reverseAutoAssign(budgetUid);
	}

	/**
	 * 反向自动分配：预算员空闲时从待分配队列中获取任务（含类型匹配）
	 */
	private void reverseAutoAssign(Integer budgetUid) {
		// 1. 获取预算员信息
		QuotationAssignUserRulePO budgetUser = quotationAssignUserRuleDao.queryQuotationAssignUserRuleByUid(budgetUid);
		if (budgetUser == null) {
			return;
		}

		List<Short> supportedTypes = quotationAssignUserRuleTypeDao.queryTypesByQaurid(budgetUser.getQaurid());

		if (supportedTypes == null || supportedTypes.isEmpty()) {
			// 预算员未配置类型，无法分配
			return;
		}

		// 2. 查询待分配队列中最优先且类型匹配的任务
		QuotationAssignRequestPO request = quotationAssignRequestDao.pullTopPriorityQuotationAssignRequestByTypes(budgetUser.getCompany(), budgetUser.getDepartment() != null ? budgetUser.getDepartment() : null, supportedTypes);

		if (request == null) {
			// 队列为空或无匹配类型，预算员保持空闲
			return;
		}

		// 3. 更新装修单的预算员ID
		DecorationPO decoration = decorationDao.queryDecorationByOrderId(request.getOrderId());
		if (decoration != null) {
			UserPO quoter = new UserPO();
			quoter.setUid(budgetUid);
			decoration.setQuoter(quoter);
			decorationDao.update(decoration);
		}

		// 4. 更新待分配请求状态
		request.setStatus(QuotationAssignRequestPO.STATUS_ASSIGNED_INT);
		request.setAssignTime(new Timestamp(System.currentTimeMillis()));
		quotationAssignRequestDao.update(request);

		// 5. 更新预算员状态
		updateBudgetUserStatus(budgetUid);

		// 6. 记录分配历史
		saveAssignRecord(request.getOrderId(), budgetUid, (short) 3, (short) 1, request.getDecorationType(), null);

		// 7. 发送通知
		sendAssignNotification(request.getOrderId(), budgetUid, null, "reverse_auto_assign");
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public boolean reassignBudgetUser(String orderId, Integer newBudgetUid, Integer assignUid) {
		DecorationPO decoration = decorationDao.queryDecorationByOrderId(orderId);
		if (decoration == null) {
			throw new FLException("装修单不存在: " + orderId);
		}

		Integer oldQuoterUid = decoration.getQuoter() != null ? decoration.getQuoter().getUid() : null;

		// 1. 更新装修单的预算员ID
		UserPO quoter = new UserPO();
		quoter.setUid(newBudgetUid);
		decoration.setQuoter(quoter);
		decorationDao.update(decoration);

		// 2. 更新 quotationassignrequest（如果存在）
		QuotationAssignRequestPO request = quotationAssignRequestDao.queryQuotationAssignRequestByOrderId(orderId);
		if (request != null) {
			request.setAssignTime(new Timestamp(System.currentTimeMillis()));
			quotationAssignRequestDao.update(request);
		}

		// 3. 更新旧预算员状态
		if (oldQuoterUid != null) {
			updateBudgetUserStatus(oldQuoterUid);
		}

		// 4. 更新新预算员状态
		updateBudgetUserStatus(newBudgetUid);

		// 5. 记录分配历史
		saveAssignRecord(orderId, newBudgetUid, (short) 2, (short) 1, decoration.getType(), null);

		// 6. 发送通知
		sendAssignNotification(orderId, newBudgetUid, assignUid, "manual");

		return true;
	}

	@Override
	public boolean isQuotationAssignEnabled(Integer companyId, Integer departmentId) {
		QuotationAssignConfigPO config = quotationAssignConfigDao.queryQuotationAssignConfigByCompanyAndDepartment(companyId, departmentId);
		return config != null && config.getEnabled() == QuotationAssignConfigPO.ENABLED_ENABLED_INT;
	}

	@Override
	public boolean isAutoAssign(Integer companyId, Integer departmentId) {
		QuotationAssignConfigPO config = quotationAssignConfigDao.queryQuotationAssignConfigByCompanyAndDepartment(companyId, departmentId);
		return config != null && config.getAutoAssign() == QuotationAssignConfigPO.AUTO_ASSIGN_AUTO_INT;
	}

	@Override
	public void updateBudgetUserStatus(Integer uid) {
		// 统计该预算员的已分配请求数
		int taskCount = quotationAssignUserRuleDao.countQuotationAssignTaskByUid(uid);

		QuotationAssignUserRulePO user = quotationAssignUserRuleDao.queryQuotationAssignUserRuleByUid(uid);
		if (user == null) {
			return;
		}

		short status;
		if (taskCount == 0) {
			status = QuotationAssignUserRulePO.STATUS_AVAILABLE_INT; // 待分配
		} else {
			status = QuotationAssignUserRulePO.STATUS_BUSY_INT; // 制作中
		}

		quotationAssignUserRuleDao.updateStatusAndTaskCount(uid, status, taskCount);
	}

	/**
	 * 生成分配记录（所有分支都调用）
	 */
	private void saveAssignRecord(String orderId, Integer budgetUid, short assignType, short assignResult, Short decorationType, String failReason) {
		QuotationAssignRecordPO record = new QuotationAssignRecordPO();
		record.setOrderId(orderId);
		if (budgetUid != null) {
			UserPO user = new UserPO();
			user.setUid(budgetUid);
			record.setUser(user);
		}
		record.setAssignType(assignType);
		record.setAssignResult(assignResult);
		record.setFailReason(failReason);
		record.setDecorationType(decorationType);
		record.setAssignTime(new Timestamp(System.currentTimeMillis()));
		quotationAssignRecordDao.save(record);
	}

	/**
	 * 发送分配通知
	 */
	private void sendAssignNotification(String orderId, Integer budgetUid, Integer assignUid, String assignType) {
		if (informationService == null) {
			return;
		}

		// TODO: 实现通知逻辑
		// 通知设计师、预算员、预算经理
	}

	/**
	 * 发送待分配队列通知
	 */
	private void sendQueueNotification(String orderId, Integer designerUid, Integer companyId, String action) {
		if (informationService == null) {
			return;
		}

		// TODO: 实现通知逻辑
	}

	/**
	 * 发送错误通知
	 */
	private void sendErrorNotification(Integer designerUid, String orderId, String typeName) {
		if (informationService == null) {
			return;
		}

		// TODO: 实现通知逻辑
	}

	/**
	 * 发送经理通知
	 */
	private void sendManagerNotification(Integer companyId, String orderId, String typeName) {
		if (informationService == null) {
			return;
		}

		// TODO: 实现通知逻辑
	}
}
