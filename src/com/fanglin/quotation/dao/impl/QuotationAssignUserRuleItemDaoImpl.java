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
import com.fanglin.quotation.dao.QuotationAssignUserRuleItemDao;
import com.fanglin.quotation.po.QuotationAssignUserRuleItemPO;
import com.fanglin.quotation.po.QuotationAssignUserRulePO;

@Repository("quotationAssignUserRuleItemDao")
public class QuotationAssignUserRuleItemDaoImpl extends DaoImpl<QuotationAssignUserRuleItemPO> implements QuotationAssignUserRuleItemDao {

	public QuotationAssignUserRuleItemDaoImpl() {
		super(QuotationAssignUserRuleItemPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<QuotationAssignUserRuleItemPO> queryQuotationAssignUserRuleItemByRuleId(long qaurid) throws FLException {
		return createCriteria(QuotationAssignUserRuleItemPO.class)
			.createAlias("userRule", "userRule")
			.add(Restrictions.eq("userRule.qaurid", qaurid))
			.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<QuotationAssignUserRuleItemPO> queryQuotationAssignUserRuleItemByUserId(String userId) throws FLException {
		return createCriteria(QuotationAssignUserRuleItemPO.class)
			.createAlias("userRule", "userRule")
			.createAlias("userRule.user", "user")
			.add(Restrictions.eq("user.userId", userId))
			.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<QuotationAssignUserRuleItemPO> queryQuotationAssignUserRuleItemByUserIdAndCompany(String userId, int company) throws FLException {
		return createCriteria(QuotationAssignUserRuleItemPO.class)
			.createAlias("userRule", "userRule")
			.createAlias("userRule.user", "user")
			.createAlias("company", "company")
			.add(Restrictions.eq("user.userId", userId))
			.add(Restrictions.eq("company.cid", company))
			.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<QuotationAssignUserRuleItemPO> queryAvailableItemsForAssign(int company, Integer department, Short decorationType) throws FLException {
		Criteria criteria = createCriteria(QuotationAssignUserRuleItemPO.class);

		// 关联 userRule 和 user
		criteria.createAlias("userRule", "userRule");
		criteria.createAlias("userRule.user", "user");

		// 按公司筛选
		criteria.createAlias("company", "company");
		criteria.add(Restrictions.eq("company.cid", company));

		// 部门匹配：指定部门 OR 全公司(department IS NULL)
		criteria.createAlias("department", "dept", CriteriaSpecification.LEFT_JOIN);
		if (department != null) {
			criteria.add(Restrictions.or(
				Restrictions.eq("dept.did", department),
				Restrictions.isNull("department")));
		}

		// 装修类型匹配：通用(-1) 或 指定类型
		if (decorationType != null) {
			criteria.add(Restrictions.or(
				Restrictions.eq("supportedType", QuotationAssignUserRulePO.SUPPORTED_TYPE_ALL_INT),
				Restrictions.eq("supportedType", (int) decorationType.shortValue())));
		}

		// 预算员状态：仅待分配
		criteria.add(Restrictions.eq("userRule.status", QuotationAssignUserRulePO.STATUS_AVAILABLE_INT));

		// 按预算员的最后完成时间升序排序
		criteria.addOrder(Order.asc("userRule.lastFinishTime"));

		return criteria.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<QuotationAssignUserRuleItemPO> queryAvailableItemsForCrossCompanyAssign(int company, Integer department, Short decorationType) throws FLException {
		Criteria criteria = createCriteria(QuotationAssignUserRuleItemPO.class);

		// 关联
		criteria.createAlias("userRule", "userRule");
		criteria.createAlias("userRule.user", "user");

		// 按公司筛选
		criteria.createAlias("company", "company");
		criteria.add(Restrictions.eq("company.cid", company));

		// 部门匹配
		criteria.createAlias("department", "dept", CriteriaSpecification.LEFT_JOIN);
		if (department != null) {
			criteria.add(Restrictions.or(
				Restrictions.eq("dept.did", department),
				Restrictions.isNull("department")));
		}

		// 装修类型匹配
		if (decorationType != null) {
			criteria.add(Restrictions.or(
				Restrictions.eq("supportedType", QuotationAssignUserRulePO.SUPPORTED_TYPE_ALL_INT),
				Restrictions.eq("supportedType", (int) decorationType.shortValue())));
		}

		// 预算员状态：仅待分配
		criteria.add(Restrictions.eq("userRule.status", QuotationAssignUserRulePO.STATUS_AVAILABLE_INT));

		// 跨公司验证：排除在其他公司存在非"待分配"状态的预算员
		// 使用 SQLRestriction 避免 Hibernate 3 中 DetachedCriteria eqProperty 跨层引用外层 alias 导致的
		// MappingException: unknown entity: null
		criteria.add(Restrictions.sqlRestriction(
			"not exists (" +
			"  select 1 from quotation.quotationassignuserrule t " +
			"  inner join communion.user u2 on t.uid = u2.uid " +
			"  where u2.userId = (" +
			"    select u3.userId from quotation.quotationassignuserrule r " +
			"    inner join communion.user u3 on r.uid = u3.uid " +
			"    where r.qaurid = {alias}.qaurid" +
			"  ) and t.status <> " + QuotationAssignUserRulePO.STATUS_AVAILABLE_INT +
			")"
		));

		// 按预算员的最后完成时间升序排序
		criteria.addOrder(Order.asc("userRule.lastFinishTime"));

		return criteria.list();
	}

	@Override
	public void deleteQuotationAssignUserRuleItemByRuleId(long qaurid) throws FLException {
		List<QuotationAssignUserRuleItemPO> items = queryQuotationAssignUserRuleItemByRuleId(qaurid);
		for (QuotationAssignUserRuleItemPO item : items) {
			delete(item);
		}
	}
}
