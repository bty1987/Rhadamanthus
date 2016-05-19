/**
 * @FileName	: CityDaoImpl.java
 * @Package   	: com.fanglin.dao.impl
 * @Version		: 1.0
 * @Date		: 2014-8-2
 * @Copyright	: Copyright Decoration 2014
 * @Author		: Howard
 * @Describing	: 
 */
package com.fanglin.system.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.system.dao.CityDao;
import com.fanglin.system.po.CityPO;
import com.fanglin.utils.Paging;

@Repository("cityDaoImpl")
public class CityDaoImpl extends DaoImpl<CityPO> implements CityDao {

	public CityDaoImpl(){
		super(CityPO.class);
	}
	
	@Override
	public List<CityPO> pageCity(Paging paging, List<FilterVO> filters){

		PagingQuery<CityPO> query = pagingQuery(paging, CityPO.class);
		
		if(filters != null){
			for(FilterVO filter: filters){
				if(CityPO.CITY_NAME.equals(filter.getField())){
					query.add(query.getCriterion(CityPO.CITY_NAME, filter.getData(), filter.getOp()));
				}else if(CityPO.REGION_ID.equals(filter.getField())){
					query.alias("region","region");
					query.add(query.getCriterion("region.regionId", filter.getData(), filter.getOp()));
				}
			}
		}
		
		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<CityPO> queryCityByRegionId(String regionId){
		return session().createCriteria(CityPO.class).add(Restrictions.eq("region.regionId",regionId)).list();
	}
	
}
