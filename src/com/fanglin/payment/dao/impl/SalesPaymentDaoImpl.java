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
	
	@Override
	public List<SalesPaymentPO> pageSalesPaymentForInit(Paging paging, List<Filter> filters) {

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
	public List<SalesPaymentPO> pageSalesPaymentForConfirm(Paging paging, List<Filter> filters) {

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

	@Override
	@SuppressWarnings("unchecked")
	public List<SalesPaymentPO> querySalesPaymentsBySid(long sid)
	{
		return session().createCriteria(SalesPaymentPO.class).createAlias("sales", "sales").add(Restrictions.eq("sales.sid", Long.valueOf(sid))).list();
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<SalesPaymentPO> querySalesPaymentBySids(List<Long> sids) {		
		return session().createCriteria(SalesPaymentPO.class).createAlias("sales", "sales").add(Restrictions.in("sales.sid", sids)).list();
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<SalesPaymentPO> querySalesPaymentForNotInitBySrid(long srid) {
		return session().createCriteria(SalesPaymentPO.class).createAlias("salesReceipt", "salesReceipt").add(Restrictions.eq("salesReceipt.srId", srid)).add(Restrictions.sqlRestriction(" status!=0")).list();
	}

	@Override
	public int countSalesPaymentBySid(long sid) {

		String sql = "select count(*) from payment.salespayment where sid =:sid";
		BigInteger num = (BigInteger)session().createSQLQuery(sql).setLong("sid", sid).uniqueResult();
		return num.intValue();
	}

	@Override
	public int countSalesPaymentBySidAType(Long sid,Short type) {

		String sql = "select count(*) from payment.salespayment where sid =:sid and type =:type";
		BigInteger num = (BigInteger)session().createSQLQuery(sql).setLong("sid", sid).setShort("type", type).uniqueResult();
		return num.intValue();
	}

	private void queryFilterExecute(PagingQuery<?> query, List<Filter> filters){

		if(filters != null && filters.size() > 0){

			for(Filter filter: filters){

				String field = filter.getField();
				String data = filter.getData();
				String op = filter.getOp();

				query.alias("sales", "sales");
				query.alias("sales.salesman", "salesman");
				query.alias("sales.house", "house");
				query.alias("house.village", "village");

				if("sid".equals(field)){
					query.add(query.getCriterion(SalesPaymentPO.COLUMN_SALES_ORDERID_STR, data, op));
				}else if("no".equals(field)){
					query.add(query.getCriterion(SalesPaymentPO.COLUMN_SALES_NO_STR, data, op));
				}else if("userName".equals(field)){
					query.add(query.getCriterion(SalesPaymentPO.COLUMN_SALES_SALESMAN_USERID_STR, data, op));
				}else if("villageName".equals(field)){
					query.add(query.getCriterion(SalesPaymentPO.COLUMN_SALES_VILLAGE_NO_STR, data, op));
				}else if("status".equals(field)){
					query.add(query.getCriterion(field, Short.valueOf(data), op));
				}else if("collectTime".equals(field)){
					//因srId第一次为NULL 所以在链接时放在这里
					query.alias("salesReceipt","salesReceipt");
					
					if("between".equals(filter.getOp())){
						
						String sTime = filter.getData().split("-")[0].replaceAll("/", "-") + " 00:00:00";
						String eTime = filter.getData().split("-")[1].replaceAll("/", "-") + " 23:59:59";
						
						Date sDate = DateUtil.parseDate(sTime, "yyyy-MM-dd HH:mm:ss");
						Date eDate = DateUtil.parseDate(eTime, "yyyy-MM-dd HH:mm:ss");
						
						Timestamp sTimestamp = DateUtil.getDateToTimestamp(sDate);
						Timestamp eTimestamp = DateUtil.getDateToTimestamp(eDate);
						
						query.add(query.getCriterion(SalesPaymentPO.COLUMN_COLLECTTIME_STR, eTimestamp, "le"));
						query.add(query.getCriterion(SalesPaymentPO.COLUMN_COLLECTTIME_STR, sTimestamp, "ge"));
					}else{
						query.add(query.getCriterion(SalesPaymentPO.COLUMN_COLLECTTIME_STR, filter.getData(), filter.getOp()));
					}
				}else if("confirmTime".equals(field)){

					query.alias("salesReceipt","salesReceipt");
					
					if("between".equals(filter.getOp())){
						
						String sTime = filter.getData().split("-")[0].replaceAll("/", "-") + " 00:00:00";
						String eTime = filter.getData().split("-")[1].replaceAll("/", "-") + " 23:59:59";
						
						Date sDate = DateUtil.parseDate(sTime, "yyyy-MM-dd HH:mm:ss");
						Date eDate = DateUtil.parseDate(eTime, "yyyy-MM-dd HH:mm:ss");
						
						Timestamp sTimestamp = DateUtil.getDateToTimestamp(sDate);
						Timestamp eTimestamp = DateUtil.getDateToTimestamp(eDate);
						
						query.add(query.getCriterion(SalesPaymentPO.COLUMN_COLLECTTIME_STR, eTimestamp, "le"));
						query.add(query.getCriterion(SalesPaymentPO.COLUMN_COLLECTTIME_STR, sTimestamp, "ge"));
					}else{
						query.add(query.getCriterion(SalesPaymentPO.COLUMN_COLLECTTIME_STR, filter.getData(), filter.getOp()));
					}
				}else if("company".equals(filter.getField())){
					query.add(query.getCriterion(filter.getField(), Integer.valueOf(filter.getData()), filter.getOp()));
				}
			}
		}
	}
	
}
