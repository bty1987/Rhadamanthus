package com.fanglin.production.dao.impl;

import java.sql.Timestamp;
import java.util.Date;
import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.production.dao.ProductionPlanDao;
import com.fanglin.production.po.ProductionPlanPO;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;
@Repository("ProductionPlanDao")
public class ProductionPlanDaoImpl extends DaoImpl<ProductionPlanPO> implements ProductionPlanDao {
	
	public ProductionPlanDaoImpl(){
		super(ProductionPlanPO.class);
	}
	@Override
	public List<ProductionPlanPO> pageProductionPlan(Paging paging,List<Filter> filters,long pid) {
		PagingQuery<ProductionPlanPO> query = pagingQuery(paging, ProductionPlanPO.class);
		query.add(query.getCriterion(ProductionPlanPO.COLUMN_PID_STR, pid, "eq"));
		queryFilterExcute(query,filters);
		return query.list();
	}


	@Override
	public ProductionPlanPO queryProductionPlanByNo(String no) {
		return (ProductionPlanPO) session().createCriteria(ProductionPlanPO.class)
				.add(Restrictions.eq(ProductionPlanPO.COLUMN_NO_STR, no)).uniqueResult();
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<ProductionPlanPO> queryProductionPlanByPid(long pid) {
		return session().createCriteria(ProductionPlanPO.class).add(Restrictions.eq(ProductionPlanPO.COLUMN_PID_STR,pid)).list();
	}

	private void queryFilterExcute(PagingQuery<ProductionPlanPO> query,
			List<Filter> filters) {
		
		if(filters != null){
			for(Filter filter : filters){
				String field = filter.getField();
				String data = filter.getData();
				String op = filter.getOp();
				if(ProductionPlanPO.COLUMN_STATUS_STR.equals(field)){
					query.add(query.getCriterion(ProductionPlanPO.COLUMN_STATUS_STR, Short.parseShort(data), op));
				}else if(ProductionPlanPO.COLUMN_STRATTIME_STR.equals(field)){
					String sTime = data.split("-")[0].replaceAll("/", "-") + " 00:00:00";
					String eTime = data.split("-")[1].replaceAll("/", "-") + " 23:59:59";
					
					Date sDate = DateUtil.parseDate(sTime, "yyyy-MM-dd HH:mm:ss");
					Date eDate = DateUtil.parseDate(eTime, "yyyy-MM-dd HH:mm:ss");
					
					Timestamp sTimestamp = DateUtil.getDateToTimestamp(sDate);
					Timestamp eTimestamp = DateUtil.getDateToTimestamp(eDate);
					
					query.add(query.getCriterion(ProductionPlanPO.COLUMN_STRATTIME_STR, eTimestamp, "le"));
					query.add(query.getCriterion(ProductionPlanPO.COLUMN_STRATTIME_STR, sTimestamp, "ge"));
				}else if(ProductionPlanPO.COLUMN_ENDTIME_STR.equals(field)){
					String sTime = data.split("-")[0].replaceAll("/", "-") + " 00:00:00";
					String eTime = data.split("-")[1].replaceAll("/", "-") + " 23:59:59";
					
					Date sDate = DateUtil.parseDate(sTime, "yyyy-MM-dd HH:mm:ss");
					Date eDate = DateUtil.parseDate(eTime, "yyyy-MM-dd HH:mm:ss");
					
					Timestamp sTimestamp = DateUtil.getDateToTimestamp(sDate);
					Timestamp eTimestamp = DateUtil.getDateToTimestamp(eDate);
					
					query.add(query.getCriterion(ProductionPlanPO.COLUMN_ENDTIME_STR, eTimestamp, "le"));
					query.add(query.getCriterion(ProductionPlanPO.COLUMN_ENDTIME_STR, sTimestamp, "ge"));
				}
			}
		}
		
	}

}
