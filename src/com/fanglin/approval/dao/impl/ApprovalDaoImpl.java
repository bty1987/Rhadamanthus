/**
 * @File Name		: ApprovalDaoImpl.java
 * @Package   	: com.fanglin.approval.dao.impl
 * @Version		: 1.0
 * @Date			: 2015-10-25
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.approval.dao.impl;

import java.math.BigInteger;
import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.approval.dao.ApprovalDao;
import com.fanglin.approval.po.ApprovalPO;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

@Repository("approvalDao")
public class ApprovalDaoImpl extends DaoImpl<ApprovalPO> implements ApprovalDao {

	public ApprovalDaoImpl() {
		super(ApprovalPO.class);
	}

	@Override
	public List<ApprovalPO> pageApproval(Paging paging, List<Filter> filters, int company) {

		PagingQuery<ApprovalPO> query = pagingQuery(paging, ApprovalPO.class);

		query.add(Restrictions.eq("company", company));

		queryFilterExcute(filters, query);

		query.desc("aid");

		return query.list();
	}

	@Override
	public List<ApprovalPO> pageApprovalForReceive(Paging paging, List<Filter> filters, String userId, int company) {

		PagingQuery<ApprovalPO> query = pagingQuery(paging, ApprovalPO.class);

		query.alias("receiver", "receiver");
		query.add(Restrictions.eq("receiver.userId", userId));
		query.add(Restrictions.eq("company", company));

		if (filters != null) {
			queryFilterExcute(filters, query);
		}

		query.asc("status");
		query.desc("createTime");

		return query.list();
	}

	@Override
	public List<ApprovalPO> pageApprovalForSend(Paging paging, List<Filter> filters, String userId, int company) {

		PagingQuery<ApprovalPO> query = pagingQuery(paging, ApprovalPO.class);

		query.alias("sender", "sender");
		query.add(Restrictions.eq("sender.userId", userId));
		query.add(Restrictions.eq("company", company));

		if (filters != null) {
			queryFilterExcute(filters, query);
		}

		query.asc("status");
		query.desc("createTime");

		return query.list();
	}

	@Override
	public List<ApprovalPO> pageApprovalForReceiveDept(Paging paging, List<Filter> filters, int department, int company) {

		PagingQuery<ApprovalPO> query = pagingQuery(paging, ApprovalPO.class);

		query.alias("receiver", "receiver");
		query.add(Restrictions.eq("receiver.dept.did", department));
		query.add(Restrictions.eq("company", company));

		if (filters != null) {
			queryFilterExcute(filters, query);
		}

		query.desc("createTime");

		return query.list();
	}

	@Override
	public ApprovalPO queryApproval(short status, short type, String ident) {
		return (ApprovalPO) session().createCriteria(ApprovalPO.class).add(Restrictions.eq(ApprovalPO.COLUMN_TYPE_STR, type)).add(Restrictions.eq(ApprovalPO.COLUMN_IDENT_STR, ident)).add(Restrictions.eq(ApprovalPO.COLUMN_STATUS_STR, status)).setMaxResults(1).uniqueResult();
	}

	@Override
	public ApprovalPO queryApprovalByChange(List<Short> status, short type, String ident) {
		return (ApprovalPO) session().createCriteria(ApprovalPO.class).add(Restrictions.eq(ApprovalPO.COLUMN_TYPE_STR, type)).add(Restrictions.eq(ApprovalPO.COLUMN_IDENT_STR, ident)).add(Restrictions.in(ApprovalPO.COLUMN_STATUS_STR, status)).setMaxResults(1).uniqueResult();
	}

	@Override
	public ApprovalPO queryApprovalByProcessinstanceid(String processinstanceid) {
		return (ApprovalPO) session().createCriteria(ApprovalPO.class).add(Restrictions.eq(ApprovalPO.COLUMN_PROCESSINSTANCEID_STR, processinstanceid)).uniqueResult();
	}

	@Override
	public int countApprovalForInitByIdent(String ident) {

		String sql = "select count(*) from approval.approval where ident = :ident and status = 0";
		BigInteger count = (BigInteger) session().createSQLQuery(sql).setString("ident", ident).uniqueResult();

		return count.intValue();
	}

	@Override
	public int countApprovalForInitByOrderId(String orderId) {

		String sql = "select count(*) from approval.approval where orderId = :orderId and status = 0";
		BigInteger count = (BigInteger) session().createSQLQuery(sql).setString("orderId", orderId).uniqueResult();

		return count.intValue();
	}

	@Override
	public int countApprovalForReceive(short status, int ruid, int company) {

		String sql = "SELECT COUNT(*) from approval.approval where ruid = :ruid and `status` = :status and company = :company";
		BigInteger count = (BigInteger) session().createSQLQuery(sql).setShort("status", status).setInteger("ruid", ruid).setInteger("company", company).uniqueResult();

		return count.intValue();
	}

	@Override
	public int countApprovalForSend(short status, int suid, int company) {

		String sql = "SELECT COUNT(*) from approval.approval where suid = :suid and `status` = :status and company = :company";
		BigInteger count = (BigInteger) session().createSQLQuery(sql).setShort("status", status).setInteger("suid", suid).setInteger("company", company).uniqueResult();

		return count.intValue();
	}

	public void queryFilterExcute(List<Filter> filters, PagingQuery<ApprovalPO> query) {

		for (Filter filter : filters) {
			if (ApprovalPO.COLUMN_ORDERID_STR.equals(filter.getField())) {
				query.add(query.getCriterion(ApprovalPO.COLUMN_ORDERID_STR, String.valueOf(filter.getData()), filter.getOp()));
			} else if ("status".equals(filter.getField())) {
				query.add(query.getCriterion("status", Short.valueOf(filter.getData()), filter.getOp()));
			} else if ("type".equals(filter.getField())) {
				query.add(query.getCriterion("type", Short.valueOf(filter.getData()), filter.getOp()));
			} else if ("senderName".equals(filter.getField())) {
				query.alias("sender", "sender");
				query.add(query.getCriterion("sender.userId", filter));
			} else if ("receiverName".equals(filter.getField())) {
				query.alias("receiver", "receiver");
				query.add(query.getCriterion("receiver.userId", filter));
			} else if ("dateRange".equals(filter.getField())) {
				query.timeranges(ApprovalPO.COLUMN_CREATETIME_STR, ApprovalPO.COLUMN_CREATETIME_STR, filter.getData());
			} else if (ApprovalPO.COLUMN_CREATETIME_STR.equals(filter.getField())) {
				query.timeranges(ApprovalPO.COLUMN_CREATETIME_STR, ApprovalPO.COLUMN_CREATETIME_STR, filter.getData());
			} else if (ApprovalPO.COLUMN_APPROVALTIME_STR.equals(filter.getField())) {
				query.timeranges(ApprovalPO.COLUMN_APPROVALTIME_STR, ApprovalPO.COLUMN_CREATETIME_STR, filter.getData());
			}
		}

	}
}
