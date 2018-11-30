package com.fanglin.market.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.market.dao.EcaseDao;
import com.fanglin.market.po.EcasePO;
import com.fanglin.utils.Paging;

@Repository("ecaseDao")
public class EcaseDaoImpl extends DaoImpl<EcasePO> implements EcaseDao {

	public EcaseDaoImpl() {
		super(EcasePO.class);
	}

	@Override
	public List<EcasePO> pageEcase(Paging paging, List<Filter> filters) {

		PagingQuery<EcasePO> query = pagingQuery(paging, EcasePO.class);

		queryFilterExcute(query, filters);

		return query.list();
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<EcasePO> queryEcaseByTypeAndStatus(long cityId, short status, short type) {
		return createCriteria(EcasePO.class).add(Restrictions.eq(EcasePO.COLUMN_CITYID_STR, cityId)).add(Restrictions.eq(EcasePO.COLUMN_STATUS_STR, status)).add(Restrictions.eq(EcasePO.COLUMN_TYPE_STR, type)).list();
	}
	
	
	private void queryFilterExcute(PagingQuery<EcasePO> query,List<Filter> filters) {
		
		if (filters != null) {
			for (Filter filter : filters) {
				String field = filter.getField();
				String data = filter.getData();
				String op = filter.getOp();
				
				if(field.equals("type")){
					query.add(query.getCriterion("type", Short.valueOf(data), op));
				}else if(field.equals("designer")){
					query.alias("designer", "designer");
					query.add(query.getCriterion("designer.euid", Long.valueOf(data), op));
				}else if(field.equals("supervisor")){
					query.alias("supervisor", "supervisor");
					query.add(query.getCriterion("supervisor.euid", Long.valueOf(data), op));
				}else if(field.equals("style")){
					query.add(query.getCriterion("style", data, op));
				}else if(field.equals("houseType")){
					query.add(query.getCriterion("houseType", data, op));
				}else if(field.equals("area")){
					String area[] = filter.getData().split("-");
					query.add(Restrictions.ge("area",Float.valueOf(area[0])));
					query.add(Restrictions.le("area",Float.valueOf(area[1])));
				}else if(field.equals("cityId")){
					query.add(query.getCriterion(field, Long.valueOf(data), op));
				}
			}
		}
	}

}
