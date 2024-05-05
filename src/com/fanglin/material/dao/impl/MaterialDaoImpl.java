/**
 * @File Name		: MaterialDaoImpl.java
 * @Package   	: com.fanglin.dao.impl.materialOrder
 * @Version		: 1.0
 * @Date			: 2014-10-7
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.material.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.material.dao.MaterialDao;
import com.fanglin.material.po.MaterialPO;
import com.fanglin.utils.Paging;

@Repository("materialDao")
public class MaterialDaoImpl extends DaoImpl<MaterialPO> implements MaterialDao {

	public MaterialDaoImpl() {
		super(MaterialPO.class);
	}

	@Override
	public List<MaterialPO> pageMaterial(Paging paging, List<Filter> filters) {

		PagingQuery<MaterialPO> query = pagingQuery(paging, MaterialPO.class);

		query.add(query.getCriterion(MaterialPO.COLUMN_ORDERID_STR, "", "ne"));
		query.add(query.getCriterion(MaterialPO.COLUMN_STATUS_STR, MaterialPO.STATUS_TYPE_DELETE_INT, "ne"));

		queryFilterExcute(query, filters);

		return query.list();
	}

	@Override
	public List<MaterialPO> pageMaterialByOrderId(Paging paging, List<Filter> filters, String orderId, String userId) {

		PagingQuery<MaterialPO> query = pagingQuery(paging, MaterialPO.class);

		query.alias("salesman", "salesman");
		query.alias("instorer", "instorer");
		query.alias("materialer", "materialer");

		query.add(query.getCriterion(MaterialPO.COLUMN_ORDERID_STR, orderId, "eq"));
		query.add(query.getCriterion(MaterialPO.COLUMN_STATUS_STR, MaterialPO.STATUS_TYPE_DELETE_INT, "ne"));
		query.add(Restrictions.or(Restrictions.or(query.getCriterion(MaterialPO.COLUMN_SALESMANID_STR, userId, "eq"), query.getCriterion(MaterialPO.COLUMN_INSTOREID_STR, userId, "eq")), query.getCriterion(MaterialPO.COLUMN_MATERIALID_STR, userId, "eq")));

		queryFilterExcute(query, filters);

		return query.list();
	}

	@Override
	public List<MaterialPO> pageMaterialForAdvance(Paging paging, List<Filter> filters, String orderId) {

		PagingQuery<MaterialPO> query = pagingQuery(paging, MaterialPO.class);

		query.add(query.getCriterion(MaterialPO.COLUMN_ORDERID_STR, orderId, "eq"));
		query.add(query.getCriterion(MaterialPO.COLUMN_STATUS_STR, MaterialPO.STATUS_TYPE_DELETE_INT, "ne"));

		queryFilterExcute(query, filters);

		return query.list();
	}

	@Override
	public List<MaterialPO> pageMaterialPreBalance(Paging paging, List<Filter> filters, int company) {

		PagingQuery<MaterialPO> query = pagingQuery(paging, MaterialPO.class);

		query.add(query.getCriterion("company", company, "eq"));
		query.add(query.getCriterion(MaterialPO.COLUMN_STATUS_STR, MaterialPO.STATUS_TYPE_INIT_INT, "eq"));
		query.add(query.getCriterion(MaterialPO.COLUMN_FULLSTATUS_STR, MaterialPO.FINANCE_STATUS_TYPE_CONFIRM_INT, "eq"));

		queryFilterExcute(query, filters);

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<MaterialPO> queryMaterialByOrderId(String orderId) {
		return session().createCriteria(MaterialPO.class).add(Restrictions.eq(MaterialPO.COLUMN_ORDERID_STR, orderId)).list();
	}

	@Override
	public MaterialPO queryMaterialByNo(String msoNo) {
		return (MaterialPO) session().createCriteria(MaterialPO.class).add(Restrictions.eq(MaterialPO.COLUMN_NO_STR, msoNo)).add(Restrictions.ne(MaterialPO.COLUMN_STATUS_STR, MaterialPO.STATUS_TYPE_DELETE_INT)).uniqueResult();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<Object> queryMaterialActivityByTotal(String orderId) {

		String sql = "select ac.`name`,sum(pm.refermoney) from information.activity ac,material.material mm,payment.materialpayment pm where mm.orderId = :orderId and mm.mid=pm.mid and pm.paymentstatus in (1,2) and ac.aId=mm.activityId group by mm.activityId";

		List<Object> uniqueResult = session().createSQLQuery(sql).setString("orderId", orderId).list();

		return uniqueResult;
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null) return;

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			query.alias("instorer", "instorer");
			query.alias("customer", "customer");
			query.alias("house", "house");
			query.alias("house.village", "village");
			query.alias("salesman", "salesman");

			if (MaterialPO.COLUMN_NO_STR.equals(field)) {
				query.add(query.getCriterion(field, data, op));
			} else if (MaterialPO.COLUMN_INSTOREID_STR.equals(field)) {
				query.add(query.getCriterion("instorer.userId", data, op));
			} else if (MaterialPO.COLUMN_MATERIALBRAND_STR.equals(field)) {
				query.add(query.getCriterion(MaterialPO.COLUMN_MATERIALBRAND_STR, data, op));
			} else if ("customer.cid".equals(field)) {
				query.add(query.getCriterion("customer.cid", data, op));
			} else if (MaterialPO.COLUMN_VILLAGE_ID_STR.equals(field)) {
				query.add(query.getCriterion("village.no", data, op));
			} else if (MaterialPO.COLUMN_HOUSE_NUMBER__STR.equals(field)) {
				query.add(query.getCriterion("house.houseNumber", data, op));
			} else if (MaterialPO.COLUMN_ORDERID_STR.equals(field)) {
				query.add(query.getCriterion(field, data, op));
			} else if (MaterialPO.COLUMN_SALESMAN_STR.equals(field)) {
				query.add(query.getCriterion("salesman.userId", data, op));
			} else if (MaterialPO.COLUMN_FULLCOLLECTTIME_RANGE_STR.equals(field)) {
				query.timeranges(MaterialPO.COLUMN_FULLPAYTIME_STR, data);
			}
		}
	}

}
