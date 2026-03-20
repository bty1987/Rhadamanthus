package com.fanglin.quotation.dao.impl;

import java.sql.Timestamp;
import java.util.List;

import org.hibernate.Query;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.quotation.dao.QuotationAssignUserRuleDao;
import com.fanglin.quotation.po.QuotationAssignUserRulePO;
import com.fanglin.utils.Paging;

/**
 * 预算员规则表 DAO 实现类
 * 
 * @author Claude AI
 * @date 2026-03-20
 */
@Repository("quotationAssignUserRuleDao")
public class QuotationAssignUserRuleDaoImpl extends DaoImpl<QuotationAssignUserRulePO> implements QuotationAssignUserRuleDao {

	@Override
	public List<QuotationAssignUserRulePO> pageQuotationAssignUserRule(Paging paging, List<Filter> filters) throws FLException {
		// todo
		return null;
	}

	@Override
	public QuotationAssignUserRulePO get(long qaurid) throws FLException {
		return get(QuotationAssignUserRulePO.class, qaurid);
	}

	@Override
	@SuppressWarnings("unchecked")
	public QuotationAssignUserRulePO getByUidAndCompany(int uid, int company) throws FLException {
		String hql = "FROM QuotationAssignUserRulePO WHERE uid = :uid AND company = :company";
		Query query = session().createQuery(hql);
		query.setParameter("uid", uid);
		query.setParameter("company", company);
		query.setMaxResults(1);
		List<QuotationAssignUserRulePO> list = query.list();
		return list.isEmpty() ? null : list.get(0);
	}

	@Override
	public List<QuotationAssignUserRulePO> queryAvailableUsers(int company, Integer department) throws FLException {
		// todo
		return null;
	}

	@Override
	public int addQuotationAssignUserRule(QuotationAssignUserRulePO quotationAssignUserRule) throws FLException {
		save(quotationAssignUserRule);
		return 1;
	}

	@Override
	public int updateQuotationAssignUserRule(QuotationAssignUserRulePO quotationAssignUserRule) throws FLException {
		update(quotationAssignUserRule);
		return 1;
	}

	@Override
	public int deleteQuotationAssignUserRule(long qaurid) throws FLException {
		delete(QuotationAssignUserRulePO.class, qaurid);
		return 1;
	}

	@Override
	public int updateQuotationAssignUserRuleStatus(long qaurid, short status) throws FLException {
		String hql = "UPDATE QuotationAssignUserRulePO SET status = :status WHERE qaurid = :qaurid";
		Query query = session().createQuery(hql);
		query.setParameter("status", status);
		query.setParameter("qaurid", qaurid);
		return query.executeUpdate();
	}

	@Override
	public int updateLastFinishTime(long qaurid, Timestamp lastFinishTime) throws FLException {
		String hql = "UPDATE QuotationAssignUserRulePO SET lastFinishTime = :lastFinishTime WHERE qaurid = :qaurid";
		Query query = session().createQuery(hql);
		query.setParameter("lastFinishTime", lastFinishTime);
		query.setParameter("qaurid", qaurid);
		return query.executeUpdate();
	}

}
