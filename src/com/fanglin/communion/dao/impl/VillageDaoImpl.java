package com.fanglin.communion.dao.impl;

import java.math.BigInteger;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;
import com.fanglin.communion.dao.VillageDao;
import com.fanglin.communion.po.VillagePO;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;

import com.fanglin.utils.Paging;

@Repository("villageDao")
public class VillageDaoImpl extends DaoImpl<VillagePO> implements VillageDao {

	public VillageDaoImpl(){
		super(VillagePO.class);
	}

	@Override
	public List<VillagePO> pageVillage(Paging paging, List<Filter> filters){

		PagingQuery<VillagePO> query = pagingQuery(paging, VillagePO.class);

		queryFilterExcute(query, filters);
		
		query.asc("vid");

		return query.list();
	}
	
	@Override
	public List<VillagePO> queryVillageByPinyin(Paging paging, String pinyinName){
		PagingQuery<VillagePO> query = pagingQuery(paging, VillagePO.class);
		
		if(StringUtils.isNotEmpty(pinyinName)){
			query.add(Restrictions.eq(VillagePO.COLUMN_STATUS_STR, VillagePO.STATUS_ENABLE_INT)).add(Restrictions.or(Restrictions.ilike("name", pinyinName, MatchMode.ANYWHERE), Restrictions.ilike("pinyinAB", pinyinName, MatchMode.ANYWHERE)));
		}
		
		return query.list();
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<VillagePO> queryVillageByCityProperId(Integer cityProperId){
		return session().createCriteria(VillagePO.class).add(Restrictions.eq("cityProper.cpid", cityProperId)).list();
	}

	@Override
	public int countVillageByCpid(Integer cpid){
		
		String sql = "select count(*) from communion.village where cityProperId = :cityProperId";
		BigInteger count = (BigInteger) session().createSQLQuery(sql).setInteger("cityProperId", cpid).uniqueResult();
		
		return count.intValue();
	}
	
	@Override
	public int countVillageByNameACpid(String name, Integer cpid) {

		String sql = "select count(*) from communion.village where name = :name and cityProperId = :cityProperId";
		BigInteger count = (BigInteger) session().createSQLQuery(sql).setString("name", name).setInteger("cityProperId", cpid).uniqueResult();
		
		return count.intValue();
	}
	
	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters){
		
		if(filters != null){
			query.alias("cityProper", "cityProper");
			for(Filter filter: filters){
			
				if(StringUtils.isNotEmpty(filter.getData())){
					if("villageName".equals(filter.getField())){
						query.add(Restrictions.or(Restrictions.ilike("name", filter.getData(),MatchMode.ANYWHERE),Restrictions.or(Restrictions.ilike("pinyinAB", filter.getData(),MatchMode.ANYWHERE),Restrictions.ilike("pinyinAll", filter.getData(),MatchMode.ANYWHERE))));
					}else if("cityProperId".equals(filter.getField())){
						query.add(query.getCriterion("cityProper.cpid", filter));
					} else if("cityId".equals(filter.getField())){
						query.alias("cityProper.city", "city");
						query.add(Restrictions.eq("city.cid", Integer.valueOf(filter.getData())));
					}
				}
			}
		}
	}

}
