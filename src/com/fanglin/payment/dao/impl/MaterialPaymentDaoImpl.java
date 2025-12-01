/**
 * @File Name		: MaterialPaymentDaoImpl.java
 * @Package   	: com.fanglin.dao.impl.materialOrder
 * @Version		: 1.0
 * @Date			: 2014-10-7
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.payment.dao.impl;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.alibaba.fastjson.JSONArray;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.material.po.MaterialPO;
import com.fanglin.payment.dao.MaterialPaymentDao;
import com.fanglin.payment.po.MaterialPaymentPO;
import com.fanglin.utils.Paging;

@Repository("materialPaymentDao")
public class MaterialPaymentDaoImpl extends DaoImpl<MaterialPaymentPO> implements MaterialPaymentDao {

	public MaterialPaymentDaoImpl() {
		super(MaterialPaymentPO.class);
	}

	@Override
	public List<MaterialPaymentPO> pageMaterialPayment(Paging paging, List<Filter> filters) {

		PagingQuery<MaterialPaymentPO> query = pagingQuery(paging, MaterialPaymentPO.class);

		queryFilterExcute(query, filters);

		return query.list();
	}

	@Override
	public List<MaterialPaymentPO> queryMaterialPaymentByOrderId(List<Filter> filters) {

		PagingQuery<MaterialPaymentPO> query = pagingQuery(new Paging(), MaterialPaymentPO.class);

		queryFilterExcute(query, filters);

		query.notPaging();

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<MaterialPaymentPO> queryMaterialPaymentByOrderIdAStatus(String orderId, List<Short> paymentTypes, Short[] paymentStatus) {
		return session().createCriteria(MaterialPaymentPO.class).createAlias("material", "material").add(Restrictions.eq("orderId", orderId)).add(Restrictions.eq(MaterialPaymentPO.COLUMN_PAYMENTSTATUS_STR, paymentStatus)).add(Restrictions.in(MaterialPaymentPO.COLUMN_PAYMENTTYPE_STR, paymentTypes)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<MaterialPaymentPO> queryMaterialPaymentByMid(long mid, Short paymentStatus) {

		Criteria query = session().createCriteria(MaterialPaymentPO.class).createAlias("material", "material").add(Restrictions.eq("material.mid", mid));

		if (paymentStatus != null) {
			query.add(Restrictions.eq(MaterialPaymentPO.COLUMN_PAYMENTSTATUS_STR, paymentStatus));
		}

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<MaterialPaymentPO> queryMaterialPaymentByMids(List<Long> mids) {
		return session().createCriteria(MaterialPaymentPO.class).createAlias("material", "material").add(Restrictions.in("material.mid", mids)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<MaterialPaymentPO> queryMaterialPaymentByMidAType(long mid, Short paymentType) {
		Criteria query = session().createCriteria(MaterialPaymentPO.class).createAlias("material", "material").add(Restrictions.eq("material.mid", mid));

		if (paymentType != null) {
			query.add(Restrictions.eq(MaterialPaymentPO.COLUMN_PAYMENTTYPE_STR, paymentType));
		}

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<MaterialPaymentPO> queryMaterialPaymentByMidATypes(long mid, List<Short> paymentType) {
		return session().createCriteria(MaterialPaymentPO.class).createAlias("material", "material").add(Restrictions.eq("material.mid", mid)).add(Restrictions.in(MaterialPaymentPO.COLUMN_PAYMENTTYPE_STR, paymentType)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<MaterialPaymentPO> queryMaterialPaymentByMidATypeAStatus(long mid, Short paymentType, Short paymentStatus) {

		Criteria query = session().createCriteria(MaterialPaymentPO.class).createAlias("material", "material").add(Restrictions.eq("material.mid", mid));

		if (paymentType != null) {
			query.add(Restrictions.eq(MaterialPaymentPO.COLUMN_PAYMENTTYPE_STR, paymentType));
		}

		if (paymentStatus != null) {
			query.add(Restrictions.eq(MaterialPaymentPO.COLUMN_PAYMENTSTATUS_STR, paymentStatus));
		}

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<MaterialPaymentPO> queryMaterialPaymentForNotInitByMid(long mid) {
		return session().createCriteria(MaterialPaymentPO.class).createAlias("material", "material").add(Restrictions.eq("material.mid", mid)).add(Restrictions.ne(MaterialPaymentPO.COLUMN_PAYMENTSTATUS_STR, MaterialPaymentPO.PAYMENTSTATUS_TYPE_INIT_INT)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<MaterialPaymentPO> queryMaterialPaymentForInitByMid(long mid) {
		return session().createCriteria(MaterialPaymentPO.class).createAlias("material", "material").add(Restrictions.eq("material.mid", mid)).add(Restrictions.eq(MaterialPaymentPO.COLUMN_PAYMENTSTATUS_STR, MaterialPaymentPO.PAYMENTSTATUS_TYPE_INIT_INT)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<MaterialPaymentPO> queryMaterialPaymentForNotInitByMrId(long mrId) {
		return session().createCriteria(MaterialPaymentPO.class).createAlias("materialReceipt", "materialReceipt").add(Restrictions.eq("materialReceipt.mrId", mrId)).add(Restrictions.ne(MaterialPaymentPO.COLUMN_PAYMENTSTATUS_STR, MaterialPaymentPO.PAYMENTSTATUS_TYPE_INIT_INT)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<MaterialPaymentPO> queryMaterialPaymentByReceiptId(long mrId) {
		return session().createCriteria(MaterialPaymentPO.class).createAlias("materialReceipt", "materialReceipt").add(Restrictions.eq("materialReceipt.mrId", mrId)).list();
	}

	@Override
	public MaterialPaymentPO queryMaterialPaymentByMsoNoAType(String msoNo, Short paymentType) {
		return (MaterialPaymentPO) session().createCriteria(MaterialPaymentPO.class).createAlias("material", "material").add(Restrictions.eq(MaterialPaymentPO.COLUMN_NO_STR, msoNo)).add(Restrictions.eq(MaterialPaymentPO.COLUMN_PAYMENTTYPE_STR, paymentType)).uniqueResult();
	}

	@Override
	public int countMaterialPaymentByMidAType(long mid, Short paymentType) {

		String sql = "select count(*) from payment.materialpayment where mid =:mid and paymentType =:paymentType";
		BigInteger num = (BigInteger) session().createSQLQuery(sql).setLong("mid", mid).setInteger("paymentType", paymentType).uniqueResult();
		return num.intValue();
	}

	@Override
	public long amountMaterialPayment(String orderId) {

		String sql = "select sum(if(mp.paymenttype in (2, 3), mp.referMoney, -mp.refermoney)) from payment.materialpayment mp, material.material m where m.orderId = :orderId and m.mid = mp.mid and mp.paymentstatus != 0";
		BigDecimal sqlQuery = (BigDecimal) session().createSQLQuery(sql).setString("orderId", orderId).uniqueResult();

		return sqlQuery == null ? 0 : sqlQuery.longValue();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null) return;

		query.alias("material", "material");
		query.alias("material.house", "house");
		query.alias("house.village", "village");
		query.alias("material.salesman", "salesman");

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if (MaterialPaymentPO.COLUMN_ORDERID_STR.equals(field)) {
				query.add(query.getCriterion("material.orderId", data, op));
			} else if ("village".equals(field)) {
				query.add(query.getCriterion("village.no", data, op));
			} else if (MaterialPO.COLUMN_NO_STR.equals(field)) {
				query.add(query.getCriterion("material.no", data, op));
			} else if (MaterialPaymentPO.COLUMN_NO_STR.equals(field)) {
				query.add(query.getCriterion(field, data, op));
			} else if ("designer".equals(field)) {
				query.add(query.getCriterion("salesman.userId", data, op));
			} else if (MaterialPaymentPO.COLUMN_PAYMENTSTATUS_STR.equals(field)) {
				query.add(query.getCriterion(field, Short.valueOf(data), op));
			} else if (MaterialPaymentPO.COLUMN_COLLECTTIME_STR.equals(field)) {
				query.alias("materialReceipt", "materialReceipt");

				if ("between".equals(op)) {
					query.timeranges("materialReceipt.collectTime", "materialReceipt.collectTime", data);
				} else {
					query.add(query.getCriterion("materialReceipt.collectTime", data, op));
				}
			} else if ("confirmTime".equals(field)) {

				query.alias("materialReceipt", "materialReceipt");

				query.timeranges("materialReceipt.confirmTime", "materialReceipt.confirmTime", data);

			} else if ("company".equals(field)) {
				query.add(query.getCriterion(field, Integer.valueOf(data), op));
			} else if ("paymentType".equals(field)) {
				List<Short> type = JSONArray.parseArray(data, Short.class);
				query.add(query.getCriterion(field, type, op));
			}
		}
	}
}
