package com.fanglin.decoration.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.decoration.dao.DecorationInclusiveDao;
import com.fanglin.decoration.po.DecorationInclusivePO;
import com.fanglin.utils.Paging;

@Repository("decorationInclusiveDao")
public class DecorationInclusiveDaoImpl extends DaoImpl<DecorationInclusivePO> implements DecorationInclusiveDao {

	@Override
	public List<DecorationInclusivePO> pageDecorationInclusive(Paging paging,List<Filter> filters, int company) {
		
		PagingQuery<DecorationInclusivePO> query = pagingQuery(paging, DecorationInclusivePO.class);
		
		query.add(query.getCriterion(DecorationInclusivePO.COLUMN_COMPANY_STR, company, "eq"));
		
		queryFilterExcute(paging, filters, query);
		
		return query.list();
	}
	
	@Override
	public DecorationInclusivePO queryDecorationInclusiveByOrderId(String orderId) {
		return (DecorationInclusivePO) session().createCriteria(DecorationInclusivePO.class).add(Restrictions.eq("decorationOrder.orderId",orderId)).uniqueResult();
	}

	private void queryFilterExcute(Paging paging,List<Filter> filters,PagingQuery<DecorationInclusivePO> query){
		if(filters != null){
			for(Filter filter:filters){
				
				String field = filter.getField();
				String data = filter.getData();
				String op = filter.getOp();
				
				query.alias("decorationOrder", "decorationOrder");
				query.alias("decorationOrder.villagePO", "village");
				query.alias("decorationOrder.designerPO", "designer");
				
				if("orderId".equals(field)){
					query.add(query.getCriterion(DecorationInclusivePO.COLUMN_ORDERID_STR, data, op));
				}else if("designer".equals(field)){
					query.add(query.getCriterion(DecorationInclusivePO.COLUMN_DESIGNER_STR, data, op));
				}else if("village".equals(field)){
					query.add(query.getCriterion(DecorationInclusivePO.COLUMN_VILLAGE_STR, data, op));
				}
			}
		}
	}

	
}
