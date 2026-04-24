/**
 * @File Name     : QuotationAssignServiceImpl.java
 * @Package      : com.fanglin.quotation.service.impl
 * @Version       : 2.0
 * @Date          : 2026-04-21
 * @Copyright     : Copyright Creators 2026
 * @Author        : Claude AI
 * @Describing    : 核心分配逻辑 Service 实现类（适配 UserRule + UserRuleItem 新模型）
 */

package com.fanglin.quotation.service.impl;

import java.sql.Timestamp;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.quotation.dao.QuotationAssignConfigDao;
import com.fanglin.quotation.dao.QuotationAssignRecordDao;
import com.fanglin.quotation.dao.QuotationAssignRequestDao;
import com.fanglin.quotation.dao.QuotationAssignUserRuleDao;
import com.fanglin.quotation.dao.QuotationAssignUserRuleItemDao;
import com.fanglin.quotation.dao.QuotationDao;
import com.fanglin.quotation.po.QuotationAssignConfigPO;
import com.fanglin.quotation.po.QuotationAssignRecordPO;
import com.fanglin.quotation.po.QuotationAssignRequestPO;
import com.fanglin.quotation.po.QuotationAssignUserRuleItemPO;
import com.fanglin.quotation.po.QuotationAssignUserRulePO;
import com.fanglin.quotation.po.QuotationPO;
import com.fanglin.quotation.service.QuotationAssignService;
import com.fanglin.quotation.service.QuotationService;
import com.fanglin.quotation.vo.QuotationAssignVO;
import com.fanglin.quotation.vo.QuotationVO;

