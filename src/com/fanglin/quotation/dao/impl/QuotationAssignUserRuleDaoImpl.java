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

	public QuotationAssignUserRuleDaoImpl() {
		super(QuotationAssignUserRulePO.class);
	}

	@Override
	public List<QuotationAssignUserRulePO> pageQuotationAssignUserRule(Paging paging, List<Filter> filters) throws FLException {

		PagingQuery<QuotationAssignUserRulePO> query = pagingQuery(paging, QuotationAssignUserRulePO.class);

		queryFilterExcute(query, filters);

		// 按创建时间倒序排序
		query.desc("createTime");

		return query.list();
	}

	@Override
	public QuotationAssignUserRulePO getQuotationAssignUserRule(String userId, int company) throws FLException {
		return (QuotationAssignUserRulePO) createCriteria(QuotationAssignUserRulePO.class).createAlias("user", "user").add(Restrictions.eq("user.userId", userId)).add(Restrictions.eq("company.cid", company)).uniqueResult();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<QuotationAssignUserRulePO> queryAvailableUsers(int company, Integer department) throws FLException {
		org.hibernate.Criteria criteria = createCriteria(QuotationAssignUserRulePO.class);

		// 按公司筛选（使用关联属性）
		criteria.add(org.hibernate.criterion.Restrictions.eq("company.cid", company));

		// 只查询待分配状态的人员
		criteria.add(org.hibernate.criterion.Restrictions.eq("status", QuotationAssignUserRulePO.STATUS_AVAILABLE_INT));

		// 使用 OR 逻辑：匹配该部门的规则 OR 公司级规则（department IS NULL）
		criteria.add(org.hibernate.criterion.Restrictions.or(
			org.hibernate.criterion.Restrictions.eq("department.did", department),
			org.hibernate.criterion.Restrictions.isNull("department.did")
		));

		// 按最后完成时间升序排序（最早完成的排在前面）
		criteria.addOrder(org.hibernate.criterion.Order.asc("lastFinishTime"));

		return criteria.list();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null) return;

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if ("status".equals(field)) {
				// 状态：精确匹配
				query.add(query.getCriterion("status", Short.valueOf(data), op));
			} else if ("userName".equals(field)) {
				// 用户姓名：需要关联 user 表，使用 currentName 字段
				query.alias("user", "user");
				query.add(query.getCriterion("user.currentName", data, op));
			} else if ("company".equals(field)) {
				// 公司：需要关联 company 表，使用 cid 字段
				query.alias("company", "company");
				query.add(query.getCriterion("company.cid", Integer.valueOf(data), op));
			}
		}
	}

}
