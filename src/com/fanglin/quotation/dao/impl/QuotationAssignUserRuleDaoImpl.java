package com.fanglin.quotation.dao.impl;

import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.criterion.CriteriaSpecification;
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

	@Override
	@SuppressWarnings("unchecked")
	public List<QuotationAssignUserRulePO> queryAvailableUsers(int company, Integer department, Short decorationType) throws FLException {
		Criteria criteria = createCriteria(QuotationAssignUserRulePO.class);

		// 只查询待分配状态的人员
		criteria.add(Restrictions.eq("status", QuotationAssignUserRulePO.STATUS_AVAILABLE_INT));

		// 通过 UserRuleItem 子查询：存在至少一条匹配 company+department+supportedType 的明细
		DetachedCriteria itemMatch = DetachedCriteria.forClass(QuotationAssignUserRuleItemPO.class, "item");
		itemMatch.add(Restrictions.eqProperty("item.userRule.qaurid", "qaurid"));

		// 公司匹配
		itemMatch.createAlias("item.company", "item_company");
		itemMatch.add(Restrictions.eq("item_company.cid", company));

		// 部门匹配：匹配指定部门 OR 部门为NULL（公司级）
		if (department != null) {
			itemMatch.createAlias("item.department", "item_dept", CriteriaSpecification.LEFT_JOIN);
			itemMatch.add(Restrictions.or(Restrictions.eq("item_dept.did", department), Restrictions.isNull("item.department")));
		}

		// 装修类型匹配：-1通用 OR 匹配指定类型
		if (decorationType != null) {
			itemMatch.add(Restrictions.or(Restrictions.eq("item.supportedType", QuotationAssignUserRulePO.SUPPORTED_TYPE_ALL_INT), Restrictions.eq("item.supportedType", (int) decorationType.shortValue())));
		}

		itemMatch.setProjection(Projections.property("item.qauriid"));
		criteria.add(Subqueries.exists(itemMatch));

		// 按最后完成时间升序排序（最早完成的排在前面）
		criteria.addOrder(Order.asc("lastFinishTime"));

		return criteria.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<QuotationAssignUserRulePO> queryAvailableUsersForCrossCompany(int company, Integer department, Short decorationType) throws FLException {
		Criteria criteria = createCriteria(QuotationAssignUserRulePO.class);

		// 先通过基本条件：待分配状态
		criteria.add(Restrictions.eq("status", QuotationAssignUserRulePO.STATUS_AVAILABLE_INT));

		// 创建 user alias 供子查询使用
		criteria.createAlias("user", "user");

		// 通过 UserRuleItem 子查询：存在至少一条匹配当前 company+department+supportedType 的明细
		DetachedCriteria itemMatch = DetachedCriteria.forClass(QuotationAssignUserRuleItemPO.class, "item");
		itemMatch.add(Restrictions.eqProperty("item.userRule.qaurid", "qaurid"));

		itemMatch.createAlias("item.company", "item_company");
		itemMatch.add(Restrictions.eq("item_company.cid", company));

		if (department != null) {
			itemMatch.createAlias("item.department", "item_dept", CriteriaSpecification.LEFT_JOIN);
			itemMatch.add(Restrictions.or(Restrictions.eq("item_dept.did", department), Restrictions.isNull("item.department")));
		}

		if (decorationType != null) {
			itemMatch.add(Restrictions.or(Restrictions.eq("item.supportedType", QuotationAssignUserRulePO.SUPPORTED_TYPE_ALL_INT), Restrictions.eq("item.supportedType", (int) decorationType.shortValue())));
		}

		itemMatch.setProjection(Projections.property("item.qauriid"));
		criteria.add(Subqueries.exists(itemMatch));

		// ★ 跨公司验证：排除在其他公司有非"待分配"状态的预算员
		// 使用 SQLRestriction 避免 Hibernate 3 中 DetachedCriteria eqProperty 跨层引用外层 alias 导致的
		// MappingException: unknown entity: null
		// 原理：直接用表名 + 外键关联，不依赖 Hibernate alias 解析
		criteria.add(Restrictions.sqlRestriction("not exists (" + "  select 1 from quotation.quotationassignuserrule t " + "  inner join communion.user u2 on t.uid = u2.uid " + "  where u2.userId = (select u3.userId from communion.user u3 where u3.uid = {alias}.uid) " + "  and t.status <> " + QuotationAssignUserRulePO.STATUS_AVAILABLE_INT + ")"));

		// 按最后完成时间升序排序
		criteria.addOrder(Order.asc("lastFinishTime"));

		return criteria.list();
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
