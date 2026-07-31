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

import com.fanglin.communion.po.DepartmentPO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.dao.DecorationPictureDao;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.decoration.po.DecorationPicturePO;
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
@Transactional(readOnly = true)
public class QuotationAssignServiceImpl implements QuotationAssignService {

	private static final String DEFAULT_QUOTATION_NAME_STR = "Auto Assign";

	@Autowired
	private DecorationDao decorationDao;

	@Autowired
	private DecorationPictureDao decorationPictureDao;

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

	// ==================== 正向自动分配 ====================

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int autoQuotationAssign(QuotationAssignVO quotationAssignVO) throws FLException {

		// ========== 参数校验 ==========
		String orderId = quotationAssignVO.getOrderId();
		if (orderId == null || orderId.trim().isEmpty()) {
			throw new FLException(140093, "装修单号不能为空");
		}

		// ========== 业务逻辑开始 ==========

		// 1. 查询装修单
		DecorationPO decoration = decorationDao.queryDecorationByOrderId(orderId);
		if (decoration == null) {
			throw new FLException(140013, "装修单不存在");
		}

		// 2. 消费前置校验：必须先入待分配队列（由 addQuotationAssignRequestForAuto 写入 PENDING 记录）
		// 入队与消费已拆分为两个独立接口/事务，此处不再内部入队
		QuotationAssignRequestPO activeRequest = quotationAssignRequestDao.queryQuotationAssignRequestForActive(orderId);
		if (activeRequest == null) {
			throw new FLException(200115, "分配请求不存在,请先加入待分配队列");
		}

		// 3. 检查是否已分配报价员
		String quoterUid = getQuoteterUid(decoration);
		if (quoterUid != null) {
			throw new FLException(200097, "该装修单已分配报价员，无需重复分配");
		}

		// 4. 获取装修单类型和公司部门信息
		Short decorationType = decoration.getType();
		Integer company = decoration.getCompany();
		Integer department = getDesignDeptId(decoration);

		if (decorationType == null) {
			throw new FLException(200092, "装修单类型不能为空");
		}

		if (company == null) {
			throw new FLException(200093, "装修单公司信息不能为空");
		}

		// 5. 检查预算配置是否启用
		QuotationAssignConfigPO config = quotationAssignConfigDao.queryQuotationAssignConfig(company, department);
		if (config == null || config.getEnabled() != QuotationAssignConfigPO.ENABLED_ENABLED_INT) {
			throw new FLException(200101, "该公司/部门未启用预算员自动分配功能");
		}

		// 6. 手动模式不属于自动分配范畴,抛清晰异常,不在此处进队列
		// (进队列是独立业务动作,由 createQuotationAssignRequest 接口显式触发)
		if (config.getAutoAssign() != QuotationAssignConfigPO.AUTO_ASSIGN_AUTO_INT) {
			throw new FLException(200113, "该部门为手动分配模式,请通知预算经理手动派单");
		}

		// 7. 查找可分配预算员
		// 新模型：DAO 通过 UserRuleItem 子查询匹配 company+department+decorationType
		// 跨公司验证：排除在其他公司有非待分配状态的预算员
		List<QuotationAssignUserRuleItemPO> availableItems = quotationAssignUserRuleItemDao.queryQuotationAssignUserRuleItemForCross(company, department, decorationType);

		if (availableItems == null || availableItems.isEmpty()) {
			throw new FLException(200114, "暂无可用预算员,请稍后重试或联系管理员");
		}

		// 8. DAO 已通过 item 查询完成类型匹配和排序（按 lastFinishTime ASC）
		// 第一个即为最优选择，通过 item.getUserRule() 获取对应的预算员规则
		QuotationAssignUserRulePO selectedUser = availableItems.get(0).getUserRule();

		// 9. 执行分配
		return assignToUser(orderId, decoration, selectedUser, QuotationAssignRecordPO.ASSIGN_TYPE_FORWARD_AUTO_INT, null);
	}

