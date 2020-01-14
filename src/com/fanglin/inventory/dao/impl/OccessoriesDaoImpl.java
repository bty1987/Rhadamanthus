package com.fanglin.inventory.dao.impl;

import java.sql.Timestamp;
import java.util.Date;
import java.util.List;

import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.inventory.dao.OccessoriesDao;
import com.fanglin.inventory.po.OccessoriesPO;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Repository("occessoriesDao")
public class OccessoriesDaoImpl extends DaoImpl<OccessoriesPO> implements OccessoriesDao {

	public OccessoriesDaoImpl(){
		super(OccessoriesPO.class);
	}
	
	@Override
	public List<OccessoriesPO> pageOccessories(Paging paging, List<Filter> filters, int company) {
		
		PagingQuery<OccessoriesPO> query = pagingQuery(paging, OccessoriesPO.class);
		
		query.add(query.getCriterion(OccessoriesPO.COLUMN_COMPANY_STR, company, "eq"));
		
		queryFilterExcute(query, filters);
		
		query.desc("oid");
		
		return query.list();
	}

	private void queryFilterExcute(PagingQuery<OccessoriesPO> query, List<Filter> filters) {
		
		if(filters != null && filters.size() > 0){
			for(Filter filter: filters){
				
				String field = filter.getField();
				String data = filter.getData();
				String op = filter.getOp();
				
				if("createrName".equals(field)){
					query.alias("creater", "creater");
					query.add(query.getCriterion(OccessoriesPO.COLUMN_CREATER_USERID_STR, data, op));
				}else if(OccessoriesPO.COLUMN_ORDERID_STR.equals(field)){
					query.add(query.getCriterion(OccessoriesPO.COLUMN_ORDERID_STR, data, op));
				}else if(OccessoriesPO.COLUMN_NO_STR.equals(field)){
					query.add(query.getCriterion(OccessoriesPO.COLUMN_NO_STR, data, op));
				}else if(OccessoriesPO.COLUMN_CREATETIME_STR.equals(field)){
					
					String sTime = data + " 00:00:00";
					String eTime = data + " 23:59:59";
					Date sdate = DateUtil.parseDate(sTime, "yyyy-MM-dd HH:mm:ss");
					Date edate = DateUtil.parseDate(eTime, "yyyy-MM-dd HH:mm:ss");
					
					Timestamp stimestamp = DateUtil.getDateToTimestamp(sdate);
					Timestamp etimestamp = DateUtil.getDateToTimestamp(edate);
					
					query.add(query.getCriterion(OccessoriesPO.COLUMN_CREATETIME_STR, stimestamp, "ge"));
					query.add(query.getCriterion(OccessoriesPO.COLUMN_CREATETIME_STR, etimestamp, "le"));
				}else if("status".equals(field)){
					query.add(query.getCriterion(OccessoriesPO.COLUMN_STATUS_STR, Short.valueOf(data), op));
				}
			}
		}
	}

}
