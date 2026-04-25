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
import com.fanglin.quotation.dao.QuotationAssignUserRuleItemDao;
import com.fanglin.quotation.po.QuotationAssignUserRuleItemPO;
import com.fanglin.quotation.po.QuotationAssignUserRulePO;
import com.fanglin.utils.Paging;

@Repository("quotationAssignUserRuleItemDao")
public class QuotationAssignUserRuleItemDaoImpl extends DaoImpl<QuotationAssignUserRuleItemPO> implements QuotationAssignUserRuleItemDao {

	public QuotationAssignUserRuleItemDaoImpl() {
		super(QuotationAssignUserRuleItemPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<QuotationAssignUserRuleItemPO> queryQuotationAssignUserRuleItemByRuleId(long qaurid) throws FLException {
		return createCriteria(QuotationAssignUserRuleItemPO.class).createAlias("userRule", "userRule").add(Restrictions.eq("userRule.qaurid", qaurid)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<QuotationAssignUserRuleItemPO> queryQuotationAssignUserRuleItemByUserId(String userId) throws FLException {
		return createCriteria(QuotationAssignUserRuleItemPO.class).createAlias("userRule", "userRule").createAlias("userRule.user", "user").add(Restrictions.eq("user.userId", userId)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<QuotationAssignUserRuleItemPO> queryQuotationAssignUserRuleItemByUserIdAndCompany(String userId, int company) throws FLException {
		return createCriteria(QuotationAssignUserRuleItemPO.class).createAlias("userRule", "userRule").createAlias("userRule.user", "user").createAlias("company", "company").add(Restrictions.eq("user.userId", userId)).add(Restrictions.eq("company.cid", company)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<QuotationAssignUserRuleItemPO> queryAvailableItemsForAssign(int company, Integer department, Short decorationType) throws FLException {
		Criteria criteria = createCriteria(QuotationAssignUserRuleItemPO.class);
		criteria.createAlias("userRule", "userRule");
		criteria.createAlias("company", "company");

		// 预算员状态：仅待分配 + 空闲
		criteria.add(Restrictions.eq("userRule.status", QuotationAssignUserRulePO.STATUS_AVAILABLE_INT));
		criteria.add(Restrictions.eq("userRule.currentTaskCount", 0));

		// 公司匹配
		criteria.add(Restrictions.eq("company.cid", company));

		// 部门匹配：指定部门 OR 全公司（department IS NULL）
		criteria.createAlias("department", "dept", CriteriaSpecification.LEFT_JOIN);
		if (department != null) {
			criteria.add(Restrictions.or(Restrictions.eq("dept.did", department), Restrictions.isNull("department")));
		}

		// 装修类型匹配：通用(-1) 或 指定类型
		if (decorationType != null) {
			criteria.add(Restrictions.or(Restrictions.eq("supportedType", QuotationAssignUserRulePO.SUPPORTED_TYPE_ALL_INT), Restrictions.eq("supportedType", (int) decorationType.shortValue())));
		}

		// 按预算员的最后完成时间升序排序
		criteria.addOrder(Order.asc("userRule.lastFinishTime"));

		return criteria.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<QuotationAssignUserRuleItemPO> queryAvailableItemsForCrossCompanyAssign(int company, Integer department, Short decorationType) throws FLException {
		Criteria criteria = createCriteria(QuotationAssignUserRuleItemPO.class);
		criteria.createAlias("userRule", "userRule");
		criteria.createAlias("company", "company");

		// 预算员状态：仅待分配 + 空闲
		criteria.add(Restrictions.eq("userRule.status", QuotationAssignUserRulePO.STATUS_AVAILABLE_INT));
		criteria.add(Restrictions.eq("userRule.currentTaskCount", 0));

		// 公司匹配
		criteria.add(Restrictions.eq("company.cid", company));

		// 部门匹配：指定部门 OR 全公司（department IS NULL）
		criteria.createAlias("department", "dept", CriteriaSpecification.LEFT_JOIN);
		if (department != null) {
			criteria.add(Restrictions.or(Restrictions.eq("dept.did", department), Restrictions.isNull("department")));
		}

		// 装修类型匹配：通用(-1) 或 指定类型
		if (decorationType != null) {
			criteria.add(Restrictions.or(Restrictions.eq("supportedType", QuotationAssignUserRulePO.SUPPORTED_TYPE_ALL_INT), Restrictions.eq("supportedType", (int) decorationType.shortValue())));
		}

		// 跨公司排除：该用户不存在任何非待分配状态的规则
		// 子查询完全自包含，通过 userRule.user 关联，不引用外层 alias
		DetachedCriteria busyUsers = DetachedCriteria.forClass(QuotationAssignUserRulePO.class, "busyRule");
		busyUsers.createAlias("busyRule.user", "busyUser");
		busyUsers.add(Restrictions.ne("busyRule.status", QuotationAssignUserRulePO.STATUS_AVAILABLE_INT));
		busyUsers.setProjection(Projections.property("busyUser.uid"));
		criteria.add(Subqueries.propertyNotIn("userRule.user.uid", busyUsers));

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

	@Override
	public List<QuotationAssignUserRuleItemPO> pageQuotationAssignUserRuleItem(Paging paging, List<Filter> filters) throws FLException {
		PagingQuery<QuotationAssignUserRuleItemPO> query = pagingQuery(paging, QuotationAssignUserRuleItemPO.class);

		// 预先 alias，避免 N+1
		query.alias("userRule", "userRule");
		query.alias("userRule.user", "user");
		query.alias("company", "companyAlias");

		if (filters != null) {
			for (Filter filter : filters) {
				String field = filter.getField();
				String data = filter.getData();
				String op = filter.getOp();
				if ("company".equals(field)) {
					query.add(query.getCriterion("companyAlias.cid", Integer.valueOf(data), op));
				} else if ("supportedType".equals(field)) {
					query.add(query.getCriterion("supportedType", Integer.valueOf(data), op));
				} else if ("userName".equals(field)) {
					query.add(query.getCriterion("user.currentName", data, op));
				} else if ("qaurid".equals(field)) {
					query.add(query.getCriterion("userRule.qaurid", Long.valueOf(data), op));
				}
			}
		}

		query.desc("createTime");
		return query.list();
	}
}
