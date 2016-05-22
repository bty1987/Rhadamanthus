package com.fanglin.system.dao.impl;

import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.system.dao.CityProperDao;
import com.fanglin.system.po.CityProperPO;
import com.fanglin.utils.Paging;

@Repository("cityProperDao")
public class CityProperDaoImpl extends DaoImpl<CityProperPO> implements CityProperDao {

	public CityProperDaoImpl(){
		super(CityProperPO.class);
	}

	@Override
	public List<CityProperPO> pageCityProper(Paging paging, List<FilterVO> filters){
		
		PagingQuery<CityProperPO> query = pagingQuery(paging, CityProperPO.class);
		if(filters != null){
			query.alias("city", "city");
			for(FilterVO filter:filters){
				if(StringUtils.isNotEmpty(filter.getData())){
					if(CityProperPO.CITY_PROPER_NAME.equals(filter.getField()))
						query.add(query.getCriterion(CityProperPO.CITY_PROPER_NAME, filter));
					else if("cityId".equals(filter.getField())){
						query.add(query.getCriterion("city.cityId", filter));
					}else if("regionId".equals(filter.getField())){
						query.alias("city.region", "region");
						query.add(query.getCriterion("region.regionId", filter));
					}
				}
			}
		}
		
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
	
}