	// ==================== 入待分配队列(独立事务,与 autoQuotationAssign 解耦) ====================

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addQuotationAssignRequestForAuto(String orderId) throws FLException {

		// ========== 参数校验 ==========
		if (orderId == null || orderId.trim().isEmpty()) {
			throw new FLException(140093, "装修单号不能为空");
		}

		// 1. 查询装修单
		DecorationPO decoration = decorationDao.queryDecorationByOrderId(orderId);
		if (decoration == null) {
			throw new FLException(140013, "装修单不存在");
		}

		if (decorationPictureDao.countDecorationPictureForValid(orderId, DecorationPicturePO.TYPE_CAD_INT) == 0) {
			throw new FLException(110038, "工程文件CAD不能为空");
		}

		// 2. 幂等校验：同 orderId 已存在活跃请求（PENDING/ASSIGNED）则不重复入队
		QuotationAssignRequestPO existRequest = quotationAssignRequestDao.queryQuotationAssignRequestForActive(orderId);
		if (existRequest != null) {
			return 1;
		}

		// 3. 获取装修单维度（与 autoQuotationAssign 取数口径一致）
		Integer company = decoration.getCompany();
		Integer department = getDesignDeptId(decoration);

		if (company == null) {
			throw new FLException(200093, "装修单公司信息不能为空");
		}

		// 4. 检查预算配置：仅自动模式允许入队，手动模式抛 200113（保持现状语义）
		QuotationAssignConfigPO config = quotationAssignConfigDao.queryQuotationAssignConfig(company, department);
		if (config == null || config.getEnabled() != QuotationAssignConfigPO.ENABLED_ENABLED_INT) {
			throw new FLException(200101, "该公司/部门未启用预算员自动分配功能");
		}
		if (config.getAutoAssign() != QuotationAssignConfigPO.AUTO_ASSIGN_AUTO_INT) {
			throw new FLException(200113, "该部门为手动分配模式,请通知预算经理手动派单");
		}

		// 5. 从装修单补全维度，创建 PENDING 记录
		QuotationAssignRequestPO request = new QuotationAssignRequestPO();
		request.setOrderId(orderId);
		request.setCompany(new com.fanglin.system.po.CompanyPO(company));
		request.setDepartment(department != null ? new DepartmentPO(department) : null);
		request.setDecorationType(decoration.getType());
		request.setRequestUser(getRequestUser(decoration));
		request.setPriority(QuotationAssignRequestPO.PRIORITY_NORMAL_INT);

		Timestamp currentTime = new Timestamp(System.currentTimeMillis());
		request.setRequestTime(currentTime);
		request.setCreateTime(currentTime);
		request.setStatus(QuotationAssignRequestPO.STATUS_PENDING_INT);

		quotationAssignRequestDao.save(request);

		return 1;
	}

