/**
 * @FileName	: CityDaoImpl.java
 * @Package   	: com.fanglin.dao.impl
 * @Version		: 1.0
 * @Date		: 2014-8-2
 * @Copyright	: Copyright Decoration 2014
 * @Author		: bty1987
 * @Describing	: 
 */
package com.fanglin.system.dao.impl;

import java.util.List;

import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.system.dao.CityDao;
import com.fanglin.system.po.CityPO;
import com.fanglin.utils.Paging;

@Repository("cityDaoImpl")
public class CityDaoImpl extends DaoImpl<CityPO> implements CityDao {

	public CityDaoImpl(){
		super(CityPO.class);
	}
	
	@Override
	public List<CityPO> pageCity(Paging paging, List<Filter> filters){

		PagingQuery<CityPO> query = pagingQuery(paging, CityPO.class);
		
		queryFilterExcute(query, filters);
		
		return query.list();
	}
	
	@Override
	public List<CityPO> pageCityByName(Paging paging, String name) {
		
		PagingQuery<CityPO> query = pagingQuery(paging, CityPO.class);
		
		query.add(Restrictions.or(Restrictions.ilike(CityPO.COLUMN_NO_STR, name, MatchMode.ANYWHERE), Restrictions.ilike(CityPO.COLUMN_PINYIN_STR, name, MatchMode.ANYWHERE)));
		
		return query.list();
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<CityPO> queryCityByRid(Integer rid) {
		return session().createCriteria(CityPO.class).add(Restrictions.eq("region.rid",rid)).list();
	}

	@Override
	public CityPO queryCityByNameAndProvince(String name, String province) {
		return (CityPO) session().createCriteria(CityPO.class)
				.add(Restrictions.eq("name", name))
				.add(Restrictions.eq("province", province))
				.uniqueResult();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters){
		
		if(filters != null){
			for(Filter filter: filters){
					
				String field = filter.getField();
				String data = filter.getData();
				String op = filter.getOp();
				
				if(CityPO.COLUMN_NAME_STR.equals(field)){
					query.add(query.getCriterion(field, data, op));
				}else if("regionId".equals(field)){
					query.alias("region","region");
					query.add(query.getCriterion("region.rid", Integer.valueOf(data), op));
				}
			}
		}
	}

	
	
}
