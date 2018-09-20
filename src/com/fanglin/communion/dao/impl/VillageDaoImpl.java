package com.fanglin.communion.dao.impl;

import java.math.BigInteger;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.hibernate.SQLQuery;
import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.communion.dao.VillageDao;
import com.fanglin.communion.po.VillagePO;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;
import com.fanglin.utils.SystemConfig;

@Repository("villageDao")
public class VillageDaoImpl extends DaoImpl<VillagePO> implements VillageDao {

	public VillageDaoImpl(){
		super(VillagePO.class);
	}

	@Override
	public List<VillagePO> pageVillage(Paging paging, List<Filter> filters,Integer company){

		PagingQuery<VillagePO> query = pagingQuery(paging, VillagePO.class);

		queryFilterExcute(query, filters);
	
		if(SystemConfig.getInt("multicompany" , 0) != 0){
			query.add(Restrictions.eq("company", company));
		}
		
		query.asc("vid");

		return query.list();
	}
	
	@Override
	public List<VillagePO> queryVillageByPinyin(Paging paging, String pinyinName,Integer company){
		
		PagingQuery<VillagePO> query = pagingQuery(paging, VillagePO.class);
		
		if(StringUtils.isNotEmpty(pinyinName)){
			query.add(Restrictions.eq(VillagePO.COLUMN_STATUS_STR, VillagePO.STATUS_ENABLE_INT)).add(Restrictions.or(Restrictions.ilike("name", pinyinName, MatchMode.ANYWHERE), Restrictions.ilike("pinyinAB", pinyinName, MatchMode.ANYWHERE)));
		}
		
		if(SystemConfig.getInt("multicompany" , 0) != 0){
			query.add(Restrictions.eq("company", company));
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
	public int countVillageByNameACpid(String name, Integer cpid,Integer company ) {

		StringBuffer sql = new StringBuffer();
		
		sql.append("select count(*) from communion.village where name = :name and cityProperId = :cityProperId");
		
		if(SystemConfig.getInt("multicompany" , 0) != 0){
			
			sql.append("and company =:company ");
		}
		
		SQLQuery query = session().createSQLQuery(sql.toString());
		
		query.setString("name", name).setInteger("cityProperId", cpid);
	
		if(SystemConfig.getInt("multicompany" , 0) != 0){
			
			query.setInteger("company", company);
		
		}
	
		return ((BigInteger) query.uniqueResult()).intValue();
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
