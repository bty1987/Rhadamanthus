package com.fanglin.market.dao.impl;

import java.util.List;

import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.market.dao.EcityDao;
import com.fanglin.market.po.EcityPO;
import com.fanglin.utils.Paging;

@Repository("ecityDao")
public class EcityDaoImpl extends DaoImpl<EcityPO> implements EcityDao{

	public EcityDaoImpl(){
		super(EcityPO.class);
	}
	
	@Override
	public List<EcityPO> pageEcity(Paging paging, List<Filter> filters) {
		
		PagingQuery<EcityPO> query = pagingQuery(paging, EcityPO.class);
		
		if(filters != null){
			for (Filter filter : filters) {
				String field = filter.getField();
				String data = filter.getData();
				String op = filter.getOp();
				
				if(field.equals(EcityPO.COLUMN_CITY_STR)){
					query.add(query.getCriterion(field, data, op));
				}else if(field.equals(EcityPO.COLUMN_PINYIN_STR)){
					query.add(Restrictions.or(Restrictions.like("pinyin", data, MatchMode.START), Restrictions.like("city", data, MatchMode.START)));
				}else if(field.equals("cityId")){
					query.add(query.getCriterion(EcityPO.COLUMN_ECID_STR, Long.valueOf(data), op));
				}
			}
		}
		
		return query.list();
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<EcityPO> queryEcity() {
		return session().createCriteria(EcityPO.class).list();
	}
	
	@Override
	public EcityPO queryEcityByXandY(Double addX, Double subX, Double addY, Double subY) {
		return (EcityPO) session().createCriteria(EcityPO.class).add(Restrictions.le(EcityPO.COLUMN_X_STR, addX)).add(Restrictions.ge(EcityPO.COLUMN_X_STR, subX)).add(Restrictions.le(EcityPO.COLUMN_Y_STR, addY)).add(Restrictions.ge(EcityPO.COLUMN_Y_STR, subY)).uniqueResult();
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<EcityPO> queryEcityByPinYin(String pinyin) {
		return session().createCriteria(EcityPO.class).add(Restrictions.like(EcityPO.COLUMN_PINYIN_STR, pinyin, MatchMode.START)).list();
	}

	@Override
	public EcityPO queryEcityByCityString(String city) {
		return (EcityPO) session().createCriteria(EcityPO.class).add(Restrictions.like(EcityPO.COLUMN_CITY_STR, city, MatchMode.START)).uniqueResult();
	}

}
