package com.fanglin.quotation.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.quotation.dao.QuotationAssignConfigDao;
import com.fanglin.quotation.po.QuotationAssignConfigPO;

/**
 * 报价单预算配置表 DAO 实现 职责: 控制哪些公司/部门启用预算员分配功能
 */
@Repository("quotationAssignConfigDao")
public class QuotationAssignConfigDaoImpl extends DaoImpl<QuotationAssignConfigPO> implements QuotationAssignConfigDao {

	public QuotationAssignConfigDaoImpl() {
		super(QuotationAssignConfigPO.class);
	}

	@Override
	public QuotationAssignConfigPO queryQuotationAssignConfigByCompanyAndDepartment(int company, Integer department) {
		org.hibernate.Criteria criteria = session().createCriteria(QuotationAssignConfigPO.class).add(Restrictions.eq(QuotationAssignConfigPO.COLUMN_COMPANY_STR, company));

		if (department == null) {
			criteria.add(Restrictions.isNull(QuotationAssignConfigPO.COLUMN_DEPARTMENT_STR));
		} else {
			criteria.add(Restrictions.eq(QuotationAssignConfigPO.COLUMN_DEPARTMENT_STR, department));
		}

		return (QuotationAssignConfigPO) criteria.uniqueResult();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<QuotationAssignConfigPO> queryQuotationAssignConfigByCompany(int company) {
		return session().createCriteria(QuotationAssignConfigPO.class).add(Restrictions.eq(QuotationAssignConfigPO.COLUMN_COMPANY_STR, company)).list();
	}

	@Override
	public QuotationAssignConfigPO queryQuotationAssignConfigByCompanyLevel(int company) {
		return (QuotationAssignConfigPO) session().createCriteria(QuotationAssignConfigPO.class).add(Restrictions.eq(QuotationAssignConfigPO.COLUMN_COMPANY_STR, company)).add(Restrictions.isNull(QuotationAssignConfigPO.COLUMN_DEPARTMENT_STR)).setMaxResults(1).uniqueResult();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<QuotationAssignConfigPO> queryQuotationAssignConfigByDepartmentLevel(int company) {
		return session().createCriteria(QuotationAssignConfigPO.class).add(Restrictions.eq(QuotationAssignConfigPO.COLUMN_COMPANY_STR, company)).add(Restrictions.isNotNull(QuotationAssignConfigPO.COLUMN_DEPARTMENT_STR)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<QuotationAssignConfigPO> queryEnabledQuotationAssignConfig(int company) {
		return session().createCriteria(QuotationAssignConfigPO.class).add(Restrictions.eq(QuotationAssignConfigPO.COLUMN_COMPANY_STR, company)).add(Restrictions.eq(QuotationAssignConfigPO.COLUMN_ENABLED_STR, QuotationAssignConfigPO.ENABLED_ENABLED_INT)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<QuotationAssignConfigPO> queryAutoAssignQuotationAssignConfig(int company) {
		return session().createCriteria(QuotationAssignConfigPO.class).add(Restrictions.eq(QuotationAssignConfigPO.COLUMN_COMPANY_STR, company)).add(Restrictions.eq(QuotationAssignConfigPO.COLUMN_ENABLED_STR, QuotationAssignConfigPO.ENABLED_ENABLED_INT)).add(Restrictions.eq(QuotationAssignConfigPO.COLUMN_AUTOASSIGN_STR, QuotationAssignConfigPO.AUTO_ASSIGN_AUTO_INT)).list();
	}

	@Override
	public int existEnabledQuotationAssignConfig(int company) {
		String hql = "SELECT COUNT(*) FROM QuotationAssignConfigPO WHERE company = :company AND enabled = :enabled";
		return ((Number) session().createQuery(hql).setParameter("company", company).setParameter("enabled", QuotationAssignConfigPO.ENABLED_ENABLED_INT).uniqueResult()).intValue();
	}

	@Override
	public int existEnabledQuotationAssignConfigByDepartment(int company, int department) {
		String hql = "SELECT COUNT(*) FROM QuotationAssignConfigPO WHERE company = :company AND department = :department AND enabled = :enabled";
		return ((Number) session().createQuery(hql).setParameter("company", company).setParameter("department", department).setParameter("enabled", QuotationAssignConfigPO.ENABLED_ENABLED_INT).uniqueResult()).intValue();
	}

	@Override
	public int existAutoAssignQuotationAssignConfig(int company) {
		String hql = "SELECT COUNT(*) FROM QuotationAssignConfigPO WHERE company = :company AND enabled = :enabled AND autoAssign = :autoAssign";
		return ((Number) session().createQuery(hql).setParameter("company", company).setParameter("enabled", QuotationAssignConfigPO.ENABLED_ENABLED_INT).setParameter("autoAssign", QuotationAssignConfigPO.AUTO_ASSIGN_AUTO_INT).uniqueResult()).intValue();
	}

	@Override
	public int existAutoAssignQuotationAssignConfigByDepartment(int company, int department) {
		String hql = "SELECT COUNT(*) FROM QuotationAssignConfigPO WHERE company = :company AND department = :department AND enabled = :enabled AND autoAssign = :autoAssign";
		return ((Number) session().createQuery(hql).setParameter("company", company).setParameter("department", department).setParameter("enabled", QuotationAssignConfigPO.ENABLED_ENABLED_INT).setParameter("autoAssign", QuotationAssignConfigPO.AUTO_ASSIGN_AUTO_INT).uniqueResult()).intValue();
	}

	@Override
	public int updateQuotationAssignConfigEnabled(long qacid, short enabled) {
		String hql = "UPDATE QuotationAssignConfigPO SET enabled = :enabled, updateTime = CURRENT_TIMESTAMP WHERE qacid = :qacid";
		return session().createQuery(hql).setParameter("enabled", enabled).setParameter("qacid", qacid).executeUpdate();
	}

	@Override
	public int updateQuotationAssignConfigAutoAssign(long qacid, short autoAssign) {
		String hql = "UPDATE QuotationAssignConfigPO SET autoAssign = :autoAssign, updateTime = CURRENT_TIMESTAMP WHERE qacid = :qacid";
		return session().createQuery(hql).setParameter("autoAssign", autoAssign).setParameter("qacid", qacid).executeUpdate();
	}

	@Override
	public int countQuotationAssignConfigByCompany(int company) {
		String hql = "SELECT COUNT(*) FROM QuotationAssignConfigPO WHERE company = :company";
		return ((Number) session().createQuery(hql).setParameter("company", company).uniqueResult()).intValue();
	}

	@Override
	public int deleteQuotationAssignConfigByCompany(int company) {
		String hql = "DELETE FROM QuotationAssignConfigPO WHERE company = :company";
		return session().createQuery(hql).setParameter("company", company).executeUpdate();
	}

	@Override
	public int deleteQuotationAssignConfigByDepartment(int company, int department) {
		String hql = "DELETE FROM QuotationAssignConfigPO WHERE company = :company AND department = :department";
		return session().createQuery(hql).setParameter("company", company).setParameter("department", department).executeUpdate();
	}
}
