package com.fanglin.data.common.dao.impl;

import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.dao.HouseDao;
import com.fanglin.data.po.HousePO;
import com.fanglin.utils.Paging;

@Repository("houseDao")
public class HouseDaoImpl extends DaoImpl<HousePO> implements HouseDao {

	public HouseDaoImpl(){
		super(HousePO.class);
	}
	
	@Override
	public List<HousePO> pageHouse(Paging paging, List<Filter> filters){
	
		PagingQuery<HousePO> query = pagingQuery(paging, HousePO.class);

		queryFilterExcute(query, filters);

		query.asc("hid");

		return query.list();
	}
	
	@Override
	public HousePO queryHouseByNoAHnum(String no,String houseNumber,Short status){
		
		Criteria criteria =  session()
		        .createCriteria(HousePO.class)
		        .add(Restrictions.eq(HousePO.COLUMN_VILLAGE_NO_STR , no))
		        .add(Restrictions.eq(HousePO.COLUMN_HOUSENUMBER_STR, houseNumber));
		
		if(status != null){
			criteria.add(Restrictions.eq(HousePO.COLUMN_STATUS_STR, status));
		}
		
		return (HousePO) criteria.uniqueResult();
		
	}
	
	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters){
		
		if(filters != null){
			query.alias("village", "village");
			for(Filter filter : filters){
			
				if("no".equals(filter.getField())){
					query.add(query.getCriterion("village.no", filter));
				}else if("type".equals(filter.getField())){
					query.add(Restrictions.eq("type",Short.valueOf(filter.getData())));
				}else if("through".equals(filter.getField())){
					query.add(Restrictions.eq("through",Short.valueOf(filter.getData())));
				}else if("roomNum".equals(filter.getField())){
					if(filter.getData().equals("6")){
			            query.add(Restrictions.ge("roomNum", Integer.valueOf(filter.getData())));
			          }else{
			            query.add(Restrictions.eq("roomNum", Integer.valueOf(filter.getData())));
			          }
				}else if("waterVapour".equals(filter.getField())){
					query.add(Restrictions.eq("waterVapour",Short.valueOf(filter.getData())));
				}else if("heatingType".equals(filter.getField())){
					query.add(Restrictions.eq("heatingType",Short.valueOf(filter.getData())));
				}else if("orientation".equals(filter.getField())){
					query.add(Restrictions.eq("orientation",Short.valueOf(filter.getData())));
				}else if("houseNumber".equals(filter.getField())){
					query.add(query.getCriterion("houseNumber", filter));
				}else if("status".equals(filter.getField())){
					query.add(Restrictions.eq("status",Short.valueOf(filter.getData())));
				}else if("buildingArea".equals(filter.getField())){
					String area[]=filter.getData().split("-");
					query.add(Restrictions.ge("buildArea",Float.valueOf(area[0])));
					query.add(Restrictions.le("buildArea",Float.valueOf(area[1])));
				}else if("parlourType".equals(filter.getField())){
					query.add(Restrictions.eq("parlourType",Short.valueOf(filter.getData())));
				}
			}
		}
	}
	
}
