package com.fanglin.quotation.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.quotation.dao.QuotationAssignUserRuleDao;
import com.fanglin.quotation.dao.QuotationAssignUserRuleTypeDao;
import com.fanglin.quotation.po.QuotationAssignUserRulePO;
import com.fanglin.quotation.service.QuotationAssignUserRuleService;
import com.fanglin.quotation.vo.BudgetUserRuleVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

/**
 * 报价单预算员规则表 Service 实现
 * 职责: 管理预算员的分配规则（状态、任务数、完成时间等）
 */
@Service("quotationAssignUserRuleService")
@Transactional(readOnly = true)
public class QuotationAssignUserRuleServiceImpl implements QuotationAssignUserRuleService {

	@Autowired
	private QuotationAssignUserRuleDao quotationAssignUserRuleDao;

	@Autowired
	private QuotationAssignUserRuleTypeDao quotationAssignUserRuleTypeDao;

	@Autowired
	private UserDao userDao;

	@Override
	public BudgetUserRuleVO queryQuotationAssignUserRuleByUidAndCompany(BudgetUserRuleVO budgetUserRule) {
		QuotationAssignUserRulePO po = quotationAssignUserRuleDao.queryQuotationAssignUserRuleByUidAndCompany(
			budgetUserRule.getUid(), budgetUserRule.getCompany());
		return po != null ? BeanUtil.copyProperties(po, BudgetUserRuleVO.class) : null;
	}

	@Override
	public List<BudgetUserRuleVO> pullQuotationAssignUserRule(int company, Integer department) {
		List<QuotationAssignUserRulePO> poList = quotationAssignUserRuleDao.pullQuotationAssignUserRule(company, department);
		List<BudgetUserRuleVO> voList = new ArrayList<BudgetUserRuleVO>();
		for (QuotationAssignUserRulePO po : poList) {
			voList.add(BeanUtil.copyProperties(po, BudgetUserRuleVO.class));
		}
		return voList;
	}

	@Override
	public BudgetUserRuleVO queryQuotationAssignUserRuleByUid(BudgetUserRuleVO budgetUserRule) {
		QuotationAssignUserRulePO po = quotationAssignUserRuleDao.queryQuotationAssignUserRuleByUid(budgetUserRule.getUid());
		return po != null ? BeanUtil.copyProperties(po, BudgetUserRuleVO.class) : null;
	}

	@Override
	public List<BudgetUserRuleVO> queryQuotationAssignUserRuleByCompany(int company) {
		List<QuotationAssignUserRulePO> poList = quotationAssignUserRuleDao.queryQuotationAssignUserRuleByCompany(company);
		List<BudgetUserRuleVO> voList = new ArrayList<BudgetUserRuleVO>();
		for (QuotationAssignUserRulePO po : poList) {
			voList.add(BeanUtil.copyProperties(po, BudgetUserRuleVO.class));
		}
		return voList;
	}

	@Override
	public List<BudgetUserRuleVO> queryQuotationAssignUserRuleByDepartment(int company, int department) {
		List<QuotationAssignUserRulePO> poList = quotationAssignUserRuleDao.queryQuotationAssignUserRuleByDepartment(company, department);
		List<BudgetUserRuleVO> voList = new ArrayList<BudgetUserRuleVO>();
		for (QuotationAssignUserRulePO po : poList) {
			voList.add(BeanUtil.copyProperties(po, BudgetUserRuleVO.class));
		}
		return voList;
	}

	@Override
	public List<BudgetUserRuleVO> pullAvailableQuotationAssignUserRule(int company, Integer department) {
		List<QuotationAssignUserRulePO> poList = quotationAssignUserRuleDao.pullAvailableQuotationAssignUserRule(company, department);
		List<BudgetUserRuleVO> voList = new ArrayList<BudgetUserRuleVO>();
		for (QuotationAssignUserRulePO po : poList) {
			voList.add(BeanUtil.copyProperties(po, BudgetUserRuleVO.class));
		}
		return voList;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateStatusAndTaskCount(BudgetUserRuleVO budgetUserRule) throws FLException {
		quotationAssignUserRuleDao.updateStatusAndTaskCount(
			budgetUserRule.getUid(),
			budgetUserRule.getStatus(),
			budgetUserRule.getCurrentTaskCount()
		);
	}

	@Override
	public int countQuotationAssignTaskByUid(BudgetUserRuleVO budgetUserRule) {
		return quotationAssignUserRuleDao.countQuotationAssignTaskByUid(budgetUserRule.getUid());
	}

	@Override
	public int countQuotationAssignUserRuleByCompany(int company) {
		return quotationAssignUserRuleDao.countQuotationAssignUserRuleByCompany(company);
	}

	@Override
	public int countQuotationAssignUserRuleByDepartment(int company, int department) {
		return quotationAssignUserRuleDao.countQuotationAssignUserRuleByDepartment(company, department);
	}

	@Override
	public int existQuotationAssignUserRule(BudgetUserRuleVO budgetUserRule) {
		return quotationAssignUserRuleDao.existQuotationAssignUserRule(budgetUserRule.getUid(), budgetUserRule.getCompany());
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void disableQuotationAssignUserRuleByUid(BudgetUserRuleVO budgetUserRule) throws FLException {
		quotationAssignUserRuleDao.disableQuotationAssignUserRuleByUid(budgetUserRule.getUid());
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void enableQuotationAssignUserRuleByUid(BudgetUserRuleVO budgetUserRule) throws FLException {
		quotationAssignUserRuleDao.enableQuotationAssignUserRuleByUid(budgetUserRule.getUid());
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addQuotationAssignUserRule(BudgetUserRuleVO budgetUserRuleVO, String userId) throws FLException {
		// 检查用户是否已是预算员
		QuotationAssignUserRulePO existingPO = quotationAssignUserRuleDao.queryQuotationAssignUserRuleByUidAndCompany(
			budgetUserRuleVO.getUid(), budgetUserRuleVO.getCompany());
		if (existingPO != null) {
			throw new FLException(330080, "该用户已是预算员");
		}

		// 创建新的预算员规则
		QuotationAssignUserRulePO po = new QuotationAssignUserRulePO();
		BeanUtil.copyProperties(budgetUserRuleVO, po);

		// 设置用户对象
		UserPO user = userDao.get(budgetUserRuleVO.getUid());
		if (user == null) {
			throw new FLException(330081, "用户不存在");
		}
		po.setUser(user);

		// 设置默认值
		po.setStatus(QuotationAssignUserRulePO.STATUS_PENDING_INT);
		po.setCurrentTaskCount(0);
		po.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		po.setUpdateTime(DateUtil.getDateToTimestamp(new Date()));

		quotationAssignUserRuleDao.save(po);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateQuotationAssignUserRule(BudgetUserRuleVO budgetUserRuleVO, String userId) throws FLException {
		QuotationAssignUserRulePO po = quotationAssignUserRuleDao.get(budgetUserRuleVO.getBurid());
		if (po == null) {
			throw new FLException(330081, "预算员规则不存在");
		}

		// 更新字段（不更新uid、company、createTime）
		po.setStatus(budgetUserRuleVO.getStatus());
		po.setCurrentTaskCount(budgetUserRuleVO.getCurrentTaskCount());
		po.setLastFinishTime(budgetUserRuleVO.getLastFinishTime());
		po.setUpdateTime(DateUtil.getDateToTimestamp(new Date()));

		quotationAssignUserRuleDao.update(po);
	}
}
