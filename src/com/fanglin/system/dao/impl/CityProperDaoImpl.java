package com.fanglin.system.dao.impl;

import java.util.List;

import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.system.dao.CityProperDao;
import com.fanglin.system.po.CityProperPO;
import com.fanglin.utils.Paging;

@Repository("cityProperDao")
public class CityProperDaoImpl extends DaoImpl<CityProperPO> implements CityProperDao {

	public CityProperDaoImpl(){
		super(CityProperPO.class);
	}

	@Override
	public List<CityProperPO> pageCityProper(Paging paging, List<Filter> filters){
		
		PagingQuery<CityProperPO> query = pagingQuery(paging, CityProperPO.class);

		queryFilterExcute(query, filters);
		
		return query.list();
	}
	
	@Override
	public List<CityProperPO> pageCityProperByName(Paging paging, String name) {
		
		PagingQuery<CityProperPO> query = pagingQuery(paging, CityProperPO.class);
		
		query.add(Restrictions.or(Restrictions.ilike(CityProperPO.CITY_PROPER_NAME, name, MatchMode.ANYWHERE), Restrictions.ilike(CityProperPO.COLUMN_PINYIN_STR, name, MatchMode.ANYWHERE)));
		
		return query.list();
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<CityProperPO> queryCityProperByCityId(String cityId){
		return session().createCriteria(CityProperPO.class).add(Restrictions.eq("city.cityId",cityId)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<CityProperPO> queryCityProperByCityIds(List<String> cityIds) {
		return  session().createCriteria(CityProperPO.class).add(Restrictions.in("city.cityId",cityIds)).list();
	}
	
	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters){
		
		if(filters != null){
			
			query.alias("city", "city");
			
			for(Filter filter: filters){
					
				String field = filter.getField();
				String data = filter.getData();
				String op = filter.getOp();
				
				if(CityProperPO.CITY_PROPER_NAME.equals(field))
					query.add(query.getCriterion(CityProperPO.CITY_PROPER_NAME, data, op));
				else if("cityId".equals(field)){
					query.add(query.getCriterion("city.cityId", data, op));
				}else if("regionId".equals(field)){
					query.alias("city.region", "region");
					query.add(query.getCriterion("region.regionId", data, op));
				}
			}
		}
	}
	
}
