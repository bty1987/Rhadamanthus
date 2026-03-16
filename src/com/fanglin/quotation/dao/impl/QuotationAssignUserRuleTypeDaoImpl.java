package com.fanglin.quotation.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.quotation.dao.QuotationAssignUserRuleTypeDao;
import com.fanglin.quotation.po.QuotationAssignUserRuleTypePO;

/**
 * 报价单预算员类型支持表 DAO 实现 职责: 管理预算员支持的装修类型（半包/整装）
 */
@Repository("quotationAssignUserRuleTypeDao")
public class QuotationAssignUserRuleTypeDaoImpl extends DaoImpl<QuotationAssignUserRuleTypePO> implements QuotationAssignUserRuleTypeDao {

	public QuotationAssignUserRuleTypeDaoImpl() {
		super(QuotationAssignUserRuleTypePO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<QuotationAssignUserRuleTypePO> queryQuotationAssignUserRuleType(long qaurid) {
		return session().createCriteria(QuotationAssignUserRuleTypePO.class).createAlias("quotationAssignUserRule", "quotationAssignUserRule").add(Restrictions.eq("quotationAssignUserRule.qaurid", qaurid)).list();
	}

	@Override
	public QuotationAssignUserRuleTypePO queryQuotationAssignUserRuleType(long qaurid, short type) {
		return (QuotationAssignUserRuleTypePO) session().createCriteria(QuotationAssignUserRuleTypePO.class).createAlias("quotationAssignUserRule", "quotationAssignUserRule").add(Restrictions.eq("quotationAssignUserRule.qaurid", qaurid)).add(Restrictions.eq(QuotationAssignUserRuleTypePO.COLUMN_TYPE_STR, type)).setMaxResults(1).uniqueResult();
	}

	@Override
	public int existQuotationAssignUserRuleType(long qaurid, short type) {
		String hql = "SELECT COUNT(*) FROM QuotationAssignUserRuleTypePO WHERE quotationAssignUserRule.qaurid = :qaurid AND type = :type";
		return ((Number) session().createQuery(hql).setParameter("qaurid", qaurid).setParameter("type", type).uniqueResult()).intValue();
	}

	@Override
	public int countQuotationAssignUserRuleType(long qaurid) {
		String hql = "SELECT COUNT(*) FROM QuotationAssignUserRuleTypePO WHERE quotationAssignUserRule.qaurid = :qaurid";
		return ((Number) session().createQuery(hql).setParameter("qaurid", qaurid).uniqueResult()).intValue();
	}

	@Override
	public int deleteQuotationAssignUserRuleType(long qaurid) {
		String hql = "DELETE FROM QuotationAssignUserRuleTypePO WHERE quotationAssignUserRule.qaurid = :qaurid";
		return session().createQuery(hql).setParameter("qaurid", qaurid).executeUpdate();
	}

	@Override
	public int batchQuotationAssignUserRuleType(List<QuotationAssignUserRuleTypePO> types) {

		if (types == null || types.isEmpty()) {
			return 0;
		}

		int count = 0;
		for (QuotationAssignUserRuleTypePO type : types) {
			session().save(type);
			count++;
		}

		return count;
	}
}
