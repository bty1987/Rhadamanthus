package com.fanglin.quotation.dao.impl;

import java.util.List;

import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.quotation.dao.QuotationAssignUserRuleDao;
import com.fanglin.quotation.po.QuotationAssignRequestPO;
import com.fanglin.quotation.po.QuotationAssignUserRulePO;

/**
 * 报价单预算员规则表 DAO 实现 职责: 管理预算员的分配规则（状态、任务数、完成时间等）
 */
@Repository("quotationAssignUserRuleDao")
public class QuotationAssignUserRuleDaoImpl extends DaoImpl<QuotationAssignUserRulePO> implements QuotationAssignUserRuleDao {

	public QuotationAssignUserRuleDaoImpl() {
		super(QuotationAssignUserRulePO.class);
	}

	@Override
	public QuotationAssignUserRulePO queryQuotationAssignUserRuleByUidAndCompany(int uid, int company) {
		return (QuotationAssignUserRulePO) session().createCriteria(QuotationAssignUserRulePO.class).createAlias("user", "user").add(Restrictions.eq("user.uid", uid)).add(Restrictions.eq(QuotationAssignUserRulePO.COLUMN_COMPANY_STR, company)).setMaxResults(1).uniqueResult();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<QuotationAssignUserRulePO> pullQuotationAssignUserRule(int company, Integer department) {
		org.hibernate.Criteria criteria = session().createCriteria(QuotationAssignUserRulePO.class).add(Restrictions.eq(QuotationAssignUserRulePO.COLUMN_COMPANY_STR, company)).add(Restrictions.eq(QuotationAssignUserRulePO.COLUMN_STATUS_STR, QuotationAssignUserRulePO.STATUS_AVAILABLE_INT));

		if (department != null) {
			criteria.add(Restrictions.eq(QuotationAssignUserRulePO.COLUMN_DEPARTMENT_STR, department));
		}

		criteria.addOrder(Order.asc(QuotationAssignUserRulePO.COLUMN_LASTFINISHTIME_STR));
		criteria.addOrder(Order.asc(QuotationAssignUserRulePO.COLUMN_CURRENTTASKCOUNT_STR));

		return criteria.list();
	}

	@Override
	public QuotationAssignUserRulePO queryQuotationAssignUserRuleByUid(int uid) {
		return (QuotationAssignUserRulePO) session().createCriteria(QuotationAssignUserRulePO.class).createAlias("user", "user").add(Restrictions.eq("user.uid", uid)).setMaxResults(1).uniqueResult();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<QuotationAssignUserRulePO> queryQuotationAssignUserRuleByCompany(int company) {
		return session().createCriteria(QuotationAssignUserRulePO.class).add(Restrictions.eq(QuotationAssignUserRulePO.COLUMN_COMPANY_STR, company)).addOrder(Order.asc(QuotationAssignUserRulePO.COLUMN_LASTFINISHTIME_STR)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<QuotationAssignUserRulePO> queryQuotationAssignUserRuleByDepartment(int company, int department) {
		return session().createCriteria(QuotationAssignUserRulePO.class).add(Restrictions.eq(QuotationAssignUserRulePO.COLUMN_COMPANY_STR, company)).add(Restrictions.eq(QuotationAssignUserRulePO.COLUMN_DEPARTMENT_STR, department)).addOrder(Order.asc(QuotationAssignUserRulePO.COLUMN_LASTFINISHTIME_STR)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<QuotationAssignUserRulePO> pullAvailableQuotationAssignUserRule(int company, Integer department) {
		org.hibernate.Criteria criteria = session().createCriteria(QuotationAssignUserRulePO.class).add(Restrictions.eq(QuotationAssignUserRulePO.COLUMN_COMPANY_STR, company)).add(Restrictions.eq(QuotationAssignUserRulePO.COLUMN_STATUS_STR, QuotationAssignUserRulePO.STATUS_AVAILABLE_INT));

		if (department != null) {
			criteria.add(Restrictions.eq(QuotationAssignUserRulePO.COLUMN_DEPARTMENT_STR, department));
		}

		criteria.addOrder(Order.asc(QuotationAssignUserRulePO.COLUMN_LASTFINISHTIME_STR));
		criteria.addOrder(Order.asc(QuotationAssignUserRulePO.COLUMN_CURRENTTASKCOUNT_STR));

		return criteria.list();
	}

	@Override
	public int updateStatusAndTaskCount(int uid, short status, int taskCount) {
		String hql = "UPDATE QuotationAssignUserRulePO SET status = :status, currentTaskCount = :taskCount, updateTime = CURRENT_TIMESTAMP WHERE qaurid IN (SELECT qaurid FROM QuotationAssignUserRulePO WHERE uid = :uid)";
		return session().createQuery(hql).setParameter("status", status).setParameter("taskCount", taskCount).setParameter("uid", uid).executeUpdate();
	}

	@Override
	public int countQuotationAssignTaskByUid(int uid) {
		// 基于 quotationassignrequest 表统计该预算员的已分配请求数
		String sql = "SELECT COUNT(*) FROM quotation.quotationassignrequest WHERE orderId IN " + "(SELECT orderId FROM decoration.decoration WHERE budgetUid = :uid) " + "AND status = :status";
		return ((Number) session().createSQLQuery(sql).setParameter("uid", uid).setParameter("status", QuotationAssignRequestPO.STATUS_ASSIGNED_INT).uniqueResult()).intValue();
	}

	@Override
	public int countQuotationAssignUserRuleByCompany(int company) {
		String hql = "SELECT COUNT(*) FROM QuotationAssignUserRulePO WHERE company = :company";
		return ((Number) session().createQuery(hql).setParameter("company", company).uniqueResult()).intValue();
	}

	@Override
	public int countQuotationAssignUserRuleByDepartment(int company, int department) {
		String hql = "SELECT COUNT(*) FROM QuotationAssignUserRulePO WHERE company = :company AND department = :department";
		return ((Number) session().createQuery(hql).setParameter("company", company).setParameter("department", department).uniqueResult()).intValue();
	}

	@Override
	public int existQuotationAssignUserRule(int uid, int company) {
		String hql = "SELECT COUNT(*) FROM QuotationAssignUserRulePO WHERE qaurid IN (SELECT qaurid FROM QuotationAssignUserRulePO WHERE uid = :uid) AND company = :company";
		return ((Number) session().createQuery(hql).setParameter("uid", uid).setParameter("company", company).uniqueResult()).intValue();
	}

	@Override
	public int disableQuotationAssignUserRuleByUid(int uid) {
		String sql = "UPDATE quotation.quotationassignuserrule SET status = :status, updateTime = CURRENT_TIMESTAMP WHERE qaurid IN (SELECT qaurid FROM quotation.quotationassignuserrule WHERE uid = :uid)";
		return session().createSQLQuery(sql).setParameter("status", QuotationAssignUserRulePO.STATUS_STOP_INT).setParameter("uid", uid).executeUpdate();
	}

	@Override
	public int enableQuotationAssignUserRuleByUid(int uid) {
		String sql = "UPDATE quotation.quotationassignuserrule SET status = :status, updateTime = CURRENT_TIMESTAMP WHERE qaurid IN (SELECT qaurid FROM quotation.quotationassignuserrule WHERE uid = :uid)";
		return session().createSQLQuery(sql).setParameter("status", QuotationAssignUserRulePO.STATUS_AVAILABLE_INT).setParameter("uid", uid).executeUpdate();
	}
}
