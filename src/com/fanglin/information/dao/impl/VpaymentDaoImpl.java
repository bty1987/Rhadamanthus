package com.fanglin.information.dao.impl;


import java.util.List;

import org.hibernate.SQLQuery;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.information.dao.VpaymentDao;
import com.fanglin.information.po.VpaymentPO;
import com.fanglin.utils.Paging;

@Repository("vpaymentDao")
public class VpaymentDaoImpl extends DaoImpl<VpaymentPO> implements VpaymentDao{
	
	public VpaymentDaoImpl(){
		super(VpaymentPO.class);
	}

	@Override
	public List<VpaymentPO> pageVpayment(Paging paging, List<Filter> filters) {
		
		PagingQuery<VpaymentPO> query = pagingQuery(paging, VpaymentPO.class);
		
		queryFilterExcute(query, filters);
		
		return query.list();
	}
	
	
	@Override
	public List<?> countVpayment() {
		
		String sql = "SELECT brand, SUM(money) from information.vpayment WHERE type = 0 GROUP BY brand";
		
		SQLQuery query = session().createSQLQuery(sql);
		
		return query.list();
	}

	
	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters){
		
		if(filters != null && filters.size() > 0){
			for(Filter filter: filters){
				
				String field = filter.getField();
				String data = filter.getData();
				String op = filter.getOp();
				
				if(VpaymentPO.COLUMN_MNO_STR.equals(field)){
					
					query.add(query.getCriterion(VpaymentPO.COLUMN_MNO_STR, data, op));
					
				}else if(VpaymentPO.COLUMN_BRAND_STR.equals(field)){

					query.add(query.getCriterion(VpaymentPO.COLUMN_BRAND_STR, data, op));
					
				}
			}
		}
	}

	
}
