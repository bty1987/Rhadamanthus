package com.fanglin.inventory.dao.impl;

import java.sql.Timestamp;
import java.util.Date;
import java.util.List;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.inventory.dao.SalesDao;
import com.fanglin.inventory.po.SalesPO;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Repository("salesDao")
public class SalesDaoImpl extends DaoImpl<SalesPO> implements SalesDao {
	
	public SalesDaoImpl(){
		super(SalesPO.class);
	}

	@Override
	public List<SalesPO> pageSales(Paging paging, List<Filter> filters,int company,int uid) {
		
		PagingQuery<SalesPO> query = pagingQuery(paging, SalesPO.class);
		
		query.add(query.getCriterion(SalesPO.COLUMN_COMPANY_STR,company,"eq"));
		
		query.add(Restrictions.or(Restrictions.or(query.getCriterion(SalesPO.COLUMN_GUID_STR, uid,"eq"),query.getCriterion(SalesPO.COLUMN_ISID_STR,uid,"eq")),query.getCriterion(SalesPO.COLUMN_SALESMANID_STR,uid,"eq")));
		
		queryFilterExcute(query, filters);
		
		query.desc("sid");
		
		return query.list();
	}
	
	@Override
	public List<SalesPO> pageSalesForAdvance(Paging paging, List<Filter> filters,int company) {
		
		PagingQuery<SalesPO> query = pagingQuery(paging, SalesPO.class);
		
		query.add(query.getCriterion(SalesPO.COLUMN_COMPANY_STR,company,"eq"));
		
		queryFilterExcute(query, filters);
		
		query.desc("sid");
		
		return query.list();
	}
	
	@Override
	public List<SalesPO> pageSalesForBalance(Paging paging,List<Filter> filters, int company) {
		
		PagingQuery<SalesPO> query = pagingQuery(paging, SalesPO.class);
		
		query.add(query.getCriterion(SalesPO.COLUMN_COMPANY_STR,company,"eq"));
		
		query.add(query.getCriterion(SalesPO.COLUMN_FULLPAYSTATUS_STR,SalesPO.FULLPAYSTATUS_CONFIRM_SHORT,"eq"));
		
		query.add(query.getCriterion(SalesPO.COLUMN_BALANCESTATUS_STR,SalesPO.BALANCESTATUS_INIT_SHORT,"eq"));
		
		query.add(query.getCriterion(SalesPO.COLUMN_STATUS_STR,SalesPO.STATUS_INIT_SHORT,"eq"));
		
		queryFilterExcute(query, filters);
		
		query.desc("sid");
		
		return query.list();
	}

	@Override
	public SalesPO querySalesBySid(Long sid) {
		return (SalesPO) createCriteria(SalesPO.class).add(Restrictions.eq(SalesPO.COLUMN_SID_STR, sid)).uniqueResult();
	}
	
	@Override
	public SalesPO querySalesByNo(String no) {
		return (SalesPO) createCriteria(SalesPO.class).add(Restrictions.eq(SalesPO.COLUMN_NO_STR, no)).uniqueResult();
	}
	
	@SuppressWarnings("unchecked")
	@Override
	public List<SalesPO> querySalesByOrderId(String orderId) {
		return createCriteria(SalesPO.class).add(Restrictions.eq(SalesPO.COLUMN_ORDERID_STR, orderId)).list();
	}

	private void queryFilterExcute(PagingQuery<SalesPO> query,List<Filter> filters) {
		if(filters != null){
			for(Filter filter: filters){
				
				String field = filter.getField();
				String data = filter.getData();
				String op = filter.getOp();
				
				query.alias("instorer", "instorer");
				query.alias("salesman", "salesman");
				query.alias("dept", "dept");
				
				if(SalesPO.COLUMN_NO_STR.equals(field)){
					query.add(query.getCriterion(field, data, op));
					
				}else if(SalesPO.COLUMN_ORDERID_STR.equals(field)){
					query.add(query.getCriterion(field, data, op));
					
				}
				else if("currentName".equals(field)){
					query.add(query.getCriterion(SalesPO.COLUMN_INSTORERID_STR, data, op));
				}else if("userName".equals(field)){
					query.add(query.getCriterion(SalesPO.COLUMN_SALESMANNAME_STR, data, op));
				}else if(SalesPO.COLUMN_FULLPAYTIME_RANGE_STR.equals(field)){
					
					String sTime = data.split("-")[0].replaceAll("/", "-") + " 00:00:00";
					String eTime = data.split("-")[1].replaceAll("/", "-") + " 23:59:59";
					
					Date sDate = DateUtil.parseDate(sTime, "yyyy-MM-dd HH:mm:ss");
					Date eDate = DateUtil.parseDate(eTime, "yyyy-MM-dd HH:mm:ss");
					
					Timestamp sTimestamp = DateUtil.getDateToTimestamp(sDate);
					Timestamp eTimestamp = DateUtil.getDateToTimestamp(eDate);
					
					query.add(query.getCriterion(SalesPO.COLUMN_FULLPAYTIME_STR, eTimestamp, "le"));
					query.add(query.getCriterion(SalesPO.COLUMN_FULLPAYTIME_STR, sTimestamp, "ge"));
				}else if (SalesPO.COLUMN_DEPT_STR.equals(field)){
					query.add(query.getCriterion(field, data, op));
				}else if(SalesPO.COLUMN_FULLPAYTIME_STR.equals(field)){
					
					String sTime = data + " 00:00:00";
					String eTime = data + " 23:59:59";
					
					Date sdate = DateUtil.parseDate(sTime, "yyyy-MM-dd HH:mm:ss");
					Date edate = DateUtil.parseDate(eTime, "yyyy-MM-dd HH:mm:ss");
					
					Timestamp stimestamp = DateUtil.getDateToTimestamp(sdate);
					Timestamp etimestamp = DateUtil.getDateToTimestamp(edate);
					
					query.add(query.getCriterion(field, stimestamp, "ge"));
					query.add(query.getCriterion(field, etimestamp, "le"));
				}else if(SalesPO.COLUMN_BRAND_STR.equals(field)){
					query.add(query.getCriterion(SalesPO.COLUMN_BRAND_STR, data, op));
				}
				
			}
		}
	}

}
