/**
 * Title: VillageDaoImpl
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: JH Corporation, China, Ltd.
 * @author bty1987
 */

package com.fanglin.data.common.dao.impl;

import java.math.BigInteger;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.data.common.dao.VillageDao;
import com.fanglin.data.po.VillagePO;
import com.fanglin.utils.Paging;

@Repository("villageDao")
public class VillageDaoImpl extends DaoImpl<VillagePO> implements VillageDao {

	public VillageDaoImpl(){
		super(VillagePO.class);
	}

	@Override
	public List<VillagePO> pageVillages(Paging paging, List<FilterVO> filters){

		PagingQuery<VillagePO> query = pagingQuery(paging, VillagePO.class);

		queryFilterExcute(query, filters);

		return query.list();
	}

	@Override
	public List<VillagePO> queryVillage(List<FilterVO> filters){
		
		PagingQuery<VillagePO> query = pagingQuery(new Paging(), VillagePO.class);
		
		queryFilterExcute(query, filters);
		
		query.notPaging();
		
		return query.list();
	}

	@Override
	public List<VillagePO> queryVillagesName(Paging paging, String pinyinName){
		PagingQuery<VillagePO> query = pagingQuery(paging, VillagePO.class);
		
		if(StringUtils.isNotEmpty(pinyinName)){
			query.add(Restrictions.eq(VillagePO.COLUMN_STATUS_STR, VillagePO.STATUS_ENABLE_INT)).add(Restrictions.or(Restrictions.ilike("villageName", pinyinName, MatchMode.ANYWHERE), Restrictions.ilike("villageNamePinYinAB", pinyinName, MatchMode.ANYWHERE)));
		}
		
		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<VillagePO> queryVillagesByCityProperId(String cityProperId){
		return session().createCriteria(VillagePO.class).add(Restrictions.eq("cityProper.cityProperId", cityProperId)).list();
	}

	@Override
	public int countVillageByCityProperId(String cityProperId){
		String sql = "select count(villageId) from communion.village where cityProperId = :cityProperId";
		BigInteger count = (BigInteger) session().createSQLQuery(sql).setString("cityProperId", cityProperId).uniqueResult();
		
		return count.intValue();
	}
	
	private void queryFilterExcute(PagingQuery<?> query, List<FilterVO> filters){
		
		if(filters != null){
			query.alias("cityProper", "cityProper");
			for(FilterVO filter: filters){
				if(StringUtils.isNotEmpty(filter.getData())){
					if("villageName".equals(filter.getField()))
						query.add(query.getCriterion("villageName", filter));
					else if("cityProperId".equals(filter.getField())){
						query.add(query.getCriterion("cityProper.cityProperId", filter));
					} else if("cityId".equals(filter.getField())){
						query.alias("cityProper.city", "city");
						query.add(query.getCriterion("city.cityId", filter));
					}
				}
			}
		}
	}

}
