package com.fanglin.store.dao.impl;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.store.dao.MorderDao;
import com.fanglin.store.po.MorderPO;
import com.fanglin.utils.Paging;

@Repository("morderDao")
public class MorderDaoImpl extends DaoImpl<MorderPO> implements MorderDao{

	public MorderDaoImpl(){
		super(MorderPO.class);
	}
	
	@Override
	public List<MorderPO> pageMorder(Paging paging, List<Filter> filters) {
		
		PagingQuery<MorderPO> query = pagingQuery(paging, MorderPO.class);
		
		queryFilterExcute(query, filters);
		
		query.desc("oid");
		
		return query.list();
	}
	
	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters){
		
		if(filters != null){
			for(Filter filter: filters){
				
				String field = filter.getField();
				String data = filter.getData();
				String op = filter.getOp();
				
				if(MorderPO.COLUMN_NO_STR.equals(field)){
					query.add(query.getCriterion(MorderPO.COLUMN_NO_STR, data, op));
				}else if(MorderPO.COLUMN_STATUS_STR.equals(field)){
					query.add(query.getCriterion(MorderPO.COLUMN_STATUS_STR, Short.valueOf(data), op));
				}else if("unionId".equals(field)){
					query.add(query.getCriterion(MorderPO.COLUMN_UNIONID_STR, data, op));
				}
			}
		}
	}

}
