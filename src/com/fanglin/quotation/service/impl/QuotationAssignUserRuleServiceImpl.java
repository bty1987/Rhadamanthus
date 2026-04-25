/**
 * @File Name     : QuotationAssignUserRuleServiceImpl.java
 * @Package      : com.fanglin.quotation.service.impl
 * @Version       : 2.0
 * @Date          : 2026-04-21
 * @Copyright     : Copyright Creators 2026
 * @Author        : Claude AI
 * @Describing    : 预算员规则表 Service 实现类（人员维度）
 */

package com.fanglin.quotation.service.impl;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.quotation.dao.QuotationAssignUserRuleDao;
import com.fanglin.quotation.dao.QuotationAssignUserRuleItemDao;
import com.fanglin.quotation.po.QuotationAssignUserRuleItemPO;
import com.fanglin.quotation.po.QuotationAssignUserRulePO;
import com.fanglin.quotation.service.QuotationAssignUserRuleItemService;
import com.fanglin.quotation.service.QuotationAssignUserRuleService;
import com.fanglin.quotation.vo.QuotationAssignUserRuleVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

/**
 * 预算员规则表 Service 实现类
 * 
 * <p>
 * 核心变更：UserRule 按人员维度（每人一条），公司/部门/类型通过 UserRuleItem 管理
 * Item 相关操作委托给 QuotationAssignUserRuleItemService
 * </p>
 * 
 * @author Claude AI
 * @version 2.0
 */
@Service("quotationAssignUserRuleService")
public class QuotationAssignUserRuleServiceImpl implements QuotationAssignUserRuleService {

	@Autowired
	private QuotationAssignUserRuleDao quotationAssignUserRuleDao;

	@Autowired
	private QuotationAssignUserRuleItemDao quotationAssignUserRuleItemDao;

	@Autowired
	private QuotationAssignUserRuleItemService quotationAssignUserRuleItemService;

	@Autowired
	private UserDao userDao;

