package com.fanglin.payment.dao.impl;


import java.util.List;

import org.hibernate.SQLQuery;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.payment.dao.ActivityPaymentDao;
import com.fanglin.payment.po.ActivityPaymentPO;
import com.fanglin.utils.Paging;

@Repository("activityPaymentDao")
public class ActivityPaymentDaoImpl extends DaoImpl<ActivityPaymentPO> implements ActivityPaymentDao{
	
	public ActivityPaymentDaoImpl(){
		super(ActivityPaymentPO.class);
	}

	@Override
	public List<ActivityPaymentPO> pageActivityPayment(Paging paging, List<Filter> filters, Short status) {
		
		PagingQuery<ActivityPaymentPO> query = pagingQuery(paging, ActivityPaymentPO.class);
		
		queryFilterExcute(query, filters);
		
		if(status != null){
			query.add(Restrictions.eq(ActivityPaymentPO.COLUMN_STATUS_STR, status));
		}
		
		query.add(Restrictions.eq(ActivityPaymentPO.COLUMN_EXPIRE_STR, ActivityPaymentPO.EXPIRE_INIT_INT));
		
		query.desc("apid");
		
		return query.list();
	}


	@Override
	@SuppressWarnings("unchecked")
	public List<ActivityPaymentPO> queryActivityPaymentByNo(String mno) {
		return createCriteria(ActivityPaymentPO.class).add(Restrictions.eq(ActivityPaymentPO.COLUMN_MNO_STR, mno)).add(Restrictions.eq(ActivityPaymentPO.COLUMN_EXPIRE_STR, ActivityPaymentPO.EXPIRE_INIT_INT)).list();
	}


	@Override
	@SuppressWarnings("unchecked")
	public List<ActivityPaymentPO> queryActivityPaymentByArid(long arid) {
		return session().createCriteria(ActivityPaymentPO.class).createAlias("activityReceipt", "activityReceipt").add(Restrictions.eq("activityReceipt.arid", arid)).list();
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<List<String>> countActivityPayment() {
		
		String sql = "SELECT brand, SUM(money) from payment.activityPayment WHERE type in (2, 3) and expire = 0 GROUP BY brand";
		
		SQLQuery query = session().createSQLQuery(sql);
		
		return query.list();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters){
		
		if(filters != null && filters.size() > 0){
			for(Filter filter: filters){
				
				String field = filter.getField();
				String data = filter.getData();
				String op = filter.getOp();
				
				if(ActivityPaymentPO.COLUMN_MNO_STR.equals(field)){
					query.add(query.getCriterion(ActivityPaymentPO.COLUMN_MNO_STR, data, op));
				}else if(ActivityPaymentPO.COLUMN_CATEGORY_STR.equals(field)){
					query.add(query.getCriterion(ActivityPaymentPO.COLUMN_CATEGORY_STR, data, op));
				}else if(ActivityPaymentPO.COLUMN_BRAND_STR.equals(field)){
					query.add(query.getCriterion(ActivityPaymentPO.COLUMN_BRAND_STR, data, op));
				}else if("creater".equals(field)){
					query.alias("creater", "creater");
					query.add(query.getCriterion(ActivityPaymentPO.COLUMN_CREATER_STR, data, op));
				}else if("status".equals(field)){
					query.add(Restrictions.eq(ActivityPaymentPO.COLUMN_STATUS_STR,Short.valueOf(data)));
				}
			}
		}
	}
}
