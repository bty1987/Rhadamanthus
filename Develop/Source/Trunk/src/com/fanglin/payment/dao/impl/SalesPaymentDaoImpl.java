package com.fanglin.payment.dao.impl;

import java.math.BigInteger;
import java.sql.Timestamp;
import java.util.Date;
import java.util.List;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;
import com.fanglin.payment.dao.SalesPaymentDao;
import com.fanglin.payment.po.SalesPaymentPO;

@Repository("salesPaymentDao")
public class SalesPaymentDaoImpl extends DaoImpl<SalesPaymentPO> implements SalesPaymentDao {

	public SalesPaymentDaoImpl(){
		super(SalesPaymentPO.class);
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<SalesPaymentPO> querySalesPaymentsBySid(long sid)
	{
		return session().createCriteria(SalesPaymentPO.class).createAlias("sales", "sales").add(Restrictions.eq("sales.sid", Long.valueOf(sid))).list();
	}

	@Override
	public int countSalesPaymentBySid(long sid) {

		String sql = "select count(*) from inventory.salespayment where sid =:sid";
		BigInteger num = (BigInteger)session().createSQLQuery(sql).setLong("sid", sid).uniqueResult();
		return num.intValue();
	}

	@Override
	public int countSalesPaymentBySidAType(Long sid,Short type) {

		String sql = "select count(*) from inventory.salespayment where sid =:sid and type =:type";
		BigInteger num = (BigInteger)session().createSQLQuery(sql).setLong("sid", sid).setShort("type", type).uniqueResult();
		return num.intValue();
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<SalesPaymentPO> querySalesPaymentForNotInitBySrid(long srid) {
		return session().createCriteria(SalesPaymentPO.class).createAlias("salesReceipt", "salesReceipt").add(Restrictions.eq("salesReceipt.srId", srid)).add(Restrictions.sqlRestriction(" status!=0")).list();
	}

	@Override
	public List<SalesPaymentPO> pageSalesPaymentForConfirm(Paging paging, List<Filter> filters) {

		PagingQuery<SalesPaymentPO> query = pagingQuery(paging, SalesPaymentPO.class);

		queryFilterExecute(query, filters);

		return query.list();
	}

	@Override
	public List<SalesPaymentPO> pageSalesPaymentForCollect(Paging paging, List<Filter> filters) {

		PagingQuery<SalesPaymentPO> query = pagingQuery(paging, SalesPaymentPO.class);

		queryFilterExecute(query, filters);

		return query.list();
	}

	@Override
	public List<SalesPaymentPO> pageSalesPaymentForInit(Paging paging, List<Filter> filters) {

		PagingQuery<SalesPaymentPO> query = pagingQuery(paging, SalesPaymentPO.class);

		queryFilterExecute(query, filters);

		return query.list();
	}

	@Override
	public List<SalesPaymentPO> pageSalesPaymentForNotInit(Paging paging, List<Filter> filters) {

		PagingQuery<SalesPaymentPO> query = pagingQuery(paging, SalesPaymentPO.class);

		queryFilterExecute(query, filters);

		return query.list();
	}

	private void queryFilterExecute(PagingQuery<?> query, List<Filter> filters){

		if(filters != null && filters.size() > 0){

			for(Filter filter: filters){

				String field = filter.getField();
				String data = filter.getData();
				String op = filter.getOp();

				query.alias("sales", "sales");
				query.alias("sales.salesman", "salesman");
				query.alias("sales.village", "village");

				if("sid".equals(field)){
					query.add(query.getCriterion(SalesPaymentPO.COLUMN_SALES_ORDERID_STR, data, op));
				}else if("no".equals(field)){
					query.add(query.getCriterion(SalesPaymentPO.COLUMN_SALES_NO_STR, data, op));
				}else if("userName".equals(field)){
					query.add(query.getCriterion(SalesPaymentPO.COLUMN_SALES_SALESMAN_USERNAME_STR, data, op));
				}else if("villageName".equals(field)){
					query.add(query.getCriterion(SalesPaymentPO.COLUMN_SALES_VILLAGE_VILLAGENAME_STR, data, op));
				}else if("status".equals(field)){
					query.add(query.getCriterion(field, Short.valueOf(data), op));
				}else if("collectTime".equals(field)){
					//因srId第一次为NULL 所以在链接时放在这里
					query.alias("salesReceipt","salesReceipt");

					String sTime = data + " 00:00:00";
					String eTime = data + " 23:59:59";

					Date sdate = DateUtil.parseDate(sTime, "yyyy-MM-dd HH:mm:ss");
					Date edate = DateUtil.parseDate(eTime, "yyyy-MM-dd HH:mm:ss");

					Timestamp stimestamp = DateUtil.getDateToTimestamp(sdate);
					Timestamp etimestamp = DateUtil.getDateToTimestamp(edate);

					query.add(query.getCriterion(SalesPaymentPO.COLUMN_COLLECTTIME_STR, stimestamp, "ge"));
					query.add(query.getCriterion(SalesPaymentPO.COLUMN_COLLECTTIME_STR, etimestamp, "le"));
				}else if("confirmTime".equals(field)){

					query.alias("salesReceipt","salesReceipt");

					String sTime = data + " 00:00:00";
					String eTime = data + " 23:59:59";

					Date sdate = DateUtil.parseDate(sTime, "yyyy-MM-dd HH:mm:ss");
					Date edate = DateUtil.parseDate(eTime, "yyyy-MM-dd HH:mm:ss");

					Timestamp stimestamp = DateUtil.getDateToTimestamp(sdate);
					Timestamp etimestamp = DateUtil.getDateToTimestamp(edate);

					query.add(query.getCriterion(SalesPaymentPO.COLUMN_CONFIRMTIME_STR, stimestamp, "ge"));
					query.add(query.getCriterion(SalesPaymentPO.COLUMN_CONFIRMTIME_STR, etimestamp, "le"));
				}
			}
		}
	}

}
