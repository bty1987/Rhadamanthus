package com.fanglin.decoration.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.decoration.dao.DecorationHolonomyDao;
import com.fanglin.decoration.po.DecorationHolonomyPO;
import com.fanglin.utils.Paging;

@Repository("decorationHolonomyDao")
public class DecorationHolonomyDaoImpl extends DaoImpl<DecorationHolonomyPO> implements DecorationHolonomyDao {

	@Override
	public List<DecorationHolonomyPO> pagedecorationHolonomy(Paging paging,List<Filter> filters) {
		
		PagingQuery<DecorationHolonomyPO> query = pagingQuery(paging, DecorationHolonomyPO.class);
		
		queryFilterExcute(paging, filters, query);
		
		return query.list();
	}
	
	@Override
	public DecorationHolonomyPO queryDecorationHolonomyByOrderId(String orderId) {
		return (DecorationHolonomyPO) session().createCriteria(DecorationHolonomyPO.class).add(Restrictions.eq("decorationOrder.orderId",orderId)).uniqueResult();
	}

	private void queryFilterExcute(Paging paging,List<Filter> filters,PagingQuery<DecorationHolonomyPO> query){
		if(filters != null){
			for(Filter filter:filters){
				
				String field = filter.getField();
				String data = filter.getData();
				String op = filter.getOp();
				
				query.alias("decorationOrder", "decorationOrder");
				query.alias("decorationOrder.villagePO", "village");
				query.alias("decorationOrder.designerPO", "designer");
				
				if("orderId".equals(field)){
					query.add(query.getCriterion(DecorationHolonomyPO.COLUMN_ORDERID_STR, data, op));
				}else if("designer".equals(field)){
					query.add(query.getCriterion(DecorationHolonomyPO.COLUMN_DESIGNER_STR, data, op));
				}else if("village".equals(field)){
					query.add(query.getCriterion(DecorationHolonomyPO.COLUMN_VILLAGE_STR, data, op));
				}else if("company".equals(field)){
					query.add(query.getCriterion(DecorationHolonomyPO.COLUMN_COMPANY_STR, Integer.valueOf(data), op));
				}
			}
		}
	}

	
}
