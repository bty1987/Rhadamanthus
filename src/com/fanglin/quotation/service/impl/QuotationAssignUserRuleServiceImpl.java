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
import com.fanglin.quotation.vo.QuotationAssignUserRuleVO;
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
	public QuotationAssignUserRuleVO queryQuotationAssignUserRuleByUidAndCompany(QuotationAssignUserRuleVO quotationAssignUserRule) {
		QuotationAssignUserRulePO po = quotationAssignUserRuleDao.queryQuotationAssignUserRuleByUidAndCompany(
			quotationAssignUserRule.getUid(), quotationAssignUserRule.getCompany());
		return po != null ? po.ptv(new QuotationAssignUserRuleVO()) : null;
	}

	@Override
	public List<QuotationAssignUserRuleVO> pullQuotationAssignUserRule(int company, Integer department) {
		List<QuotationAssignUserRulePO> poList = quotationAssignUserRuleDao.pullQuotationAssignUserRule(company, department);
		List<QuotationAssignUserRuleVO> voList = new ArrayList<QuotationAssignUserRuleVO>();
		for (QuotationAssignUserRulePO po : poList) {
			voList.add(po.ptv(new QuotationAssignUserRuleVO()));
		}
		return voList;
	}

	@Override
	public QuotationAssignUserRuleVO queryQuotationAssignUserRuleByUid(QuotationAssignUserRuleVO quotationAssignUserRule) {
		QuotationAssignUserRulePO po = quotationAssignUserRuleDao.queryQuotationAssignUserRuleByUid(quotationAssignUserRule.getUid());
		return po != null ? po.ptv(new QuotationAssignUserRuleVO()) : null;
	}

	@Override
	public List<QuotationAssignUserRuleVO> queryQuotationAssignUserRuleByCompany(int company) {
		List<QuotationAssignUserRulePO> poList = quotationAssignUserRuleDao.queryQuotationAssignUserRuleByCompany(company);
		List<QuotationAssignUserRuleVO> voList = new ArrayList<QuotationAssignUserRuleVO>();
		for (QuotationAssignUserRulePO po : poList) {
			voList.add(po.ptv(new QuotationAssignUserRuleVO()));
		}
		return voList;
	}

	@Override
	public List<QuotationAssignUserRuleVO> queryQuotationAssignUserRuleByDepartment(int company, int department) {
		List<QuotationAssignUserRulePO> poList = quotationAssignUserRuleDao.queryQuotationAssignUserRuleByDepartment(company, department);
		List<QuotationAssignUserRuleVO> voList = new ArrayList<QuotationAssignUserRuleVO>();
		for (QuotationAssignUserRulePO po : poList) {
			voList.add(po.ptv(new QuotationAssignUserRuleVO()));
		}
		return voList;
	}

	@Override
	public List<QuotationAssignUserRuleVO> pullAvailableQuotationAssignUserRule(int company, Integer department) {
		List<QuotationAssignUserRulePO> poList = quotationAssignUserRuleDao.pullAvailableQuotationAssignUserRule(company, department);
		List<QuotationAssignUserRuleVO> voList = new ArrayList<QuotationAssignUserRuleVO>();
		for (QuotationAssignUserRulePO po : poList) {
			voList.add(po.ptv(new QuotationAssignUserRuleVO()));
		}
		return voList;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateStatusAndTaskCount(QuotationAssignUserRuleVO quotationAssignUserRule) throws FLException {
		quotationAssignUserRuleDao.updateStatusAndTaskCount(
			quotationAssignUserRule.getUid(),
			quotationAssignUserRule.getStatus(),
			quotationAssignUserRule.getCurrentTaskCount()
		);
	}

	@Override
	public int countQuotationAssignTaskByUid(QuotationAssignUserRuleVO quotationAssignUserRule) {
		return quotationAssignUserRuleDao.countQuotationAssignTaskByUid(quotationAssignUserRule.getUid());
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
	public int existQuotationAssignUserRule(QuotationAssignUserRuleVO quotationAssignUserRule) {
		return quotationAssignUserRuleDao.existQuotationAssignUserRule(quotationAssignUserRule.getUid(), quotationAssignUserRule.getCompany());
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void disableQuotationAssignUserRuleByUid(QuotationAssignUserRuleVO quotationAssignUserRule) throws FLException {
		quotationAssignUserRuleDao.disableQuotationAssignUserRuleByUid(quotationAssignUserRule.getUid());
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void enableQuotationAssignUserRuleByUid(QuotationAssignUserRuleVO quotationAssignUserRule) throws FLException {
		quotationAssignUserRuleDao.enableQuotationAssignUserRuleByUid(quotationAssignUserRule.getUid());
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addQuotationAssignUserRule(QuotationAssignUserRuleVO quotationAssignUserRuleVO, String userId) throws FLException {
		// 检查用户是否已是预算员
		QuotationAssignUserRulePO existingPO = quotationAssignUserRuleDao.queryQuotationAssignUserRuleByUidAndCompany(
			quotationAssignUserRuleVO.getUid(), quotationAssignUserRuleVO.getCompany());
		if (existingPO != null) {
			throw new FLException(330080, "该用户已是预算员");
		}

		// 创建新的预算员规则
		QuotationAssignUserRulePO po = new QuotationAssignUserRulePO();
		BeanUtil.copyProperties(quotationAssignUserRuleVO, po);

		// 设置用户对象
		UserPO user = userDao.get(quotationAssignUserRuleVO.getUid());
		if (user == null) {
			throw new FLException(330081, "用户不存在");
		}
		po.setUser(user);

		// 设置默认值
		po.setStatus(QuotationAssignUserRulePO.STATUS_AVAILABLE_INT);
		po.setCurrentTaskCount(0);
		po.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		po.setUpdateTime(DateUtil.getDateToTimestamp(new Date()));

		quotationAssignUserRuleDao.save(po);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateQuotationAssignUserRule(QuotationAssignUserRuleVO quotationAssignUserRuleVO, String userId) throws FLException {
		QuotationAssignUserRulePO po = quotationAssignUserRuleDao.get(quotationAssignUserRuleVO.getQaurid());
		if (po == null) {
			throw new FLException(330081, "预算员规则不存在");
		}

		// 更新字段（不更新uid、company、createTime）
		po.setStatus(quotationAssignUserRuleVO.getStatus());
		po.setCurrentTaskCount(quotationAssignUserRuleVO.getCurrentTaskCount());
		po.setLastFinishTime(quotationAssignUserRuleVO.getLastFinishTime());
		po.setUpdateTime(DateUtil.getDateToTimestamp(new Date()));

		quotationAssignUserRuleDao.update(po);
	}
}
