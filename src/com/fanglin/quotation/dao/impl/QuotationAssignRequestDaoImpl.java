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

	private static final int QUEUE_MAX_RESULTS_INT = 50;

	private static final int QUEUE_ALL_MAX_RESULTS_INT = 100;

	/**
	 * 构造函数
	 */
	public QuotationAssignRequestDaoImpl() {
		super(QuotationAssignRequestPO.class);
	}

	@Override
	public List<QuotationAssignRequestPO> pageQuotationAssignRequest(Paging paging, List<Filter> filters, Integer company) {

		PagingQuery<QuotationAssignRequestPO> query = pagingQuery(paging, QuotationAssignRequestPO.class);

		// 按公司筛选（company=0或null表示不过滤）
		if (company != null && company > 0) {
			query.add(query.getCriterion("company.cid", company, "eq"));
		}

		// 处理动态过滤条件
		queryFilterExcute(query, filters);

		// 按主键倒序
		query.desc("qarid");

		return query.list();
	}

	@Override
	public List<QuotationAssignRequestPO> pageQuotationAssignRequestByUserId(Paging paging, List<Filter> filters, String userId) {

		PagingQuery<QuotationAssignRequestPO> query = pagingQuery(paging, QuotationAssignRequestPO.class);

		// 直接按userId过滤（user关联对象的userId字段）
		query.add(query.getCriterion("user.userId", userId, "eq")).add(query.getCriterion("status", QuotationAssignRequestPO.STATUS_ASSIGNED_INT, "ne"));

		// 处理动态过滤条件
		queryFilterExcute(query, filters);

		// 按主键倒序
		query.desc("qarid");

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
			} else if ("userName".equals(field)) {
				// 预算员姓名：模糊匹配（user关联对象的currentName字段）
				query.alias("user", "user");
				query.add(query.getCriterion("user.currentName", data, op));
			} else if ("requestUserName".equals(field)) {
				// 请求人姓名：模糊匹配（requestUser关联对象的currentName字段）
				query.alias("requestUser", "requestUser");
				query.add(query.getCriterion("requestUser.currentName", data, op));
			} else if ("assignTime".equals(field)) {
				// 分配时间：范围查询
				query.timeranges("assignTime", data);
			} else if ("requestTime".equals(field)) {
				// 请求时间：范围查询
				query.timeranges("requestTime", data);
			} else if ("finishTime".equals(field)) {
				// 完成时间：范围查询
				query.timeranges("finishTime", data);
			} else if ("company".equals(field)) {
				// 公司：通过filter动态筛选（支持跨公司查询）
				query.add(query.getCriterion("company.cid", Integer.valueOf(data), op));
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

		// 按主键倒序
		criteria.addOrder(org.hibernate.criterion.Order.desc("qarid"));

		// 限制结果集数量，避免一次性加载过多数据
		criteria.setMaxResults(QUEUE_MAX_RESULTS_INT);

		return criteria.list();
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<QuotationAssignRequestPO> queryQuotationAssignRequestForQueue(List<Integer> companies) {
		org.hibernate.Criteria criteria = createCriteria(QuotationAssignRequestPO.class).add(Restrictions.in("company.cid", companies)).add(Restrictions.eq("status", QuotationAssignRequestPO.STATUS_PENDING_INT));

		// 按主键倒序
		criteria.addOrder(org.hibernate.criterion.Order.desc("qarid"));

		criteria.setMaxResults(QUEUE_MAX_RESULTS_INT);

		return criteria.list();
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<QuotationAssignRequestPO> queryQuotationAssignRequestForQueueAll() {
		org.hibernate.Criteria criteria = createCriteria(QuotationAssignRequestPO.class).add(Restrictions.eq("status", QuotationAssignRequestPO.STATUS_PENDING_INT));

		// 按主键倒序
		criteria.addOrder(org.hibernate.criterion.Order.desc("qarid"));

		criteria.setMaxResults(QUEUE_ALL_MAX_RESULTS_INT);

		return criteria.list();
	}

	@Override
	public int countQuotationAssignRequest(int uid) {
		// 统计该预算员进行中的任务数量（排除已完成 status=3）
		org.hibernate.Criteria criteria = createCriteria(QuotationAssignRequestPO.class).add(Restrictions.lt("status", QuotationAssignRequestPO.STATUS_COMPLETED_INT)).createAlias("user", "u").add(Restrictions.eq("u.uid", uid));

		Number count = (Number) criteria.setProjection(Projections.rowCount()).uniqueResult();
		return count != null ? count.intValue() : 0;
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<Object[]> countQuotationAssignRequestGroupByUid() {
		// 批量统计所有预算员进行中任务数（status < 3），按 uid 分组
		// 一次查询替代循环内逐个 count，消除 N+1
		org.hibernate.Criteria criteria = createCriteria(QuotationAssignRequestPO.class).add(Restrictions.lt("status", QuotationAssignRequestPO.STATUS_COMPLETED_INT)).createAlias("user", "u");

		// 投影：分组键 uid + 计数，结果每行 [uid, count]
		org.hibernate.criterion.ProjectionList projectionList = Projections.projectionList();
		projectionList.add(Projections.groupProperty("u.uid"));
		projectionList.add(Projections.rowCount());

		criteria.setProjection(projectionList);

		return criteria.list();
	}

}
