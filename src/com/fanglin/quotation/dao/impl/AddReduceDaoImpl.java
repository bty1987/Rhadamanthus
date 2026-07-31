/**
 * @File Name		: AddReduceDaoImpl.java
 * @Package   	: com.fanglin.dao.impl.constructionSchedule
 * @Version		: 1.0
 * @Date			: 2014-9-22
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.quotation.dao.impl;

import java.math.BigInteger;
import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.decoration.dao.impl.DecorationDaoImpl;
import com.fanglin.quotation.dao.AddReduceDao;
import com.fanglin.quotation.po.AddReduceDO;
import com.fanglin.quotation.po.AddReducePO;
import com.fanglin.utils.Paging;

@Repository("addReduceDao")
public class AddReduceDaoImpl extends DaoImpl<AddReducePO> implements AddReduceDao {

	public AddReduceDaoImpl() {
		super(AddReducePO.class);
	}

	@Override
	public List<AddReduceDO> pageAddReduce(Paging paging, List<Filter> filters, Integer company) throws FLException {

		PagingQuery<AddReduceDO> query = pagingQuery(paging, AddReduceDO.class);

		queryFilterExcute(query, filters, AddReduceDO.class);

		query.desc("createTime");

		return query.list();
	}

	@Override
	public List<AddReducePO> pageAddReduce(Paging paging, List<Filter> filters, String orderId) throws FLException {

		PagingQuery<AddReducePO> query = pagingQuery(paging, AddReducePO.class);

		query.add(query.getCriterion(AddReducePO.COLUMN_ORDERID_STR, orderId, "eq"));

		queryFilterExcute(query, filters, AddReducePO.class);

		query.desc("createTime");

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<AddReducePO> queryAddReduce(String orderId, List<Short> statuses) {

		Criteria query = session().createCriteria(AddReducePO.class).add(Restrictions.eq(AddReducePO.COLUMN_ORDERID_STR, orderId));

		if (statuses != null && statuses.size() != 0) {
			query.add(Restrictions.in(AddReducePO.COLUMN_STATUS_STR, statuses));
		}

		return query.list();
	}

	public List<AddReducePO> queryAddReduceByOrderId(String orderId) {
		return queryAddReduce(orderId, null);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<AddReducePO> queryAddReduce(Long dpId) {
		return createCriteria(AddReducePO.class).add(Restrictions.eq("dpId", dpId)).list();
	}

	@Override
	public int countAddReduceByOrderId(String orderId) {

		String sql = "select count(*) from quotation.addreduce where orderId = :orderId";
		BigInteger count = (BigInteger) session().createSQLQuery(sql).setString("orderId", orderId).uniqueResult();

		return count.intValue();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters, Class<?> clazz) throws FLException {

		if (filters == null || filters.size() == 0) return;

		// AddReduceDO 拥有 decoration @ManyToOne 关联, 委托 DecorationDaoImpl 统一处理 decoration.* 系列筛选
		// 与 ConstructionDaoImpl / PaymentDaoImpl / SalesDaoImpl 等模块保持一致写法
		if (AddReduceDO.class.equals(clazz)) {
			DecorationDaoImpl.queryFilterExcute(query, filters, "decoration");
		}

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if (AddReducePO.COLUMN_ORDERID_STR.equals(field)) {

				// AddReduceDO 的 orderId filter 已由上面 DecorationDaoImpl 处理 (字段名 decoration.orderId)
				// 走到此分支说明是用 AddReducePO 标量查询
				if (AddReducePO.class.equals(clazz)) {
					query.add(query.getCriterion(AddReducePO.COLUMN_ORDERID_STR, data, op));
				}
			} else if (AddReducePO.COLUMN_STATUS_STR.equals(field)) {
				query.add(query.getCriterion(field, Short.parseShort(data), op));
			} else if ("statuses".equals(field)) {
				query.add(query.getCriterion("status", filter.getShorts(), "in"));
			} else if (AddReducePO.COLUMN_TYPE_STR.equals(field)) {
				query.add(query.getCriterion(field, Short.parseShort(data), op));
			} else if (AddReducePO.COLUMN_PAYTYPE_STR.equals(field)) {
				query.add(query.getCriterion(field, Short.parseShort(data), op));
			} else if (AddReducePO.COLUMN_ATTTYPE_STR.equals(field)) {
				query.add(query.getCriterion(field, Short.parseShort(data), op));
			} else if ("isAffirm".equals(field)) {
				query.add(query.getCriterion(field, Short.parseShort(data), op));
			} else if ("isSalary".equals(field)) {
				query.add(query.getCriterion(field, Short.parseShort(data), op));
			} else if ("createTime".equals(field)) {
				query.timeranges("createTime", "createTime", data);
			} else if ("affirmTime".equals(field)) {
				query.timeranges("affirmTime", "affirmTime", data);
			} else if ("sendTime".equals(field)) {
				query.timeranges("sendTime", "sendTime", data);
			} else if ("constructionNodeId".equals(field)) {
				query.add(query.getCriterion("constructionNode.cnid", Long.valueOf(data), op));
			}
		}
	}

}
