package com.fanglin.quotation.dao.impl;

import java.util.List;

import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.quotation.dao.BudgetUserRuleDao;
import com.fanglin.quotation.po.BudgetUserRulePO;

/**
 * 预算员规则表 DAO 实现
 */
@Repository("budgetUserRuleDao")
public class BudgetUserRuleDaoImpl extends DaoImpl<BudgetUserRulePO> implements BudgetUserRuleDao {

	public BudgetUserRuleDaoImpl() {
		super(BudgetUserRulePO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public BudgetUserRulePO findByUidAndCompany(Integer uid, Integer company) {
		return (BudgetUserRulePO) createCriteria(BudgetUserRulePO.class)
				.add(Restrictions.eq("uid", uid))
				.add(Restrictions.eq("company", company))
				.uniqueResult();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<BudgetUserRulePO> findAvailableBudgetUsers(Integer company, Integer department) {
		org.hibernate.Criteria criteria = createCriteria(BudgetUserRulePO.class)
				.add(Restrictions.eq("company", company))
				.add(Restrictions.eq("status", BudgetUserRulePO.STATUS_AVAILABLE_INT));

		if (department != null) {
			criteria.add(Restrictions.eq("department", department));
		}

		criteria.addOrder(Order.asc("lastFinishTime"));
		criteria.addOrder(Order.asc("currentTaskCount"));

		return criteria.list();
	}

	@Override
	public BudgetUserRulePO findByUid(Integer uid) {
		return (BudgetUserRulePO) createCriteria(BudgetUserRulePO.class)
				.add(Restrictions.eq("uid", uid))
				.uniqueResult();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<BudgetUserRulePO> findByCompany(Integer company) {
		return createCriteria(BudgetUserRulePO.class)
				.add(Restrictions.eq("company", company))
				.addOrder(Order.asc("lastFinishTime"))
				.list();
	}

	@Override
	public int updateStatusAndTaskCount(Integer uid, Byte status, Integer taskCount) {
		String hql = "UPDATE BudgetUserRulePO SET status = :status, currentTaskCount = :taskCount, updateTime = CURRENT_TIMESTAMP WHERE uid = :uid";
		return getSession().createQuery(hql)
				.setParameter("status", status)
				.setParameter("taskCount", taskCount)
				.setParameter("uid", uid)
				.executeUpdate();
	}

	@Override
	public int countTasksByUid(Integer uid) {
		// 基于 quotationassignrequest 表统计该预算员的已分配请求数
		String sql = "SELECT COUNT(*) FROM quotation.quotationassignrequest WHERE orderId IN " +
				     "(SELECT orderId FROM decoration.decoration WHERE budgetUid = :uid) " +
				     "AND status = :status";
		return ((Number) getSession().createSQLQuery(sql)
				.setParameter("uid", uid)
				.setParameter("status", QuotationAssignRequestPO.STATUS_ASSIGNED_INT)
				.uniqueResult()).intValue();
	}
}
