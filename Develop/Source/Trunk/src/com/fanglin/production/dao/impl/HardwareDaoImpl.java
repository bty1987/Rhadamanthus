package com.fanglin.production.dao.impl;


import java.util.List;

import org.springframework.stereotype.Repository;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.production.dao.HardwareDao;
import com.fanglin.production.po.HardwarePO;
import com.fanglin.utils.Paging;

@Repository("hardwareDao")
public class HardwareDaoImpl extends DaoImpl<HardwarePO> implements HardwareDao{

	public HardwareDaoImpl(){
		super(HardwarePO.class);
	}
	
	@Override
	public List<HardwarePO> pageHardware(Paging paging, List<Filter> filters,long pid) {
		
		PagingQuery<HardwarePO> query = pagingQuery(paging, HardwarePO.class);
		
		query.add(query.getCriterion(HardwarePO.COLUMN_PID_STR, pid, "eq"));
		
		queryFilterExcute(query, filters);
		
		return query.list();
	}

	private void queryFilterExcute(PagingQuery<?> query ,List<Filter> filters){
		
		if(filters != null){
			
			for(Filter filter : filters){
				
				String field = filter.getField();
				String data = filter.getData();
				String op = filter.getOp();
				
				if(HardwarePO.COLUMN_PID_STR.equals(field)){
					query.add(query.getCriterion(HardwarePO.COLUMN_PID_STR, Long.parseLong(data), op));
				}
			}
		}
	}
	
}
