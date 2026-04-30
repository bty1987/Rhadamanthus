/**
 * @File Name     : QuotationAssignRequestDaoImpl.java
 * @Package      : com.fanglin.quotation.dao.impl
 * @Version       : 1.0
 * @Date          : 2026-03-20
 * @Copyright     : Copyright Creators 2026
 * @Author        : Claude AI
 * @Describing    : 装修单预算分配请求表 DAO 实现类
 */

package com.fanglin.quotation.dao.impl;

import java.util.List;

import org.hibernate.criterion.Projections;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.quotation.dao.QuotationAssignRequestDao;
import com.fanglin.quotation.po.QuotationAssignRequestPO;
import com.fanglin.utils.Paging;

/**
 * 装修单预算分配请求表 DAO 实现类
 * 
 * @author Claude AI
 * @date 2026-03-20
 */
@Repository("quotationAssignRequestDao")
public class QuotationAssignRequestDaoImpl extends DaoImpl<QuotationAssignRequestPO> implements QuotationAssignRequestDao {

	/**
	 * 构造函数
	 */
	public QuotationAssignRequestDaoImpl() {
		super(QuotationAssignRequestPO.class);
	}

	@Override
	public List<QuotationAssignRequestPO> pageQuotationAssignRequest(Paging paging, List<Filter> filters, Integer company) {

		PagingQuery<QuotationAssignRequestPO> query = pagingQuery(paging, QuotationAssignRequestPO.class);

		// 按公司筛选（company现在是ManyToOne关联，需用company.cid匹配）
		if (company != null) {
			query.add(query.getCriterion("company.cid", company, "eq"));
		}

		// 处理动态过滤条件
		queryFilterExcute(query, filters);

		// 按优先级升序、请求时间升序排序
		query.asc("priority");
		query.asc("requestTime");

		return query.list();
	}

	/**
	 * 执行过滤条件
	 * 
	 * @param query 分页查询对象
	 * @param filters 过滤条件列表
	 */
	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null) return;

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if ("status".equals(field)) {
				// 状态：精确匹配
				query.add(query.getCriterion("status", Short.valueOf(data), op));
			} else if ("orderId".equals(field)) {
				// 装修单号：模糊匹配
				query.add(query.getCriterion("orderId", data, op));
			} else if ("uid".equals(field)) {
				// 预算员UID：精确匹配（user关联对象的uid字段）
				query.add(query.getCriterion("user.uid", Integer.valueOf(data), op));
			} else if ("userId".equals(field)) {
				// 预算员登录名：精确匹配（user关联对象的userId字段）
				query.add(query.getCriterion("user.userId", data, op));
			} else if ("company".equals(field)) {
				// 公司：已在方法参数中处理，这里跳过
				continue;
			}
		}
	}

	@Override
	public QuotationAssignRequestPO queryActiveByOrderId(String orderId) {
		return (QuotationAssignRequestPO) createCriteria(QuotationAssignRequestPO.class).add(Restrictions.eq("orderId", orderId)).add(Restrictions.lt("status", QuotationAssignRequestPO.STATUS_COMPLETED_INT)).uniqueResult();
	}

	@Override
	public QuotationAssignRequestPO queryQuotationAssignRequestForPending(String orderId) {
		return (QuotationAssignRequestPO) createCriteria(QuotationAssignRequestPO.class).add(Restrictions.eq("orderId", orderId)).add(Restrictions.eq("status", QuotationAssignRequestPO.STATUS_PENDING_INT)).uniqueResult();
	}

	@Override
	public QuotationAssignRequestPO queryQuotationAssignRequestForAssigned(String orderId) {
		return (QuotationAssignRequestPO) createCriteria(QuotationAssignRequestPO.class).add(Restrictions.eq("orderId", orderId)).add(Restrictions.eq("status", QuotationAssignRequestPO.STATUS_ASSIGNED_INT)).uniqueResult();
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<QuotationAssignRequestPO> queryQuotationAssignRequestForQueue(int company, Integer department, Short decorationType) {
		org.hibernate.Criteria criteria = createCriteria(QuotationAssignRequestPO.class).add(Restrictions.eq("company.cid", company)).add(Restrictions.eq("status", QuotationAssignRequestPO.STATUS_PENDING_INT));
		// 如果指定了部门，则匹配该部门或部门为NULL的请求
		if (department != null) {
			criteria.add(Restrictions.or(Restrictions.eq("department.did", department), Restrictions.isNull("department")));
		}

		// 如果指定了装修类型，则匹配该类型或类型为NULL的请求
		if (decorationType != null) {
			criteria.add(Restrictions.or(Restrictions.eq("decorationType", decorationType.shortValue()), Restrictions.isNull("decorationType")));
		}

		// 按优先级升序、请求时间升序排序
		criteria.addOrder(org.hibernate.criterion.Order.asc("priority"));
		criteria.addOrder(org.hibernate.criterion.Order.asc("requestTime"));

		// 限制结果集数量，避免一次性加载过多数据
		criteria.setMaxResults(50);

		return criteria.list();
	}

	@Override
	public int countQuotationAssignRequest(int uid) {
		// 统计该预算员进行中的任务数量（排除已完成 status=3）
		org.hibernate.Criteria criteria = createCriteria(QuotationAssignRequestPO.class)
			.add(Restrictions.lt("status", QuotationAssignRequestPO.STATUS_COMPLETED_INT))
			.createAlias("user", "u")
			.add(Restrictions.eq("u.uid", uid));

		Number count = (Number) criteria.setProjection(Projections.rowCount()).uniqueResult();
		return count != null ? count.intValue() : 0;
	}

}
