package com.fanglin.quotation.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.service.BaseService;
import com.fanglin.core.vo.Filter;
import com.fanglin.quotation.dao.BudgetUserRuleDao;
import com.fanglin.quotation.dao.BudgetUserRuleTypeDao;
import com.fanglin.quotation.po.BudgetUserRulePO;
import com.fanglin.quotation.po.BudgetUserRuleTypePO;
import com.fanglin.quotation.service.BudgetUserRuleService;
import com.fanglin.quotation.vo.BudgetUserRuleVO;
import com.fanglin.utils.Paging;

/**
 * 预算员规则服务实现类
 */
@Service
public class BudgetUserRuleServiceImpl extends BaseServiceImpl<BudgetUserRulePO> implements BudgetUserRuleService {

	@Autowired
	private BudgetUserRuleDao budgetUserRuleDao;

	@Autowired
	private BudgetUserRuleTypeDao budgetUserRuleTypeDao;

	@Override
	public BudgetUserRuleDao getDao() {
		return budgetUserRuleDao;
	}

	@Override
	public List<BudgetUserRuleVO> pageBudgetUserRule(Paging paging, List<Filter> filters) {
		List<BudgetUserRulePO> poList = budgetUserRuleDao.page(paging, filters);
		List<BudgetUserRuleVO> voList = new ArrayList<BudgetUserRuleVO>();

		for (BudgetUserRulePO po : poList) {
			BudgetUserRuleVO vo = copyToVO(po);
			voList.add(vo);
		}

		return voList;
	}

	@Override
	public BudgetUserRuleVO getBudgetUserRule(Integer burid) {
		BudgetUserRulePO po = budgetUserRuleDao.get(burid);
		if (po == null) {
			return null;
		}
		return copyToVO(po);
	}

	@Override
	public BudgetUserRuleVO getBudgetUserRuleByUid(Integer uid) {
		BudgetUserRulePO po = budgetUserRuleDao.findByUid(uid);
		if (po == null) {
			return null;
		}
		return copyToVO(po);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void saveBudgetUserRule(BudgetUserRuleVO budgetUserRule) {
		// 检查是否已存在
		BudgetUserRulePO existing = budgetUserRuleDao.findByUidAndCompany(
			budgetUserRule.getUid(), budgetUserRule.getCompany());

		if (existing != null) {
			// 更新
			existing.setDepartment(budgetUserRule.getDepartment());
			existing.setStatus(budgetUserRule.getStatus());
			budgetUserRuleDao.update(existing);
		} else {
			// 新增
			BudgetUserRulePO po = new BudgetUserRulePO();
			po.setUid(budgetUserRule.getUid());
			po.setCompany(budgetUserRule.getCompany());
			po.setDepartment(budgetUserRule.getDepartment());
			po.setStatus(budgetUserRule.getStatus() != null ? budgetUserRule.getStatus() : BudgetUserRulePO.STATUS_AVAILABLE_INT);
			po.setCurrentTaskCount(0);
			budgetUserRuleDao.save(po);
		}
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateBudgetUserRule(BudgetUserRuleVO budgetUserRule) {
		BudgetUserRulePO po = budgetUserRuleDao.get(budgetUserRule.getBurid());
		if (po != null) {
			po.setDepartment(budgetUserRule.getDepartment());
			po.setStatus(budgetUserRule.getStatus());
			budgetUserRuleDao.update(po);
		}
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void deleteBudgetUserRule(Integer burid) {
		// 先删除类型配置
		budgetUserRuleTypeDao.deleteByBurid(burid);
		// 再删除规则
		budgetUserRuleDao.delete(burid);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void saveBudgetUserRuleTypes(Integer burid, List<Byte> types) {
		// 先删除所有类型配置
		budgetUserRuleTypeDao.deleteByBurid(burid);

		// 再插入新的类型配置
		if (types != null && !types.isEmpty()) {
			for (Byte type : types) {
				BudgetUserRuleTypePO typePO = new BudgetUserRuleTypePO();
				typePO.setBurid(burid);
				typePO.setType(type);
				budgetUserRuleTypeDao.save(typePO);
			}
		}
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateBudgetUserStatus(Integer uid) {
		// 统计任务数量
		int taskCount = budgetUserRuleDao.countTasksByUid(uid);

		// 更新状态
		Byte status = (taskCount == 0) ?
			BudgetUserRulePO.STATUS_AVAILABLE_INT :  // 待分配
			BudgetUserRulePO.STATUS_BUSY_INT;        // 制作中

		budgetUserRuleDao.updateStatusAndTaskCount(uid, status, taskCount);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void disableBudgetUserRule(Integer burid) {
		BudgetUserRulePO po = budgetUserRuleDao.get(burid);
		if (po != null) {
			po.setStatus(BudgetUserRulePO.STATUS_STOP_INT);
			budgetUserRuleDao.update(po);
		}
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void enableBudgetUserRule(Integer burid) {
		BudgetUserRulePO po = budgetUserRuleDao.get(burid);
		if (po != null) {
			po.setStatus(BudgetUserRulePO.STATUS_AVAILABLE_INT);
			budgetUserRuleDao.update(po);
		}
	}

	@Override
	public List<BudgetUserRuleVO> getBudgetUsersByCompany(Integer company) {
		List<BudgetUserRulePO> poList = budgetUserRuleDao.findByCompany(company);
		List<BudgetUserRuleVO> voList = new ArrayList<BudgetUserRuleVO>();

		for (BudgetUserRulePO po : poList) {
			BudgetUserRuleVO vo = copyToVO(po);
			voList.add(vo);
		}

		return voList;
	}

	@Override
	public List<BudgetUserRuleVO> getAvailableBudgetUsers(Integer company, Integer department) {
		List<BudgetUserRulePO> poList = budgetUserRuleDao.findAvailableBudgetUsers(company, department);
		List<BudgetUserRuleVO> voList = new ArrayList<BudgetUserRuleVO>();

		for (BudgetUserRulePO po : poList) {
			BudgetUserRuleVO vo = copyToVO(po);
			voList.add(vo);
		}

		return voList;
	}

	/**
	 * 将 PO 转换为 VO
	 * @param po 持久化对象
	 * @return 值对象
	 */
	private BudgetUserRuleVO copyToVO(BudgetUserRulePO po) {
		BudgetUserRuleVO vo = new BudgetUserRuleVO();
		vo.setBurid(po.getBurid());
		vo.setUid(po.getUid());
		vo.setCompany(po.getCompany());
		vo.setDepartment(po.getDepartment());
		vo.setStatus(po.getStatus());
		vo.setLastFinishTime(po.getLastFinishTime());
		vo.setCurrentTaskCount(po.getCurrentTaskCount());
		vo.setCreateTime(po.getCreateTime());
		vo.setUpdateTime(po.getUpdateTime());

		// 查询支持的类型
		List<Byte> types = budgetUserRuleTypeDao.findTypesByBurid(po.getBurid());
		vo.setSupportedTypes(types);

		// 设置状态名称
		if (po.getStatus() != null) {
			switch (po.getStatus()) {
				case BudgetUserRulePO.STATUS_AVAILABLE_INT:
					vo.setStatusName("待分配");
					break;
				case BudgetUserRulePO.STATUS_BUSY_INT:
					vo.setStatusName("制作中");
					break;
				case BudgetUserRulePO.STATUS_STOP_INT:
					vo.setStatusName("已停止");
					break;
				case BudgetUserRulePO.STATUS_COMPLETED_INT:
					vo.setStatusName("已完成");
					break;
				default:
					vo.setStatusName("未知");
					break;
			}
		}

		return vo;
	}
}