/**
 * 核心分配逻辑 Service 实现类
 * 
 * <p>
 * 适配 UserRule + UserRuleItem 新模型：
 * </p>
 * <ul>
 * <li>UserRule 按人员维度（每人一条），status 为全局状态</li>
 * <li>UserRuleItem 按公司/部门/类型维度，用于匹配分配条件</li>
 * <li>跨公司验证简化：单一 UserRule 的 status 即代表该人全局状态</li>
 * </ul>
 * 
 * @author Claude AI
 * @version 2.0
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
	private QuotationAssignUserRuleItemDao quotationAssignUserRuleItemDao;

	@Autowired
	private QuotationAssignRequestDao quotationAssignRequestDao;

	@Autowired
	private QuotationAssignRecordDao quotationAssignRecordDao;

	@Autowired
	private QuotationDao quotationDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private QuotationService quotationService;

	/**
	 * 安全获取报价员ID
	 */
	private String getQuoteterUid(DecorationPO decoration) {
		return decoration.getQuoter() != null ? decoration.getQuoter().getUserId() : null;
	}

	/**
	 * 安全获取设计部门ID
	 */
	private Integer getDesignDeptId(DecorationPO decoration) {
		return decoration.getDesignDept() != null ? decoration.getDesignDept().getDid() : null;
	}

	/**
	 * 检查预算员在指定公司下是否有匹配的规则明细
	 * 
	 * @param userRule 预算员规则
	 * @param company 公司ID
	 * @return true=有匹配
	 */
	private boolean hasMatchingItem(QuotationAssignUserRulePO userRule, int company) throws FLException {
		List<QuotationAssignUserRuleItemPO> items = quotationAssignUserRuleItemDao.queryQuotationAssignUserRuleItemByRuleId(userRule.getQaurid());
		for (QuotationAssignUserRuleItemPO item : items) {
			if (item.getCompany() != null && item.getCompany().getCid() == company) {
				return true;
			}
		}
		return false;
	}

	/**
	 * 检查预算员在指定公司+装修类型下是否有匹配的规则明细
	 * 
	 * <p>
	 * 匹配逻辑：item.supportedType == -1(通用) 或 == decorationType
	 * </p>
	 * 
	 * @param userRule 预算员规则
	 * @param company 公司ID
	 * @param decorationType 装修类型
	 * @return true=有匹配
	 */
	private boolean isTypeSupported(QuotationAssignUserRulePO userRule, int company, short decorationType) throws FLException {
		List<QuotationAssignUserRuleItemPO> items = quotationAssignUserRuleItemDao.queryQuotationAssignUserRuleItemByRuleId(userRule.getQaurid());
		for (QuotationAssignUserRuleItemPO item : items) {
			if (item.getCompany() != null && item.getCompany().getCid() == company) {
				int supportedType = item.getSupportedType();
				if (supportedType == QuotationAssignUserRulePO.SUPPORTED_TYPE_ALL_INT || supportedType == (int) decorationType) {
					return true;
				}
			}
		}
		return false;
	}

	// ==================== 正向自动分配 ====================

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int autoQuotationAssign(QuotationAssignVO quotationAssignVO) throws FLException {

		// ========== 参数校验 ==========
		String orderId = quotationAssignVO.getOrderId();
		if (orderId == null || orderId.trim().isEmpty()) {
			throw new FLException(0, "装修单号不能为空");
		}

		// ========== 业务逻辑开始 ==========

		// 1. 查询装修单
		DecorationPO decoration = decorationDao.queryDecorationByOrderId(orderId);
		if (decoration == null) {
			throw new FLException(0, "装修单不存在");
		}

		// 2. 检查是否已分配报价员
		String quoterUid = getQuoteterUid(decoration);
		if (quoterUid != null) {
			throw new FLException(0, "该装修单已分配报价员，无需重复分配");
		}

		// 3. 获取装修单类型和公司部门信息
		Short decorationType = decoration.getType();
		Integer company = decoration.getCompany();
		Integer department = getDesignDeptId(decoration);

		if (decorationType == null) {
			throw new FLException(0, "装修单类型不能为空");
		}

		if (company == null) {
			throw new FLException(0, "装修单公司信息不能为空");
		}

		// 4. 检查预算配置是否启用
		QuotationAssignConfigPO config = quotationAssignConfigDao.queryQuotationAssignConfig(company, department);
		if (config == null || config.getEnabled() != QuotationAssignConfigPO.ENABLED_ENABLED_INT) {
			throw new FLException(0, "该公司/部门未启用预算员自动分配功能");
		}

		// 5. 如果是手动模式，直接进入待分配队列
		if (config.getAutoAssign() != QuotationAssignConfigPO.AUTO_ASSIGN_AUTO_INT) {
			return createPendingRequest(orderId, company, department, decorationType);
		}

		// 6. 查找可分配预算员
		// 新模型：DAO 通过 UserRuleItem 子查询匹配 company+department+decorationType
		// 跨公司验证：排除在其他公司有非待分配状态的预算员
		List<QuotationAssignUserRuleItemPO> availableItems = quotationAssignUserRuleItemDao.queryAvailableItemsForCrossCompanyAssign(company, department, decorationType);

		if (availableItems == null || availableItems.isEmpty()) {
			return createPendingRequest(orderId, company, department, decorationType);
		}

		// 7. DAO 已通过 item 查询完成类型匹配和排序（按 lastFinishTime ASC）
		// 第一个即为最优选择，通过 item.getUserRule() 获取对应的预算员规则
		QuotationAssignUserRulePO selectedUser = availableItems.get(0).getUserRule();

		// 8. 执行分配
		return assignToUser(orderId, decoration, selectedUser, QuotationAssignRecordPO.ASSIGN_TYPE_FORWARD_AUTO_INT, null);
	}

	// ==================== 手动分配 ====================

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int manualQuotationAssign(QuotationAssignVO quotationAssignVO, String userId) throws FLException {

		// ========== 参数校验 ==========
		String orderId = quotationAssignVO.getOrderId();
		if (orderId == null || orderId.trim().isEmpty()) {
			throw new FLException(0, "装修单号不能为空");
		}

		if (quotationAssignVO.getQuoter() == null || quotationAssignVO.getQuoter().getUserId() == null) {
			throw new FLException(0, "预算员ID不能为空");
		}

		UserPO assigner = userDao.queryUserByUserId(userId);
		if (assigner == null) {
			throw new FLException(0, "分配人不存在");
		}

		// ========== 业务逻辑开始 ==========

		// 1. 查询装修单
		DecorationPO decoration = decorationDao.queryDecorationByOrderId(orderId);
		if (decoration == null) {
			throw new FLException(0, "装修单不存在");
		}

		// 2. 查询预算员规则（新模型：按 userId 查询唯一规则）
		QuotationAssignUserRulePO userRule = quotationAssignUserRuleDao.queryQuotationAssignUserRuleByUserId(quotationAssignVO.getQuoter().getUserId());
		if (userRule == null) {
			throw new FLException(0, "预算员规则不存在");
		}

		// 3. 验证公司是否匹配（通过 items 检查该预算员是否覆盖此公司）
		if (!hasMatchingItem(userRule, decoration.getCompany())) {
			throw new FLException(0, "预算员不支持该公司");
		}

		// 4. 执行分配
		return assignToUser(orderId, decoration, userRule, QuotationAssignRecordPO.ASSIGN_TYPE_MANUAL_INT, assigner.getUid());
	}

	// ==================== 重新分配 ====================

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int reassignQuotationAssign(QuotationAssignVO quotationAssignVO, String userId) throws FLException {

		// ========== 参数校验 ==========
		String orderId = quotationAssignVO.getOrderId();
		if (orderId == null || orderId.trim().isEmpty()) {
			throw new FLException(0, "装修单号不能为空");
		}

		if (quotationAssignVO.getQuoter() == null || quotationAssignVO.getQuoter().getUserId() == null) {
			throw new FLException(0, "预算员ID不能为空");
		}

		UserPO assigner = userDao.queryUserByUserId(userId);
		if (assigner == null) {
			throw new FLException(0, "分配人不存在");
		}

		// ========== 业务逻辑开始 ==========

		// 1. 查询装修单
		DecorationPO decoration = decorationDao.queryDecorationByOrderId(orderId);
		if (decoration == null) {
			throw new FLException(0, "装修单不存在");
		}

		// 2. 检查是否已分配报价员
		String oldBudgetUid = getQuoteterUid(decoration);
		if (oldBudgetUid == null) {
			throw new FLException(0, "该装修单尚未分配报价员，请使用手动分配功能");
		}

		// 3. 如果新旧预算员相同，无需重新分配
		if (oldBudgetUid.equals(quotationAssignVO.getQuoter().getUserId())) {
			throw new FLException(0, "新旧预算员相同，无需重新分配");
		}

		// 4. 查询新预算员规则（新模型：按 userId 查询唯一规则）
		QuotationAssignUserRulePO userRule = quotationAssignUserRuleDao.queryQuotationAssignUserRuleByUserId(quotationAssignVO.getQuoter().getUserId());
		if (userRule == null) {
			throw new FLException(0, "新预算员规则不存在");
		}

		// 5. 验证公司是否匹配（通过 items 检查）
		if (!hasMatchingItem(userRule, decoration.getCompany())) {
			throw new FLException(0, "新预算员不支持该公司");
		}

		// 6. 释放旧预算员状态（新模型：按 userId 查询唯一规则）
		QuotationAssignUserRulePO oldUserRule = quotationAssignUserRuleDao.queryQuotationAssignUserRuleByUserId(oldBudgetUid);
		if (oldUserRule != null) {
			int oldTaskCount = oldUserRule.getCurrentTaskCount() - 1;
			if (oldTaskCount < 0) {
				oldTaskCount = 0;
			}
			oldUserRule.setCurrentTaskCount(oldTaskCount);
			if (oldTaskCount == 0) {
				oldUserRule.setStatus(QuotationAssignUserRulePO.STATUS_AVAILABLE_INT);
			}
			quotationAssignUserRuleDao.update(oldUserRule);
		}

		// 7. 执行重新分配
		return assignToUser(orderId, decoration, userRule, QuotationAssignRecordPO.ASSIGN_TYPE_MANUAL_INT, assigner.getUid());
	}

	// ==================== 完成报价后反向分配 ====================

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int finishQuotationAssign(QuotationAssignVO quotationAssignVO) throws FLException {

		// ========== 参数校验 ==========
		String orderId = quotationAssignVO.getOrderId();
		if (orderId == null || orderId.trim().isEmpty()) {
			throw new FLException(0, "装修单号不能为空");
		}

		// ========== 业务逻辑开始 ==========

		// 1. 查询装修单，获取释放的预算员信息
		DecorationPO decoration = decorationDao.queryDecorationByOrderId(orderId);
		if (decoration == null) {
			throw new FLException(0, "装修单不存在");
		}

		String budgetUid = getQuoteterUid(decoration);
		if (budgetUid == null) {
			throw new FLException(0, "该装修单未分配报价员");
		}

		// 2. 根据预算员ID查询其规则（新模型：按 userId 查询唯一规则）
		Integer company = decoration.getCompany();
		QuotationAssignUserRulePO userRule = quotationAssignUserRuleDao.queryQuotationAssignUserRuleByUserId(budgetUid);

		if (userRule == null) {
			return 1;
		}

		// 3. 更新预算员的最后完成时间和任务数
		userRule.setLastFinishTime(new Timestamp(System.currentTimeMillis()));

		int currentTaskCount = quotationAssignRequestDao.countQuotationAssignRequest(decoration.getQuoter().getUid());
		currentTaskCount = Math.max(0, currentTaskCount - 1);
		userRule.setCurrentTaskCount(currentTaskCount);

		// 更新状态：currentTaskCount > 0 制作中，否则待分配
		short newStatus = currentTaskCount > 0 ? QuotationAssignUserRulePO.STATUS_BUSY_INT : QuotationAssignUserRulePO.STATUS_AVAILABLE_INT;
		userRule.setStatus(newStatus);

		quotationAssignUserRuleDao.update(userRule);

		// 4. 如果预算员仍有任务，不触发反向分配
		if (newStatus != QuotationAssignUserRulePO.STATUS_AVAILABLE_INT) {
			return 1;
		}

		// ★ 跨公司验证已简化：新模型下每人只有一条 UserRule，status 即全局状态
		// 不再需要遍历多个公司的 UserRule 记录（旧模型需要，因为每个公司一条 UserRule）

		Integer department = getDesignDeptId(decoration);

		// 5. 查询待分配队列（不过滤类型，后续通过 items 匹配类型）
		// 新模型下预算员可能支持多种类型，需要统一查询后逐个匹配
		List<QuotationAssignRequestPO> pendingQueue = quotationAssignRequestDao.queryQuotationAssignRequestForQueue(company, department, null);

		// 6. 遍历队列，通过 items 检查预算员是否支持该任务的装修类型
		if (pendingQueue != null && !pendingQueue.isEmpty()) {
			for (QuotationAssignRequestPO request : pendingQueue) {

				boolean typeSupported = isTypeSupported(userRule, company, request.getDecorationType());

				if (typeSupported) {
					DecorationPO pendingDecoration = decorationDao.queryDecorationByOrderId(request.getOrderId());
					if (pendingDecoration != null) {
						assignToUser(request.getOrderId(), pendingDecoration, userRule, QuotationAssignRecordPO.ASSIGN_TYPE_REVERSE_AUTO_INT, null);
						break; // 只分配一个任务
					} else {
						request.setStatus(QuotationAssignRequestPO.STATUS_ASSIGNED_INT);
						quotationAssignRequestDao.update(request);
						continue;
					}
				}
			}
		}

		return 1;
	}

	// ==================== 私有辅助方法 ====================

	/**
	 * 创建待分配请求
	 */
	private int createPendingRequest(String orderId, Integer company, Integer department, Short decorationType) throws FLException {

		QuotationAssignRequestPO existRequest = quotationAssignRequestDao.queryActiveByOrderId(orderId);
		if (existRequest != null) {
			if (existRequest.getStatus() == QuotationAssignRequestPO.STATUS_ASSIGNED_INT) {
				throw new FLException(0, "该装修单已分配报价员，无需重复分配");
			}
			throw new FLException(0, "已加入待分配队列，请等待分配");
		}

		QuotationAssignRequestPO request = new QuotationAssignRequestPO();
		request.setOrderId(orderId);
		request.setCompany(company);
		request.setDepartment(department);
		request.setDecorationType(decorationType);
		request.setPriority(QuotationAssignRequestPO.PRIORITY_NORMAL_INT);
		request.setCreateTime(new Timestamp(System.currentTimeMillis()));
		request.setRequestTime(new Timestamp(System.currentTimeMillis()));
		request.setStatus(QuotationAssignRequestPO.STATUS_PENDING_INT);
		quotationAssignRequestDao.save(request);

		QuotationAssignRecordPO record = new QuotationAssignRecordPO();
		record.setOrderId(orderId);
		record.setUid(null);
		record.setAssignType(QuotationAssignRecordPO.ASSIGN_TYPE_FORWARD_AUTO_INT);
		record.setAssignResult(QuotationAssignRecordPO.ASSIGN_RESULT_FAILED_INT);
		record.setAssignUid(null);
		record.setAssignTime(new Timestamp(System.currentTimeMillis()));
		record.setFailReason("暂无可用预算员");
		record.setDecorationType(decorationType);
		quotationAssignRecordDao.save(record);

		return 0;
	}

	/**
	 * 分配给指定预算员
	 */
	private int assignToUser(String orderId, DecorationPO decoration, QuotationAssignUserRulePO userRule, short assignType, Integer assignUid) throws FLException {

		// 1. 更新装修单报价员
		decoration.setQuoter(userRule.getUser());
		decorationDao.update(decoration);

		// 2. 更新或创建分配请求（status=2 已分配，绑定预算员 uid）
		QuotationAssignRequestPO request = quotationAssignRequestDao.queryActiveByOrderId(orderId);
		if (request != null) {
			request.setStatus(QuotationAssignRequestPO.STATUS_ASSIGNED_INT);
			request.setUid(userRule.getUser().getUid());
			request.setAssignTime(new Timestamp(System.currentTimeMillis()));
			quotationAssignRequestDao.update(request);
		} else {
			request = new QuotationAssignRequestPO();
			request.setOrderId(orderId);
			request.setCompany(decoration.getCompany());
			request.setDepartment(getDesignDeptId(decoration) != null ? getDesignDeptId(decoration) : 0);
			request.setDecorationType(decoration.getType());
			request.setPriority(QuotationAssignRequestPO.PRIORITY_NORMAL_INT);
			request.setCreateTime(new Timestamp(System.currentTimeMillis()));
			request.setRequestTime(new Timestamp(System.currentTimeMillis()));
			request.setStatus(QuotationAssignRequestPO.STATUS_ASSIGNED_INT);
			request.setUid(userRule.getUser().getUid());
			request.setAssignTime(new Timestamp(System.currentTimeMillis()));
			quotationAssignRequestDao.save(request);
		}

		// 3. 更新预算员状态（基于 request 统计 currentTaskCount）
		int currentTaskCount = quotationAssignRequestDao.countQuotationAssignRequest(userRule.getUser().getUid());

		userRule.setCurrentTaskCount(currentTaskCount);

		short newStatus = currentTaskCount > 0 ? QuotationAssignUserRulePO.STATUS_BUSY_INT : QuotationAssignUserRulePO.STATUS_AVAILABLE_INT;
		userRule.setStatus(newStatus);

		// 4. 创建分配记录（成功）
		QuotationAssignRecordPO record = new QuotationAssignRecordPO();
		record.setOrderId(orderId);
		record.setUid(userRule.getUser().getUid());
		record.setAssignType(assignType);
		record.setAssignResult(QuotationAssignRecordPO.ASSIGN_RESULT_SUCCESS_INT);
		record.setAssignUid(assignUid);
		record.setAssignTime(new Timestamp(System.currentTimeMillis()));
		record.setDecorationType(decoration.getType());
		quotationAssignRecordDao.save(record);

		QuotationPO quotationPO = quotationDao.queryQuotationForDefaultByOrderId(orderId);

		if (quotationPO != null) return 1;

		QuotationVO quotationVO = new QuotationVO();
		quotationVO.setName("Auto Assign");
		quotationVO.setOrderId(orderId);
		quotationVO.setStyle(null);
		quotationVO.setContent(null);

		quotationService.addQuotation(quotationVO, userRule.getUser().getUserId(), decoration.getCompany());

		return 1;
	}

	// ==================== 转交 ====================

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int transferQuotationAssign(QuotationAssignVO quotationAssignVO, String userId) throws FLException {

		// ========== 参数校验 ==========
		String orderId = quotationAssignVO.getOrderId();
		if (orderId == null || orderId.trim().isEmpty()) {
			throw new FLException(0, "装修单号不能为空");
		}

		if (quotationAssignVO.getQuoter() == null || quotationAssignVO.getQuoter().getUserId() == null) {
			throw new FLException(0, "目标预算员不能为空");
		}

		// ========== 业务逻辑开始 ==========

		// 1. 查询装修单
		DecorationPO decoration = decorationDao.queryDecorationByOrderId(orderId);
		if (decoration == null) {
			throw new FLException(0, "装修单不存在");
		}

		// 2. 查询分配队列中已分配的请求（status=2）
		QuotationAssignRequestPO request = quotationAssignRequestDao.queryQuotationAssignRequestForAssigned(orderId);
		if (request == null) {
			throw new FLException(0, "该装修单未分配报价员，无法转交");
		}

		// 3. 验证转出人是否为当前预算员（可选，根据业务需要决定是否强制）
		UserPO transferUser = userDao.queryUserByUserId(userId);
		if (transferUser == null) {
			throw new FLException(0, "操作人不存在");
		}

		// 4. 不能转交给自己
		if (transferUser.getUid() == request.getUid()) {
			throw new FLException(0, "不能转交给自己");
		}

		// 5. 查询目标预算员规则
		QuotationAssignUserRulePO targetUserRule = quotationAssignUserRuleDao.queryQuotationAssignUserRuleByUserId(quotationAssignVO.getQuoter().getUserId());
		if (targetUserRule == null) {
			throw new FLException(0, "目标预算员规则不存在");
		}

		// 6. 验证目标预算员是否支持该公司（通过 items 检查）
		if (!hasMatchingItem(targetUserRule, decoration.getCompany())) {
			throw new FLException(0, "目标预算员不支持该公司");
		}

		// 7. 查询原预算员规则，更新任务数
		Integer oldUid = request.getUid();
		QuotationAssignUserRulePO oldUserRule = null;
		if (oldUid != null) {
			UserPO oldUser = userDao.get(oldUid);
			if (oldUser != null) {
				oldUserRule = quotationAssignUserRuleDao.queryQuotationAssignUserRuleByUserId(oldUser.getUserId());
			}
		}

		// 8. 更新分配队列中的预算员
		request.setUid(targetUserRule.getUser().getUid());
		quotationAssignRequestDao.update(request);

		// 9. 更新装修单中的预算员
		decoration.setQuoter(targetUserRule.getUser());
		decorationDao.update(decoration);

		// 10. 更新旧预算员任务数
		if (oldUserRule != null) {
			int oldTaskCount = Math.max(0, quotationAssignRequestDao.countQuotationAssignRequest(oldUserRule.getUser().getUid()) - 1);
			oldUserRule.setCurrentTaskCount(oldTaskCount);
			if (oldTaskCount == 0) {
				oldUserRule.setStatus(QuotationAssignUserRulePO.STATUS_AVAILABLE_INT);
			}
			quotationAssignUserRuleDao.update(oldUserRule);
		}

		// 11. 更新新预算员任务数
		int newTaskCount = quotationAssignRequestDao.countQuotationAssignRequest(targetUserRule.getUser().getUid());
		targetUserRule.setCurrentTaskCount(newTaskCount);
		if (newTaskCount > 0) {
			targetUserRule.setStatus(QuotationAssignUserRulePO.STATUS_BUSY_INT);
		}
		quotationAssignUserRuleDao.update(targetUserRule);

		// 12. 记录转交操作日志
		QuotationAssignRecordPO record = new QuotationAssignRecordPO();
		record.setOrderId(orderId);
		record.setUid(targetUserRule.getUser().getUid());
		record.setAssignType(QuotationAssignRecordPO.ASSIGN_TYPE_TRANSFER_INT);
		record.setAssignResult(QuotationAssignRecordPO.ASSIGN_RESULT_SUCCESS_INT);
		record.setAssignUid(transferUser.getUid());
		record.setAssignTime(new Timestamp(System.currentTimeMillis()));
		record.setDecorationType(decoration.getType());
		quotationAssignRecordDao.save(record);

		return 1;
	}
}
