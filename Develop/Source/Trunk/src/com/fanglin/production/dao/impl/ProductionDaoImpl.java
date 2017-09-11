package com.fanglin.production.dao.impl;


import java.util.List;

import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.production.dao.ProductionDao;
import com.fanglin.production.po.ProductionPO;
import com.fanglin.utils.Paging;

@Repository("productionDao")
public class ProductionDaoImpl extends DaoImpl<ProductionPO> implements ProductionDao {

	public ProductionDaoImpl(){
		super(ProductionPO.class);
	}
	
	@Override
	public List<ProductionPO> pageProduction(Paging paging, List<Filter> filters, int company) {
		
		PagingQuery<ProductionPO> query = pagingQuery(paging, ProductionPO.class);
		
		query.add(query.getCriterion("company", company, "eq"));
		
		queryFilterExcute(query, filters);
		
		query.desc("pid");
		
		return query.list();
	}
	
	private void queryFilterExcute(PagingQuery<ProductionPO> query, List<Filter> filters) {
		
		if(filters != null){
			
			for(Filter filter : filters){
				
				String field = filter.getField();
				String data = filter.getData();
				String op = filter.getOp();
				
				if(ProductionPO.COLUMN_ORDERID_STR.equals(field)){
					query.add(query.getCriterion(field, Long.parseLong(data), op));
				}else if(ProductionPO.COLUMN_STATUS_STR.equals(field)){
					query.add(query.getCriterion(field, Short.parseShort(data), op));
				}
				
				
				
			}
			
		}
		
		
	}

	

}