	// ==================== 手动分配 ====================

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int manualQuotationAssign(QuotationAssignVO quotationAssignVO, String userId) throws FLException {

		// ========== 参数校验 ==========
		String orderId = quotationAssignVO.getOrderId();
		if (orderId == null || orderId.trim().isEmpty()) {
			throw new FLException(140093, "装修单号不能为空");
		}

		if (quotationAssignVO.getQuoter() == null || quotationAssignVO.getQuoter().getUserId() == null) {
			throw new FLException(200091, "预算员ID不能为空");
		}

		UserPO assigner = userDao.queryUserByUserId(userId);
		if (assigner == null) {
			throw new FLException(200095, "分配人不存在");
		}

		// ========== 业务逻辑开始 ==========

		// 1. 查询装修单
		DecorationPO decoration = decorationDao.queryDecorationByOrderId(orderId);
		if (decoration == null) {
			throw new FLException(140013, "装修单不存在");
		}

		if (decorationPictureDao.countDecorationPictureForValid(orderId, DecorationPicturePO.TYPE_CAD_INT) == 0) {
			throw new FLException(110038, "工程文件CAD不能为空");
		}

		// 2. 查询预算员规则（新模型：按 userId 查询唯一规则）
		QuotationAssignUserRulePO userRule = quotationAssignUserRuleDao.queryQuotationAssignUserRuleByUserId(quotationAssignVO.getQuoter().getUserId());
		if (userRule == null) {
			throw new FLException(200111, "预算员规则不存在");
		}

		// 3. 验证公司是否匹配（通过 items 检查该预算员是否覆盖此公司）
		if (!hasMatchingItem(userRule, decoration.getCompany())) {
			throw new FLException(200100, "预算员不支持该公司");
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
			throw new FLException(140093, "装修单号不能为空");
		}

		if (quotationAssignVO.getQuoter() == null || quotationAssignVO.getQuoter().getUserId() == null) {
			throw new FLException(200091, "预算员ID不能为空");
		}

		UserPO assigner = userDao.queryUserByUserId(userId);
		if (assigner == null) {
			throw new FLException(200095, "分配人不存在");
		}

		// ========== 业务逻辑开始 ==========

		// 1. 查询装修单
		DecorationPO decoration = decorationDao.queryDecorationByOrderId(orderId);
		if (decoration == null) {
			throw new FLException(140013, "装修单不存在");
		}

		// 2. 检查是否已分配报价员
		String oldBudgetUid = getQuoteterUid(decoration);
		if (oldBudgetUid == null) {
			throw new FLException(200102, "该装修单尚未分配报价员，请使用手动分配功能");
		}

		// 3. 如果新旧预算员相同，无需重新分配
		if (oldBudgetUid.equals(quotationAssignVO.getQuoter().getUserId())) {
			throw new FLException(200103, "新旧预算员相同，无需重新分配");
		}

		// 4. 查询新预算员规则（新模型：按 userId 查询唯一规则）
		QuotationAssignUserRulePO userRule = quotationAssignUserRuleDao.queryQuotationAssignUserRuleByUserId(quotationAssignVO.getQuoter().getUserId());
		if (userRule == null) {
			throw new FLException(200104, "新预算员规则不存在");
		}

		// 5. 验证公司是否匹配（通过 items 检查）
		if (!hasMatchingItem(userRule, decoration.getCompany())) {
			throw new FLException(200105, "新预算员不支持该公司");
		}

		// 6. 释放旧预算员状态（新模型：按 userId 查询唯一规则）
		QuotationAssignUserRulePO oldUserRule = quotationAssignUserRuleDao.queryQuotationAssignUserRuleByUserId(oldBudgetUid);
		if (oldUserRule != null) {
			// 当前 request 仍归属旧预算员且 status=ASSIGNED，count 结果包含这一条，故需 -1 表示即将转出
			int oldTaskCount = quotationAssignRequestDao.countQuotationAssignRequest(oldUserRule.getUser().getUid()) - 1;
			if (oldTaskCount < QuotationAssignUserRulePO.TASK_COUNT_NONE_INT) {
				oldTaskCount = QuotationAssignUserRulePO.TASK_COUNT_NONE_INT;
			}
			oldUserRule.setCurrentTaskCount(oldTaskCount);
			if (oldTaskCount == QuotationAssignUserRulePO.TASK_COUNT_NONE_INT) {
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
			throw new FLException(140093, "装修单号不能为空");
		}

		// ========== 业务逻辑开始 ==========

		// 1. 查询装修单，获取释放的预算员信息
		DecorationPO decoration = decorationDao.queryDecorationByOrderId(orderId);
		if (decoration == null) {
			throw new FLException(140013, "装修单不存在");
		}

		QuotationAssignRequestPO currentRequest = quotationAssignRequestDao.queryQuotationAssignRequestForAssigned(orderId);

		if (currentRequest == null) {
			return 1;
		}

		if (currentRequest.getUser() == null) {
			throw new FLException(200098, "该装修单未分配报价员");
		}

		String budgetUid = currentRequest.getUser().getUserId();

		// 2. 根据预算员ID查询其规则（新模型：按 userId 查询唯一规则）
		QuotationAssignUserRulePO userRule = quotationAssignUserRuleDao.queryQuotationAssignUserRuleByUserId(budgetUid);

		if (userRule == null) {
			return 1;
		}

		// 3.5 先将当前装修单的分配请求状态更新为"已完成"（必须先落库，count 才不会多算这一条）
		currentRequest.setStatus(QuotationAssignRequestPO.STATUS_COMPLETED_INT);
		currentRequest.setFinishTime(new Timestamp(System.currentTimeMillis()));
		quotationAssignRequestDao.update(currentRequest);
		// 强制 flush，保证后续 count 查询能感知状态变更（避免一级缓存未同步导致漏算）
		quotationAssignRequestDao.flush();

		// 3. 更新预算员的最后完成时间和任务数
		userRule.setLastFinishTime(new Timestamp(System.currentTimeMillis()));

		// count 在 request 状态置为已完成之后执行，自然不再包含当前这条，无需 -1
		int currentTaskCount = quotationAssignRequestDao.countQuotationAssignRequest(userRule.getUser().getUid());
		userRule.setCurrentTaskCount(currentTaskCount);

		// 更新状态：currentTaskCount > QuotationAssignUserRulePO.TASK_COUNT_NONE_INT 制作中，否则待分配
		short newStatus = currentTaskCount > QuotationAssignUserRulePO.TASK_COUNT_NONE_INT ? QuotationAssignUserRulePO.STATUS_BUSY_INT : QuotationAssignUserRulePO.STATUS_AVAILABLE_INT;
		userRule.setStatus(newStatus);

		quotationAssignUserRuleDao.update(userRule);

		// ========== 反向分配：全局匹配 ==========
		triggerReverseAssign();

		return 1;
	}

	// ==================== 私有辅助方法 ====================

	/**
	 * 反向分配：全局匹配
	 * 
	 * <p>
	 * 查出所有待分配请求（status=PENDING），对每个请求查找所有可用预算员中最优人选进行分配。 适用于交付完成、转交等场景——预算员释放后触发待分配队列的消费。 每次调用最多分配一个任务即返回。
	 * </p>
	 */
	private void triggerReverseAssign() throws FLException {

		// 1. 查出所有待分配请求（status=PENDING），不过滤公司（全局扫描）
		List<QuotationAssignRequestPO> pendingQueue = quotationAssignRequestDao.queryQuotationAssignRequestForQueueAll();

		if (pendingQueue == null || pendingQueue.isEmpty()) {
			return;
		}

		// 2. 遍历待分配队列，对每个请求查找所有可用预算员
		for (QuotationAssignRequestPO request : pendingQueue) {
			int requestCompany = request.getCompany() != null ? request.getCompany().getCid() : -1;
			Integer requestDept = request.getDepartment() != null ? request.getDepartment().getDid() : null;
			Short requestType = request.getDecorationType();

			// 用 queryAvailableItemsForCrossCompanyAssign 查找所有状态为 AVAILABLE 且匹配该请求维度的预算员
			// 该方法已内置：status=AVAILABLE、currentTaskCount=0、company匹配、department匹配、supportedType匹配、跨公司排除
			// 结果按 lastFinishTime ASC 排序，第一个即为空闲最久的最优人选
			List<QuotationAssignUserRuleItemPO> availableItems = quotationAssignUserRuleItemDao.queryQuotationAssignUserRuleItemForCross(requestCompany, requestDept, requestType);

			if (availableItems == null || availableItems.isEmpty()) {
				continue; // 该请求暂无可用预算员，跳过，继续处理下一个请求
			}

			// 取第一个匹配的可用预算员（lastFinishTime 最早，即空闲最久的）
			QuotationAssignUserRulePO bestMatch = availableItems.get(0).getUserRule();

			DecorationPO pendingDecoration = decorationDao.queryDecorationByOrderId(request.getOrderId());

			if (pendingDecoration != null) {
				assignToUser(request.getOrderId(), pendingDecoration, bestMatch, QuotationAssignRecordPO.ASSIGN_TYPE_REVERSE_AUTO_INT, null);
				return; // 每次只分配一个任务，立即返回
			} else {
				// 装修单不存在，标记该请求为已分配（脏数据清理）
				request.setStatus(QuotationAssignRequestPO.STATUS_ASSIGNED_INT);
				quotationAssignRequestDao.update(request);
				continue;
			}
		}
	}

	// 注:进待分配队列有两条独立路径:
	//   ① addQuotationAssignRequestForAuto —— 自动分配前置入队(按 orderId 补全维度,写 PENDING)
	//   ② QuotationAssignRequestService.createQuotationAssignRequest —— 预算经理手动加单(完整表单)
	// autoQuotationAssign 只负责"尝试消费队列",与入队彻底解耦,各自独立事务。

	/**
	 * 分配给指定预算员
	 */
	private int assignToUser(String orderId, DecorationPO decoration, QuotationAssignUserRulePO userRule, short assignType, Integer assignUid) throws FLException {

		// 1. 更新装修单报价员
		decoration.setQuoter(userRule.getUser());
		decorationDao.update(decoration);

		// 2. 更新或创建分配请求（status=2 已分配，绑定预算员 uid）
		QuotationAssignRequestPO request = quotationAssignRequestDao.queryQuotationAssignRequestForActive(orderId);
		if (request != null) {
			request.setStatus(QuotationAssignRequestPO.STATUS_ASSIGNED_INT);
			request.setUser(userRule.getUser());
			if (request.getRequestUser() == null) request.setRequestUser(getRequestUser(decoration));
			request.setAssignTime(new Timestamp(System.currentTimeMillis()));
			quotationAssignRequestDao.update(request);
		} else {
			request = new QuotationAssignRequestPO();
			request.setOrderId(orderId);
			request.setCompany(new com.fanglin.system.po.CompanyPO(decoration.getCompany()));
			request.setDepartment(getDesignDeptId(decoration) != null ? new DepartmentPO(getDesignDeptId(decoration)) : null);
			request.setDecorationType(decoration.getType());
			request.setPriority(QuotationAssignRequestPO.PRIORITY_NORMAL_INT);
			request.setCreateTime(new Timestamp(System.currentTimeMillis()));
			request.setRequestTime(new Timestamp(System.currentTimeMillis()));
			request.setStatus(QuotationAssignRequestPO.STATUS_ASSIGNED_INT);
			request.setUser(userRule.getUser());
			request.setRequestUser(getRequestUser(decoration));
			request.setAssignTime(new Timestamp(System.currentTimeMillis()));
			quotationAssignRequestDao.save(request);
		}
		// flush 保证后续 count 查询能命中刚写入的归属关系（避免新预算员 count 漏算、状态误判为 AVAILABLE）
		quotationAssignRequestDao.flush();

		// 3. 更新预算员状态（基于 request 统计 currentTaskCount）
		int currentTaskCount = quotationAssignRequestDao.countQuotationAssignRequest(userRule.getUser().getUid());

		userRule.setCurrentTaskCount(currentTaskCount);

		short newStatus = currentTaskCount > QuotationAssignUserRulePO.TASK_COUNT_NONE_INT ? QuotationAssignUserRulePO.STATUS_BUSY_INT : QuotationAssignUserRulePO.STATUS_AVAILABLE_INT;
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
		quotationVO.setName(DEFAULT_QUOTATION_NAME_STR);
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
			throw new FLException(140093, "装修单号不能为空");
		}

		if (quotationAssignVO.getQuoter() == null || quotationAssignVO.getQuoter().getUserId() == null) {
			throw new FLException(200094, "目标预算员不能为空");
		}

		// ========== 业务逻辑开始 ==========

		// 1. 查询装修单
		DecorationPO decoration = decorationDao.queryDecorationByOrderId(orderId);
		if (decoration == null) {
			throw new FLException(140013, "装修单不存在");
		}

		// 2. 查询分配队列中已分配的请求（status=2）
		QuotationAssignRequestPO request = quotationAssignRequestDao.queryQuotationAssignRequestForAssigned(orderId);
		if (request == null) {
			throw new FLException(200107, "该装修单未分配报价员，无法转交");
		}

		// 3. 验证转出人是否为当前预算员（可选，根据业务需要决定是否强制）
		UserPO transferUser = userDao.queryUserByUserId(userId);
		if (transferUser == null) {
			throw new FLException(200096, "操作人不存在");
		}

		// 4. 不能转交给自己
		if (request.getUser() != null && transferUser.getUid() == request.getUser().getUid()) {
			throw new FLException(200108, "不能转交给自己");
		}

		// 5. 查询目标预算员规则
		QuotationAssignUserRulePO targetUserRule = quotationAssignUserRuleDao.queryQuotationAssignUserRuleByUserId(quotationAssignVO.getQuoter().getUserId());
		if (targetUserRule == null) {
			throw new FLException(200109, "目标预算员规则不存在");
		}

		// 6. 验证目标预算员是否支持该公司（通过 items 检查）
		if (!hasMatchingItem(targetUserRule, decoration.getCompany())) {
			throw new FLException(200110, "目标预算员不支持该公司");
		}

		// 7. 查询原预算员规则，更新任务数
		UserPO oldUser = request.getUser();
		QuotationAssignUserRulePO oldUserRule = null;
		if (oldUser != null) {
			oldUserRule = quotationAssignUserRuleDao.queryQuotationAssignUserRuleByUserId(oldUser.getUserId());
		}

		// 8. 更新分配队列中的预算员
		request.setUser(targetUserRule.getUser());
		quotationAssignRequestDao.update(request);
		// flush 保证新旧预算员的 count 都基于已落库的 user 归属
		quotationAssignRequestDao.flush();

		// 9. 更新装修单中的预算员
		decoration.setQuoter(targetUserRule.getUser());
		decorationDao.update(decoration);

		// 10. 更新旧预算员任务数
		// 注意：第 8 步已把 request.user 改为新预算员并落库，
		// 因此这里 count 旧预算员的结果天然已排除当前这条请求，不能再 -1（否则会多扣）
		if (oldUserRule != null) {
			int oldTaskCount = quotationAssignRequestDao.countQuotationAssignRequest(oldUserRule.getUser().getUid());
			oldUserRule.setCurrentTaskCount(oldTaskCount);
			if (oldTaskCount == QuotationAssignUserRulePO.TASK_COUNT_NONE_INT) {
				oldUserRule.setStatus(QuotationAssignUserRulePO.STATUS_AVAILABLE_INT);
			}
			quotationAssignUserRuleDao.update(oldUserRule);
		}

		// 11. 更新新预算员任务数
		int newTaskCount = quotationAssignRequestDao.countQuotationAssignRequest(targetUserRule.getUser().getUid());
		targetUserRule.setCurrentTaskCount(newTaskCount);
		if (newTaskCount > QuotationAssignUserRulePO.TASK_COUNT_NONE_INT) {
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

		// ========== 反向分配：全局匹配 ==========
		triggerReverseAssign();

		return 1;
	}

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
	 * 获取分配请求人，默认使用装修单设计师。
	 */
	private UserPO getRequestUser(DecorationPO decoration) {
		return decoration.getDesigner();
	}
}
