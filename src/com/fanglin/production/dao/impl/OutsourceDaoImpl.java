package com.fanglin.production.dao.impl;

import java.util.List;
import org.springframework.stereotype.Repository;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.production.dao.OutsourceDao;
import com.fanglin.production.po.OutsourcePO;
import com.fanglin.utils.Paging;

@Repository("outsourceDao")
public class OutsourceDaoImpl extends DaoImpl<OutsourcePO> implements OutsourceDao {

	public OutsourceDaoImpl() {
		super(OutsourcePO.class);
	}

	@Override
	public List<OutsourcePO> pageOutsource(Paging paging, List<Filter> filter) {

		PagingQuery<OutsourcePO> query = pagingQuery(paging, OutsourcePO.class);

		queryFilterExcute(query, filter);
		
		return query.list();

	}

	public void queryFilterExcute(PagingQuery<OutsourcePO> query,List<Filter> filter) {

		if (filter != null) {
			for (Filter filters : filter) {
				String op = filters.getOp();
				String data = filters.getData();
				String field = filters.getField();

				if (OutsourcePO.COLMU_PID.equals(field)) {
					query.add(query.getCriterion(OutsourcePO.COLMU_PID,Long.valueOf(data), op));

				}
				if (OutsourcePO.COLMU_STATUSTR.equals(field) ){
					query.add(query.getCriterion(OutsourcePO.COLMU_STATUSTR,Short.parseShort(data), op));
					
				}
			}
		}
	}
	
}
