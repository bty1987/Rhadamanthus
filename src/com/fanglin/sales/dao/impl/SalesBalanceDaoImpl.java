package com.fanglin.sales.dao.impl;

import java.sql.Timestamp;
import java.util.Date;
import java.util.List;

import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.sales.dao.SalesBalanceDao;
import com.fanglin.sales.po.SalesBalancePO;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Repository("salesBalanceDao")
public class SalesBalanceDaoImpl extends DaoImpl<SalesBalancePO> implements SalesBalanceDao {

	public SalesBalanceDaoImpl(){
		super(SalesBalancePO.class);
	}

	@Override
	public List<SalesBalancePO> pageSalesBalance(Paging paging,List<Filter> filters) {
		
		PagingQuery<SalesBalancePO> query = pagingQuery(paging, SalesBalancePO.class);
		
		queryFilterExcute(query, filters);
		
		query.desc("sbid");
		
		return query.list();
	}
	
	private void queryFilterExcute(PagingQuery<SalesBalancePO> query,List<Filter> filters) {
		
		if(filters != null){
			for(Filter filter: filters){
				
				String field = filter.getField();
				String data = filter.getData();
				String op = filter.getOp();
				
				query.alias("sales", "sales");
				query.alias("sales.house", "house");
				query.alias("house.village", "village");
				query.alias("sales.region", "region");
				query.alias("sales.dept", "dept");
				
				if(SalesBalancePO.COLUMN_ORDERID_STR.equals(field)){
					query.add(query.getCriterion(SalesBalancePO.COLUMN_ORDERID_STR, data, op));
				}else if (SalesBalancePO.COLUMN_SALESNO_STR.equals(field)){
					query.add(query.getCriterion(SalesBalancePO.COLUMN_SALESNO_STR, data, op));
				}else if (SalesBalancePO.COLUMN_SALESBRAND_STR.equals(field)){
					query.add(query.getCriterion(SalesBalancePO.COLUMN_SALESBRAND_STR, data, op));
				}else if (SalesBalancePO.COLUMN_SALESVILLAGE_STR.equals(field)){
					query.add(query.getCriterion(SalesBalancePO.COLUMN_SALESVILLAGE_STR, data, op));
				}else if (SalesBalancePO.COLUMN_SALESREGION_STR.equals(field)){
					query.add(query.getCriterion(SalesBalancePO.COLUMN_SALESREGION_STR, data, op));
				}else if (SalesBalancePO.COLUMN_SALESDEPT_STR.equals(field)){
					query.add(query.getCriterion(SalesBalancePO.COLUMN_SALESDEPT_STR, data, op));
				}else if (SalesBalancePO.COLUMN_STATUS_STR.equals(field)){
					query.add(query.getCriterion(SalesBalancePO.COLUMN_STATUS_STR, Short.valueOf(data), op));
				}else if (SalesBalancePO.COLUMN_TYPE_STR.equals(field)){
					query.add(query.getCriterion(SalesBalancePO.COLUMN_TYPE_STR, Short.valueOf(data), op));
				}else if (SalesBalancePO.COLUMN_SALESFULLPAYTIME_STR.equals(field)){
					
					String sTime = data.split("-")[0].replaceAll("/", "-") + " 00:00:00";
					String eTime = data.split("-")[1].replaceAll("/", "-") + " 23:59:59";
					
					Date sDate = DateUtil.parseDate(sTime, "yyyy-MM-dd HH:mm:ss");
					Date eDate = DateUtil.parseDate(eTime, "yyyy-MM-dd HH:mm:ss");
					
					Timestamp sTimestamp = DateUtil.getDateToTimestamp(sDate);
					Timestamp eTimestamp = DateUtil.getDateToTimestamp(eDate);
					
					query.add(query.getCriterion(SalesBalancePO.COLUMN_SALESFULLPAYTIME_STR, eTimestamp, "le"));
					query.add(query.getCriterion(SalesBalancePO.COLUMN_SALESFULLPAYTIME_STR, sTimestamp, "ge"));
					
				}else if (SalesBalancePO.COLUMN_CREATETIME_STR.equals(field)){
					
					String sTime = data.split("-")[0].replaceAll("/", "-") + " 00:00:00";
					String eTime = data.split("-")[1].replaceAll("/", "-") + " 23:59:59";
					
					Date sDate = DateUtil.parseDate(sTime, "yyyy-MM-dd HH:mm:ss");
					Date eDate = DateUtil.parseDate(eTime, "yyyy-MM-dd HH:mm:ss");
					
					Timestamp sTimestamp = DateUtil.getDateToTimestamp(sDate);
					Timestamp eTimestamp = DateUtil.getDateToTimestamp(eDate);
					
					query.add(query.getCriterion(SalesBalancePO.COLUMN_CREATETIME_STR, eTimestamp, "le"));
					query.add(query.getCriterion(SalesBalancePO.COLUMN_CREATETIME_STR, sTimestamp, "ge"));
					
				}else if (SalesBalancePO.COLUMN_VENDERTIME_STR.equals(field)){
					
					String sTime = data.split("-")[0].replaceAll("/", "-") + " 00:00:00";
					String eTime = data.split("-")[1].replaceAll("/", "-") + " 23:59:59";
					
					Date sDate = DateUtil.parseDate(sTime, "yyyy-MM-dd HH:mm:ss");
					Date eDate = DateUtil.parseDate(eTime, "yyyy-MM-dd HH:mm:ss");
					
					Timestamp sTimestamp = DateUtil.getDateToTimestamp(sDate);
					Timestamp eTimestamp = DateUtil.getDateToTimestamp(eDate);
					
					query.add(query.getCriterion(SalesBalancePO.COLUMN_VENDERTIME_STR, eTimestamp, "le"));
					query.add(query.getCriterion(SalesBalancePO.COLUMN_VENDERTIME_STR, sTimestamp, "ge"));
					
				}else if (SalesBalancePO.COLUMN_POSTTIME_STR.equals(field)){
					
					String sTime = data.split("-")[0].replaceAll("/", "-") + " 00:00:00";
					String eTime = data.split("-")[1].replaceAll("/", "-") + " 23:59:59";
					
					Date sDate = DateUtil.parseDate(sTime, "yyyy-MM-dd HH:mm:ss");
					Date eDate = DateUtil.parseDate(eTime, "yyyy-MM-dd HH:mm:ss");
					
					Timestamp sTimestamp = DateUtil.getDateToTimestamp(sDate);
					Timestamp eTimestamp = DateUtil.getDateToTimestamp(eDate);
					
					query.add(query.getCriterion(SalesBalancePO.COLUMN_POSTTIME_STR, eTimestamp, "le"));
					query.add(query.getCriterion(SalesBalancePO.COLUMN_POSTTIME_STR, sTimestamp, "ge"));
					
				}
				
			}
		}
	}
}
