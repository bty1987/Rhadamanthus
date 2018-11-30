package com.fanglin.market.dao.impl;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.market.dao.EcustomerDao;
import com.fanglin.market.po.EcustomerPO;
import com.fanglin.utils.Paging;

@Repository("ecustomerDao")
public class EcustomerDaoImpl  extends DaoImpl<EcustomerPO> implements EcustomerDao {
	
	public EcustomerDaoImpl() {
		super(EcustomerPO.class);
	}

	@Override
	public List<EcustomerPO> pageEcustomer(Paging paging, List<Filter> filters) {
		
		PagingQuery<EcustomerPO> query = pagingQuery(paging, EcustomerPO.class);

		queryFilterExcute(query, filters);

		return query.list();
	}
	
	private void queryFilterExcute(PagingQuery<EcustomerPO> query,List<Filter> filters) {
		
		if (filters != null) {
			for (Filter filter : filters) {
				String field = filter.getField();
				String data = filter.getData();
				String op = filter.getOp();
				
				if(field.equals("name")){
					query.add(query.getCriterion("name", data, op));
				}else if(field.equals("cityId")){
					query.add(query.getCriterion(field, Long.valueOf(data), op));
				}
			}
			
		}
	}

}
