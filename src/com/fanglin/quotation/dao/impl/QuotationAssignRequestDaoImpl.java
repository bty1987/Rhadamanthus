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

import org.hibernate.SQLQuery;
import org.springframework.stereotype.Repository;

import com.fanglin.core.vo.Filter;
import com.fanglin.core.dao.impl.DaoImpl;
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

		// 按公司筛选
		if (company != null) {
			query.add(query.getCriterion("company", company, "eq"));
		}

		// 按优先级升序、请求时间升序排序
		query.asc("priority");
		query.asc("requestTime");

		return query.list();
	}

	@Override
	public QuotationAssignRequestPO queryPendingRequestByOrderId(String orderId) {
		String hql = "from QuotationAssignRequestPO where orderId = :orderId and status = " + QuotationAssignRequestPO.STATUS_PENDING_INT;
		return (QuotationAssignRequestPO) session().createQuery(hql)
				.setString("orderId", orderId)
				.uniqueResult();
	}

	@Override
	public QuotationAssignRequestPO queryAssignedRequestByOrderId(String orderId) {
		String hql = "from QuotationAssignRequestPO where orderId = :orderId and status = " + QuotationAssignRequestPO.STATUS_ASSIGNED_INT;
		return (QuotationAssignRequestPO) session().createQuery(hql)
				.setString("orderId", orderId)
				.uniqueResult();
	}

	@Override
	public int countCurrentTasksByUid(int uid) {
		// 需要关联 quotationassignuserrule 表来统计当前任务数
		String sql = "SELECT COUNT(*) " +
				     "FROM quotation.quotationassignrequest r " +
				     "INNER JOIN quotation.quotationassignuserrule u ON u.uid = :uid " +
				     "  AND r.company = u.company " +
				     "  AND (r.department IS NULL OR u.department IS NULL OR r.department = u.department) " +
				     "WHERE r.status = " + QuotationAssignRequestPO.STATUS_ASSIGNED_INT;

		SQLQuery query = session().createSQLQuery(sql);
		query.setInteger("uid", uid);

		Number count = (Number) query.uniqueResult();
		return count != null ? count.intValue() : 0;
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<QuotationAssignRequestPO> queryPendingQueue(int company, Integer department, short decorationType) {
		String hql = "from QuotationAssignRequestPO " +
				     "where company = :company " +
				     "and status = " + QuotationAssignRequestPO.STATUS_PENDING_INT + " " +
				     "and decorationType = :decorationType ";

		if (department != null) {
			hql += "and (department is null or department = :department) ";
		}

		hql += "order by priority asc, requestTime asc";

		org.hibernate.Query query = session().createQuery(hql);
		query.setInteger("company", company);
		query.setShort("decorationType", decorationType);

		if (department != null) {
			query.setInteger("department", department);
		}

		return query.list();
	}

	@Override
	public int updateStatusToAssigned(long qarid) {
		String sql = "update quotation.quotationassignrequest " +
				     "set status = " + QuotationAssignRequestPO.STATUS_ASSIGNED_INT + ", assignTime = CURRENT_TIMESTAMP " +
				     "where qarid = :qarid";

		SQLQuery query = session().createSQLQuery(sql);
		query.setLong("qarid", qarid);

		return query.executeUpdate();
	}
}
