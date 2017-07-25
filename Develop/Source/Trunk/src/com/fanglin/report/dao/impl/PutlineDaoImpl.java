package com.fanglin.report.dao.impl;

import java.util.List;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.report.dao.PutlineDao;
import com.fanglin.report.po.PutlinePO;
import com.fanglin.utils.Paging;

@Repository("putlineDao")
public class PutlineDaoImpl extends DaoImpl<PutlinePO> implements PutlineDao {
	
	public PutlineDaoImpl(){
		super(PutlinePO.class);
	}
	
	@Override
	public List<PutlinePO> pagePutline(Paging paging, List<Filter> filters) {
		
		PagingQuery<PutlinePO> query = pagingQuery(paging,PutlinePO.class);
		query.alias("decorationOrder", "decorationOrder");
		query.asc("putlineTime");
		
		if(filters != null){
			for(Filter filter: filters){
				String field = filter.getField();
				String op = filter.getOp();
				String data = filter.getData();
				
				if("orderId".equals(field)){
					query.add(query.getCriterion("decorationOrder.orderId", data, op));
				}else if("houseNumber".equals(field)){
					query.add(query.getCriterion("decorationOrder.houseNumber", data, op));
				}else if("village".equals(field)){
					query.alias("decorationOrder.villagePO", "village");
					query.add(query.getCriterion("village.villageName", data, op));
				}else if("designer".equals(field)){
					query.alias("decorationOrder.designerPO", "designer");
					query.add(query.getCriterion("designer.currentName", data, op));
				}
			}
		}
		return query.list();
	}
}
