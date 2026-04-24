package com.fanglin.quotation.dao.impl;

import java.util.List;

import org.hibernate.criterion.DetachedCriteria;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Projections;
import org.hibernate.criterion.Restrictions;
import org.hibernate.criterion.Subqueries;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.quotation.dao.QuotationAssignUserRuleDao;
import com.fanglin.quotation.po.QuotationAssignUserRuleItemPO;
import com.fanglin.quotation.po.QuotationAssignUserRulePO;
import com.fanglin.utils.Paging;

/**
 * 预算员规则表 DAO 实现类（人员维度）
 * 
 * <p>
 * 核心变更：company/department/supportedType 已移到 UserRuleItem， 所有按这些维度查询的方法均通过 UserRuleItem 子查询实现
 * </p>
 * 
 * @author Claude AI
 * @date 2026-04-21
 */
@Repository("quotationAssignUserRuleDao")
public class QuotationAssignUserRuleDaoImpl extends DaoImpl<QuotationAssignUserRulePO> implements QuotationAssignUserRuleDao {

	public QuotationAssignUserRuleDaoImpl() {
		super(QuotationAssignUserRulePO.class);
	}

	@Override
	public List<QuotationAssignUserRulePO> pageQuotationAssignUserRule(Paging paging, List<Filter> filters, Integer company) throws FLException {

		PagingQuery<QuotationAssignUserRulePO> query = pagingQuery(paging, QuotationAssignUserRulePO.class);

		queryFilterExcute(query, filters);

		// 按公司筛选：通过 UserRuleItem 子查询，找出在指定公司有规则明细的用户
		if (company != null) {
			DetachedCriteria itemSubquery = DetachedCriteria.forClass(QuotationAssignUserRuleItemPO.class, "item_sub");
			itemSubquery.add(Restrictions.eqProperty("item_sub.userRule.qaurid", "qaurid"));
			itemSubquery.createAlias("item_sub.company", "item_company");
			itemSubquery.add(Restrictions.eq("item_company.cid", company));
			itemSubquery.setProjection(Projections.property("item_sub.qauriid"));

			query.add(Subqueries.exists(itemSubquery));
		}

		query.desc("createTime");

		return query.list();
	}

	@Override
	public QuotationAssignUserRulePO queryQuotationAssignUserRuleByUserId(String userId) throws FLException {
		return (QuotationAssignUserRulePO) createCriteria(QuotationAssignUserRulePO.class).createAlias("user", "user").add(Restrictions.eq("user.userId", userId)).uniqueResult();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<QuotationAssignUserRulePO> queryAllQuotationAssignUserRule() throws FLException {
		return createCriteria(QuotationAssignUserRulePO.class).createAlias("user", "user").addOrder(Order.asc("status")).addOrder(Order.desc("currentTaskCount")).addOrder(Order.asc("user.currentName")).list();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null) return;

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if ("status".equals(field)) {
				query.add(query.getCriterion("status", Short.valueOf(data), op));
			} else if ("userName".equals(field)) {
				query.alias("user", "user");
				query.add(query.getCriterion("user.currentName", data, op));
			}
			// company 过滤已通过子查询在主方法中处理
		}
	}
}
