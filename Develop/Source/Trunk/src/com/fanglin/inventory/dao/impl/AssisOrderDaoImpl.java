package com.fanglin.inventory.dao.impl;

import java.sql.Timestamp;
import java.util.Date;
import java.util.List;

import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.inventory.dao.AssisOrderDao;
import com.fanglin.inventory.po.AssisOrderPO;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Repository("assisOrderDao")
public class AssisOrderDaoImpl extends DaoImpl<AssisOrderPO> implements AssisOrderDao{
	
	public AssisOrderDaoImpl(){
		super(AssisOrderPO.class);
	}
	
	@Override
	public List<AssisOrderPO> pageAssisOrder(Paging paging, List<Filter> filters) {
		
		PagingQuery<AssisOrderPO> query = pagingQuery(paging, AssisOrderPO.class);
		
		queryFilterExcute(query, filters);
		
		query.desc("aoid");
		
		return query.list();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters){
		
		if(filters != null && filters.size() > 0){
			for(Filter filter: filters){
				
				String field = filter.getField();
				String data = filter.getData();
				String op = filter.getOp();
				
				if("createrName".equals(field)){
					query.alias("creater", "creater");
					query.add(query.getCriterion(AssisOrderPO.COLUMN_CREATER_NAME_STR, data, op));
				}else if("approverName".equals(field)){
					query.alias("approver","approver");
					query.add(query.getCriterion(AssisOrderPO.COLUMN_APPROVER_NAME_STR, data, op));
				}else if(AssisOrderPO.COLUMN_ORDERID_STR.equals(field)){
					query.add(query.getCriterion(AssisOrderPO.COLUMN_ORDERID_STR, data, op));
				}else if(AssisOrderPO.COLUMN_CREATETIME_STR.equals(field)){
					
					String sTime = data + " 00:00:00";
					String eTime = data + " 23:59:59";
					Date sdate = DateUtil.parseDate(sTime, "yyyy-MM-dd HH:mm:ss");
					Date edate = DateUtil.parseDate(eTime, "yyyy-MM-dd HH:mm:ss");
					
					Timestamp stimestamp = DateUtil.getDateToTimestamp(sdate);
					Timestamp etimestamp = DateUtil.getDateToTimestamp(edate);
					
					query.add(query.getCriterion(AssisOrderPO.COLUMN_CREATETIME_STR, stimestamp, "ge"));
					query.add(query.getCriterion(AssisOrderPO.COLUMN_CREATETIME_STR, etimestamp, "le"));
				}else if(AssisOrderPO.COLUMN_APPROVERTIME_STR.equals(field)){

					String sTime = data + " 00:00:00";
					String eTime = data + " 23:59:59";
					Date sdate = DateUtil.parseDate(sTime, "yyyy-MM-dd HH:mm:ss");
					Date edate = DateUtil.parseDate(eTime, "yyyy-MM-dd HH:mm:ss");
					
					Timestamp stimestamp = DateUtil.getDateToTimestamp(sdate);
					Timestamp etimestamp = DateUtil.getDateToTimestamp(edate);
					
					query.add(query.getCriterion(AssisOrderPO.COLUMN_APPROVERTIME_STR, stimestamp, "ge"));
					query.add(query.getCriterion(AssisOrderPO.COLUMN_APPROVERTIME_STR, etimestamp, "le"));
				}else if("status".equals(field)){
					query.add(query.getCriterion(AssisOrderPO.COLUMN_STATUS_STR, Short.valueOf(data), op));
				}else if("company".equals(field)){
					query.add(query.getCriterion(AssisOrderPO.COLUMN_COMPANY_STR, Integer.valueOf(data), op));
				}
			}
		}
	}

}
