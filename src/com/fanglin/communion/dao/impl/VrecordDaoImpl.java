package com.fanglin.communion.dao.impl;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.fanglin.communion.dao.VrecordDao;
import com.fanglin.communion.po.VrecordPO;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

@Repository("vrecordDao")
public class VrecordDaoImpl extends DaoImpl<VrecordPO> implements VrecordDao{
	
	public VrecordDaoImpl(){
		super(VrecordPO.class);
	}
	
	@Override
	public List<VrecordPO> queryVrecordByVid(Paging paging, List<Filter> filters) {
		
		PagingQuery<VrecordPO> query = pagingQuery(paging, VrecordPO.class);
		
		if(filters != null){
			
			for (Filter filter : filters) {
				String field = filter.getField();
				String data = filter.getData();
				String op = filter.getOp();
				
				if(field.equals(VrecordPO.COLUMN_VID_STRING)){
					query.add(query.getCriterion(field, data, op));
				}
			}
			
		}
		
		query.notPaging();
		
		return query.list();
		
	}
	
}
