package com.fanglin.quotation.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.quotation.dao.BudgetUserRuleTypeDao;
import com.fanglin.quotation.po.BudgetUserRuleTypePO;

/**
 * 预算员类型支持表 DAO 实现
 */
@Repository("budgetUserRuleTypeDao")
public class BudgetUserRuleTypeDaoImpl extends DaoImpl<BudgetUserRuleTypePO> implements BudgetUserRuleTypeDao {

	public BudgetUserRuleTypeDaoImpl() {
		super(BudgetUserRuleTypePO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<Byte> findTypesByBurid(Integer burid) {
		// 查询预算员支持的所有类型
		String hql = "SELECT type FROM BudgetUserRuleTypePO WHERE burid = :burid";
		return getSession().createQuery(hql)
				.setParameter("burid", burid)
				.list();
	}

	@Override
	public boolean existsByBuridAndType(Integer burid, Byte type) {
		// 检查预算员是否支持某个类型
		BudgetUserRuleTypePO record = (BudgetUserRuleTypePO) createCriteria(BudgetUserRuleTypePO.class)
				.add(Restrictions.eq("burid", burid))
				.add(Restrictions.eq("type", type))
				.uniqueResult();
		return record != null;
	}

	@Override
	public int deleteByBurid(Integer burid) {
		// 删除预算员的所有类型配置
		String hql = "DELETE FROM BudgetUserRuleTypePO WHERE burid = :burid";
		return getSession().createQuery(hql)
				.setParameter("burid", burid)
				.executeUpdate();
	}
}
