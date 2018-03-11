package com.fanglin.production.dao.impl;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.production.dao.OutsourceItemDao;
import com.fanglin.production.po.OutsourceItemPO;
import com.fanglin.utils.Paging;
@Repository("outsourceItemDao")
public class OutsourceItemDaoImpl extends DaoImpl<OutsourceItemPO>  implements OutsourceItemDao{
	
	public OutsourceItemDaoImpl (){
		super (OutsourceItemPO.class);
	}
	
	@Override
	public List<OutsourceItemPO> pageoutsourceItem(Paging paging, List<Filter> filters,Long oid) {
		
			PagingQuery<OutsourceItemPO> query = pagingQuery(paging, OutsourceItemPO.class);
					
			query.add(getCriterion(OutsourceItemPO.COLUMN_OID, oid, "op"));
			
			queryFilterExcute(query, filters);
			
			return query.list();
		
	}
	public void queryFilterExcute(PagingQuery<OutsourceItemPO> query, List<Filter> filters){
		if(filters != null){
			
			for(Filter fliter:filters){
				
				String field = fliter.getField();
				String data = fliter.getData();
				String op = fliter.getOp();
				
				if(OutsourceItemPO.COLUMN_OID.equals(field)){
					query.add(query.getCriterion(field, Long.parseLong(data), op));
				}
			}
		}
		
	}

}
