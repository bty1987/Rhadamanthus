package com.fanglin.quotation.dao.impl;

import java.util.List;

import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.quotation.dao.QuotationAssignUserRuleDao;
import com.fanglin.quotation.po.QuotationAssignUserRulePO;
import com.fanglin.utils.Paging;

/**
 * 预算员规则表 DAO 实现类（人员维度）
 * 
 * <p>
 * 核心变更：company/department/supportedType 已移到 UserRuleItem，预算员规则列表按用户所属公司查询
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
	public List<QuotationAssignUserRulePO> pageQuotationAssignUserRule(Paging paging, List<Filter> filters, int company, String userId) throws FLException {

		PagingQuery<QuotationAssignUserRulePO> query = pagingQuery(paging, QuotationAssignUserRulePO.class);

		// alias 幂等（GenericDaoImpl 中基于 Map 去重），统一在此声明一次
		query.alias("user", "user");

		if (company > 0) {
			query.add(query.getCriterion("user.company", company, "eq"));
		}

		// 强制按当前登录人员过滤：仅返回本人预算员规则
		query.add(query.getCriterion("user.userId", userId, "eq"));

		queryFilterExcute(query, filters);

		query.desc("createTime");

		return query.list();
	}

	@Override
	public QuotationAssignUserRulePO queryQuotationAssignUserRuleByUserId(String userId) throws FLException {
		return (QuotationAssignUserRulePO) createCriteria(QuotationAssignUserRulePO.class).createAlias("user", "user").add(Restrictions.eq("user.userId", userId)).setMaxResults(1).uniqueResult();
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
		}
	}
}
