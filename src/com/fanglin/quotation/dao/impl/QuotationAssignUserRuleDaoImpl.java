package com.fanglin.quotation.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.quotation.dao.QuotationAssignUserRuleDao;
import com.fanglin.quotation.po.QuotationAssignUserRulePO;
import com.fanglin.utils.Paging;

@Repository("quotationAssignUserRuleDao")
public class QuotationAssignUserRuleDaoImpl extends DaoImpl<QuotationAssignUserRulePO> implements QuotationAssignUserRuleDao {

	@Override
	public List<QuotationAssignUserRulePO> pageQuotationAssignUserRule(Paging paging, List<Filter> filters) throws FLException {

		PagingQuery<QuotationAssignUserRulePO> query = pagingQuery(paging, QuotationAssignUserRulePO.class);

		queryFilterExcute(query, filters);

		// 按创建时间倒序排序
		query.desc("createTime");

		return query.list();
	}

	@Override
	public QuotationAssignUserRulePO get(long qaurid) throws FLException {
		return get(QuotationAssignUserRulePO.class, qaurid);
	}

	@Override
	public QuotationAssignUserRulePO getByUidAndCompany(int uid, int company) throws FLException {
		return (QuotationAssignUserRulePO) createCriteria(QuotationAssignUserRulePO.class)
				.add(Restrictions.eq("user.uid", uid))
				.add(Restrictions.eq("company.cid", company))
				.uniqueResult();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<QuotationAssignUserRulePO> queryAvailableUsers(int company, Integer department) throws FLException {
		org.hibernate.Criteria criteria = createCriteria(QuotationAssignUserRulePO.class);

		// 按公司筛选（使用关联属性）
		criteria.add(org.hibernate.criterion.Restrictions.eq("company.cid", company));

		// 只查询待分配状态的人员
		criteria.add(org.hibernate.criterion.Restrictions.eq("status", QuotationAssignUserRulePO.STATUS_AVAILABLE_INT));

		// 按部门筛选（如果指定了部门，则匹配该部门或部门为NULL的规则）
		if (department != null) {
			criteria.add(org.hibernate.criterion.Restrictions.or(
				org.hibernate.criterion.Restrictions.eq("department.did", department),
				org.hibernate.criterion.Restrictions.isNull("department.did")
			));
		}

		// 按最后完成时间升序排序（最早完成的排在前面）
		criteria.addOrder(org.hibernate.criterion.Order.asc("lastFinishTime"));

		return criteria.list();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		// 添加过滤条件
		if (filters != null) {
			for (Filter filter : filters) {
				query.add(query.getCriterion(filter.getField(), filter.getData(), filter.getOp()));
			}
		}

	}

}