	@Autowired
	private com.fanglin.quotation.dao.QuotationAssignRequestDao quotationAssignRequestDao;

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void pageQuotationAssignUserRule(Paging paging, List<Filter> filters) throws FLException {

		List<QuotationAssignUserRulePO> rulePOs = quotationAssignUserRuleDao.pageQuotationAssignUserRule(paging, filters);
		List<QuotationAssignUserRuleVO> ruleVOs = new ArrayList<QuotationAssignUserRuleVO>();

		for (QuotationAssignUserRulePO po : rulePOs) {
			QuotationAssignUserRuleVO vo = po.ptv(new QuotationAssignUserRuleVO(new UserBaseVO()));
			vo.setItems(quotationAssignUserRuleItemService.queryItemsByRuleId(po.getQaurid()));
			ruleVOs.add(vo);
		}

		paging.setData(ruleVOs);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public QuotationAssignUserRuleVO queryQuotationAssignUserRuleById(QuotationAssignUserRuleVO quotationAssignUserRule) throws FLException {

		QuotationAssignUserRulePO rulePO = quotationAssignUserRuleDao.get(quotationAssignUserRule.getQaurid());

		if (rulePO == null) return null;

		QuotationAssignUserRuleVO vo = rulePO.ptv(new QuotationAssignUserRuleVO(new UserBaseVO()));
		vo.setItems(quotationAssignUserRuleItemService.queryItemsByRuleId(rulePO.getQaurid()));

		return vo;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public List<QuotationAssignUserRuleVO> queryQuotationAssignUserRuleForAvaile(int company, Integer department, Short decorationType) throws FLException {
		List<QuotationAssignUserRuleItemPO> itemPOs = quotationAssignUserRuleItemDao.queryAvailableItemsForAssign(company, department, decorationType);
		List<QuotationAssignUserRuleVO> ruleVOs = new ArrayList<QuotationAssignUserRuleVO>();

		for (QuotationAssignUserRuleItemPO itemPO : itemPOs) {
			ruleVOs.add(itemPO.getUserRule().ptv(new QuotationAssignUserRuleVO(new UserBaseVO())));
		}

		return ruleVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int createQuotationAssignUserRule(QuotationAssignUserRuleVO quotationAssignUserRuleVO) throws FLException {

		// 空值检查
		if (quotationAssignUserRuleVO.getUser() == null) {
			throw new FLException(0, "用户信息不能为空");
		}

		String userId = quotationAssignUserRuleVO.getUser().getUserId();

		// 校验：用户唯一性（新模型下每人只有一条 UserRule）
		QuotationAssignUserRulePO existRule = quotationAssignUserRuleDao.queryQuotationAssignUserRuleByUserId(userId);
		if (existRule != null) {
			throw new FLException(0, "该用户的规则已存在，请使用编辑功能");
		}

		UserPO userPO = userDao.queryUserByUserId(userId);
		if (userPO == null) {
			throw new FLException(0, "用户不存在");
		}

		// 创建 UserRule PO 对象
		QuotationAssignUserRulePO rulePO = new QuotationAssignUserRulePO();
		BeanUtil.copyProperties(quotationAssignUserRuleVO, rulePO, "user", "qaurid", "createTime", "updateTime");

		rulePO.setUser(userPO);

		// 设置默认值
		if (rulePO.getStatus() == 0) {
			rulePO.setStatus(QuotationAssignUserRulePO.STATUS_AVAILABLE_INT);
		}

		Timestamp currentTime = DateUtil.getDateToTimestamp(new Date());
		rulePO.setCreateTime(currentTime);
		rulePO.setUpdateTime(currentTime);

		// 保存 UserRule
		quotationAssignUserRuleDao.save(rulePO);

		// 创建 Items（委托给 ItemService）
		quotationAssignUserRuleItemService.saveItems(rulePO, quotationAssignUserRuleVO.getItems(), currentTime);

		// 设置返回的ID
		quotationAssignUserRuleVO.setQaurid(rulePO.getQaurid());

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateQuotationAssignUserRule(QuotationAssignUserRuleVO quotationAssignUserRuleVO) throws FLException {

		if (quotationAssignUserRuleVO.getQaurid() == null) {
			throw new FLException(0, "规则ID不能为空");
		}

		// 查询现有记录
		QuotationAssignUserRulePO rulePO = quotationAssignUserRuleDao.get(quotationAssignUserRuleVO.getQaurid());
		if (rulePO == null) {
			throw new FLException(0, "规则不存在");
		}

		// 复制基本属性
		BeanUtil.copyProperties(quotationAssignUserRuleVO, rulePO, "user", "qaurid", "createTime", "updateTime");

		Timestamp currentTime = DateUtil.getDateToTimestamp(new Date());
		rulePO.setUpdateTime(currentTime);

		// 更新 UserRule
		quotationAssignUserRuleDao.update(rulePO);

		// 更新 Items：先删后增（委托给 ItemService）
		quotationAssignUserRuleItemService.deleteItemsByRuleId(rulePO.getQaurid());
		quotationAssignUserRuleItemService.saveItems(rulePO, quotationAssignUserRuleVO.getItems(), currentTime);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateQuotationAssignUserRuleForStatus(QuotationAssignUserRuleVO quotationAssignUserRuleVO) throws FLException {

		if (quotationAssignUserRuleVO.getQaurid() == null || quotationAssignUserRuleVO.getQaurid() <= 0) {
			throw new FLException(0, "规则ID不能为空");
		}

		QuotationAssignUserRulePO rulePO = quotationAssignUserRuleDao.get(quotationAssignUserRuleVO.getQaurid());
		if (rulePO == null) {
			throw new FLException(0, "规则不存在");
		}

		rulePO.setStatus(quotationAssignUserRuleVO.getStatus());
		rulePO.setUpdateTime(DateUtil.getDateToTimestamp(new Date()));

		quotationAssignUserRuleDao.update(rulePO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateLastFinishTime(QuotationAssignUserRuleVO quotationAssignUserRule) throws FLException {

		if (quotationAssignUserRule.getQaurid() == null || quotationAssignUserRule.getQaurid() <= 0) {
			throw new FLException(0, "规则ID不能为空");
		}

		Timestamp lastFinishTime;
		if (quotationAssignUserRule.getLastFinishTime() == null) {
			lastFinishTime = new Timestamp(System.currentTimeMillis());
		} else {
			lastFinishTime = quotationAssignUserRule.getLastFinishTime();
		}

		QuotationAssignUserRulePO rulePO = quotationAssignUserRuleDao.get(quotationAssignUserRule.getQaurid());
		if (rulePO == null) {
			throw new FLException(0, "规则不存在");
		}

		rulePO.setStatus(quotationAssignUserRule.getStatus());
		rulePO.setLastFinishTime(lastFinishTime);
		rulePO.setUpdateTime(DateUtil.getDateToTimestamp(new Date()));

		quotationAssignUserRuleDao.update(rulePO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteQuotationAssignUserRule(QuotationAssignUserRuleVO quotationAssignUserRule) throws FLException {

		if (quotationAssignUserRule.getQaurid() == null || quotationAssignUserRule.getQaurid() <= 0) {
			throw new FLException(0, "规则ID不能为空");
		}

		// 先删除 Items（委托给 ItemService）
		quotationAssignUserRuleItemService.deleteItemsByRuleId(quotationAssignUserRule.getQaurid());

		// 再删除 UserRule
		quotationAssignUserRuleDao.deleteById(quotationAssignUserRule.getQaurid());

		return 0;
	}

	// ==================== 全集团汇总 ====================

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void pageQuotationAssignUserRuleSummary(Paging paging, List<Filter> filters) throws FLException {

		// 1. 先同步一次所有预算员的状态
		syncQuotationAssignUserRuleStatus();

		// 2. 查询所有预算员规则（已按状态升序、任务数降序排列）
		List<QuotationAssignUserRulePO> allRules = quotationAssignUserRuleDao.queryAllQuotationAssignUserRule();

		// 3. 内存过滤（支持 status 和 userName）
		List<QuotationAssignUserRulePO> filtered = new ArrayList<QuotationAssignUserRulePO>();
		Short filterStatus = null;
		String filterUserName = null;

		if (filters != null) {
			for (Filter filter : filters) {
				if ("status".equals(filter.getField())) {
					filterStatus = Short.valueOf(filter.getData());
				} else if ("userName".equals(filter.getField())) {
					filterUserName = filter.getData();
				}
			}
		}

		for (QuotationAssignUserRulePO po : allRules) {
			// 状态过滤
			if (filterStatus != null && po.getStatus() != filterStatus) {
				continue;
			}
			// 姓名过滤（模糊匹配）
			if (filterUserName != null && !filterUserName.isEmpty()) {
				if (po.getUser() == null || po.getUser().getCurrentName() == null || !po.getUser().getCurrentName().contains(filterUserName)) {
					continue;
				}
			}
			filtered.add(po);
		}

		// 4. 内存分页
		int totalCount = filtered.size();
		int page = paging.getPage() != null ? paging.getPage() : 1;
		int pageSize = paging.getRows() != null ? paging.getRows() : 20;
		int fromIndex = Math.min((page - 1) * pageSize, totalCount);
		int toIndex = Math.min(fromIndex + pageSize, totalCount);

		List<QuotationAssignUserRulePO> pageData = filtered.subList(fromIndex, toIndex);

		// 5. 转换为 VO
		List<QuotationAssignUserRuleVO> ruleVOs = new ArrayList<QuotationAssignUserRuleVO>();
		for (QuotationAssignUserRulePO po : pageData) {
			QuotationAssignUserRuleVO vo = po.ptv(new QuotationAssignUserRuleVO(new UserBaseVO()));
			vo.setItems(quotationAssignUserRuleItemService.queryItemsByRuleId(po.getQaurid()));
			ruleVOs.add(vo);
		}

		paging.setData(ruleVOs);
		paging.setTotalRecords(totalCount);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int syncQuotationAssignUserRuleStatus() throws FLException {

		List<QuotationAssignUserRulePO> allRules = quotationAssignUserRuleDao.queryAllQuotationAssignUserRule();
		int updateCount = 0;

		for (QuotationAssignUserRulePO rule : allRules) {

			if (rule.getUser() == null) continue;

			// 从分配队列统计该预算员的活跃任务数（status < 3）
			int actualTaskCount = quotationAssignRequestDao.countQuotationAssignRequest(rule.getUser().getUid());
			int storedTaskCount = rule.getCurrentTaskCount();

			boolean needUpdate = false;

			// 更新任务数（如果不一致）
			if (actualTaskCount != storedTaskCount) {
				rule.setCurrentTaskCount(actualTaskCount);
				needUpdate = true;
			}

			// 根据任务数更新状态（不覆盖"停止"状态）
			if (rule.getStatus() != QuotationAssignUserRulePO.STATUS_STOPPED_INT) {
				short expectedStatus = actualTaskCount > 0 ? QuotationAssignUserRulePO.STATUS_BUSY_INT : QuotationAssignUserRulePO.STATUS_AVAILABLE_INT;
				if (rule.getStatus() != expectedStatus) {
					rule.setStatus(expectedStatus);
					needUpdate = true;
				}
			}

			if (needUpdate) {
				rule.setUpdateTime(DateUtil.getDateToTimestamp(new Date()));
				quotationAssignUserRuleDao.update(rule);
				updateCount++;
			}
		}

		return updateCount;
	}
}
