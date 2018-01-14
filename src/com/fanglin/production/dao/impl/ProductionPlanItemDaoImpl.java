package com.fanglin.production.dao.impl;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.production.dao.ProductionPlanItemDao;
import com.fanglin.production.po.ProductionPlanItemPO;
import com.fanglin.utils.Paging;
@Repository("ProductionPlanItemDao")
public class ProductionPlanItemDaoImpl extends DaoImpl<ProductionPlanItemPO> implements ProductionPlanItemDao {

	public ProductionPlanItemDaoImpl(){
		super(ProductionPlanItemPO.class);
	}
	
	@Override
	public List<ProductionPlanItemPO> pageProductionPlanItemByPpid(Paging paging, List<Filter> filters,long ppid) {
		
		PagingQuery<ProductionPlanItemPO> query = pagingQuery(paging,ProductionPlanItemPO.class);
		
		query.add(query.getCriterion(ProductionPlanItemPO.COLUMN_PPID_STR,ppid,"eq"));
		
		return query.list();
	}

}
