/**
 * @File Name     : QuotationAssignServiceImpl.java
 * @Package      : com.fanglin.quotation.service.impl
 * @Version       : 1.0
 * @Date          : 2026-03-20
 * @Copyright     : Copyright Creators 2026
 * @Author        : Claude AI
 * @Describing    : 核心分配逻辑 Service 实现类
 */

package com.fanglin.quotation.service.impl;

import java.sql.Timestamp;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.exception.FLException;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationPO;
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
 * 核心分配逻辑 Service 实现类
 *
 * <p>
 * 职责：实现报价员预算员的自动分配与手动派单功能
 * </p>
 *
 * <p>
 * 主要功能：
 * </p>
 * <ul>
 * <li>正向自动分配（设计师发起）</li>
 * <li>反向自动分配（预算员完成后）</li>
 * <li>手动分配（预算经理派单）</li>
 * <li>重新分配（更换预算员）</li>
 * </ul>
 *
 * @author Claude AI
 * @version 1.0
 */
@Service("quotationAssignService")
public class QuotationAssignServiceImpl implements QuotationAssignService {

	@Autowired
	private DecorationDao decorationDao;

	@Autowired
	private QuotationAssignConfigDao quotationAssignConfigDao;

	@Autowired
	private QuotationAssignUserRuleDao quotationAssignUserRuleDao;

	@Autowired
	private QuotationAssignRequestDao quotationAssignRequestDao;

	@Autowired
	private QuotationAssignRecordDao quotationAssignRecordDao;

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int autoAssignQuotation(String orderId) throws FLException {

		// ========== 参数校验 ==========
		if (orderId == null || orderId.trim().isEmpty()) {
			throw new FLException(0, "装修单号不能为空");
		}

		// ========== 业务逻辑开始 ==========

		// 1. 查询装修单
		DecorationPO decoration = decorationDao.queryByOrderId(orderId);
		if (decoration == null) {
			throw new FLException(0, "装修单不存在");
		}

		// 2. 检查是否已分配报价员
		if (decoration.getQuid() != null && decoration.getQuid() > 0) {
			throw new FLException(0, "该装修单已分配报价员，无需重复分配");
		}

		// 3. 获取装修单类型和公司部门信息
		Short decorationType = decoration.getType();
		Integer company = decoration.getCompany();
		Integer department = decoration.getDepartment();

		if (decorationType == null) {
			throw new FLException(0, "装修单类型不能为空");
		}

		if (company == null) {
			throw new FLException(0, "装修单公司信息不能为空");
		}

		// 4. 检查预算配置是否启用
		QuotationAssignConfigPO config = quotationAssignConfigDao.getByCompanyAndDepartment(company, department);
		if (config == null || config.getEnabled() != QuotationAssignConfigPO.ENABLED_ENABLED_INT) {
			throw new FLException(0, "该公司/部门未启用预算员自动分配功能");
		}

		// 5. 如果是手动模式，直接进入待分配队列
		if (config.getAutoAssign() != QuotationAssignConfigPO.AUTO_ASSIGN_AUTO_INT) {
			return createPendingRequest(orderId, company, department, decorationType);
		}

		// 6. 查找可分配预算员（status=1，按lastFinishTime升序、currentTaskCount升序）
		List<QuotationAssignUserRulePO> availableUsers = quotationAssignUserRuleDao.queryAvailableUsers(company, department);

		if (availableUsers == null || availableUsers.isEmpty()) {
			return createPendingRequest(orderId, company, department, decorationType);
		}

		// 7. 验证预算员是否支持该装修类型，选择最早完成的
		QuotationAssignUserRulePO selectedUser = null;
		for (QuotationAssignUserRulePO user : availableUsers) {
			// 检查预算员是否支持该装修类型：-1通用，0半包，1整装
			boolean typeSupported = user.getSupportedType() == QuotationAssignUserRulePO.SUPPORTED_TYPE_ALL_INT
					|| user.getSupportedType() == decorationType;
			if (typeSupported) {
				selectedUser = user;
				break;
			}
		}

		// 8. 如果找到支持的预算员，执行分配
		if (selectedUser != null) {
			return assignToUser(orderId, decoration, selectedUser, QuotationAssignRecordPO.ASSIGN_TYPE_FORWARD_AUTO_INT, null);
		}

		// 9. 找到预算员但类型都不支持
		createFailRecord(orderId, decorationType);
		throw new FLException(0, "无预算员支持该装修类型");
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int manualAssignQuotation(String orderId, int budgetUid, int assignUid) throws FLException {

		// ========== 参数校验 ==========
		if (orderId == null || orderId.trim().isEmpty()) {
			throw new FLException(0, "装修单号不能为空");
		}

		if (budgetUid <= 0) {
			throw new FLException(0, "预算员ID不能为空");
		}

		if (assignUid <= 0) {
			throw new FLException(0, "分配人ID不能为空");
		}

		// ========== 业务逻辑开始 ==========

		// 1. 查询装修单
		DecorationPO decoration = decorationDao.queryByOrderId(orderId);
		if (decoration == null) {
			throw new FLException(0, "装修单不存在");
		}

		// 2. 查询预算员规则
		QuotationAssignUserRulePO userRule = quotationAssignUserRuleDao.getByUid(budgetUid);
		if (userRule == null) {
			throw new FLException(0, "预算员规则不存在");
		}

		// 3. 验证公司部门是否匹配
		if (!userRule.getCompany().equals(decoration.getCompany())) {
			throw new FLException(0, "预算员公司与装修单公司不匹配");
		}

		if (userRule.getDepartment() != null && decoration.getDepartment() != null
				&& !userRule.getDepartment().equals(decoration.getDepartment())) {
			throw new FLException(0, "预算员部门与装修单部门不匹配");
		}

		// 4. 执行分配
		return assignToUser(orderId, decoration, userRule, QuotationAssignRecordPO.ASSIGN_TYPE_MANUAL_INT, assignUid);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int reassignQuotation(String orderId, int newBudgetUid, int assignUid) throws FLException {

		// ========== 参数校验 ==========
		if (orderId == null || orderId.trim().isEmpty()) {
			throw new FLException(0, "装修单号不能为空");
		}

		if (newBudgetUid <= 0) {
			throw new FLException(0, "新预算员ID不能为空");
		}

		if (assignUid <= 0) {
			throw new FLException(0, "分配人ID不能为空");
		}

		// ========== 业务逻辑开始 ==========

		// 1. 查询装修单
		DecorationPO decoration = decorationDao.queryByOrderId(orderId);
		if (decoration == null) {
			throw new FLException(0, "装修单不存在");
		}

		// 2. 检查是否已分配报价员
		if (decoration.getQuid() == null || decoration.getQuid() == 0) {
			throw new FLException(0, "该装修单尚未分配报价员，请使用手动分配功能");
		}

		int oldBudgetUid = decoration.getQuid();

		// 3. 如果新旧预算员相同，无需重新分配
		if (oldBudgetUid == newBudgetUid) {
			throw new FLException(0, "新旧预算员相同，无需重新分配");
		}

		// 4. 查询新预算员规则
		QuotationAssignUserRulePO userRule = quotationAssignUserRuleDao.getByUid(newBudgetUid);
		if (userRule == null) {
			throw new FLException(0, "新预算员规则不存在");
		}

		// 5. 验证公司部门是否匹配
		if (!userRule.getCompany().equals(decoration.getCompany())) {
			throw new FLException(0, "新预算员公司与装修单公司不匹配");
		}

		if (userRule.getDepartment() != null && decoration.getDepartment() != null
				&& !userRule.getDepartment().equals(decoration.getDepartment())) {
			throw new FLException(0, "新预算员部门与装修单部门不匹配");
		}

		// 6. 执行重新分配
		return assignToUser(orderId, decoration, userRule, QuotationAssignRecordPO.ASSIGN_TYPE_MANUAL_INT, assignUid);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int finishQuotationForAssign(String orderId) throws FLException {

		// ========== 参数校验 ==========
		if (orderId == null || orderId.trim().isEmpty()) {
			throw new FLException(0, "装修单号不能为空");
		}

		// ========== 业务逻辑开始 ==========

		// 1. 查询装修单，获取预算员信息
		DecorationPO decoration = decorationDao.queryByOrderId(orderId);
		if (decoration == null) {
			throw new FLException(0, "装修单不存在");
		}

		if (decoration.getQuid() == null || decoration.getQuid() == 0) {
			throw new FLException(0, "该装修单未分配报价员");
		}

		int budgetUid = decoration.getQuid();

		// 2. 更新预算员的最后完成时间
		QuotationAssignUserRulePO userRule = quotationAssignUserRuleDao.getByUid(budgetUid);
		if (userRule != null) {
			quotationAssignUserRuleDao.updateLastFinishTime(userRule.getQaurid(), new Timestamp(System.currentTimeMillis()));
		}

		// 3. 检查待分配队列
		Integer company = decoration.getCompany();
		Integer department = decoration.getDepartment();
		Short decorationType = decoration.getType();

		// 查询待分配队列中类型匹配且最优先的任务
		List<QuotationAssignRequestPO> pendingQueue = quotationAssignRequestDao.queryPendingQueue(company, department, decorationType);

		if (pendingQueue != null && !pendingQueue.isEmpty()) {
			// 找到任务，执行反向自动分配
			for (QuotationAssignRequestPO request : pendingQueue) {
				// 检查预算员是否支持该任务的装修类型：-1通用，0半包，1整装
				boolean typeSupported = userRule.getSupportedType() == QuotationAssignUserRulePO.SUPPORTED_TYPE_ALL_INT
						|| userRule.getSupportedType() == request.getDecorationType();
				if (typeSupported) {
					// 分配给当前预算员
					DecorationPO pendingDecoration = decorationDao.queryByOrderId(request.getOrderId());
					if (pendingDecoration != null) {
						assignToUser(request.getOrderId(), pendingDecoration, userRule, QuotationAssignRecordPO.ASSIGN_TYPE_REVERSE_AUTO_INT, null);
						// 只分配一个任务，然后退出
						break;
					}
				}
			}
		}

		return 1;
	}

	// ==================== 私有辅助方法 ====================

	/**
	 * 创建待分配请求
	 *
	 * @param orderId 装修单号
	 * @param company 公司ID
	 * @param department 部门ID
	 * @param decorationType 装修类型
	 * @return 影响行数
	 * @throws FLException 业务异常
	 */
	private int createPendingRequest(String orderId, Integer company, Integer department,
			Short decorationType) throws FLException {

		// 1. 检查是否已存在待分配请求
		QuotationAssignRequestPO existRequest = quotationAssignRequestDao.queryPendingRequestByOrderId(orderId);
		if (existRequest != null) {
			throw new FLException(0, "已加入待分配队列，请等待分配");
		}

		// 2. 创建待分配请求
		QuotationAssignRequestPO request = new QuotationAssignRequestPO();
		request.setOrderId(orderId);
		request.setCompany(company);
		request.setDepartment(department);
		request.setDecorationType(decorationType);
		request.setPriority(QuotationAssignRequestPO.PRIORITY_NORMAL_INT); // 普通优先级
		request.setRequestTime(new Timestamp(System.currentTimeMillis()));
		request.setStatus(QuotationAssignRequestPO.STATUS_PENDING_INT); // 待分配
		quotationAssignRequestDao.save(request);

		// 3. 创建分配记录（失败）
		QuotationAssignRecordPO record = new QuotationAssignRecordPO();
		record.setOrderId(orderId);
		record.setUid(null); // 失败时无预算员
		record.setAssignType(QuotationAssignRecordPO.ASSIGN_TYPE_FORWARD_AUTO_INT); // 正向自动
		record.setAssignResult(QuotationAssignRecordPO.ASSIGN_RESULT_FAILED_INT); // 失败
		record.setAssignUid(null);
		record.setAssignTime(new Timestamp(System.currentTimeMillis()));
		record.setFailReason("暂无可用预算员");
		record.setDecorationType(decorationType);
		quotationAssignRecordDao.save(record);

		// 4. 抛出异常提示前端
		throw new FLException(0, "已加入待分配队列，暂无可用预算员");
	}

	/**
	 * 创建失败记录
	 *
	 * @param orderId 装修单号
	 * @param decorationType 装修类型
	 * @throws FLException 业务异常
	 */
	private void createFailRecord(String orderId, Short decorationType) throws FLException {

		// 1. 创建分配记录（失败）
		QuotationAssignRecordPO record = new QuotationAssignRecordPO();
		record.setOrderId(orderId);
		record.setUid(null); // 失败时无预算员
		record.setAssignType(QuotationAssignRecordPO.ASSIGN_TYPE_FORWARD_AUTO_INT); // 正向自动
		record.setAssignResult(QuotationAssignRecordPO.ASSIGN_RESULT_FAILED_INT); // 失败
		record.setAssignUid(null);
		record.setAssignTime(new Timestamp(System.currentTimeMillis()));
		record.setFailReason("无预算员支持该装修类型");
		record.setDecorationType(decorationType);
		quotationAssignRecordDao.save(record);
	}

	/**
	 * 分配给指定预算员
	 *
	 * @param orderId 装修单号
	 * @param decoration 装修单对象
	 * @param userRule 预算员规则对象
	 * @param assignType 分配类型（1-正向自动，2-手动，3-反向自动）
	 * @param assignUid 分配人ID（手动分配时有值）
	 * @return 影响行数
	 * @throws FLException 业务异常
	 */
	private int assignToUser(String orderId, DecorationPO decoration,
			QuotationAssignUserRulePO userRule, short assignType, Integer assignUid) throws FLException {

		// 1. 更新装修单报价员
		decoration.setQuid(userRule.getUid());
		decorationDao.update(decoration);

		// 2. 更新或创建分配请求（status=2 已分配）
		QuotationAssignRequestPO request = quotationAssignRequestDao.queryPendingRequestByOrderId(orderId);
		if (request != null) {
			// 更新待分配请求为已分配
			quotationAssignRequestDao.updateStatusToAssigned(request.getQarid());
		} else {
			// 创建新的已分配请求
			request = new QuotationAssignRequestPO();
			request.setOrderId(orderId);
			request.setCompany(decoration.getCompany());
			request.setDepartment(decoration.getDepartment());
			request.setDecorationType(decoration.getType());
			request.setPriority(QuotationAssignRequestPO.PRIORITY_NORMAL_INT);
			request.setRequestTime(new Timestamp(System.currentTimeMillis()));
			request.setStatus(QuotationAssignRequestPO.STATUS_ASSIGNED_INT); // 已分配
			request.setAssignTime(new Timestamp(System.currentTimeMillis()));
			quotationAssignRequestDao.save(request);
		}

		// 3. 更新预算员状态（基于quotationassignrequest统计currentTaskCount）
		int currentTaskCount = quotationAssignRequestDao.countCurrentTasksByUid(userRule.getUid());
		quotationAssignUserRuleDao.updateCurrentTaskCount(userRule.getQaurid(), currentTaskCount);

		// 更新预算员状态：currentTaskCount > 0 时为制作中，否则为待分配
		short newStatus = currentTaskCount > 0 ? QuotationAssignUserRulePO.STATUS_BUSY_INT : QuotationAssignUserRulePO.STATUS_AVAILABLE_INT;
		quotationAssignUserRuleDao.updateQuotationAssignUserRuleStatus(userRule.getQaurid(), newStatus);

		// 4. 创建分配记录（成功）
		QuotationAssignRecordPO record = new QuotationAssignRecordPO();
		record.setOrderId(orderId);
		record.setUid(userRule.getUid());
		record.setAssignType(assignType);
		record.setAssignResult(QuotationAssignRecordPO.ASSIGN_RESULT_SUCCESS_INT); // 成功
		record.setAssignUid(assignUid);
		record.setAssignTime(new Timestamp(System.currentTimeMillis()));
		record.setDecorationType(decoration.getType());
		quotationAssignRecordDao.save(record);

		return 1;
	}
}
